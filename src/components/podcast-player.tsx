'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Home, Search, Library, Volume2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import debounce from 'lodash/debounce'
import Parser from 'rss-parser'

type CustomItem = {
  title: string;
  enclosure: { url: string };
  itunes: { image: string; duration: string };
}

type CustomFeed = {
  title: string;
  description: string;
  items: CustomItem[];
}

type Podcast = {
  id: number;
  title: string;
  description: string;
  cover: string;
  audio: string;
  duration: string;
}

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    item: ['itunes:image', ['itunes:duration', 'duration']]
  }
});

const RSS_FEED_URL = 'https://allinchamathjason.libsyn.com/rss';

export default function PodcastPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null)
  const [volume, setVolume] = useState(75)
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
const [duration, setDuration] = useState(0)

  useEffect(() => {
    fetchPodcasts()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const debouncedHandlePodcastClick = useCallback(
    debounce((podcast: Podcast) => {
      handlePodcastClick(podcast)
    }, 300),
    []
  )

  const fetchPodcasts = async () => {
    try {
      const feed = await parser.parseURL(RSS_FEED_URL)
      const parsedPodcasts: Podcast[] = feed.items.map((item, index) => ({
        id: index,
        title: item.title || '',
        description: item.contentSnippet || '',
        cover: item.itunes?.image || feed.image?.url || '',
        audio: item.enclosure?.url || '',
        duration: item.itunes?.duration || ''
      }))
      setPodcasts(parsedPodcasts)
    } catch (error) {
      console.error('Error fetching podcasts:', error)
      setError('Failed to fetch podcasts. Please try again later.')
    }
  }

  const togglePlayPause = async () => {
    if (audioRef.current && currentPodcast) {
      try {
        if (isPlaying) {
          await audioRef.current.pause()
        } else {
          await audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
      } catch (error) {
        console.error('Error toggling play/pause:', error)
        setError('Failed to play/pause audio. Please try again.')
      }
    }
  }

  const handlePodcastClick = async (podcast: Podcast) => {
    setCurrentPodcast(podcast)
    setIsPlaying(false)
    setIsLoading(true)
    setError(null)
  
    if (audioRef.current) {
      try {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = podcast.audio
  
        await new Promise((resolve, reject) => {
          if (audioRef.current) {
            audioRef.current.oncanplay = resolve
            audioRef.current.onerror = reject
          }
        })
  
        await audioRef.current.play()
  
        setIsPlaying(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Error playing audio:', error)
        setError('Failed to play audio. Please try again.')
        setIsLoading(false)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0]
    setProgress(newProgress)
    if (audioRef.current) {
      const newTime = (newProgress / 100) * audioRef.current.duration
      audioRef.current.currentTime = newTime
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <audio
        ref={audioRef}
        src={currentPodcast?.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {podcasts.map((podcast) => (
              <div key={podcast.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => debouncedHandlePodcastClick(podcast)}>
                <img src={podcast.cover} alt={podcast.title} className="w-full aspect-square object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{podcast.title}</h3>
                  <p className="text-gray-400 text-sm">{podcast.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Bottom player */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Podcast info */}
          <div className="flex items-center space-x-4 w-1/4">
            <img src={currentPodcast?.cover} alt="Current podcast" className="w-16 h-16 rounded flex-shrink-0" />
            <div className="overflow-hidden">
              <h3 className="font-semibold truncate w-48">{currentPodcast?.title || 'No podcast selected'}</h3>
              <p className="text-gray-400 text-sm truncate w-48">{currentPodcast?.duration || 'Select a podcast to play'}</p>
            </div>
          </div>
          
          {/* Player controls and progress */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex justify-center items-center space-x-4 mb-2">
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-purple-100 hover:bg-purple-800">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-purple-300 hover:text-purple-100 hover:bg-purple-800" 
                onClick={togglePlayPause}
                disabled={!currentPodcast || isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin">⌛</span>
                ) : isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-purple-100 hover:bg-purple-800">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center">
              <span className="text-sm w-10 text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[progress]}
                max={100}
                step={1}
                className="w-full mx-4"
                onValueChange={handleProgressChange}
              />
              <span className="text-sm w-10">{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Volume control */}
          <div className="flex items-center space-x-2 w-1/4 justify-end">
            <Volume2 className="h-5 w-5 text-purple-300" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-24"
              onValueChange={(value) => setVolume(value[0])}
            />
          </div>
        </div>
      </div>
    </div>
  )
}