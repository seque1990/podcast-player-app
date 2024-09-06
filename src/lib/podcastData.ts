// src/lib/podcastData.ts

import { getFallbackPodcastById } from '@/utils/fallbackPodcasts';
import { ParsedFeed } from '@/utils/rssFeedParser';

const podcastCache = new Map<string, ParsedFeed>();

export async function getPodcastData(id: string): Promise<ParsedFeed> {
  if (podcastCache.has(id)) {
    return podcastCache.get(id)!;
  }

  try {
    const podcast = await getFallbackPodcastById(id);
    if (!podcast) {
      throw new Error('Podcast not found');
    }
    
    // Cache the podcast data
    podcastCache.set(id, podcast);
    
    return podcast;
  } catch (error) {
    console.error('Error fetching podcast data:', error);
    throw new Error('Failed to fetch podcast details');
  }
}