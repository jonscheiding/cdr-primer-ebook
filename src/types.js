/**
 * @typedef {Object} ScrapedToc
 * @property {string} html
 */

/**
 * @typedef {Object} ScrapedPage
 * @property {string} html
 * @property {int} index
 * @property {string} href
 */

/**
 * @typedef {Object} ScrapedData
 * @property {ScrapedToc} toc
 * @property {Object.<string, ScrapedPage>} pages
 */

/**
 * @typedef {ScrapedData} TransformedData
 */

export default {};
