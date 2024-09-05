import { getPodcastData } from '@/lib/podcastData';
import PodcastShowDetails from '@/components/podcast-show-details';
import { PodcastShow } from 'podcast-api';

export default async function PodcastPage({ params }: { params: { id: string } }) {
  try {
    const show: PodcastShow = await getPodcastData(params.id);
    return <PodcastShowDetails show={show} />;
  } catch (error) {
    console.error('Error fetching podcast data:', error);
    return <div className="text-red-500">Failed to fetch podcast details. Please try again later.</div>;
  }
}