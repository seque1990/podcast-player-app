'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PodcastLayout from './podcast-layout';
import { getFallbackPodcasts } from '@/utils/fallbackPodcasts';
import { ParsedFeed } from '@/utils/rssFeedParser';
import { getAllPodcasts } from '@/lib/api'


type PodcastShow = ParsedFeed;

const INITIAL_BATCH_SIZE = 8;

// Custom loader function
const imageLoader = ({ src }: { src: string }) => {
  return src;
};

export default function PodcastShowsList({ initialPodcasts }: { initialPodcasts: PodcastShow[] }) {
  const [podcastShows, setPodcastShows] = useState<PodcastShow[]>(initialPodcasts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (podcastShows.length === INITIAL_BATCH_SIZE) {
      loadRemainingPodcasts();
    }
  }, [podcastShows.length]);

  const loadRemainingPodcasts = async () => {
    setIsLoading(true);
    try {
      const allPodcasts = await getAllPodcasts();
      setPodcastShows(allPodcasts);
    } catch (error) {
      console.error('Error loading remaining podcasts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PodcastLayout
      currentEpisode={null}
      isPlaying={false}
      togglePlayPause={() => {}}
      progress={0}
      handleProgressChange={() => {}}
      volume={75}
      setVolume={() => {}}
      currentTime={0}
      duration={null}
    >
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Popular Podcasts</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {podcastShows.map((podcast) => (
            <Link href={`/podcast/${podcast.id}`} key={podcast.id}>
              <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="aspect-square relative">
                  <Image 
                    loader={imageLoader}
                    src={podcast.image} 
                    alt={podcast.title} 
                    fill
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                    unoptimized
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="font-semibold text-lg text-white">{podcast.title}</h3>
                    <p className="text-gray-300 text-sm">{podcast.total_episodes} episodes</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {isLoading && <p className="text-center mt-4">Loading more podcasts...</p>}
      </div>
    </PodcastLayout>
  );
}