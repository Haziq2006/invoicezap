'use client'

import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'

const messages = [
  "Trusted by 50k freelancers",
  "Make invoices in seconds", 
  "Support 25+ payment processors"
]

export default function AnimatedTextTransition() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length)
        setIsTransitioning(false)
      }, 400) // Slightly longer for smoother transition
    }, 4000) // Change every 4 seconds for better readability

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="inline-flex flex-col items-center bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-6 py-3 mb-8 shadow-lg">
      <div className="flex items-center space-x-2">
        <Shield className="h-5 w-5 text-green-500" />
        <span 
          className={`text-sm font-medium text-gray-700 transition-all duration-500 ease-in-out ${
            isTransitioning ? 'opacity-0 transform translate-y-1 scale-95' : 'opacity-100 transform translate-y-0 scale-100'
          }`}
        >
          {messages[currentIndex]}
        </span>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
          ))}
        </div>
      </div>
      
      {/* Progress indicators */}
      <div className="flex space-x-1 mt-2">
        {messages.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-blue-500 scale-125' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
