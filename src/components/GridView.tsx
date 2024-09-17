import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ParsedFeed } from '@/utils/rssFeedParser';

interface GridViewProps {
  podcasts: ParsedFeed[];
  imageLoader: (props: { src: string }) => string;
}

const GridView: React.FC<GridViewProps> = ({ podcasts, imageLoader }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {podcasts.map((podcast) => (
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
  );
};

export default GridView;