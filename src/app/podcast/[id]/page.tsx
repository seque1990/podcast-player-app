// src/app/podcast/[id]/page.tsx

import { getPodcastData } from '@/lib/podcastData';
import PodcastShowDetails from '@/components/podcast-show-details';
import { ParsedFeed } from '@/utils/rssFeedParser';

export default async function PodcastPage({ params }: { params: { id: string } }) {
  try {
    const show: ParsedFeed = await getPodcastData(params.id);
    return <PodcastShowDetails initialShow={show} />;
  } catch (error) {
    console.error('Error fetching podcast data:', error);
    return <div className="text-red-500">Failed to fetch podcast details. Please try again later.</div>;
  }
}