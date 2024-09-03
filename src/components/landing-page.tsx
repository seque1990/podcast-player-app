'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Headphones, ChevronRight, Mic, Podcast, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/player')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Headphones className="h-8 w-8 text-purple-500" />
          <span className="text-2xl font-bold">PodcastPro</span>
        </div>
        <nav className="hidden md:flex space-x-4">
          <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
          <a href="#popular" className="hover:text-purple-400 transition-colors">Popular</a>
          <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
        </nav>
        <Button variant="outline" className="hidden md:inline-flex border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors">
          Sign Up
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Discover Your Next Favorite Podcast
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300">
          Immerse yourself in a world of captivating stories, insightful discussions, and endless entertainment.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <Input 
            type="email" 
            placeholder="Enter your email" 
            className="max-w-xs bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleGetStarted}>
            Get Started <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose PodcastPro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Mic className="h-12 w-12 text-purple-500" />}
              title="High-Quality Audio"
              description="Experience crystal-clear sound with our advanced audio processing technology."
            />
            <FeatureCard 
              icon={<Podcast className="h-12 w-12 text-purple-500" />}
              title="Vast Library"
              description="Access thousands of podcasts across various genres and topics."
            />
            <FeatureCard 
              icon={<Play className="h-12 w-12 text-purple-500" />}
              title="Seamless Playback"
              description="Enjoy uninterrupted listening with our smart streaming capabilities."
            />
          </div>
        </div>
      </section>

      {/* Popular Podcasts Section */}
      <section id="popular" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Popular Podcasts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                <div className="w-full aspect-square bg-gray-700 flex items-center justify-center">
                  <Headphones className="h-16 w-16 text-gray-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Podcast Title {i}</h3>
                  <p className="text-gray-400 text-sm">Host Name</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Listening?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join millions of listeners and start your podcast journey today. Sign up now for free!
          </p>
          <Button className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-8 py-3">
            Sign Up for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Headphones className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold">PodcastPro</span>
          </div>
          <nav className="flex space-x-4">
            <a href="#" className="hover:text-purple-400 transition-colors">About</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}