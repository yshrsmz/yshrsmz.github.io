/* eslint-disable prettier/prettier */
// eslint-disable-next-line no-unused-labels
javascript:(function (d) {
  const ASIN_REGEX =
    /https:\/\/www.amazon.co.jp\/(.*\/|)(dp|gp)\/(product\/|)([A-Z0-9]+).*/;

  const title = d.getElementById('productTitle').innerText;
  const authors = [...document.querySelectorAll('#bylineInfo .author')]
    .map((el) => el.innerText.replace(/\n/g,'').replace(/\t/g,'').replace(/\s+/g, ' ').trim())
    .join('');
  const publisher = d.querySelector(
    '#rpi-attribute-book_details-publisher .rpi-attribute-value',
  )?.innerText;
  const publishedAt = d.querySelector(
    '#rpi-attribute-book_details-publication_date .rpi-attribute-value',
  ).innerText;
  const asin = d.location.href.match(ASIN_REGEX)[4];
  const seriesAsin = d
    .querySelector('#seriesBulletWidget_feature_div a')
    ?.href?.match(ASIN_REGEX)[4];

  const data = { title, authors, publisher, publishedAt, asin, seriesAsin };

  navigator.clipboard.writeText(JSON.stringify(data));
})(document);
