import fs from 'fs';
import yargs from 'yargs';

import scrape from './scrape';
import transform from './transform';
import generate from './generate';

yargs
  .command('scrape', true, () => {}, async () => {
    const scraped = await scrape();
    console.log(JSON.stringify(scraped, null, '  '));
  })
  .command('transform', true, 
    y => y.option('input', { type: 'string' }).demandOption('input'),
    (argv) => {
      const scraped = JSON.parse(fs.readFileSync(argv.input));
      const transformed = transform(scraped);
      console.log(JSON.stringify(transformed, null, '  '));
    }
  )
  .command('generate', true, 
    y => y
      .option('input', { type: 'string' })
      .option('output', { type: 'string' })
      .demandOption('input').demandOption('output')
    ,
    (argv) => {
      const transformed = JSON.parse(fs.readFileSync(argv.input));
      generate(transformed, argv.output);
    }
  )
  .argv;
