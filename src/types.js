/**
 * @typedef {Object} ScrapedToc
 * @property {string} html
 */

/**
 * @typedef {Object} ScrapedPage
 * @property {string} html
 * @property {int} index
 * @property {string} num
 * @property {string} href
 */

/**
 * @typedef {Object} ScrapedData
 * @property {string} baseUrl
 * @property {ScrapedToc} toc
 * @property {Object.<string, ScrapedPage>} pages
 */

/**
 * @typedef {Object} Figure
 * @property {string} num
 * @property {string} label
 * @property {string} caption
 * @property {string} src
 */

/**
 * @typedef {Object} SectionContent
 * @property {string} type
 * @property {string} html
 * @property {Figure} figure
 */

/**
 * @typedef {Object} TermCategory
 * @property {string} heading
 * @property {Array<TermDefinition>} definitions
 */

/**
 * @typedef {Object} TermDefinition
 * @property {string} term
 * @property {string} definition
 */

/**
 * @typedef {Object} Section
 * @property {string} type
 * @property {string} title
 * @property {Array<SectionContent>} contents
 * @property {Array<TermCategory>} categories
 * @property {Array<TermDefinition>} definitions
 */

/**
 * @typedef {Object} Chapter
 * @property {string} title
 * @property {string} authors
 * @property {string} num
 * @property {string} id
 * @property {Array<Section>} sections
 */

/**
 * @typedef {Array<Chapter>} TransformedData
 */

export default {};
