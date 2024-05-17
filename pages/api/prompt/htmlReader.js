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
    const imgsData = {};

    imgs.forEach(img => {
        if (img.src.toLowerCase().includes('media/catalog/product/cache/image')) {
          const imgName = img.src.split('/').pop();
          const imgData = { src: img.src, alt: img.getAttribute('alt'), name: imgName };
          const image = imgsData[imgName];

          if (image) {
            image.src = imgData.src;
          } else {
            imgsData[imgName] = imgData;
          }
        }

        if (img.src.toLowerCase().includes('media/catalog/product/cache/thumbnail')) {
          const imgName = img.src.split('/').pop();
          const imgData = { thumbnail: img.src, alt: img.getAttribute('alt'), name: imgName };
          const image = imgsData[imgName];

          if (image) {
            image.thumbnail = imgData.thumbnail;
          } else {
            imgsData[imgName] = imgData;
          }
        }
    });

    const imgsList = Object.values(imgsData);

    return imgsList;
  });

  await browser.close();

  if (images.length > 0) {
    const productImages = {
      images
    };

    contents.push(JSON.stringify(productImages));
  }

  return contents;
}

const processUserManualPage = (document) => {
  const contents = [];
  const bodyContent = document.getElementById("UM");
  const elements = bodyContent.querySelectorAll('.LW-UM2-Heading1, .LW-UM2-Heading2, .LW-UM2-Heading3, .LW-UM2-Subhead-big, .LW-UM2-Subhead-small, .LW-UM2-Bodytext, .LW-UM2-Steps, .LW-UM2-Simple-text');

  elements.forEach((element) => {
    const text = element.textContent.trim();

    if (text !== '') {
      contents.push(text.trim());
    }
  });

  return contents;
}

const processUserManualImages = (document, url) => {
  const contents = [];
  const imgs = document.querySelectorAll('img');
  const imgsData = {};

  imgs.forEach(img => {
    const imgSrc = url.split('/').slice(0, -1).join('/');
    const imgName = img.src.split('/').pop();
    const imgData = { src: imgSrc + '/' + img.src, alt: img.getAttribute('alt'), name: imgName };
    const image = imgsData[imgName];

    if (image) {
      image.src = imgData.src;
    } else {
      imgsData[imgName] = imgData;
        }
  
  });
  const imgsList = Object.values(imgsData);
  
  if (imgsList.length > 0) {
    const productImages = {
      imgsList
    };

    contents.push(JSON.stringify(productImages));
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
      if(pathnameParts[0] === "media" && pathnameParts[2] === "User_Manuals"){
        page = pathnameParts[2];
      } else {
        page = pathnameParts[0];
      }
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
      case 'User_Manuals':
        contents.push(processUserManualPage(document));
        contents.push(processUserManualImages(document, url))
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