import { createPodcastClient } from '@/utils/podcastApiUtils';
import { PodcastShow } from 'podcast-api';

const client = createPodcastClient();

export async function getPodcastData(id: string): Promise<PodcastShow> {
  try {
    const response = await client.fetchPodcastById({ id });
    return response.data;
  } catch (error) {
    console.error('Error fetching podcast details:', error);
    throw new Error('Failed to fetch podcast details');
  }
}