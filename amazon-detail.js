javascript:(function (d) {
  const ASIN_REGEX =
    /https:\/\/www.amazon.co.jp\/(.*\/|)(dp|gp)\/(product\/|)([A-Z0-9]+).*/;

  let title = d.getElementById('productTitle').textContent.trim();
  let maker = d.querySelector('.po-brand td:nth-child(2)')?.textContent?.trim();
  if (!maker) {
    const els = Array.from(document.querySelectorAll('#detailBullets_feature_div .a-list-item')).filter((el) => el.textContent.includes('メーカー'));
    if (els.length > 0) {
      maker = els[0].querySelector('span + span')?.textContent?.trim();
    }
  }
  if (!maker) {
    const els = document.querySelectorAll('table.prodDetTable tr');
    els.forEach((el) => {
      const key = el.querySelector('th')?.textContent?.trim();
      if (key === 'メーカー名') {
        maker = el.querySelector('td')?.textContent?.trim();
      }
    });
  }
  const imageUrl = document.querySelector('#imgTagWrapperId img')?.src;

  if (title) {
    title = title.replace("'", "&#39;")
  }
  if (maker) {
    maker = maker.replace("'", "&#39;")
  }

  const asin = d.location.href.match(ASIN_REGEX)[4];

  const data = { title, maker, asin, imageUrl };

  navigator.clipboard.writeText(JSON.stringify(data));
})(document);
