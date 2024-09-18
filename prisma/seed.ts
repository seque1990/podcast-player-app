import { PrismaClient } from '@prisma/client'
import { parsePodcastFeed } from '../src/utils/rssFeedParser'

const prisma = new PrismaClient()

const rssFeedUrls = [
  "https://allinchamathjason.libsyn.com/rss",
  "https://feeds.megaphone.fm/hubermanlab",
  "https://lexfridman.com/feed/podcast/",
  "https://feeds.megaphone.fm/thediaryofaceo",
  "https://rss.art19.com/business-wars",
  "https://feeds.megaphone.fm/investlikethebest",
  "https://feeds.megaphone.fm/ATHLLC5883700320",
  "https://feeds.simplecast.com/3hnxp7yk",
  "https://rss.art19.com/masters-of-scale",
  "https://feeds.simplecast.com/54nAGcIl",
  "https://feeds.megaphone.fm/thispastweekend",
  "https://omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/A91018A4-EA4F-4130-BF55-AE270180C327/44710ECC-10BB-48D1-93C7-AE270180C33E/podcast.rss",
]

async function main() {
  // Create users
  const users = [
    { name: 'Alice Johnson', email: 'alice@example.com' },
    { name: 'Bob Smith', email: 'bob@example.com' },
    { name: 'Charlie Brown', email: 'charlie@example.com' },
  ]

  for (const user of users) {
    await prisma.user.create({ data: user })
  }

  console.log('Users created')

  // Create podcasts
  for (const url of rssFeedUrls) {
    try {
      const parsedFeed = await parsePodcastFeed(url)
      await prisma.podcast.create({
        data: {
          title: parsedFeed.title,
          description: parsedFeed.description,
          imageUrl: parsedFeed.image,
          feedUrl: url,
        },
      })
    } catch (error) {
      console.error(`Error creating podcast from ${url}:`, error)
    }
  }

  console.log('Podcasts created')

  // Add some subscriptions
  const allUsers = await prisma.user.findMany()
  const allPodcasts = await prisma.podcast.findMany()

  for (const user of allUsers) {
    const randomPodcasts = allPodcasts
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 5) + 1)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        podcasts: {
          connect: randomPodcasts.map((podcast) => ({ id: podcast.id })),
        },
      },
    })
  }

  console.log('Subscriptions added')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
