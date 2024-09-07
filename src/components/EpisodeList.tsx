// src/components/EpisodeList.tsx

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Clock, Calendar, Search, ChevronDown, ChevronUp } from 'lucide-react'

type SimplifiedPodcastEpisode = {
  id: string;
  title: string;
  description: string;
  pub_date_ms: number;
  audio_length_sec: number;
  audio: string;
  thumbnail: string;
};

type EpisodeListProps = {
  episodes: SimplifiedPodcastEpisode[];
  onEpisodeClick: (episode: SimplifiedPodcastEpisode) => void;
};

export default function EpisodeList({ episodes, onEpisodeClick }: EpisodeListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<string>>(new Set());

  const filteredEpisodes = episodes.filter(episode =>
    episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    episode.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpanded = (episodeId: string) => {
    setExpandedEpisodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };

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
  };

  return (
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
          {filteredEpisodes.map((episode) => (
            <div 
              key={episode.id} 
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-70 transition-all duration-300 cursor-pointer"
              onClick={() => onEpisodeClick(episode)}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <img src={episode.thumbnail} alt={episode.title} className="w-full md:w-48 h-48 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{episode.title}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEpisodeClick(episode);
                      }}
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div 
                    className={`text-gray-300 mb-4 prose prose-invert max-w-none ${
                      expandedEpisodes.has(episode.id) ? '' : 'line-clamp-3'
                    }`}
                    dangerouslySetInnerHTML={{ __html: episode.description }}
                  />
                  {episode.description.length > 150 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 p-0 h-auto font-normal"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(episode.id);
                      }}
                    >
                      {expandedEpisodes.has(episode.id) ? (
                        <>Read less <ChevronUp className="ml-1 h-4 w-4" /></>
                      ) : (
                        <>Read more <ChevronDown className="ml-1 h-4 w-4" /></>
                      )}
                    </Button>
                  )}
                  <div className="flex items-center text-sm text-gray-400 mt-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="mr-4">{formatTime(episode.audio_length_sec)}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(episode.pub_date_ms).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}