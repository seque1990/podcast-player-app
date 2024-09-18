import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        podcasts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ podcasts: user.podcasts });
  } catch (error) {
    console.error('Error fetching subscribed podcasts:', error);
    return NextResponse.json({ message: 'Error fetching subscribed podcasts' }, { status: 500 });
  }
}
