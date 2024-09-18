import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { authMiddleware } from '@/lib/authMiddleware'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const userId = req.user.id

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          podcasts: true,
        },
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json({ podcasts: user.podcasts })
    } catch (error) {
      res.status(400).json({ message: 'Error fetching subscribed podcasts', error })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)