declare module 'podcast-api' {
    export interface ClientOptions {
      apiKey: string;
    }
  
    export interface PodcastEpisode {
      id: string;
      title: string;
      description: string;
      pub_date_ms: number;
      audio_length_sec: number;
      audio: string;
      thumbnail: string;
    }
  
    export interface PodcastShow {
      id: string;
      title: string;
      publisher: string;
      image: string;
      description: string;
      total_episodes: number;
      explicit_content: boolean;
      website: string;
      episodes: PodcastEpisode[];
    }
  
    export interface PodcastResponse {
      data: PodcastShow;
    }
  
    export interface PodcastClient {
      fetchPodcastById(params: { id: string; sort?: string }): Promise<PodcastResponse>;
      // Add other methods as needed
    }
  
    export function Client(options: ClientOptions): PodcastClient;
  }