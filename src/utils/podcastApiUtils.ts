// Create a new file named 'podcastApiUtils.ts' in your src/utils directory

import { Client } from 'podcast-api';

export function createPodcastClient() {
  return Client({ apiKey: process.env.NEXT_PUBLIC_LISTENNOTES_API_KEY || '' });
}