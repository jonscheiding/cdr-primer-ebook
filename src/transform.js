import $ from 'cheerio';

/**
 * @typedef {import('./types.js').ScrapedData} ScrapedData
 * @typedef {import('./types.js').TransformedData} TransformedData
 */

/**
 * @param {ScrapedData} scraped 
 * @return {TransformedData}
 */
export default function transform(scraped) {
  const $toc = $.load(scraped.toc.html);

  /**
   * @type {TransformedData}
   */
  const transformed = Object.values(scraped.pages).map(p => {
    const $page = $.load(p.html);
    const title = $page('.book-pg-header h1').text().trim();

    // TODO:
    // $page('img:not([src])').each((i, img) => {
    //   const imgData = eval($(img).parent().attr('x-data') + '-lt.png');
    //   $(img).attr('src', imgData.imgPath);
    // });

    $page('img:not([src])').remove();

    const data = $page('.book-sec-sub').html() || '';

    return { title, data };
  });

  return transformed;
}
