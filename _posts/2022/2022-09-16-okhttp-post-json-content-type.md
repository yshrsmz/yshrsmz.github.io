---
layout: post
title: OkHttp で Json の POST がうまくいかない件
category: programming
tags:
  - Android
  - TIL
---

掲題の通り。  
なんか数年前にも調べた気がするのでまとめておく.


```kotlin
val client = OkHttpClient.Builder().build()
val body = AwesomeRequest()

val request = Request.Builder()
  .url("https://....")
  .header("Authorization", API_KEY)
  .post(
    moshi.adapter(AwesomeRequest::class.java).toJson(body)
      .toRequestBody("application/json".toMediaType())
  )
  .build()

val result = client.newCall(request).execute()
```

的なコードを書いたが、なぜかレスポンスが404になってしまう。

[Ok2Curl](https://github.com/mrmike/Ok2Curl) 使ってみてもターミナルだと成功してしまうしよくわからなかったんだけど、Android Studio のネットワークプロファイラ見てたらリクエストの Content-Type が最終的に `application/json; charset=utf-8` になっていることがわかった。

で、サーバ側は `application/json` の完全一致で見てたのでエラーになってしまっていた。

OkHttp のレポジトリを検索したら、 close 済みで対応する予定なさそうだけど issue はあった

[#3081 Feature: Provide RequestBody.create WITHOUT default charset=utf-8](https://github.com/square/okhttp/issues/3081)

[MIME typeの仕様](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)を見ると `type/subtype;parameter=value` という仕様でパラメータを指定できるはずなので、これを許容しないサーバ側の設定が間違っているからサーバ側を修正しよう、という話らしい。


とはいえ自分の管理外のサーバなど簡単に修正できない場合もある。上の issue にも workaround として `NetworkInterceptor` を実装する方法が載っている。

```kotlin
private class FixJsonContentTypeInterceptor : Interceptor {
  override fun intercept(chain: Interceptor.Chain): Response {
    val original = chain.request()

    val fixed = original.newBuilder()
      .header("Content-Type", "application/json")
      .build()

    return chain.proceed(fixed)
  }
}

val client = OkHttpClient.Builder()
  .addNetworkInterceptor(FixJsonContentTypeInterceptor())
  .build()
```

のようにしてあげればよい。 `RequestBody` が `charset=utf-8` 付きの Content-Type を設定したあとに上書きした RequestBody を作り直してしまおう、という作戦。
