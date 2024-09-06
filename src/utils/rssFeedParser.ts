// src/utils/rssFeedParser.ts

import Parser from 'rss-parser';

const parser = new Parser();

export type ParsedFeed = {
  id: string;
  title: string;
  publisher: string;
  description: string;
  image: string;
  total_episodes: number;
  listennotes_url: string;
};

export async function parsePodcastFeed(feedUrl: string): Promise<ParsedFeed> {
  try {
    const feed = await parser.parseURL(feedUrl);
    
    return {
      id: feed.link || feedUrl,
      title: feed.title || 'Unknown Podcast',
      publisher: feed.itunes?.author || 'Unknown Publisher',
      description: feed.description || 'No description available',
      image: feed.itunes?.image || '',
      total_episodes: feed.items.length,
      listennotes_url: feedUrl,
    };
  } catch (error) {
    console.error(`Error parsing RSS feed ${feedUrl}:`, error);
    throw error;
  }
}