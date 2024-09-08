// src/components/SearchPageContent.tsx

'use client';

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Mic, Headphones, TrendingUp, Music, Book, Film, Coffee, Star, Clock } from 'lucide-react'
import PodcastLayout from '@/components/podcast-layout'
import { getFallbackPodcasts } from '@/utils/fallbackPodcasts'
import { ParsedFeed } from '@/utils/rssFeedParser'

const categories = [
  { id: 1, name: "Technology", icon: <Mic className="h-6 w-6" /> },
  { id: 2, name: "Business", icon: <TrendingUp className="h-6 w-6" /> },
  { id: 3, name: "Science", icon: <Book className="h-6 w-6" /> },
  { id: 4, name: "Entertainment", icon: <Film className="h-6 w-6" /> },
  { id: 5, name: "News", icon: <Coffee className="h-6 w-6" /> },
]

export default function SearchPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [podcasts, setPodcasts] = useState<ParsedFeed[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    (podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    podcast.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeCategory === "All" || podcast.categories?.includes(activeCategory))
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
              <div className="flex space-x-2">
                {["All", ...categories.map(c => c.name)].map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full ${activeCategory === cat ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading podcasts...</div>
            ) : (
              <>
                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPodcasts.map((podcast) => (
                      <div key={podcast.id} className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group">
                        <div className="relative">
                          <img src={podcast.image} alt={podcast.title} className="w-full h-48 object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                              Listen Now
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold mb-2">{podcast.title}</h3>
                          <p className="text-gray-300 mb-2 line-clamp-2">{podcast.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span className="flex items-center">
                              <Headphones className="h-4 w-4 mr-1" />
                              {podcast.total_episodes} episodes
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                  <div className="space-y-4">
                    {filteredPodcasts.map((podcast) => (
                      <div key={podcast.id} className="bg-gray-800 rounded-lg overflow-hidden flex items-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                        <img src={podcast.image} alt={podcast.title} className="w-24 h-24 object-cover" />
                        <div className="flex-1 p-4">
                          <h3 className="text-xl font-semibold mb-1">{podcast.title}</h3>
                          <p className="text-gray-300 mb-2 line-clamp-2">{podcast.description}</p>
                          <div className="flex items-center text-sm text-gray-400">
                            <span className="flex items-center mr-4">
                              <Headphones className="h-4 w-4 mr-1" />
                              {podcast.total_episodes} episodes
                            </span>
                          </div>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white m-4">
                          Listen
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </PodcastLayout>
  )
}