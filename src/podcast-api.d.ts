// Create a new file named 'podcast-api.d.ts' in your project's root or src directory
declare module 'podcast-api' {
    export interface ClientOptions {
      apiKey: string;
    }
  
    export interface PodcastResponse {
      // Add properties based on the actual response structure
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
  
    export class Client {
      constructor(options: ClientOptions);
      fetchPodcastById(params: { id: string; sort?: string }): Promise<PodcastResponse>;
      // Add other methods as needed
    }
  }