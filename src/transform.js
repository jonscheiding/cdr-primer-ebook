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
    $page('img').each((i, img) => {
      let src = $(img).attr('src');
      if(!src) {
        const imgData = eval('(' + $(img).parent().attr('x-data') + ')');
        src = imgData.imgPath + '-lt.png';
      }

      src = new URL(src, scraped.baseUrl);
      
      $(img).replaceWith(
        $('<img />')
          .attr('src', src)
          .attr('alt', $(img).attr('alt'))
      );
    });

    const data = $page('.book-sec-sub').html() || '';

    return { title, data };
  });

  return transformed;
}
