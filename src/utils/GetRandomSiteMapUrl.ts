import { request, Page } from '@playwright/test';
import { parseStringPromise } from 'xml2js';

export async function getRandomSitemapUrl(url: string): Promise<string> {
  const apiContext = await request.newContext();

  const response = await apiContext.get(url);

  if (!response.ok()) {
    throw new Error(`Failed to fetch sitemap: ${response.status()}`);
  }

  const xml = await response.text();

  const parsed = await parseStringPromise(xml);

  // Extract all <loc> URLs
  const urls: string[] = parsed.urlset.url.map(
    (u: any) => u.loc[0]
  );

  if (!urls.length) {
    throw new Error('No URLs found in sitemap');
  }

  // Pick random URL
  const randomUrl = urls[Math.floor(Math.random() * urls.length)];

  return randomUrl;
}
