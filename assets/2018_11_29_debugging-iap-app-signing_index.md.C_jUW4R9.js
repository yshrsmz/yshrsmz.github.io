import{_ as i,c as a,L as t,o as n}from"./chunks/framework.B28L1Bbi.js";const m=JSON.parse('{"title":"(Android) App Signingなアプリの課金デバッグをしたい","description":"","frontmatter":{"layout":"post","title":"(Android) App Signingなアプリの課金デバッグをしたい","category":"programming","tags":["TIL","Android"],"head":[["link",{"rel":"canonical","href":"https://www.codingfeline.com/2018/11/29/debugging-iap-app-signing/"}],["meta",{"property":"og:url","content":"https://www.codingfeline.com/2018/11/29/debugging-iap-app-signing/"}],["meta",{"property":"og:title","content":"(Android) App Signingなアプリの課金デバッグをしたい"}],["meta",{"property":"twitter:card","content":"summary_large_image"}],["meta",{"property":"twitter:site","content":"@_yshrsmz"}],["meta",{"property":"twitter:creator","content":"@_yshrsmz"}],["meta",{"property":"og:image","content":"https://www.codingfeline.com/2018/11/29/debugging-iap-app-signing/ogp.png"}]]},"headers":[],"relativePath":"2018/11/29/debugging-iap-app-signing/index.md","filePath":"posts/2018/2018-11-29-debugging-iap-app-signing.md","date":{"time":"2018-11-29","string":"November 29, 2018","year":"2018","month":"11","day":"29"}}'),o={name:"2018/11/29/debugging-iap-app-signing/index.md"};function r(p,e,g,l,s,d){return n(),a("div",null,e[0]||(e[0]=[t('<h2 id="tl-dr" tabindex="-1">TL;DR <a class="header-anchor" href="#tl-dr" aria-label="Permalink to &quot;TL;DR&quot;">​</a></h2><p>PlayStoreから一度アプリをインストールした後、アンインストールしてパッケージ名を揃えたデバッグビルドをインストールしたらよい。</p><h2 id="app-signingでも課金でバッグしたい" tabindex="-1">App Signingでも課金でバッグしたい <a class="header-anchor" href="#app-signingでも課金でバッグしたい" aria-label="Permalink to &quot;App Signingでも課金でバッグしたい&quot;">​</a></h2><p>Google Play App Signing、便利だけど手元にあるのはAPKアップロード用の鍵なので、課金のデバッグはできないものと思っていた。 でも、調べてみると結構簡単にエミュレータ上のデバッグビルドでも課金することができた。</p><p>手順は簡単。</p><ol><li>PlayStoreからアプリをインストールする</li><li>アプリをアンインストールする</li><li>本番のapplication idでデバッグ版をビルド、いつもどおりにAndroid Studioからデバッグする</li></ol><p>これだけ。 もちろん対象アカウントのテスター登録とかアルファ版に課金Permission入れたAPKをアップロードするとか、通常の課金テストで必要な手順は一通り必要。</p><p>一つ注意点があって、この方法だとGoogle PlayのDeveloperコンソールから課金キャンセルした場合に、キャンセルが反映されない。<br> おそらく署名が違うから正常にリモートから情報を取得できないのだと思う。<br> この場合は一度デバッグビルドをアンインストールして、再度上記のPlayStoreからインストールする手順を踏めば良い。</p><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li><a href="https://groups.google.com/forum/#!topic/Android-group-japan/j3rLbdiLq2w" target="_blank" rel="noreferrer">Google Play App Signing環境でのアプリ課金実装方法について</a></li><li><a href="https://stackoverflow.com/questions/45993630/how-can-i-test-in-app-payments-when-google-play-app-signing-feature-is-enabled" target="_blank" rel="noreferrer">How can i test in-app payments when Google Play App Signing feature is enabled? </a></li></ul>',10)]))}const h=i(o,[["render",r]]);export{m as __pageData,h as default};