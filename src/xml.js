import { getHTMLByUrl, saveAssets } from './index.js';
import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';

const xmlDefaultLinks = ['http://www.sitemaps.org', 'http://www.w3.org'];

const getLinksFromXml = (xml) => {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const links = [];
  xml.replace(urlRegex, (url) => {
    links.push(url);
    return '';
  });

  return links.filter(link => xmlDefaultLinks
    .every(xmlDefaultLink => !link.includes(xmlDefaultLink)));
};

export const getInfoViaXml = async (url, outputDir) => {
  // get xml sitemap data
  console.log('Reading xml sitemap...');
  const xml = await getHTMLByUrl(url);

  // get all site links from sitemap
  getLinksFromXml(xml)
    .forEach((link) => {
      console.log(`Reading ${link}...`);
      getHTMLByUrl(link)
        .then(async (htmlData) => {
          if (typeof htmlData !== 'string') {
            return;
          }

          const urlObject = new URL(link);
          const {
            pathname,
            hostname,
          } = urlObject;
          const mainPath = path.join(outputDir, hostname);

          if (!fs.existsSync(mainPath)) {
            await fsPromises.mkdir(mainPath);
          }

          const pathChain = pathname
            .split('/')
            .filter(path => !!path);

          pathChain.forEach((subPath, index, arr) => {
            const outputPath = `${mainPath}/${arr.slice(0, index)
              .join('/')}/${subPath}`;

            if (!fs.existsSync(outputPath)) {
              fs.mkdirSync(outputPath);
            }
          });

          const pagePath = path.join(mainPath, pathChain.join('/'));
          saveAssets(htmlData, urlObject, pagePath, true);
        });
    });

  return 'Reading completed. Info about pages with errors (if relevant) is below.';
};
