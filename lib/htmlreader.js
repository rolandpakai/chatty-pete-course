'use server';
import * as fs from 'lib/fswrapper';
import { JSDOM } from 'jsdom';

export const parseHtml = (filePath) => {
  const html = fs.readFileSync(filePath, 'utf-8');

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const title = document.title;
  const textContent = document.body.textContent;

  return {
    filePath,
    title,
    textContent
  }
}
