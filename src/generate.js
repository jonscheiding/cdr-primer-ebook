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
    content: transformed
  };

  new Epub(options, output);
}
