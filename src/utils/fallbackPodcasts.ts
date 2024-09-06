// src/utils/fallbackPodcasts.ts

import { parsePodcastFeed, ParsedFeed } from './rssFeedParser';

const rssFeedUrls = [
  "https://allinchamathjason.libsyn.com/rss",
  "https://feeds.megaphone.fm/hubermanlab",
  "https://lexfridman.com/feed/podcast/",
  "https://feeds.megaphone.fm/thediaryofaceo",
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