import{_ as i,c as a,L as n,o as t}from"./chunks/framework.B28L1Bbi.js";const c=JSON.parse('{"title":"(Android) アプリのbackground/foregroundを検知する","description":"","frontmatter":{"layout":"post","title":"(Android) アプリのbackground/foregroundを検知する","category":"programming","tags":["Android"],"head":[["link",{"rel":"canonical","href":"https://www.codingfeline.com/2015/07/30/android_how_to_detect_app_is_background_or_not/"}],["meta",{"property":"og:url","content":"https://www.codingfeline.com/2015/07/30/android_how_to_detect_app_is_background_or_not/"}],["meta",{"property":"og:title","content":"(Android) アプリのbackground/foregroundを検知する"}],["meta",{"property":"twitter:card","content":"summary_large_image"}],["meta",{"property":"twitter:site","content":"@_yshrsmz"}],["meta",{"property":"twitter:creator","content":"@_yshrsmz"}],["meta",{"property":"og:image","content":"https://www.codingfeline.com/2015/07/30/android_how_to_detect_app_is_background_or_not/ogp.png"}]]},"headers":[],"relativePath":"2015/07/30/android_how_to_detect_app_is_background_or_not/index.md","filePath":"posts/2015/2015-07-30-android_how_to_detect_app_is_background_or_not.md","date":{"time":"2015-07-30","string":"July 30, 2015","year":"2015","month":"07","day":"30"}}'),p={name:"2015/07/30/android_how_to_detect_app_is_background_or_not/index.md"};function e(l,s,h,k,r,d){return t(),a("div",null,s[0]||(s[0]=[n(`<h3 id="update-2018-01-18" tabindex="-1">Update 2018.01.18 <a class="header-anchor" href="#update-2018-01-18" aria-label="Permalink to &quot;Update 2018.01.18&quot;">​</a></h3><p>2017年のGoogle I/Oで<a href="https://developer.android.com/topic/libraries/architecture/index.html" target="_blank" rel="noreferrer">Architecture Components</a>が発表されました。</p><p>Architecture Componentsにはいろいろな機能が含まれますが、その中に<a href="https://developer.android.com/topic/libraries/architecture/lifecycle.html" target="_blank" rel="noreferrer">Lifecycle</a>という一連のコンポーネントがあります。</p><p>これはいろいろなクラスにAndroidのActivityやFragmentといったコンポーネントのライフサイクルを監視する機能を追加するためのコンポーネントです。<br> この中に、<a href="https://developer.android.com/reference/android/arch/lifecycle/ProcessLifecycleOwner.html" target="_blank" rel="noreferrer"><code>ProcessLifecycleOwner</code></a>というコンポーネントが用意されています。<br> 下に記載している<code>MyActivityLifecycleCallbacks</code>の代わりに\b似たような<code>LifecycleObserver</code>を実装して、<code>Application#onCreate</code>とかで<code>ProcessLifecycleOwner#addObserver</code>すると、実装がよりシンプルになるかもしれません。</p><p><code>ProcessLifecycleOwner</code>を使った際のざっくりしたイベントの対照表は下記のとおりです。</p><table tabindex="0"><thead><tr><th>Lifecycle.Event</th><th>対応するイベント</th></tr></thead><tbody><tr><td>ON_CREATE</td><td>アプリ起動時に一度だけ</td></tr><tr><td>ON_RESUME</td><td>アプリ起動時/バックグラウンドからの復帰時</td></tr><tr><td>ON_START</td><td>アプリ起動時/バックグラウンドからの復帰時</td></tr><tr><td>ON_PAUSE</td><td>アプリ終了時/バックグラウンド\bへの移行時</td></tr><tr><td>ON_STOP</td><td>アプリ終了時/バックグラウンド\bへの移行時</td></tr><tr><td>ON_DESTROY</td><td>一度も呼ばれない</td></tr></tbody></table><p>---更新終わり。↓下から本文\b---</p><hr><p>単純に<code>onResume/onStart</code>でバックグラウンド復帰時の処理を書くと<code>Activity</code>の生成時やバックキーで戻ってきた時等、処理しなくていいタイミングでもコードが走ってしまいます。</p><p><code>ActivityManager#getRunningAppProcesses</code>で実行中のプロセスを取得し、アプリのforeground/backgroundステータスを見ることもできますが、一部端末でうまく動作しないことがあるようです(そもそもbackground/foregroundを判定するためだけに実行中のプロセスを全部調べるのもアホくさい気がします)。</p><p>そこで、API14(ICS)から追加された、<code>Application.ActivityLifecycleCallbacks</code>を利用します。このAPIを利用すると、すべての<code>Activity</code>のライフサイクルを監視し、任意の処理を実行することができます。</p><p>コードは下記のとおりです。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MyApp</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Application</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    private</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> AppStatus mAppStatus </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> AppStatus.FOREGROUND;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onCreate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        super</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">onCreate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        registerActivityLifecycleCallbacks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MyActivityLifecycleCallbacks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> MyApp </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Context </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">context</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (MyApp) context.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getApplicationContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> AppStatus </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getAppStatus</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mAppStatus;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // check if app is foreground</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> boolean</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> isForeground</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mAppStatus.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ordinal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> AppStatus.BACKGROUND.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ordinal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> enum</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> AppStatus</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        BACKGROUND</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,                </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app is background</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        RETURNED_TO_FOREGROUND</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,    </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app returned to foreground(or first launch)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        FOREGROUND</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;                </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app is foreground</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MyActivityLifecycleCallbacks</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> implements</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ActivityLifecycleCallbacks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // running activity count</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        private</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> running </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onActivityCreated</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Activity </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">activity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, Bundle </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">bundle</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onActivityStarted</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Activity </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">activity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">running </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                // running activity is 1,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                // app must be returned from background just now (or first launch)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                mAppStatus </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> AppStatus.RETURNED_TO_FOREGROUND;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (running </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                // 2 or more running activities,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                // should be foreground already.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                mAppStatus </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> AppStatus.FOREGROUND;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onActivityResumed</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Activity </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">activity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onActivityPaused</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Activity </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">activity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onActivityStopped</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Activity </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">activity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">--</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">running </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                // no active activity</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                // app goes to background</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                mAppStatus </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> AppStatus.BACKGROUND;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onActivitySaveInstanceState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Activity </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">activity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, Bundle </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">bundle</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onActivityDestroyed</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Activity </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">activity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>あとは任意の場所で<code>MyApp.get(getContext()).getAppStatus()</code>とか、<code>MyApp.get(getContext()).isForeground()</code>とか呼んであげれば、アプリが現在foregroundにいるのかbackgroundにいるのか、判定することができます。</p><p>backgroundからforegroundに復帰した時かどうか知りたい！ってときは<code>MyApp.get(getContext()).getAppStatus()</code>で<code>AppStatus.RETURNED_TO_BACKGROUND</code>と比較してあげればいいです。</p><p>軽く仕組みを説明すると、<code>Activity</code>の<code>onStart/onStop</code>に相当する<code>onActivityStarted/onActivityStopped</code>で現在アクティブな<code>Activity</code>をカウントしているだけです。</p><p><code>Activity</code>間を遷移していると、最低でも今いる<code>Activity</code>と、一つ前の<code>Activity</code>がアクティブな状態になります(<code>running &gt; 1</code>な状態)。 アプリが<code>background</code>になると、すべての<code>Activity</code>が<code>onStop</code>を通るので、非アクティブな状態になります(<code>running == 0</code>な状態)。 また、アプリがforegroundに復帰すると直前まで表示されていた<code>Activity</code>の<code>onStart</code>のみが実行されるので、<code>running == 1</code>になります。</p><p>この状態の変化を利用して、アプリのbackground/foregroundステータスを検知するのが上記のコードです。</p><p><code>Activity</code>が複数作られる、という前提のコードなので1<code>Activity</code>複数<code>Fragment</code>なアプリや<a href="https://github.com/square/mortar" target="_blank" rel="noreferrer">Mortar</a>/<a href="https://github.com/square/flow" target="_blank" rel="noreferrer">Flow</a>なアプリだと意味がなさそうです。</p><p>こちらからは以上です。</p>`,20)]))}const o=i(p,[["render",e]]);export{c as __pageData,o as default};