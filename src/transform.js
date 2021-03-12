/**
 * @typedef {import('./types.js').ScrapedData} ScrapedData
 * @typedef {import('./types.js').TransformedData} TransformedData
 */

/**
 * @param {ScrapedData} scraped 
 * @return {TransformedData}
 */
export default function transform(scraped) {
  return scraped.pages;
}
