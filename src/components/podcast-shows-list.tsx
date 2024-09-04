'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Home, Search, Library } from 'lucide-react'
import Parser from 'rss-parser';

type PodcastShow = {
  id: number;
  title: string;
  host: string;
  description: string;
  cover: string;
  category: string;
  rssUrl: string;
  episodeCount: number;
}

const parser = new Parser();

const podcastFeeds = [
  { id: 1, rssUrl: "https://allinchamathjason.libsyn.com/rss" },
  { id: 2, rssUrl: "https://feeds.megaphone.fm/hubermanlab" },
  { id: 3, rssUrl: "https://lexfridman.com/feed/podcast/" },
  // Add more podcast RSS feeds here
];

export default function PodcastShowsList() {
  const [podcastShows, setPodcastShows] = useState<PodcastShow[]>([]);

  useEffect(() => {
    fetchPodcastShows();
  }, []);

  const fetchPodcastShows = async () => {
    const shows = await Promise.all(podcastFeeds.map(async (feed, index) => {
      try {
        const parsedFeed = await parser.parseURL(feed.rssUrl);
        return {
          id: feed.id,
          title: parsedFeed.title || `Podcast ${index + 1}`,
          host: parsedFeed.itunes?.author || 'Unknown Host',
          description: parsedFeed.description || '',
          cover: parsedFeed.itunes?.image || parsedFeed.image?.url || '/placeholder.svg',
          category: parsedFeed.itunes?.categories?.[0] || 'Uncategorized',
          rssUrl: feed.rssUrl,
          episodeCount: parsedFeed.items.length
        };
      } catch (error) {
        console.error(`Error fetching podcast ${feed.rssUrl}:`, error);
        return null;
      }
    }));
    setPodcastShows(shows.filter((show): show is PodcastShow => show !== null));
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-900 p-5 hidden md:block">
          <div className="space-y-6">
            <Button variant="ghost" className="w-full justify-start text-lg font-semibold">
              <Home className="mr-2 h-5 w-5" /> Home
            </Button>
            <Button variant="ghost" className="w-full justify-start text-lg font-semibold">
              <Search className="mr-2 h-5 w-5" /> Search
            </Button>
            <Button variant="ghost" className="w-full justify-start text-lg font-semibold">
              <Library className="mr-2 h-5 w-5" /> Your Library
            </Button>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold mb-6">Popular Podcasts</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {podcastShows.map((podcast) => (
              <Link href={`/podcast/${podcast.id}`} key={podcast.id}>
                <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="aspect-square relative">
                    <img src={podcast.cover} alt={podcast.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="font-semibold text-lg text-white">{podcast.title}</h3>
                      <p className="text-gray-300 text-sm">{podcast.episodeCount} episodes</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}