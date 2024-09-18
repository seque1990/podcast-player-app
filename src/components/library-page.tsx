'use client';

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, PlayCircle, PlusCircle, Bookmark, History, Clock, Calendar } from 'lucide-react'
import PodcastLayout from '@/components/podcast-layout'
import Image from 'next/image'
import { getFallbackPodcasts } from '@/utils/fallbackPodcasts'
import { ParsedFeed } from '@/utils/rssFeedParser'
import Link from 'next/link'

// You might want to create a separate file for these types
type UserSubscription = {
  podcastId: string;
  lastListened: string;
}

type RecentlyPlayedEpisode = {
  id: string;
  title: string;
  podcastId: string;
  podcastTitle: string;
  duration: string;
  image: string;
}

export default function YourLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [allPodcasts, setAllPodcasts] = useState<ParsedFeed[]>([])
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([])
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedEpisode[]>([])

  useEffect(() => {
    const loadPodcasts = async () => {
      const podcasts = await getFallbackPodcasts()
      setAllPodcasts(podcasts)
    }

    loadPodcasts()

    // Mock user subscriptions - replace with actual data fetching
    setUserSubscriptions([
      { podcastId: "1", lastListened: "2 days ago" },
      { podcastId: "2", lastListened: "1 week ago" },
      { podcastId: "3", lastListened: "3 days ago" },
    ])

    // Mock recently played - replace with actual data fetching
    setRecentlyPlayed([
      { id: "1", title: "The Future of AI", podcastId: "1", podcastTitle: "Tech Talk Daily", duration: "45:30", image: "/placeholder.svg?height=60&width=60&text=AI" },
      { id: "2", title: "Startup Funding Strategies", podcastId: "2", podcastTitle: "Business Insights", duration: "38:15", image: "/placeholder.svg?height=60&width=60&text=Funding" },
      { id: "3", title: "Black Holes Explained", podcastId: "3", podcastTitle: "Science Today", duration: "52:00", image: "/placeholder.svg?height=60&width=60&text=Space" },
    ])
  }, [])

  const subscribedPodcasts = allPodcasts.filter(podcast => 
    userSubscriptions.some(sub => sub.podcastId === podcast.id)
  )

  const filteredPodcasts = subscribedPodcasts.filter(podcast =>
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubscribe = (podcastId: string) => {
    // Implement subscription logic here
    console.log(`Subscribing to podcast ${podcastId}`)
  }

  const handlePlay = (episodeId: string) => {
    // Implement play logic here
    console.log(`Playing episode ${episodeId}`)
  }

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
                  {filteredPodcasts.map((podcast) => {
                    const subscription = userSubscriptions.find(sub => sub.podcastId === podcast.id)
                    return (
                      <div key={podcast.id} className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg">
                        <Image src={podcast.image} alt={podcast.title} width={80} height={80} className="rounded-md object-cover" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{podcast.title}</h3>
                          <p className="text-sm text-gray-300">Last episode: {podcast.episodes[0]?.title || 'N/A'}</p>
                          <p className="text-xs text-gray-400">Last listened: {subscription?.lastListened || 'N/A'}</p>
                        </div>
                        <Link href={`/podcast/${podcast.id}`}>
                          <Button variant="ghost" size="icon">
                            <PlayCircle className="h-6 w-6" />
                          </Button>
                        </Link>
                      </div>
                    )
                  })}
                </div>
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => handleSubscribe('')}>
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
                        <p className="text-sm text-gray-400">{episode.podcastTitle}</p>
                      </div>
                      <span className="text-sm text-gray-400">{episode.duration}</span>
                      <Button variant="ghost" size="icon" onClick={() => handlePlay(episode.id)}>
                        <PlayCircle className="h-5 w-5" />
                      </Button>
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