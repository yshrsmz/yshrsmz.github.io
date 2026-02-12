import{_ as a,o as i,a as n,X as l}from"./chunks/framework.BPPv2K3c.js";const c=JSON.parse('{"title":"AWS CodeBuild 用に Java11 で Android がビルドできる Docker イメージをつくる","description":"","frontmatter":{"layout":"post","title":"AWS CodeBuild 用に Java11 で Android がビルドできる Docker イメージをつくる","category":"programming","tags":["Android","Docker","AWS","CodeBuild"],"head":[["link",{"rel":"canonical","href":"https://www.codingfeline.com/2022/08/19/android-docker-image-for-codebuild/"}],["meta",{"property":"og:url","content":"https://www.codingfeline.com/2022/08/19/android-docker-image-for-codebuild/"}],["meta",{"property":"og:title","content":"AWS CodeBuild 用に Java11 で Android がビルドできる Docker イメージをつくる"}],["meta",{"property":"twitter:card","content":"summary_large_image"}],["meta",{"property":"twitter:site","content":"@_yshrsmz"}],["meta",{"property":"twitter:creator","content":"@_yshrsmz"}],["meta",{"property":"og:image","content":"https://www.codingfeline.com/2022/08/19/android-docker-image-for-codebuild/ogp.png"}]]},"headers":[],"relativePath":"2022/08/19/android-docker-image-for-codebuild/index.md","filePath":"posts/2022/2022-08-19-android-docker-image-for-codebuild.md","date":{"time":"2022-08-19","string":"August 19, 2022","year":"2022","month":"08","day":"19"}}'),e={name:"2022/08/19/android-docker-image-for-codebuild/index.md"};function t(p,s,o,r,d,h){return i(),n("div",null,[...s[0]||(s[0]=[l(`<p>CodeBuild の提供するイメージでは最新の Android アプリがビルドできないので、自分でなんとかする必要がある。</p><p>2022年8月現在、<a href="https://docs.aws.amazon.com/codebuild/latest/userguide/available-runtimes.html" target="_blank" rel="noreferrer">CodeBuild 公式の利用可能ランタイム一覧</a> だと、Android は API 28, 29 のみ記載がある。</p><p>GitHub の <a href="https://github.com/aws/aws-codebuild-docker-images" target="_blank" rel="noreferrer">aws/aws-codebuild-docker-images</a> にもいくつか issue がたっている。</p><ul><li><a href="https://github.com/aws/aws-codebuild-docker-images/issues/537" target="_blank" rel="noreferrer">Using Android Images (runtime 28+29) does not work anymore as Android Tools require Java 11 and the images require Corretto 8 · Issue #537</a></li><li><a href="https://github.com/aws/aws-codebuild-docker-images/issues/496" target="_blank" rel="noreferrer">Android version 31, AGP 7 support · Issue #496</a></li></ul><p><a href="https://github.com/aws/aws-codebuild-docker-images/issues/537" target="_blank" rel="noreferrer">issue 537</a> の方に書いてあるように BuildSpec で Android SDK インストールしてもいいんだけど、せっかくなので Docker イメージ作ってみる。</p><p>こんな感じ。</p><div class="language-docker vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">docker</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> public.ecr.aws/amazoncorretto/amazoncorretto:11</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ENV</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ANDROID_SDK_ROOT /opt/android-sdk-linux</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ENV</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> PATH=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;\${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:\${ANDROID_SDK_ROOT}/platform-tools:/opt/bin:\${PATH}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> yum install -y \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    wget \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    unzip \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; rm -rf /var/cache/yum/* \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; yum clean all</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># install Android</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mkdir -p /opt/android-sdk-linux/cmdline-tools \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; cd /opt/android-sdk-linux/cmdline-tools \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O /opt/android-sdk-linux/cmdline-tools/latest.zip \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; unzip latest.zip \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; mv cmdline-tools latest \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; rm -f latest.zip</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> echo y | sdkmanager \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;build-tools;33.0.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;platform-tools&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;platforms;android-32&quot;</span></span></code></pre></div><p>ついでに Node.js 使えるようにしたかったので、 nodenv も追加してみるとこうなる。</p><div class="language-docker vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">docker</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> public.ecr.aws/amazoncorretto/amazoncorretto:11</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ENV</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ANDROID_SDK_ROOT /opt/android-sdk-linux</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ENV</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> PATH=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/root/.nodenv/bin:/root/.nodenv/shims:\${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:\${ANDROID_SDK_ROOT}/platform-tools:/opt/bin:\${PATH}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> yum install -y \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    git \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    wget \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    unzip \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    gzip \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    tar \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; rm -rf /var/cache/yum/* \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; yum clean all</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># install Android</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mkdir -p /opt/android-sdk-linux/cmdline-tools \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; cd /opt/android-sdk-linux/cmdline-tools \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O /opt/android-sdk-linux/cmdline-tools/latest.zip \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; unzip latest.zip \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; mv cmdline-tools latest \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &amp;&amp; rm -f latest.zip</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> echo y | sdkmanager \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;build-tools;33.0.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;platform-tools&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;platforms;android-32&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># install Node.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> wget -q https://raw.githubusercontent.com/nodenv/nodenv-installer/master/bin/nodenv-installer -O- | bash &amp;&amp; \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    eval </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;$(nodenv init -)&quot;</span></span></code></pre></div><hr><p>定期的に Android SDK と node-build の更新のために Docker イメージビルドし直さなきゃいけないのがめんどくさい。<br> やはり Java11 入ってる公式イメージ使いつつ、 BuildSpec で Android SDK インストールするのが楽な気がする.</p>`,11)])])}const E=a(e,[["render",t]]);export{c as __pageData,E as default};
