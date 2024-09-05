'use client';

import { useParams } from 'next/navigation'
import PodcastShowDetails from '@/components/podcast-show-details'
import { useState, useEffect } from 'react';
import { Client } from 'podcast-api';
import { createPodcastClient } from '@/utils/podcastApiUtils';


type PodcastShow = {
  id: string;
  title: string;
  publisher: string;
  description: string;
  image: string;
  total_episodes: number;
  listennotes_url: string;
  genre_ids: number[];
  website: string;
}

const client = createPodcastClient();

export default function PodcastPage() {
  const params = useParams();
  const [show, setShow] = useState<PodcastShow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPodcastDetails();
  }, [params.id]);

  const fetchPodcastDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await client.fetchPodcastById({
        id: params.id as string
      });
      setShow(response.data);
    } catch (error) {
      console.error('Error fetching podcast details:', error);
      setError('Failed to fetch podcast details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!show) {
    return <div>Podcast not found</div>;
  }

  return <PodcastShowDetails show={show} />;
}