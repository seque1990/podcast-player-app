// src/utils/rssFeedParser.ts

import Parser from 'rss-parser';
import { createHash } from 'crypto';

const parser = new Parser();

export type ParsedEpisode = {
  id: string;
  title: string;
  description: string;
  pub_date_ms: number;
  audio_length_sec: number;
  audio: string;
  thumbnail: string;
};

export type ParsedFeed = {
  id: string;
  title: string;
  publisher: string;
  description: string;
  image: string;
  total_episodes: number;
  listennotes_url: string;
  episodes: ParsedEpisode[];
};

  function generateUrlFriendlyId(url: string): string {
    return createHash('md5').update(url).digest('hex');
  }
  
  export async function parsePodcastFeed(feedUrl: string): Promise<ParsedFeed> {
    try {
      const feed = await parser.parseURL(feedUrl);
      
      const episodes: ParsedEpisode[] = feed.items.map(item => ({
        id: item.guid || item.link || '',
        title: item.title || 'Untitled Episode',
        description: item.content || item.description || '',
        pub_date_ms: new Date(item.pubDate || '').getTime(),
        audio_length_sec: parseInt(item.itunes?.duration || '0', 10),
        audio: item.enclosure?.url || '',
        thumbnail: item.itunes?.image || feed.itunes?.image || '',
      }));
  
      return {
        id: generateUrlFriendlyId(feedUrl),
        title: feed.title || 'Unknown Podcast',
        publisher: feed.itunes?.author || 'Unknown Publisher',
        description: feed.description || 'No description available',
        image: feed.itunes?.image || '',
        total_episodes: episodes.length,
        listennotes_url: feedUrl,
        episodes: episodes,
      };
    } catch (error) {
      console.error(`Error parsing RSS feed ${feedUrl}:`, error);
      throw error;
    }
  }