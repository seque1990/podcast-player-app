'use client';

import React, { useState, useRef, lazy, Suspense } from 'react';
import PodcastLayout from './podcast-layout';
import { Button } from "@/components/ui/button"
import { Headphones, Share2 } from 'lucide-react'

const EpisodeList = lazy(() => import('./EpisodeList'));

type SimplifiedPodcastShow = {
  id: string;
  title: string;
  description: string;
  image: string;
  total_episodes: number;
  episodes: SimplifiedPodcastEpisode[];
};

type SimplifiedPodcastEpisode = {
  id: string;
  title: string;
  description: string;
  pub_date_ms: number;
  audio_length_sec: number;
  audio: string;
  thumbnail: string;
};

export default function PodcastShowDetails({ initialShow }: { initialShow: SimplifiedPodcastShow }) {
  const [currentEpisode, setCurrentEpisode] = useState<SimplifiedPodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      
      setCurrentTime(currentTime);
      
      if (!isNaN(duration)) {
        setDuration(duration);
        const progress = (currentTime / duration) * 100;
        setProgress(progress);
      }
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setProgress(newProgress);
    if (audioRef.current) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <PodcastLayout
      currentEpisode={currentEpisode ? {
        title: currentEpisode.title,
        show: initialShow.title,
        image: currentEpisode.thumbnail || ''
      } : null}
      isPlaying={isPlaying}
      togglePlayPause={togglePlayPause}
      progress={progress}
      handleProgressChange={handleProgressChange}
      volume={volume}
      setVolume={setVolume}
      currentTime={currentTime}
      duration={duration}
    >
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
        {/* Header */}
        <header className="bg-black bg-opacity-50 backdrop-blur-lg py-6 sticky top-0 z-10">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img src={initialShow.image} alt={initialShow.title} className="w-16 h-16 rounded-lg" />
              <h1 className="text-3xl font-bold">{initialShow.title}</h1>
            </div>
            <Button 
              className={`${isSubscribed ? 'bg-purple-700' : 'bg-purple-600'} hover:bg-purple-700 text-white`}
              onClick={() => setIsSubscribed(!isSubscribed)}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </div>
        </header>

        {/* Podcast Info Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <img 
                src={initialShow.image} 
                alt={initialShow.title} 
                className="w-64 h-64 object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">About the Show</h2>
                <p className="text-gray-300 mb-4">{initialShow.description}</p>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-purple-800 text-purple-200 px-3 py-1 rounded-full text-sm">
                    Podcast
                  </span>
                  <span className="flex items-center text-gray-300">
                    <Headphones className="h-5 w-5 mr-2" />
                    {initialShow.total_episodes} episodes
                  </span>
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors">
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Episodes Section */}
        <Suspense fallback={<div className="text-white">Loading episodes...</div>}>
          <EpisodeList 
            episodes={initialShow.episodes} 
            onEpisodeClick={(episode) => {
              setCurrentEpisode(episode);
              setIsPlaying(true);
              if (audioRef.current) {
                audioRef.current.src = episode.audio;
                audioRef.current.play();
              }
            }} 
          />
        </Suspense>
      </div>
    </PodcastLayout>
  );
}