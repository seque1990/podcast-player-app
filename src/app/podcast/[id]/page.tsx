'use client';

import { useParams } from 'next/navigation'
import PodcastShowDetails from '@/components/podcast-show-details'

const podcastFeeds = [
  { id: 1, rssUrl: "https://allinchamathjason.libsyn.com/rss", title: "All-In Podcast", host: "Chamath, Jason, Sacks & Friedberg", cover: "/placeholder.svg" },
  { id: 2, rssUrl: "https://feeds.megaphone.fm/hubermanlab", title: "Huberman Lab", host: "Andrew Huberman", cover: "/placeholder.svg" },
  { id: 3, rssUrl: "https://lexfridman.com/feed/podcast/", title: "Lex Fridman Podcast", host: "Lex Fridman", cover: "/placeholder.svg" },
  // Add more podcast shows here
];

export default function PodcastPage() {
  const params = useParams()
  const showId = parseInt(params.id as string)
  const show = podcastFeeds.find(s => s.id === showId)

  if (!show) {
    return <div>Podcast not found</div>
  }

  return <PodcastShowDetails show={show} />
}