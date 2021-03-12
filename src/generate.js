import fs from 'fs';
import ejs from 'ejs';
import Epub from 'epub-gen';

/**
 * @typedef {import('./types').TransformedData} TransformedData
 */

/**
 * @param {TransformedData} transformed 
 */
export default function generate(transformed, output) {
  const chapter = ejs.compile(fs.readFileSync(__dirname + '/templates/chapter.ejs').toString());
  const styles = fs.readFileSync(__dirname + '/templates/styles.css').toString();

  const content = transformed.map(t => ({
    title: t.title,
    author: t.authors,
    data: chapter(t),
    filename: t.id
  }));

  const options = {
    title: 'Title',
    author: 'Author',
    css: styles,
    content
  };

  new Epub(options, output);
}
