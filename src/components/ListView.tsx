import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Headphones, ChevronDown, ChevronUp } from 'lucide-react'
import { ParsedFeed } from '@/utils/rssFeedParser';

interface ListViewProps {
  podcasts: ParsedFeed[];
  imageLoader: (props: { src: string }) => string;
  expandedShows: Set<string>;
  toggleExpanded: (showId: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ podcasts, imageLoader, expandedShows, toggleExpanded }) => {
  return (
    <div>
      {podcasts.map((podcast) => (
        <Link href={`/podcast/${podcast.id}`} key={podcast.id}>
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-70 transition-all duration-300 cursor-pointer mb-6">
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
  );
};

export default ListView;