import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const userId = cookieStore.get('userId')?.value

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { podcastId } = await request.json()

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        podcasts: {
          connect: { id: podcastId },
        },
      },
      include: {
        podcasts: true,
      },
    })

    return NextResponse.json({ message: 'Subscribed successfully', podcasts: updatedUser.podcasts })
  } catch (error) {
    console.error('Error subscribing to podcast:', error)
    return NextResponse.json({ message: 'Error subscribing to podcast', error }, { status: 400 })
  }
}