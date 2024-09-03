'use client';

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Home, Search, Library, Volume2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

// Define the Podcast type if not imported from elsewhere
type Podcast = {
  id: number,
  title: string,
  host: string,
  cover: string,
  audio: string
}

const podcastData = [
  { id: 1, title: "Tech Talk", host: "Alice Smith", cover: "/placeholder.svg", audio: "/podcast_sample.mp3" },
  { id: 2, title: "True Crime Stories", host: "Bob Johnson", cover: "/placeholder.svg", audio: "/podcast_sample.mp3" },
  { id: 3, title: "Comedy Hour", host: "Charlie Brown", cover: "/placeholder.svg", audio: "/podcast_sample.mp3" },
  { id: 4, title: "Science Today", host: "Diana Prince", cover: "/placeholder.svg", audio: "/podcast_sample.mp3" },
  { id: 5, title: "History Uncovered", host: "Edward Norton", cover: "/placeholder.svg", audio: "/podcast_sample.mp3" },
  { id: 6, title: "Mindfulness Meditation", host: "Fiona Apple", cover: "/placeholder.svg", audio: "/podcast_sample.mp3" },
]

export default function PodcastPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null)
  const [volume, setVolume] = useState(75)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlayPause = () => {
    if (audioRef.current && currentPodcast) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handlePodcastClick = (podcast: Podcast) => {
    setCurrentPodcast(podcast)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.src = podcast.audio
      audioRef.current.play()
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(progress)
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {podcastData.map((podcast) => (
              <div key={podcast.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => handlePodcastClick(podcast)}>
                <img src={podcast.cover} alt={podcast.title} className="w-full aspect-square object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{podcast.title}</h3>
                  <p className="text-gray-400 text-sm">{podcast.host}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Bottom player */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-4">
            <img src={currentPodcast?.cover} alt="Current podcast" className="w-16 h-16 rounded" />
            <div>
              <h3 className="font-semibold">{currentPodcast?.title || 'No podcast selected'}</h3>
              <p className="text-gray-400 text-sm">{currentPodcast?.host || 'Select a podcast to play'}</p>
            </div>
          </div>
          <div className="flex-1 max-w-md mx-4">
            <div className="flex justify-center items-center space-x-4 mb-2">
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-purple-100 hover:bg-purple-800">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-purple-300 hover:text-purple-100 hover:bg-purple-800" 
                onClick={togglePlayPause}
                disabled={!currentPodcast}
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-purple-100 hover:bg-purple-800">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            <Slider
              value={[progress]}
              max={100}
              step={1}
              className="w-full"
              onValueChange={handleProgressChange}
            />
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
  )
}