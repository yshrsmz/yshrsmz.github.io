import{_ as s,c as i,L as e,o as a}from"./chunks/framework.B28L1Bbi.js";const u=JSON.parse('{"title":"GitHub Actionsでworkflowからpushしたときに後続のworkflowが起動しなくなった件","description":"","frontmatter":{"layout":"post","title":"GitHub Actionsでworkflowからpushしたときに後続のworkflowが起動しなくなった件","category":"programming","tags":["GitHub Actions","TIL"],"head":[["link",{"rel":"canonical","href":"https://www.codingfeline.com/2020/04/18/actions-checkout-v2-push/"}],["meta",{"property":"og:url","content":"https://www.codingfeline.com/2020/04/18/actions-checkout-v2-push/"}],["meta",{"property":"og:title","content":"GitHub Actionsでworkflowからpushしたときに後続のworkflowが起動しなくなった件"}],["meta",{"property":"twitter:card","content":"summary_large_image"}],["meta",{"property":"twitter:site","content":"@_yshrsmz"}],["meta",{"property":"twitter:creator","content":"@_yshrsmz"}],["meta",{"property":"og:image","content":"https://www.codingfeline.com/2020/04/18/actions-checkout-v2-push/ogp.png"}]]},"headers":[],"relativePath":"2020/04/18/actions-checkout-v2-push/index.md","filePath":"posts/2020/2020-04-18-actions-checkout-v2-push.md","date":{"time":"2020-04-18","string":"April 18, 2020","year":"2020","month":"04","day":"18"}}'),o={name:"2020/04/18/actions-checkout-v2-push/index.md"};function n(r,t,p,c,h,l){return a(),i("div",null,t[0]||(t[0]=[e(`<p>GitHub Actionsを使ってGitHub Pagesを運用している。 定期的にあるAPIから情報を取得して、更新があったらレポジトリにpushする。そしてそのpushをトリガーにしてGitHub Pagesにサイトをデプロイする、というフロー。</p><p>これがついさっきいろいろコードを更新してたら動かなくなった。 自分でpushするときはデプロイ用のworkflowが動くけど、workflowからpushするときは動かないのだ。</p><p>動き的には、GitHub Actions動かすと自動で設定されるアクセストークンを利用している時のような動作だ。このトークンは、無限ループを防ぐためにpush時にworkflowがトリガーされない。</p><p>しかし、workflowの設定ファイルを見ても自分で用意した別のアクセストークンを利用している。</p><p>GitHubのフォーラムを探してみると、そのもの<a href="https://github.community/t5/GitHub-Actions/Push-from-action-even-with-PAT-does-not-trigger-action/td-p/46232" target="_blank" rel="noreferrer">ズバリなトピック</a>があった。</p><p>結論から言うと、 <code>actions/checkout</code> をv2に更新したのが原因だった。 v2からは後続のgitコマンドで、デフォルトのアクセストークンが使われるような設定になっていたのだ。</p><p>ということで <code>actions/checkout@v2</code> の設定に <code>persist-credentials: false</code> を設定したら復旧した</p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Checkout</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  uses</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">actions/checkout@v2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  with</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    persist-credentials</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span></span></code></pre></div><h3 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h3><ul><li><a href="https://github.com/actions/checkout" target="_blank" rel="noreferrer">actions/checkout: Action for checking out a repo</a></li><li><a href="https://github.community/t5/GitHub-Actions/Push-from-action-even-with-PAT-does-not-trigger-action/td-p/46232" target="_blank" rel="noreferrer">Solved: Re: Push from action (even with PAT) does not trig... - GitHub Community Forum</a></li></ul>`,10)]))}const d=s(o,[["render",n]]);export{u as __pageData,d as default};