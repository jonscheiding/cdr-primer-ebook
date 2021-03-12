import Crawler from 'crawler';

const crawler = new Crawler();

const baseUrl = new URL('https://cdrprimer.org/read');

crawler.queue({
  uri: baseUrl,
  callback: processToc
});

const sections = [];

function processToc(error, res, done) {
  const $ = res.$;

  $('.mobile.toc .book-link').each((index, e) => {
    const num = $('.num-col', e).text().trim();
    const href = $('.chap-link', e).attr('href');
    const url = new URL(href, baseUrl);
    const data = {num, index};

    sections.push(data);

    crawler.queue({
      uri: url,
      callback: (error, res, done) => processNonChapter(data, error, res, done)
    });
  });

  done();
}

function processNonChapter(data, error, res, done) {
  data.html = res.$('.book-sec-main').html();
  data.title = res.$('.book-pg-header').text().trim();
  done();
}

crawler.on('drain', () => {
  console.log(JSON.stringify(sections, null, '  '));
});
