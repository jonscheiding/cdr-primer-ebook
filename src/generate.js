import Epub from 'epub-gen';

/**
 * @typedef {import('./types').TransformedData} TransformedData
 */

/**
 * @param {TransformedData} transformed 
 */
export default function generate(transformed, output) {
  const options = {
    title: 'Title',
    author: 'Author',
    content: []
    // content: Object.values(transformed.pages).map(p => ({
    //   title: `Page ${p.index}`,
    //   data: p.html
    // }))
  };

  new Epub(options, output);
}
