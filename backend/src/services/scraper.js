import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractDomain } from '../utils/validateUrl.js';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
];

export async function scrapeUrl(url) {
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

  let response;
  try {
    response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html',
        'Accept-Language': 'en-US',
        'Connection': 'keep-alive'
      },
      maxRedirects: 5,
      responseType: 'text'
    });
  } catch (error) {
    if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
      throw { code: 'TIMEOUT', message: 'Page took too long to load (10s limit)' };
    }
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw { code: 'UNREACHABLE', message: 'Cannot reach that URL. Does it even exist?' };
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 403) {
        throw { code: 'BLOCKED', message: 'This site blocks scrapers. Nothing to roast... for now.' };
      }
      if (status === 404) {
        throw { code: 'NOT_FOUND', message: 'Page not found (404). Already deleted in shame?' };
      }
      if (status >= 400) {
        throw { code: 'HTTP_ERROR', message: `Site returned error ${status}` };
      }
    }
    throw { code: 'SCRAPE_FAILED', message: 'Failed to load the page' };
  }

  const contentType = response.headers['content-type'] || '';
  if (!contentType.toLowerCase().includes('text/html')) {
    throw { code: 'NOT_HTML', message: 'Only HTML pages can be roasted.' };
  }

  const $ = cheerio.load(response.data);

  // Remove non-content elements
  $('script, style, noscript, nav, footer, header, aside, iframe').remove();

  // Extract Title
  let title = $('meta[property="og:title"]').attr('content') ||
              $('meta[name="twitter:title"]').attr('content') ||
              $('title').text() ||
              $('h1').first().text() ||
              '';
  title = title.trim();

  // Extract Description
  let description = $('meta[property="og:description"]').attr('content') ||
                    $('meta[name="description"]').attr('content') ||
                    $('meta[name="twitter:description"]').attr('content') ||
                    '';
  description = description.trim();

  // Extract Body Text
  let bodyContainer = $('main');
  if (bodyContainer.length === 0) bodyContainer = $('article');
  if (bodyContainer.length === 0) bodyContainer = $('[role="main"]');
  if (bodyContainer.length === 0) bodyContainer = $('.content');
  if (bodyContainer.length === 0) bodyContainer = $('#content');
  if (bodyContainer.length === 0) bodyContainer = $('body');

  let bodyText = bodyContainer.text() || '';
  bodyText = bodyText.replace(/\s+/g, ' ').trim();
  bodyText = bodyText.slice(0, 4000);

  // Combine content
  const combined = `Title: ${title}\nDescription: ${description}\nContent: ${bodyText}`;
  const content = combined.slice(0, 4500);

  if (content.length < 50) {
    throw { code: 'EMPTY_CONTENT', message: 'Not enough content to roast.' };
  }

  const domain = extractDomain(url);
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  return {
    title: title.slice(0, 200),
    description: description.slice(0, 500),
    bodyText,
    content,
    favicon,
    domain
  };
}
