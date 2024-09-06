// src/app/podcast/[id]/page.tsx

import { getPodcastData } from '@/lib/podcastData';
import PodcastShowDetails from '@/components/podcast-show-details';
import { PodcastShow } from 'podcast-api';
import { getFallbackPodcastById } from '@/utils/fallbackPodcasts';
import { ParsedFeed } from '@/utils/rssFeedParser';

export default async function PodcastPage({ params, searchParams }: { params: { id: string }, searchParams: { fallback?: string } }) {
  try {
    let show: PodcastShow | ParsedFeed;
    
    if (searchParams.fallback === 'true') {
      show = await getFallbackPodcastById(params.id) as ParsedFeed;
      if (!show) {
        throw new Error('Fallback podcast not found');
      }
    } else {
      show = await getPodcastData(params.id) as PodcastShow;
    }
    
    return <PodcastShowDetails initialShow={show} />;
  } catch (error) {
    console.error('Error fetching podcast data:', error);
    return <div className="text-red-500">Failed to fetch podcast details. Please try again later.</div>;
  }
}