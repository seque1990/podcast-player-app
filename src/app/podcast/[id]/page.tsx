// src/app/podcast/[id]/page.tsx

import { getPodcastData } from '@/lib/podcastData';
import PodcastShowDetails from '@/components/podcast-show-details';
import { ParsedFeed } from '@/utils/rssFeedParser';
import { Suspense } from 'react';

async function PodcastDetails({ id }: { id: string }) {
  const show: ParsedFeed = await getPodcastData(id);
  return <PodcastShowDetails initialShow={show} />;
}

export default function PodcastPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="text-white">Loading podcast details...</div>}>
      <PodcastDetails id={params.id} />
    </Suspense>
  );
}

export async function generateStaticParams() {
  // This function should return an array of all possible podcast IDs
  // For now, we'll return an empty array, but you should implement this
  // to generate static pages for all your podcasts
  return [];
}