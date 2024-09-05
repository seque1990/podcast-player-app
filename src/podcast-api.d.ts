// Update your podcast-api.d.ts file
declare module 'podcast-api' {
    export interface ClientOptions {
      apiKey: string;
    }
  
    export interface PodcastResponse {
      data: {
        episodes: Array<{
          id: string;
          title: string;
          description: string;
          pub_date_ms: number;
          audio_length_sec: number;
          audio: string;
          thumbnail: string;
        }>;
      };
    }
  
    export interface PodcastClient {
      fetchPodcastById(params: { id: string; sort?: string }): Promise<PodcastResponse>;
      // Add other methods as needed
    }
  
    export function Client(options: ClientOptions): PodcastClient;
  }