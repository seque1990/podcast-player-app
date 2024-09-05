import { getPodcastData } from '@/lib/podcastData';
import PodcastShowDetails from '@/components/podcast-show-details';

export default async function PodcastPage({ params }: { params: { id: string } }) {
  try {
    const show = await getPodcastData(params.id);
    return <PodcastShowDetails show={show} />;
  } catch (error) {
    return <div className="text-red-500">Failed to fetch podcast details. Please try again later.</div>;
  }
}