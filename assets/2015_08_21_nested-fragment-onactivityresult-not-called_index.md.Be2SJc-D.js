import{_ as i,c as a,L as t,o as e}from"./chunks/framework.B28L1Bbi.js";const k=JSON.parse('{"title":"(Android) ネストしたFragmentのonActivityResultが呼ばれない件","description":"","frontmatter":{"layout":"post","title":"(Android) ネストしたFragmentのonActivityResultが呼ばれない件","category":"programming","tags":["Android","java"],"head":[["link",{"rel":"canonical","href":"https://www.codingfeline.com/2015/08/21/nested-fragment-onactivityresult-not-called/"}],["meta",{"property":"og:url","content":"https://www.codingfeline.com/2015/08/21/nested-fragment-onactivityresult-not-called/"}],["meta",{"property":"og:title","content":"(Android) ネストしたFragmentのonActivityResultが呼ばれない件"}],["meta",{"property":"twitter:card","content":"summary_large_image"}],["meta",{"property":"twitter:site","content":"@_yshrsmz"}],["meta",{"property":"twitter:creator","content":"@_yshrsmz"}],["meta",{"property":"og:image","content":"https://www.codingfeline.com/2015/08/21/nested-fragment-onactivityresult-not-called/ogp.png"}]]},"headers":[],"relativePath":"2015/08/21/nested-fragment-onactivityresult-not-called/index.md","filePath":"posts/2015/2015-08-21-nested-fragment-onactivityresult-not-called.md","date":{"time":"2015-08-21","string":"August 21, 2015","year":"2015","month":"08","day":"21"}}'),n={name:"2015/08/21/nested-fragment-onactivityresult-not-called/index.md"};function l(p,s,h,d,r,o){return e(),a("div",null,s[0]||(s[0]=[t(`<h2 id="現象" tabindex="-1">現象 <a class="header-anchor" href="#現象" aria-label="Permalink to &quot;現象&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Activity &gt; Fragment &gt; ViewPager &gt; Fragment</span></span></code></pre></div><p>という構成にすると<code>ViewPager</code>内の<code>Fragment</code>で<code>onActivityResult</code>が呼ばれなくなってしまう。<br> また、<code>Activity</code>直下に<code>Fragment</code>が複数あると、想定していない<code>Fragment</code>の<code>onActivityResult</code>が呼ばれてしまう。</p><p>例:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Activity &gt; (DrawerFragment + (ParentFragment &gt; ViewPager &gt; ChildFragment))</span></span></code></pre></div><p>↑このような構成の時、<code>ViewPager</code>内の<code>ChildFragment</code>から<code>startActivityForResult</code>を呼ぶと、<code>ChildFragment</code>の<code>onActivityResult</code>が呼ばれないだけでなく、<code>DrawerFragment</code>の<code>onActivityResult</code>が呼ばれてしまったりする。<br> なお、<code>ParentFragment</code>の<code>onActivityResult</code>も呼ばれない。</p><h2 id="原因" tabindex="-1">原因 <a class="header-anchor" href="#原因" aria-label="Permalink to &quot;原因&quot;">​</a></h2><p>どの<code>Fragment</code>から<code>Activity</code>が呼ばれたかは、その<code>Fragment</code>が属する<code>FragmentManager</code>内のIndexで管理しているようだ。</p><p>ネストされた<code>Fragment</code>から<code>Activity</code>を呼ぶと、<code>Fragment</code>のIndexは親<code>Fragment</code>の<code>FragmentManager</code>(<code>getChildFragmentManager</code>で取得する<code>FragmentManager</code>)から取得される。</p><p>しかし、<code>Activity#onActivityResult</code>で呼び出し元のFragmentを判定する時は、<code>Activity</code>の<code>FragmentManager</code>から対応する<code>Fragment</code>を取得しようとするようである。そのため、見当違いの<code>Fragment</code>の<code>onActivityResult</code>が呼ばれてしまう。</p><p>なお、サポートライブラリではそもそも親<code>Fragment</code>から子<code>Fragment</code>の<code>onActivityResult</code>を呼ぶ機能はない模様。</p><h2 id="対策" tabindex="-1">対策 <a class="header-anchor" href="#対策" aria-label="Permalink to &quot;対策&quot;">​</a></h2><p>よくわからない<code>Fragment</code>の<code>onActivityResult</code>が呼ばれてしまう件は、とりあえず無視。その<code>Fragment</code>に<code>onActivityResult</code>を実装していなければ問題ないし、実装している場合もきちんと条件分岐していれば問題ない。</p><p>子<code>Fragment</code>の<code>onActivityResult</code>に関しては、下記のようにして対応する</p><ol><li>子<code>Fragment</code>で結果を受け取りたい場合は、親<code>Fragment</code>の<code>startActivityForResult</code>を呼ぶ。</li><li>親<code>Fragment</code>では<code>onActivityResult</code>を受け取れるので、親<code>Fragment</code>の<code>onActivityResult</code>内で、すべての子<code>Fragment</code>の<code>onActivityResult</code>を手動で呼ぶ</li></ol><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// BaseFragment.java</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">protected</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> callChildOnActivityResult</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(FragmentManager fm, </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> requestCode, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> resultCode, Intent data) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    List&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Fragment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; fragments </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fm.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getFragments</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (fragments </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fragments.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">size</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (Fragment fragment </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fragments) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            fragment.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">onActivityResult</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(requestCode, resultCode, data);            </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>上記のようなメソッドを用意し、必要な箇所(親<code>Fragment</code>の<code>onActivityResult</code>)で呼ぶとよさげ。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// FooActivity.java</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> static</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> startActivity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Fragment fragment) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Intent intent </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Intent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(fragment.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getActivity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), FooActivity.class);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 親Fragmentがあれば親Fragmentから呼ぶ</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Fragment parentFragment </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fragment.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getParentFragment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (parentFragment </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        fragment.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">startActivityForResult</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(intent, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;fragment_content&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        parentFragment.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">startActivityForResult</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(intent, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;fragment_content&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p><code>Activity</code>を開始するときはこんな感じ。</p>`,19)]))}const g=i(n,[["render",l]]);export{k as __pageData,g as default};