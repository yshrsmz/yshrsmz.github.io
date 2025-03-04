javascript:(function (d) {
  const ASIN_REGEX =
    /https:\/\/www.amazon.co.jp\/(.*\/|)(dp|gp)\/(product\/|)([A-Z0-9]+).*/;

  let title = d.getElementById('productTitle').textContent.trim();
  let authors = [...document.querySelectorAll('#bylineInfo .author')]
    .map((el) => el.textContent.replace(/\n/g,'').replace(/\t/g,'').replace(/\s+/g, ' ').trim())
    .join('');
  let publisher = d.querySelector(
    '#rpi-attribute-book_details-publisher .rpi-attribute-value',
  )?.textContent?.trim();
  const publishedAt = d.querySelector(
    '#rpi-attribute-book_details-publication_date .rpi-attribute-value',
  ).textContent.trim();
  const asin = d.location.href.match(ASIN_REGEX)[4];
  const seriesAsin = d
    .querySelector('#seriesBulletWidget_feature_div a')
    ?.href?.match(ASIN_REGEX)[4];
  const imageUrl = document.querySelector('#imgTagWrapperId img')?.src;

  if (title) {
    title = title.replace("'", "&#39;")
  }
  if (authors) {
    authors = authors.replace("'", "&#39;")
  }

  const data = { title, authors, publisher, publishedAt, asin, seriesAsin, imageUrl };

  navigator.clipboard.writeText(JSON.stringify(data));
})(document);
