'use client';

import { useParams } from 'next/navigation'
import PodcastShowDetails from '@/components/podcast-show-details'

// Update this type to match the PodcastShow type in podcast-show-details.tsx
type PodcastShow = {
  id: number;
  title: string;
  host: string;
  summary: string;
  cover: string;
  rssUrl: string;
  category: string;
}

const podcastFeeds: PodcastShow[] = [
  { 
    id: 1, 
    rssUrl: "https://allinchamathjason.libsyn.com/rss", 
    title: "All-In Podcast", 
    host: "Chamath, Jason, Sacks & Friedberg", 
    cover: "/placeholder.svg",
    summary: "Industry veterans discussing tech, politics, and economics.",
    category: "Technology"
  },
  { 
    id: 2, 
    rssUrl: "https://feeds.megaphone.fm/hubermanlab", 
    title: "Huberman Lab", 
    host: "Andrew Huberman", 
    cover: "/placeholder.svg",
    summary: "Science and science-based tools for everyday life.",
    category: "Science"
  },
  { 
    id: 3, 
    rssUrl: "https://lexfridman.com/feed/podcast/", 
    title: "Lex Fridman Podcast", 
    host: "Lex Fridman", 
    cover: "/placeholder.svg",
    summary: "Conversations about science, technology, history, philosophy and the nature of intelligence, consciousness, love, and power.",
    category: "Technology"
  },
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