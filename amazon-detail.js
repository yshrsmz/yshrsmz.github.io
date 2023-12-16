/* eslint-disable prettier/prettier */
// eslint-disable-next-line no-unused-labels
javascript:(function (d) {
  const ASIN_REGEX =
    /https:\/\/www.amazon.co.jp\/(.*\/|)(dp|gp)\/(product\/|)([A-Z0-9]+).*/;

  const title = d.getElementById('productTitle').textContent.trim();
  let maker = d.querySelector('.po-brand td:nth-child(2)')?.textContent?.trim();
  if (!maker) {
    const els = Array.from(document.querySelectorAll('#detailBullets_feature_div .a-list-item')).filter((el) => el.textContent.includes('メーカー'));
    if (els.length > 0) {
      maker = els[0].querySelector('span + span')?.textContent?.trim();
    }
  }

  const asin = d.location.href.match(ASIN_REGEX)[4];

  const data = { title, maker, asin };

  navigator.clipboard.writeText(JSON.stringify(data));
})(document);
