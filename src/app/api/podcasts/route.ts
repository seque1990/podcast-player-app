import { NextResponse } from 'next/server';
import { getFallbackPodcasts } from '@/utils/fallbackPodcasts';

export async function GET() {
  try {
    const podcasts = await getFallbackPodcasts();
    return NextResponse.json(podcasts);
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return NextResponse.json({ error: 'Failed to fetch podcasts' }, { status: 500 });
  }
}