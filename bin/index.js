#!/usr/bin/env node
import program from 'commander';
import pageLoader from '../index.js';

program.arguments('<link>')
	.description('Bla bla bla')
	.version('1.0.0')
	.option('-o, --output [type]', 'output dir', process.cwd())
	.action((link) => {
		pageLoader(link, program.opts().output)
			.then(console.log);
	})
	.parse(process.argv);
