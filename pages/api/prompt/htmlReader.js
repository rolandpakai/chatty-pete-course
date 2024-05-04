import { getSession } from "lib/auth/auth";
import { createNewPrompt } from 'services/prompt';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';

const processWikiPage = (document) => {
  const contents = [];
  const bodyContent = document.getElementById("bodyContent");
  const elements = bodyContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li');

  elements.forEach((element) => {
    const text = element.textContent.trim();
    const elementType = element.tagName.toLowerCase();
    if (
      !element.closest('.reflist') && 
      !element.closest('.wikitable') && 
      !element.closest('#References') && 
      !element.closest('#mw-hidden-catlinks') && 
      element.id !== 'References' &&
      text !== 'References[edit]' &&
      text !== '') {
      contents.push(text.trim());
    }
  });

  return contents;
}

const processProductPage = (document) => {
  const contents = [];
  const bodyContent = document.getElementById("maincontent");
  const elements = bodyContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li');

  elements.forEach((element) => {
    const text = element.textContent.trim();

    if (text !== '') {
      contents.push(text.trim());
    }
  });

  return contents;
}

const processProductPageImages = async (url) => {
  const contents = [];
  const browser = await puppeteer.launch();
  const browserPage = await browser.newPage();
  await browserPage.goto(url, { waitUntil: 'networkidle0' });

  const images = await browserPage.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    const imgsList = [];

    imgs.forEach(img => {
        if (img.src.toLowerCase().includes('media/catalog/product/cache/image')) {
          const imgData = { src: img.src, alt: img.getAttribute('alt') };
          imgsList.push(imgData);
        }
    });

    return imgsList;
  });

  await browser.close();

  if (images.length > 0) {
    const imagesContent = images.map((img) => {
      return `src='${img.src}' alt='${img.alt}'`
    })

    contents.push(`${images.length} image about the product: ${imagesContent.join(', ')}`);
  }

  return contents;
}

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const { url, label } = req.body;
    let { hostname, pathname } = new URL(url);
    let page = '';
    let type = 'html';

    if (pathname !== '/') {
      if (pathname.startsWith('/')) {
        pathname = pathname.slice(1);
      }
      const pathnameParts = pathname.split('/');
      page = pathnameParts[0];
    } else {
      page = hostname;
    }

    const response = await fetch(url);
    const html = await response.text(); 
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const contents = [];

    switch (page) {
      case 'wiki': 
        contents.push(processWikiPage(document)); 
        break;
      case 'products': 
        contents.push(processProductPage(document));
        contents.push(await processProductPageImages(url));
        break;
      default: throw new Error('No processor for the content');
    }

    contents.push(`More information at the following link: ${url}`);
    
    const promptResponse = await createNewPrompt(req, { url, label, content: contents.join('\n'), type, page });
    const { prompt } = await promptResponse.json();

    res.status(200).json({
      prompt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred when reading an url."
    });
  }
}