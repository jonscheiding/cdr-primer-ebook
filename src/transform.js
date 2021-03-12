import $ from 'cheerio';

/**
 * @typedef {import('./types.js').ScrapedData} ScrapedData
 * @typedef {import('./types.js').TransformedData} TransformedData
 */

/**
 * @param {ScrapedData} scraped 
 * @param {TransformOptions} removeImages
 * @return {TransformedData}
 */
export default function transform(scraped) {
  /**
   * @type {TransformedData}
   */
  const transformed = Object.values(scraped.pages).map(p => {
    const $page = $.load(p.html);
    const title = $page('.book-pg-header h1').text().trim();

    const sections = [];

    fixImages($page, scraped.baseUrl);
    fixLinks($page, scraped.baseUrl);

    $page('main section').each((i, section) => {
      if($(section).is('.concepts')) {
        sections.push(parseConceptsSection($(section)));
        return;
      }

      if($(section).is('.definitions')) {
        sections.push(parseDefinitionsSection($(section)));
        return;
      }

      sections.push(parseContentSection($(section)));
    });

    return { title, sections, num: p.num, id: cleanHref(p.href) };
  });

  return transformed;
}

function cleanHref(url) {
  return url.replace(/\//g, '_');
}

function parseContentSection($section) {
  const id = $('div.anchor', $section).attr('id');

  let header = $.html($('header .title-col h1', $section));
  const title = $('p', header).text().trim();
  const num = $('.num', header).text().trim();
  
  const contents = $('.txt .grow > *, .figure-wrap', $section)
    .toArray()
    .map(content => {
      if($(content).is('.figure-wrap')) {
        return parseFigure($(content));
      }

      if($(content).is('.concept-cat')) {
        return { type: 'concepts' };
      }

      return { type: 'html', html: $.html(content) };
    });

  return { id, contents, title, num, type: 'content' };
}

function parseConceptsSection($section) {
  const intro = $('.def-intro p', $section).text().trim();
  const categories = [];
  
  $('.concept-cat', $section).each((i, category) => {
    const heading = $('.cat-name', category).text().trim();
    const definitions = parseDefinitions(category);
    categories.push({heading, definitions});
  });

  return {intro, categories, type: 'concepts'};
}

function parseDefinitionsSection($section) {
  const definitions = parseDefinitions($section);
  return { definitions, type: 'definitions' };
}

function parseDefinitions($defs) {
  const definitions = [];

  $('.term-def', $defs).each((j, termDef) => {
    const term = $('strong > p', termDef).text().trim();
    const definition = $('.bodytxt', termDef).text().trim();

    definitions.push({term, definition});
  });

  return definitions;
}

/**
 * @param {cheerio.Root} $ 
 */
function parseFigure($figure) {
  $('.num-col h2 span', $figure).remove();
  const num = $('.num-col h2', $figure).text().trim();
  const label = $('.num-col strong', $figure).text().trim();
  const caption = $('.caption.lg-only', $figure).text().trim();
  const src = $('img', $figure).attr('src');
  const html = $.html($('.box', $figure));

  return { type: 'figure', figure: { num, label, html, caption, src } };
}

/**
 * 
 * @param {cheerio.Root} $page 
*/
function fixLinks($page) {
  const FAKE_ORIGIN = 'http://book';

  $page('a').each((i, link) => {
    const url = new URL($(link).attr('href'), FAKE_ORIGIN);
    if(url.origin !== FAKE_ORIGIN || url.pathname === '/') return;
    $(link).attr('href', cleanHref(url.pathname) + '.xhtml');
  });
}

/**
 * @param {cheerio.Root} $page
 * @param {URL} baseUrl 
 */
function fixImages($page, baseUrl) {
  $page('img').each((i, img) => {
    let src = $(img).attr('src');
    if(!src) {
      const imgData = eval('(' + $(img).parent().attr('x-data') + ')');
      src = imgData.imgPath + '-lt.png';
    }

    src = new URL(src, baseUrl);
    
    $(img).replaceWith(
      $('<img />')
        .attr('src', src)
        .attr('alt', $(img).attr('alt'))
    );
  });
}