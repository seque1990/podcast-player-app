'use client';

import React, { useState, useRef, useEffect } from 'react';
import PodcastLayout from './podcast-layout';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Clock, Calendar, Search, Volume2, Headphones, Share2 } from 'lucide-react'
import Parser from 'rss-parser';

type PodcastShow = {
  id: number;
  title: string;
  host: string;
  summary: string;
  cover: string;
  rssUrl: string;
  category: string;
}

type PodcastEpisode = {
  id: string;
  title: string;
  duration: string;
  date: string;
  description: string;
  audioUrl: string;
  image: string;
}

const parser = new Parser();

export default function PodcastShowDetails({ show }: { show: PodcastShow }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null)
  const [volume, setVolume] = useState(75)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState<number | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    fetchEpisodes();
  }, [show.rssUrl]);

  const fetchEpisodes = async () => {
    try {
      const feed = await parser.parseURL(show.rssUrl);
      const parsedEpisodes: PodcastEpisode[] = feed.items.map((item, index) => ({
        id: item.guid || `${index}`,
        title: item.title || '',
        duration: item.itunes?.duration || '',
        date: item.pubDate || '',
        description: item.contentSnippet || '',
        audioUrl: item.enclosure?.url || '',
        image: item.itunes?.image || show.cover,
      }));
      setEpisodes(parsedEpisodes);
      // Update show summary if available in the feed
      if (feed.description) {
        show.summary = feed.description;
      }
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  const filteredEpisodes = episodes.filter(episode =>
    episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    episode.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleEpisodeClick = (episode: PodcastEpisode) => {
    setCurrentEpisode(episode)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.src = episode.audioUrl
      audioRef.current.play()
    }
  }

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
  }

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0]
    setProgress(newProgress)
    if (audioRef.current) {
      const newTime = (newProgress / 100) * audioRef.current.duration
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (timeInSeconds: number | null): string => {
    if (timeInSeconds === null || isNaN(timeInSeconds)) {
      return "--:--";
    }
    
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
  
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  return (
    <PodcastLayout
      currentEpisode={currentEpisode ? {
        title: currentEpisode.title,
        show: show.title,
        image: currentEpisode.image
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
              <img src={show.cover} alt={show.title} className="w-16 h-16 rounded-lg" />
              <h1 className="text-3xl font-bold">{show.title}</h1>
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
                src={show.cover} 
                alt={show.title} 
                className="w-64 h-64 object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">About the Show</h2>
                <p className="text-gray-300 mb-4">{show.summary}</p>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-purple-800 text-purple-200 px-3 py-1 rounded-full text-sm">
                    {show.category}
                  </span>
                  <span className="flex items-center text-gray-300">
                    <Headphones className="h-5 w-5 mr-2" />
                    {episodes.length} episodes
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
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">Episodes</h2>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search episodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pl-10"
                />
              </div>
            </div>
            <div className="space-y-6">
              {episodes.filter(episode =>
                episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                episode.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((episode) => (
                <div 
                  key={episode.id} 
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-70 transition-all duration-300 transform hover:scale-102 cursor-pointer"
                  onClick={() => handleEpisodeClick(episode)}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <img src={episode.image} alt={episode.title} className="w-full md:w-48 h-48 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">{episode.title}</h3>
                        <Button variant="ghost" size="icon" className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/50">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                      <p className="text-gray-300 mb-4">{episode.description}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="mr-4">{episode.duration}</span>
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(episode.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PodcastLayout>
  )
}