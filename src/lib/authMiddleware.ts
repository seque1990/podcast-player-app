import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export function authMiddleware(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
      req.user = { id: decoded.userId }
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}