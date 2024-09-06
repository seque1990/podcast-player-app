// src/utils/fallbackPodcasts.ts

import { parsePodcastFeed, ParsedFeed } from './rssFeedParser';

const rssFeedUrls = [
  "https://allinchamathjason.libsyn.com/rss",
  "https://feeds.megaphone.fm/hubermanlab",
  "https://lexfridman.com/feed/podcast/",
  "https://feeds.megaphone.fm/thediaryofaceo",
  // Add more RSS feed URLs here to reach a total of 12
];

export async function getFallbackPodcasts(): Promise<ParsedFeed[]> {
  try {
    const podcastPromises = rssFeedUrls.map(url => parsePodcastFeed(url));
    return await Promise.all(podcastPromises);
  } catch (error) {
    console.error('Error fetching fallback podcasts:', error);
    return [];
  }
}