// src/app/player/page.tsx

import { getFallbackPodcasts } from '@/utils/fallbackPodcasts';
import PodcastShowsList from '@/components/podcast-shows-list';
import { ParsedFeed } from '@/utils/rssFeedParser';

const INITIAL_BATCH_SIZE = 8;

async function getInitialPodcasts() {
  const allPodcasts = await getFallbackPodcasts();
  return allPodcasts.slice(0, INITIAL_BATCH_SIZE);
}

export default async function Home() {
  const initialPodcasts = await getInitialPodcasts();
  
  return <PodcastShowsList initialPodcasts={initialPodcasts} />;
}