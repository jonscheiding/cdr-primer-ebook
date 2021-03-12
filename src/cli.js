import yargs from 'yargs';

import scrape from './scrape';

yargs
  .command('scrape', true, () => {}, async () => {
    const scraped = await scrape();
    console.log(JSON.stringify(scraped, null, '  '));
  })
  .argv;
