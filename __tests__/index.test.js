import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import nock from 'nock';
import pageLoader from '../index.js';
import { expect } from '@jest/globals';

const getFixturePath = (filename) => path.join(path.resolve(), '__fixtures__', filename);

let outputFolder;

describe('page-loader', () => {
	beforeEach(async () => {
		outputFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
	});
	
	test('page loaded', async () => {
		const nockData = await fs.readFile(getFixturePath('courses.html'), 'utf-8');
		const scope = nock('https://blablabla.ru')
			.get('/courses')
			.reply(200, nockData);
		await pageLoader('https://blablabla.ru/courses', outputFolder);
		const page = await fs.lstat(path.join(outputFolder, 'blablabla-ru-courses.html'));
		
		expect(scope.isDone()).toBe(true);
		expect(page.isFile()).toBe(true);
	});
});
