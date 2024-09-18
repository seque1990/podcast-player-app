'use client';

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Headphones, ChevronDown, ChevronUp } from 'lucide-react'
import dynamic from 'next/dynamic'
import { debounce } from 'lodash'
import PodcastLayout from '@/components/podcast-layout'
import { getFallbackPodcasts } from '@/utils/fallbackPodcasts'
import { ParsedFeed } from '@/utils/rssFeedParser'
import { getAllPodcasts } from '@/lib/api'

const INITIAL_BATCH_SIZE = 8;
const LOAD_MORE_SIZE = 16;

const DynamicGridView = dynamic(() => import('@/components/GridView'))
const DynamicListView = dynamic(() => import('@/components/ListView'))

const imageLoader = ({ src }: { src: string }) => src;

export default function SearchPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [podcasts, setPodcasts] = useState<ParsedFeed[]>([])
  const [displayedPodcasts, setDisplayedPodcasts] = useState<ParsedFeed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedShows, setExpandedShows] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(true)

  const loadMorePodcasts = useCallback(() => {
    const nextBatch = podcasts.slice(displayedPodcasts.length, displayedPodcasts.length + LOAD_MORE_SIZE)
    setDisplayedPodcasts(prev => [...prev, ...nextBatch])
    setHasMore(displayedPodcasts.length + nextBatch.length < podcasts.length)
  }, [podcasts, displayedPodcasts])

  useEffect(() => {
    async function loadInitialPodcasts() {
      setIsLoading(true)
      try {
        const allPodcasts = await getAllPodcasts()
        setPodcasts(allPodcasts)
        setDisplayedPodcasts(allPodcasts.slice(0, INITIAL_BATCH_SIZE))
        setHasMore(allPodcasts.length > INITIAL_BATCH_SIZE)
      } catch (error) {
        console.error('Error loading podcasts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadInitialPodcasts()
  }, [])

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const filtered = podcasts.filter(podcast =>
        podcast.title.toLowerCase().includes(term.toLowerCase()) ||
        podcast.description.toLowerCase().includes(term.toLowerCase())
      )
      setDisplayedPodcasts(filtered.slice(0, INITIAL_BATCH_SIZE))
      setHasMore(filtered.length > INITIAL_BATCH_SIZE)
    }, 300),
    [podcasts]
  )

  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

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
                  <DynamicGridView podcasts={displayedPodcasts} imageLoader={imageLoader} />
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <DynamicListView 
                    podcasts={displayedPodcasts} 
                    imageLoader={imageLoader}
                    expandedShows={expandedShows}
                    toggleExpanded={toggleExpanded}
                  />
                </TabsContent>
              </>
            )}

            {hasMore && !isLoading && (
              <div className="text-center mt-8">
                <Button onClick={loadMorePodcasts} variant="outline">
                  Load More
                </Button>
              </div>
            )}
          </Tabs>
        </div>
      </div>
    </PodcastLayout>
  )
}