import{_ as i,c as a,L as n,o as t}from"./chunks/framework.B28L1Bbi.js";const E=JSON.parse('{"title":"(KMP) commonTestをRobolectricで実行する","description":"","frontmatter":{"layout":"post","title":"(KMP) commonTestをRobolectricで実行する","category":"programming","tags":["kotlin","kmp"],"head":[["link",{"rel":"canonical","href":"https://www.codingfeline.com/2019/11/06/robolectric-and-kotlin-mpp-commontest/"}],["meta",{"property":"og:url","content":"https://www.codingfeline.com/2019/11/06/robolectric-and-kotlin-mpp-commontest/"}],["meta",{"property":"og:title","content":"(KMP) commonTestをRobolectricで実行する"}],["meta",{"property":"twitter:card","content":"summary_large_image"}],["meta",{"property":"twitter:site","content":"@_yshrsmz"}],["meta",{"property":"twitter:creator","content":"@_yshrsmz"}],["meta",{"property":"og:image","content":"https://www.codingfeline.com/2019/11/06/robolectric-and-kotlin-mpp-commontest/ogp.png"}]]},"headers":[],"relativePath":"2019/11/06/robolectric-and-kotlin-mpp-commontest/index.md","filePath":"posts/2019/2019-11-06-robolectric-and-kotlin-mpp-commontest.md","date":{"time":"2019-11-06","string":"November 6, 2019","year":"2019","month":"11","day":"06"}}'),l={name:"2019/11/06/robolectric-and-kotlin-mpp-commontest/index.md"};function p(e,s,h,k,o,r){return t(),a("div",null,s[0]||(s[0]=[n(`<p>AndroidXの<code>androidx.test.ext:junit</code>を利用するとサクッとできます。</p><p>基本的な方針は、Kotlin/Native向けにcommonTestを実行するときはkotlin-testを使いつつ、Android向けに実行するときはJUnit4上でRobolectricを使います。</p><p>ちなみにcommonTestのテストクラスはこんな感じになります。</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">@RunWith</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(AndroidJunit4::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SomeTest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @BeforeTest</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @AfterTest</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> tearDown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> \`It should do something\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>この<code>RunWith</code>や<code>AndroidJUnit4</code>を作っていきます。</p><p>まずはライブラリの追加。 commonTestでは<code>kotlin-test</code>を読み込みつつ、androidTestでは<code>kotlin-test</code>と<code>androidx.test.ext:junit</code>や<code>Robolectric</code>を読み込んでいく。iosTestは特に必要ありません。</p><div class="language-groovy vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">groovy</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kotlin {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    android()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    iosX64(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ios&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        binaries {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            framework()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    sourceSets {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        commonMain {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        commonTest {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            dependencies {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                implementation </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;org.jetbrains.kotlin:kotlin-test-common:1.3.51&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                implementation </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;org.jetbrains.kotlin:kotlin-test-annotations-common:1.3.51&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        androidMain {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        androidTest {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            dependencies {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                implementation </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;org.jetbrains.kotlin:kotlin-test:1.3.51&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                implementation </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;org.jetbrains.kotlin:kotlin-test-junit:1.3.51&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                implementation </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;androidx.test:core:1.2.1-alpha02&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                implementation </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;androidx.test.ext:junit:1.1.2-alpha02&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                implementation </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;org.robolectric:robolectric:4.3.1&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        iosMain {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        iosTest {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>まず共通部分のexpect定義</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// commonTest</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.reflect.KClass</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">expect </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">annotation</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> RunWith</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">val</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> value</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">KClass</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">out</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Runner</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">expect </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">abstract</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Runner</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">expect </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> AndroidJUnit4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Runner</span></span></code></pre></div><p>次にAndroid向けのactual定義。 junitやandroidxの該当クラスへのtypealiasです。</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// androidTest</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">typealias</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> RunWith</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> org.junit.runner.RunWith</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">typealias</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Runner</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> org.junit.runner.Runner</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">typealias</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> AndroidJUnit4</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> androidx.test.ext.junit.runners.AndroidJUnit4</span></span></code></pre></div><p>最後にiOS向けのactual定義</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// iosTest</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.reflect.KClass</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">annotation</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> RunWith</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">val</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> value</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">KClass</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">out</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Runner</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">abstract</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Runner</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> AndroidJUnit4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Runner</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><p>iOS側の定義は見てわかるように、単純なプレースホルダです。 iOS向けのcommonTestはiOSシミュレータ上で実行されるので(そういうGradleタスクを書く必要はありますが)特にRobolectric的なものは必要ありません。</p><p>androidTestは、instrumentation testのような顔をしていますがjvm上で動くためRobolectricが必要になります。</p><p>ここで使っている<code>androidx.test.ext.junit.runners.AndroidJUnit4</code>はクロスプラットフォーム対応のテストランナーで、実行環境に応じてテストランナーをいい感じに切り替えてくれます。jvm環境だったら勝手に<code>RobolectricTestRunner</code>を使ってくれるスグレモノです。ちゃんと設定をすればinstrumentation testでも同じテストケースが使えちゃうはず。</p><p>あとは適当にテストケースを書いて、<code>androidTest/resources/your/package/robolectric.properties</code>に諸々Robolectricの設定を書いていけば終わりです。</p><p><code>./gradlew testDebugUnitTest</code>とかやったらRobolectricを使ってcommonTestのテストケースが実行されます。</p><p>このコードは別モジュールに切り出してテスト用ライブラリとして運用するとよさそう。</p>`,19)]))}const c=i(l,[["render",p]]);export{E as __pageData,c as default};