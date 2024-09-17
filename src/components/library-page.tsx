'use client';

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, PlayCircle, PlusCircle, Bookmark, History, Clock, Calendar } from 'lucide-react'
import PodcastLayout from '@/components/podcast-layout'
import Image from 'next/image'

// Mock data for subscribed podcasts
const subscribedPodcasts = [
  { id: 1, title: "Tech Talk Daily", lastEpisode: "The Future of AI", lastListened: "2 days ago", image: "/placeholder.svg?height=80&width=80&text=Tech+Talk" },
  { id: 2, title: "Business Insights", lastEpisode: "Startup Funding Strategies", lastListened: "1 week ago", image: "/placeholder.svg?height=80&width=80&text=Business" },
  { id: 3, title: "Science Today", lastEpisode: "Black Holes Explained", lastListened: "3 days ago", image: "/placeholder.svg?height=80&width=80&text=Science" },
  { id: 4, title: "History Uncovered", lastEpisode: "The Renaissance Era", lastListened: "1 day ago", image: "/placeholder.svg?height=80&width=80&text=History" },
]

// Mock data for recently played episodes
const recentlyPlayed = [
  { id: 1, title: "The Impact of 5G", podcast: "Tech Talk Daily", duration: "45:30", image: "/placeholder.svg?height=60&width=60&text=5G" },
  { id: 2, title: "Effective Leadership", podcast: "Business Insights", duration: "38:15", image: "/placeholder.svg?height=60&width=60&text=Leadership" },
  { id: 3, title: "Climate Change Update", podcast: "Science Today", duration: "52:00", image: "/placeholder.svg?height=60&width=60&text=Climate" },
]

export default function YourLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPodcasts = subscribedPodcasts.filter(podcast =>
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Your Library</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subscribed Podcasts Section */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Subscribed Podcasts</h2>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search your podcasts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-full w-full"
                  />
                </div>
                <div className="space-y-4">
                  {filteredPodcasts.map((podcast) => (
                    <div key={podcast.id} className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg">
                      <Image src={podcast.image} alt={podcast.title} width={80} height={80} className="rounded-md object-cover" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{podcast.title}</h3>
                        <p className="text-sm text-gray-300">Last episode: {podcast.lastEpisode}</p>
                        <p className="text-xs text-gray-400">Last listened: {podcast.lastListened}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <PlayCircle className="h-6 w-6" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                  <PlusCircle className="h-5 w-5 mr-2" /> Add New Podcast
                </Button>
              </div>
            </div>

            {/* Additional Features Section */}
            <div className="space-y-6">
              {/* Recently Played */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Recently Played</h2>
                <div className="space-y-4">
                  {recentlyPlayed.map((episode) => (
                    <div key={episode.id} className="flex items-center space-x-3">
                      <Image src={episode.image} alt={episode.title} width={48} height={48} className="rounded-md object-cover" />
                      <div className="flex-1">
                        <h4 className="font-medium">{episode.title}</h4>
                        <p className="text-sm text-gray-400">{episode.podcast}</p>
                      </div>
                      <span className="text-sm text-gray-400">{episode.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center justify-center">
                    <Bookmark className="h-5 w-5 mr-2" /> Bookmarks
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center">
                    <History className="h-5 w-5 mr-2" /> History
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center">
                    <Clock className="h-5 w-5 mr-2" /> Queue
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center">
                    <Calendar className="h-5 w-5 mr-2" /> Schedule
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PodcastLayout>
  )
}