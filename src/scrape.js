import { cleanEnv, str } from 'envalid';
import Crawler from 'crawler';

export default function scrape() {
  const env = cleanEnv(process.env, {
    CONTENT_URL: str()
  });

  const crawler = new Crawler();
  const baseUrl = new URL(env.CONTENT_URL);
  const data = {};

  function processToc(error, res, done) {
    const $ = res.$;

    data.toc = { html: $('.toc').html() };
    data.pages = {};

    $('.toc .book-link').each((index, e) => {
      const href = $('.chap-link', e).attr('href');
      const url = new URL(href, baseUrl);
      const page = data.pages[href] = {index, href};

      crawler.queue({
        uri: url,
        callback: (error, res, done) => processTocLink(page, error, res, done)
      });
    });

    done();
  }

  function processTocLink(data, error, res, done) {
    data.html = res.$('.book-sec-main').html();
    done();
  }

  crawler.queue({
    uri: baseUrl,
    callback: processToc
  });

  return new Promise(resolve => {
    crawler.on('drain', () => resolve(data));
  });
}