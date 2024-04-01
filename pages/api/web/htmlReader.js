import {v4 as uuid} from 'uuid';
import { getSession } from "lib/auth/auth";
import { insertOne } from 'services/db';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const { url } = req.body;
    console.log("url", url);
    console.log("api crawl/fetchUrl");

    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const textContent = dom.window.document.body.textContent;
    const document = dom.window.document

    const contents = [];
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, li');
    elements.forEach(element => {
      const text = element.textContent.trim();
      const elementType = element.tagName.toLowerCase();
      console.log(elementType + " = " + text);
      if (text !== '') {
        contents.push(text);
      }
    });


    res.status(200).json({
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred when reading an url."
    });
  }
}