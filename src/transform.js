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

    $page('main section').each((i, section) => {
      if($(section).is('.concepts')) {
        sections.push(parseConceptsSection($(section)));
        return;
      }
      if($(section).is('.definitions')) {
        sections.push(parseDefinitionsSection($(section)));
        return;
      }

      const id = $('div.anchor', section).attr('id');

      const contents = $('.grow > *, .figure-wrap', section)
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

      sections.push({id, contents});
    });

    return { title, sections, num: p.num, data: '' };
  });

  return transformed;
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
  return { definitions };
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
  const caption = $('.caption', $figure).text().trim();
  const src = $('img', $figure).attr('src');

  return { type: 'figure', num, label, caption, src };
}

/**
 * @param {cheerio.Root} $ 
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