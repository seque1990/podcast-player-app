// src/app/podcast/[id]/page.tsx

import { getPodcastData } from '@/lib/podcastData';
import PodcastShowDetails from '@/components/podcast-show-details';
import { ParsedFeed } from '@/utils/rssFeedParser';
import { getFallbackPodcasts } from '@/utils/fallbackPodcasts';

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const podcasts = await getFallbackPodcasts();
  return podcasts.map((podcast) => ({
    id: podcast.id,
  }));
}

export default async function PodcastPage({ params }: { params: { id: string } }) {
  try {
    const show: ParsedFeed = await getPodcastData(params.id);
    
    // Only pass necessary data to the client
    const simplifiedShow = {
      id: show.id,
      title: show.title,
      description: show.description,
      image: show.image,
      total_episodes: show.total_episodes,
      episodes: show.episodes.map(episode => ({
        id: episode.id,
        title: episode.title,
        description: episode.description,
        pub_date_ms: episode.pub_date_ms,
        audio_length_sec: episode.audio_length_sec,
        audio: episode.audio,
        thumbnail: episode.thumbnail,
      })),
    };

    return <PodcastShowDetails initialShow={simplifiedShow} />;
  } catch (error) {
    console.error('Error fetching podcast data:', error);
    return <div className="text-red-500">Failed to fetch podcast details. Please try again later.</div>;
  }
}