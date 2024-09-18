import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { authMiddleware } from '@/lib/authMiddleware'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { podcastId } = req.body
    const userId = req.user.id

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

      res.status(200).json({ message: 'Subscribed successfully', podcasts: updatedUser.podcasts })
    } catch (error) {
      res.status(400).json({ message: 'Error subscribing to podcast', error })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)