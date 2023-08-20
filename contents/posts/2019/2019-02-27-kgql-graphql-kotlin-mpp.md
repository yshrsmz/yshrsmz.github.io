---
layout: post
title: Kotlin Multiplatform Project向けのGraphQLラッパー生成ライブラリ、kgqlを作った
category: programming
tags:
  - kotlin
  - kmp
---

AndroidとKotlin Multiplatform Projectで使える、GraphQLのドキュメントからコードを生成するGradle Pluginを作った。  
[kgql](https://github.com/yshrsmz/kgql)という。

これ実際の成果物を見てもらうのが早いと思うので、こんな感じ。


```
// User.gql
query User($login: String!) {
  user(login: $login) {
    id
    login
    bio
    avatarUrl
    company
    createdAt
  }
}

query Viewer {
  viewer {
    login
  }
}
```

たとえばすごいシンプルだけど、上記のGraphQLドキュメントからはこんなコードが生成される。  
内部的には[graphql-java](https://github.com/graphql-java/graphql-java)を使ってパースしている。

```kotlin
package com.sample

import com.codingfeline.kgql.core.KgqlRequestBody
import kotlin.String
import kotlin.Unit
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Optional
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

internal object UserDocument {
    private val document: String = """
            |query User(${'$'}login: String!) {
            |  user(login: ${'$'}login) {
            |    id
            |    login
            |    bio
            |    avatarUrl
            |    company
            |    createdAt
            |  }
            |}
            |
            |query Viewer {
            |  viewer {
            |    login
            |  }
            |}
            |""".trimMargin()

    object UserQuery {
        /**
         * Generate Json string of [Request]
         */
        fun requestBody(variables: Variables): String =
                kotlinx.serialization.json.Json.stringify(serializer(), Request(variables =
                variables))

        fun serializer(): KSerializer<Request> = Request.serializer()

        @Serializable
        data class Variables(@SerialName(value = "login") val login: String)

        @Serializable
        data class Request(
            @SerialName(value = "variables") override val variables: Variables?,
            @Optional @SerialName(value = "operationName") override val operationName: String? =
                    "User",
            @SerialName(value = "query") override val query: String = document
        ) : KgqlRequestBody<Variables>
    }

    object ViewerQuery {
        /**
         * Generate Json string of [Request]
         */
        fun requestBody(): String = kotlinx.serialization.json.Json.stringify(serializer(),
                Request())

        fun serializer(): KSerializer<Request> = Request.serializer()

        @Serializable
        data class Request(
            @SerialName(value = "variables") @Optional override val variables: Unit? = null,
            @Optional @SerialName(value = "operationName") override val operationName: String? =
                    "Viewer",
            @SerialName(value = "query") override val query: String = document
        ) : KgqlRequestBody<Unit>
    }
}

```

Kotlin Multiplatform Project対応のHttpClient、Ktorと一緒に利用するとこんな感じになる。  
ちなみにこの例ではGitHubのAPIを使っている。

```kotlin
package com.sample

import com.codingfeline.kgql.core.KgqlResponse
import com.codingfeline.kgql.core.KgqlError
import com.sample.UserDocument
import io.ktor.client.HttpClient
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.headers
import io.ktor.client.request.post
import io.ktor.http.Url
import kotlinx.serialization.json.JSON
import kotlinx.serialization.Serializable

const val TOKEN = "YOUR_GITHUB_TOKEN"

@Serializable
data class ViewerWrapper(
    val viewer: Viewer
)

@Serializable
data class Viewer(
    val login: String
)

@Serializable
data class ViewerResponse(
    override val data: ViewerWrapper?,
    override val errors: List<KgqlError>?
): KgqlResponse<ViewerWrapper>


class GitHubApi {

    private val client = HttpClient {
        install(JsonFeature)
    }

    suspend fun fetchLogin(): Viewer? {

        val response = client.post<String>(url = Url("https://api.github.com/graphql")) {
            // ここ！
            body = UserDocument.ViewerQuery.requestBody()

            headers {
                append("Authorization", "bearer $TOKEN")
            }
        }

        val res = JSON.parse(ViewerResponse.serializer(), response)

        return res.data?.viewer
    }
}
```

GraphQL基本的にただのPOSTなので、戻り値は好きにパースしてくれというスタンス。

## 使い方

Kotlinは1.3.20以降。  
Gradleは5.1.1以降を推奨。Jetifier使わなければ4.10でも動くかも。  
一応Android ProjectでもKMPでも動くはず

```gradle
// ./build.gradle
buildScript {
    repositories {
        jcenter()
        maven { url 'https://dl.bintray.com/yshrsmz/kgql' }
    }
    dependencies {
        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:1.3.21'
        classpath 'com.codingfeline.kgql:gradle-plugin:0.2.1'
    }
}
```


```gradle
// ./common/build.gradle
apply plugin: 'org.jetbrains.kotlin.multiplatform'
apply plugin: 'com.codingfeline.kgql'

repositories {
     maven { url "https://dl.bintray.com/yshrsmz/kgql" }
}

kotlin {
    // KMPのターゲット設定
    jvm()
    iosX64('ios')
}

kgql {
    // 出力されるクラスのパッケージ名
    packageName = "com.sample"
    // 入力元のGraphQLドキュメントファイルを格納するディレクトリ
    // デフォルトは`src/main/kgql`、Android Projectは`src/${variant}/kgql`
    // Android Projectの場合はここを変更しても意味ない。
    sourceSet = files("src/main/kgql")
    typeMapper = [
        // プリミティブでない型に対応するクラスのマッパ。
        // Gradle Pluginは対象コードにアクセス出来ないので、FQNが必要。
        "UserProfile": "com.sample.data.UserProfile"
    ]
}
```

上記設定をしたら、`kgql.sourceSet`に指定した場所にGraphQLのドキュメントを置く。拡張子は`.gql`で。

`generateKgqlInterface`というタスクができているはずなので、実行するとドキュメントファイルが生成される。  
各種ビルドタスクに依存関係を設定してあるので、適当にビルドしても生成されるはず。

## 今後やりたいこと

現状引数のデフォルト値は無視するような作りになっているので、そこはなんとかうまい方法を考えたい。

あとはもう少しインタフェースを整備して、Ktor向けのサポートライブラリも用意してあげたい。

Apolloの実装とか参考にしたらいいのができそう。


## その他

Kotlin Multiplatform Project周りはまだ色々整備されてないので今がチャンス！

## リンク

- [https://github.com/yshrsmz/kgql](https://github.com/yshrsmz/kgql)
