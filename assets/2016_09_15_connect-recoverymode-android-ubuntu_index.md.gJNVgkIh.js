import{_ as t,c as o,L as a,o as d}from"./chunks/framework.B28L1Bbi.js";const h=JSON.parse('{"title":"Recovery/FastbootモードのAndroid端末をUbuntuに認識させる","description":"","frontmatter":{"layout":"post","title":"Recovery/FastbootモードのAndroid端末をUbuntuに認識させる","category":"programming;","tags":["Android","ubuntu"],"head":[["link",{"rel":"canonical","href":"https://www.codingfeline.com/2016/09/15/connect-recoverymode-android-ubuntu/"}],["meta",{"property":"og:url","content":"https://www.codingfeline.com/2016/09/15/connect-recoverymode-android-ubuntu/"}],["meta",{"property":"og:title","content":"Recovery/FastbootモードのAndroid端末をUbuntuに認識させる"}],["meta",{"property":"twitter:card","content":"summary_large_image"}],["meta",{"property":"twitter:site","content":"@_yshrsmz"}],["meta",{"property":"twitter:creator","content":"@_yshrsmz"}],["meta",{"property":"og:image","content":"https://www.codingfeline.com/2016/09/15/connect-recoverymode-android-ubuntu/ogp.png"}]]},"headers":[],"relativePath":"2016/09/15/connect-recoverymode-android-ubuntu/index.md","filePath":"posts/2016/2016-09-15-connect-recoverymode-android-ubuntu.md","date":{"time":"2016-09-15","string":"September 15, 2016","year":"2016","month":"09","day":"15"}}'),n={name:"2016/09/15/connect-recoverymode-android-ubuntu/index.md"};function s(r,e,i,c,u,l){return d(),o("div",null,e[0]||(e[0]=[a('<p>普通に起動してるぶんには何もしなくても<code>adb devices</code>で認識してくれてたけど、OTA zipをsideloadしようと思ってリカバリモードで起動したら<code>Permission 普通に起動してるぶんには何もしなくても</code>adb devices<code>で認識してくれてたけど、OTA zipをsideloadしようと思ってリカバリモードで起動したら</code>Permission denied`的なエラーが出て認識してくれなかった。</p><p>調べてみたら<code>udev</code>の設定が必要なようだった。<br> 手順としては下記の通り。</p><h4 id="_1-リカバリモードで起動" tabindex="-1">1. リカバリモードで起動 <a class="header-anchor" href="#_1-リカバリモードで起動" aria-label="Permalink to &quot;1. リカバリモードで起動&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ adb reboot recovery</span></span></code></pre></div><h4 id="_2-lsusbで端末のidを取得" tabindex="-1">2. <code>lsusb</code>で端末のidを取得 <a class="header-anchor" href="#_2-lsusbで端末のidを取得" aria-label="Permalink to &quot;2. `lsusb`で端末のidを取得&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ lsusb</span></span>\n<span class="line"><span>&gt; Bus 002 Device 009: ID 18d1:4ee2 Google Inc. Nexus 4 (debug)</span></span></code></pre></div><p>この場合、<code>18d1</code>がidVendorで、<code>4ee2</code>がidProduct。</p><h4 id="_3-上記手順でわかったidで-etc-udev-rules-d-51-android-rulesをつくる" tabindex="-1">3. 上記手順でわかったidで<code>/etc/udev/rules.d/51-android.rules</code>をつくる <a class="header-anchor" href="#_3-上記手順でわかったidで-etc-udev-rules-d-51-android-rulesをつくる" aria-label="Permalink to &quot;3. 上記手順でわかったidで`/etc/udev/rules.d/51-android.rules`をつくる&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SUBSYSTEM==&quot;usb&quot;, ATTR{idVendor}==&quot;18d1&quot;, ATTR{idProduct}==&quot;4ee2&quot;, MODE=&quot;0666&quot;, GROUP=&quot;usergroup&quot;</span></span></code></pre></div><p>GROUPには適当なUnixグループを指定すること。GROUPの代わりに<code>OWNER={ユーザ名}</code>でもいいみたい。</p><h4 id="_4-chmodする" tabindex="-1">4. chmodする <a class="header-anchor" href="#_4-chmodする" aria-label="Permalink to &quot;4. chmodする&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ chmod a+r /etc/udev/rules.d/51-android.rules</span></span></code></pre></div><p>以上。</p><p>参考:</p><ul><li><a href="https://developer.android.com/studio/run/device.html#setting-up" target="_blank" rel="noreferrer">ハードウェア端末上でアプリを実行する</a></li><li><a href="http://android.stackexchange.com/questions/58187/adb-can-discover-devices-but-not-fastboot" target="_blank" rel="noreferrer">ADB can discover devices but not fastboot</a></li></ul>',15)]))}const b=t(n,[["render",s]]);export{h as __pageData,b as default};