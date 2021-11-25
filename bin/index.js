#!/usr/bin/env node
import program from 'commander';
import pageLoader from '../index.js';

program.version('1.0.0')
  .arguments('<link>')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .action((link) => pageLoader(link, program.output)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err.toString());
      process.exit(1);
    }))
  .parse(process.argv);
