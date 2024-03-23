import * as fs from 'lib/fswrapper';
import * as htmlparser2 from "htmlparser2";

export const parseHtml = (filePath) => {
  const html = fs.readFileSync(filePath, 'utf-8');

  const dom = htmlparser2.parseDocument(html);
  const document = dom.window.document;
  const title = document.title;
  const textContent = document.body.textContent;

  return {
    filePath,
    title,
    textContent
  }
}
