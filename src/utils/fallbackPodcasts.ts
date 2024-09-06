// src/utils/fallbackPodcasts.ts

import { parsePodcastFeed, ParsedFeed } from './rssFeedParser';

const rssFeedUrls = [
  "https://allinchamathjason.libsyn.com/rss",
  "https://feeds.megaphone.fm/hubermanlab",
  "https://lexfridman.com/feed/podcast/",
  "https://feeds.megaphone.fm/thediaryofaceo",
  "https://rss.art19.com/business-wars",
  "https://feeds.megaphone.fm/investlikethebest",
  "https://feeds.megaphone.fm/ATHLLC5883700320",
  "https://feeds.simplecast.com/3hnxp7yk",
  "https://rss.art19.com/masters-of-scale",
  "https://feeds.simplecast.com/54nAGcIl",
  "https://feeds.megaphone.fm/thispastweekend",
  "https://omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/A91018A4-EA4F-4130-BF55-AE270180C327/44710ECC-10BB-48D1-93C7-AE270180C33E/podcast.rss",

  // Add more RSS feed URLs here to reach a total of 12
];

let cachedFallbackPodcasts: ParsedFeed[] | null = null;

export async function getFallbackPodcasts(): Promise<ParsedFeed[]> {
  if (cachedFallbackPodcasts) {
    return cachedFallbackPodcasts;
  }

  try {
    const podcastPromises = rssFeedUrls.map(url => parsePodcastFeed(url));
    cachedFallbackPodcasts = await Promise.all(podcastPromises);
    return cachedFallbackPodcasts;
  } catch (error) {
    console.error('Error fetching fallback podcasts:', error);
    return [];
  }
}

export async function getFallbackPodcastById(id: string): Promise<ParsedFeed | undefined> {
  const fallbackPodcasts = await getFallbackPodcasts();
  return fallbackPodcasts.find(podcast => podcast.id === id);
}