// src/lib/podcastData.ts

import { getFallbackPodcastById } from '@/utils/fallbackPodcasts';
import { ParsedFeed } from '@/utils/rssFeedParser';

export async function getPodcastData(id: string): Promise<ParsedFeed> {
  try {
    const podcast = await getFallbackPodcastById(id);
    if (!podcast) {
      throw new Error('Podcast not found');
    }
    return podcast;
  } catch (error) {
    console.error('Error fetching podcast data:', error);
    throw new Error('Failed to fetch podcast details');
  }
}