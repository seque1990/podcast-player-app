'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PodcastLayout from './podcast-layout';
import { getFallbackPodcasts } from '@/utils/fallbackPodcasts';
import { ParsedFeed } from '@/utils/rssFeedParser';

type PodcastShow = ParsedFeed;

export default function PodcastShowsList() {
  const [podcastShows, setPodcastShows] = useState<PodcastShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFallbackPodcasts();
  }, []);

  const loadFallbackPodcasts = async () => {
    setIsLoading(true);
    try {
      const fallbackPodcasts = await getFallbackPodcasts();
      setPodcastShows(fallbackPodcasts);
    } catch (error) {
      console.error('Error loading fallback podcasts:', error);
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
        {isLoading && <p>Loading podcasts...</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {podcastShows.map((podcast) => (
            <Link href={`/podcast/${podcast.id}`} key={podcast.id}>
              <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="aspect-square relative">
                  <img src={podcast.image} alt={podcast.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="font-semibold text-lg text-white">{podcast.title}</h3>
                    <p className="text-gray-300 text-sm">{podcast.total_episodes} episodes</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PodcastLayout>
  );
}