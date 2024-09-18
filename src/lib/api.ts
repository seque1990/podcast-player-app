import { ParsedFeed } from '@/utils/rssFeedParser';

const API_BASE_URL = '/api';

export async function getAllPodcasts(): Promise<ParsedFeed[]> {
  const response = await fetch(`${API_BASE_URL}/podcasts`);
  if (!response.ok) throw new Error('Failed to fetch podcasts');
  return response.json();
}

export async function getUserSubscriptions(): Promise<ParsedFeed[]> {
  const response = await fetch(`${API_BASE_URL}/podcasts/subscribed`, {
    credentials: 'include',
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to fetch subscriptions');
  }
  const data = await response.json();
  return data.podcasts;
}

export async function subscribeToPodcast(podcastId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/podcasts/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ podcastId }),
  });
  if (!response.ok) throw new Error('Failed to subscribe to podcast');
}

export async function unsubscribeFromPodcast(podcastId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/podcasts/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ podcastId }),
  });
  if (!response.ok) throw new Error('Failed to unsubscribe from podcast');
}
