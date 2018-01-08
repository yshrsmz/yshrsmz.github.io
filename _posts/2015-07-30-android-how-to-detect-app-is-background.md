---
layout: post
title: (Android) アプリのbackground/foregroundを検知する
categories:
  - programming
tags:
  - android
---

単純に`onResume/onStart`でバックグラウンド復帰時の処理を書くと`Activity`の生成時やバックキーで戻ってきた時等、処理しなくていいタイミングでもコードが走ってしまいます。  

`ActivityManager#getRunningAppProcesses`で実行中のプロセスを取得し、アプリのforeground/backgroundステータスを見ることもできますが、一部端末でうまく動作しないことがあるようです(そもそもbackground/foregroundを判定するためだけに実行中のプロセスを全部調べるのもアホくさい気がします)。

そこで、API14(ICS)から追加された、`Application.ActivityLifecycleCallbacks`を利用します。このAPIを利用すると、すべての`Activity`のライフサイクルを監視し、任意の処理を実行することができます。

コードは下記のとおりです。

```java
public class MyApp extends Application {

    private AppStatus mAppStatus = AppStatus.FOREGROUND;

    public void onCreate() {
        super.onCreate();

        registerActivityLifecycleCallbacks(new MyActivityLifecycleCallbacks());
    }

    public MyApp get(Context context) {
        return (MyApp) context.getApplicationContext();
    }

    public AppStatus getAppStatus() {
        return mAppStatus;
    }

    // check if app is foreground
    public boolean isForeground() {
        return mAppStatus.ordinal() > AppStatus.BACKGROUND.ordinal();
    }

    public enum AppStatus {
        BACKGROUND,                // app is background
        RETURNED_TO_FOREGROUND,    // app returned to foreground(or first launch)
        FOREGROUND;                // app is foreground
    }

    public class MyActivityLifecycleCallbacks implements ActivityLifecycleCallbacks {

        // running activity count
        private int running = 0;

        @Override
        public void onActivityCreated(Activity activity, Bundle bundle) {

        }

        @Override
        public void onActivityStarted(Activity activity) {
            if (++running == 1) {
                // running activity is 1,
                // app must be returned from background just now (or first launch)
                mAppStatus = AppStatus.RETURNED_TO_FOREGROUND;
            } else if (running > 1) {
                // 2 or more running activities,
                // should be foreground already.
                mAppStatus = AppStatus.FOREGROUND;
            }
        }

        @Override
        public void onActivityResumed(Activity activity) {
        }

        @Override
        public void onActivityPaused(Activity activity) {
        }

        @Override
        public void onActivityStopped(Activity activity) {
            if (--running == 0) {
                // no active activity
                // app goes to background
                mAppStatus = AppStatus.BACKGROUND;
            }
        }

        @Override
        public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {
        }

        @Override
        public void onActivityDestroyed(Activity activity) {
        }
    }
}
```

あとは任意の場所で`MyApp.get(getContext()).getAppStatus()`とか、`MyApp.get(getContext()).isForeground()`とか呼んであげれば、アプリが現在foregroundにいるのかbackgroundにいるのか、判定することができます。

backgroundからforegroundに復帰した時かどうか知りたい！ってときは`MyApp.get(getContext()).getAppStatus()`で`AppStatus.RETURNED_TO_BACKGROUND`と比較してあげればいいです。

軽く仕組みを説明すると、`Activity`の`onStart/onStop`に相当する`onActivityStarted/onActivityStopped`で現在アクティブな`Activity`をカウントしているだけです。

`Activity`間を遷移していると、最低でも今いる`Activity`と、一つ前の`Activity`がアクティブな状態になります(`running > 1`な状態)。
アプリが`background`になると、すべての`Activity`が`onStop`を通るので、非アクティブな状態になります(`running == 0`な状態)。  
また、アプリがforegroundに復帰すると直前まで表示されていた`Activity`の`onStart`のみが実行されるので、`running == 1`になります。  

この状態の変化を利用して、アプリのbackground/foregroundステータスを検知するのが上記のコードです。

`Activity`が複数作られる、という前提のコードなので1`Activity`複数`Fragment`なアプリや[Mortar](https://github.com/square/mortar)/[Flow](https://github.com/square/flow)なアプリだと意味がなさそうです。

こちらからは以上です。
