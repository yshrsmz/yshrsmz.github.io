import{_ as e,c as r,L as o,o as d}from"./chunks/framework.B28L1Bbi.js";const u=JSON.parse('{"title":"楽天モバイルをAndroid11なOnePlus 8 Proで使う","description":"","frontmatter":{"layout":"post","title":"楽天モバイルをAndroid11なOnePlus 8 Proで使う","category":"diary","tags":["diary","Android","TIL"],"head":[["link",{"rel":"canonical","href":"https://www.codingfeline.com/2020/12/18/rakuten-mobile-oneplus8pro/"}],["meta",{"property":"og:url","content":"https://www.codingfeline.com/2020/12/18/rakuten-mobile-oneplus8pro/"}],["meta",{"property":"og:title","content":"楽天モバイルをAndroid11なOnePlus 8 Proで使う"}],["meta",{"property":"twitter:card","content":"summary_large_image"}],["meta",{"property":"twitter:site","content":"@_yshrsmz"}],["meta",{"property":"twitter:creator","content":"@_yshrsmz"}],["meta",{"property":"og:image","content":"https://www.codingfeline.com/2020/12/18/rakuten-mobile-oneplus8pro/ogp.png"}]]},"headers":[],"relativePath":"2020/12/18/rakuten-mobile-oneplus8pro/index.md","filePath":"posts/2020/2020-12-18-rakuten-mobile-oneplus8pro.md","date":{"time":"2020-12-18","string":"December 18, 2020","year":"2020","month":"12","day":"18"}}'),n={name:"2020/12/18/rakuten-mobile-oneplus8pro/index.md"};function a(p,t,i,l,s,c){return d(),r("div",null,t[0]||(t[0]=[o('<p>普通にSIMさしてAPN設定しただけでは通信できるようにならない</p><table tabindex="0"><thead><tr><th>項目</th><th>値</th></tr></thead><tbody><tr><td>APN名</td><td>楽天(rakuten.jp)</td></tr><tr><td>APN</td><td>rakuten.jp</td></tr><tr><td>MCC</td><td>440</td></tr><tr><td>MNC</td><td>11</td></tr><tr><td>APNタイプ</td><td>default,supl,dun</td></tr><tr><td>APNプロトコル</td><td>IPv4/IPv6</td></tr><tr><td>APNローミングプロトコル</td><td>IPv4/IPv6</td></tr><tr><td>PDPタイプ</td><td>IPv4/IPv6</td></tr></tbody></table><p>PDPタイプに関してはOnePlus8Proに入力欄はない</p><p>この設定をしたあと、追加で下記も必要</p><ol><li>電話アプリを起動</li><li><code>*#*#4636#*#*</code>を入力し、「テスト中」モードに入る</li><li>「携帯電話情報」をタップ</li><li>「優先ネットワークの設定」から「LTE only」を選択</li></ol><p>以上で通信が可能になる。</p><p>たまに設定がリセットされることもあるらしい。</p>',7)]))}const P=e(n,[["render",a]]);export{u as __pageData,P as default};