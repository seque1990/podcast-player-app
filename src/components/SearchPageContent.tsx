// src/components/SearchPageContent.tsx

'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Headphones, ChevronDown, ChevronUp } from 'lucide-react'
import PodcastLayout from '@/components/podcast-layout'
import { getFallbackPodcasts } from '@/utils/fallbackPodcasts'
import { ParsedFeed } from '@/utils/rssFeedParser'

// Custom loader function
const imageLoader = ({ src }: { src: string }) => {
  return src;
};

export default function SearchPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [podcasts, setPodcasts] = useState<ParsedFeed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedShows, setExpandedShows] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadPodcasts() {
      setIsLoading(true)
      try {
        const fallbackPodcasts = await getFallbackPodcasts()
        setPodcasts(fallbackPodcasts)
      } catch (error) {
        console.error('Error loading podcasts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPodcasts()
  }, [])

  const filteredPodcasts = podcasts.filter(podcast =>
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    podcast.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleExpanded = (showId: string) => {
    setExpandedShows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(showId)) {
        newSet.delete(showId);
      } else {
        newSet.add(showId);
      }
      return newSet;
    });
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
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Discover Your Next Favorite Podcast</h1>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for podcasts or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pl-12 pr-4 py-6 rounded-full w-full text-lg"
            />
          </div>

          {/* Main Content */}
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-between items-center mb-8">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="grid" className="data-[state=active]:bg-purple-600">Grid View</TabsTrigger>
                <TabsTrigger value="list" className="data-[state=active]:bg-purple-600">List View</TabsTrigger>
              </TabsList>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading podcasts...</div>
            ) : (
              <>
                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredPodcasts.map((podcast) => (
                      <Link href={`/podcast/${podcast.id}`} key={podcast.id}>
                        <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer">
                          <div className="aspect-square relative">
                            <Image 
                              loader={imageLoader}
                              src={podcast.image} 
                              alt={podcast.title} 
                              layout="fill"
                              objectFit="cover"
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
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <div>
                    {filteredPodcasts.map((podcast) => (
                      <Link href={`/podcast/${podcast.id}`} key={podcast.id}>
                      <div 
                        className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-70 transition-all duration-300 cursor-pointer mb-6" // Added mb-6 for bottom margin
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-48 h-48 relative flex-shrink-0">
                            <Image 
                              loader={imageLoader}
                              src={podcast.image} 
                              alt={podcast.title} 
                              layout="fill"
                              objectFit="cover"
                              loading="lazy"
                              unoptimized
                              className="rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-semibold">{podcast.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  // You can add additional action here if needed
                                }}
                              >
                                View Episodes
                              </Button>
                            </div>
                            <div 
                              className={`text-gray-300 mb-4 prose prose-invert max-w-none ${
                                expandedShows.has(podcast.id) ? '' : 'line-clamp-3'
                              }`}
                              dangerouslySetInnerHTML={{ __html: podcast.description }}
                            />
                            {podcast.description.length > 150 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-purple-400 hover:text-purple-300 p-0 h-auto font-normal"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  toggleExpanded(podcast.id);
                                }}
                              >
                                {expandedShows.has(podcast.id) ? (
                                  <>Read less <ChevronUp className="ml-1 h-4 w-4" /></>
                                ) : (
                                  <>Read more <ChevronDown className="ml-1 h-4 w-4" /></>
                                )}
                              </Button>
                            )}
                            <div className="flex items-center text-sm text-gray-400 mt-2">
                              <Headphones className="h-4 w-4 mr-2" />
                              <span className="mr-4">{podcast.total_episodes} episodes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    ))}
                  </div>
                </TabsContent>              </>
            )}
          </Tabs>
        </div>
      </div>
    </PodcastLayout>
  )
}