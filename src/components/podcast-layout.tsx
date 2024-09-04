'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Home, Search, Library, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { usePathname } from 'next/navigation';

type LayoutProps = {
  children: React.ReactNode;
};

export default function PodcastLayout({ children }: LayoutProps) {
  const pathname = usePathname();

  // Placeholder functions and state
  const isPlaying = false;
  const togglePlayPause = () => {};
  const currentEpisode = null;
  const progress = 0;
  const handleProgressChange = () => {};
  const volume = 75;
  const setVolume = () => {};
  const currentTime = 0;
  const duration = 0;

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-900 p-5 hidden md:block">
          <div className="space-y-6">
            <Link href="/player">
              <Button variant="ghost" className={`w-full justify-start text-lg font-semibold ${pathname === '/player' ? 'bg-gray-800' : ''}`}>
                <Home className="mr-2 h-5 w-5" /> Home
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-lg font-semibold">
              <Search className="mr-2 h-5 w-5" /> Search
            </Button>
            <Button variant="ghost" className="w-full justify-start text-lg font-semibold">
              <Library className="mr-2 h-5 w-5" /> Your Library
            </Button>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Bottom player */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-4">
            <img src="/placeholder.svg" alt="Current podcast" className="w-16 h-16 rounded" />
            <div>
              <h3 className="font-semibold">No episode selected</h3>
              <p className="text-gray-400 text-sm">Podcast Host</p>
            </div>
          </div>
          <div className="flex-1 max-w-md mx-4">
            <div className="flex justify-center items-center space-x-4 mb-2">
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-purple-100 hover:bg-purple-800">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-purple-100 hover:bg-purple-800" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-purple-100 hover:bg-purple-800">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center">
              <span className="text-sm w-16 text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[progress]}
                max={100}
                step={1}
                className="w-full mx-4"
                onValueChange={handleProgressChange}
              />
              <span className="text-sm w-16">{formatTime(duration)}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-purple-300" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-20"
              onValueChange={(value) => setVolume(value[0])}
            />
          </div>
        </div>
      </div>
    </div>
  );
}