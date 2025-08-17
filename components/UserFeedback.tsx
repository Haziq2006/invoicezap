'use client'

import { useState, useEffect } from 'react'
import { Star, MessageCircle, X, Send, Smile, Meh, Frown } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface FeedbackData {
  rating: number
  category: string
  message: string
  userAgent: string
  timestamp: string
  userId?: string
}

interface UserFeedbackProps {
  trigger?: 'time' | 'action' | 'manual'
  delay?: number
  className?: string
}

export default function UserFeedback({ trigger = 'time', delay = 30000, className = '' }: UserFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [rating, setRating] = useState(0)
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => {
    if (trigger === 'time') {
      const timer = setTimeout(() => {
        // Only show if user hasn't submitted feedback recently
        const lastFeedback = localStorage.getItem('invoicezap_lastFeedback')
        const lastFeedbackTime = lastFeedback ? JSON.parse(lastFeedback).timestamp : 0
        const daysSinceLastFeedback = (Date.now() - lastFeedbackTime) / (1000 * 60 * 60 * 24)
        
        if (daysSinceLastFeedback > 7) {
          setIsVisible(true)
        }
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [trigger, delay])

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setIsSubmitting(true)

    try {
      const feedbackData: FeedbackData = {
        rating,
        category,
        message,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        userId: localStorage.getItem('invoicezap_user') ? JSON.parse(localStorage.getItem('invoicezap_user')!).id : undefined
      }

      // Send feedback to API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      })

      if (response.ok) {
        // Store locally to prevent showing again soon
        localStorage.setItem('invoicezap_lastFeedback', JSON.stringify(feedbackData))
        setHasSubmitted(true)
        toast.success('Thank you for your feedback!')
        
        // Hide after 3 seconds
        setTimeout(() => setIsVisible(false), 3000)
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Feedback submission error:', error)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingIcon = (value: number) => {
    if (value >= 4) return <Smile className="h-6 w-6 text-green-500" />
    if (value >= 3) return <Meh className="h-6 w-6 text-yellow-500" />
    return <Frown className="h-6 w-6 text-red-500" />
  }

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm w-full ${className}`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
        {!hasSubmitted ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">How are we doing?</h3>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Rating */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Rate your experience with InvoiceZap</p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      rating >= value 
                        ? 'bg-yellow-100 text-yellow-600' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Star className={`h-5 w-5 ${rating >= value ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <div className="flex items-center space-x-2 mt-2">
                  {getRatingIcon(rating)}
                  <span className="text-sm text-gray-600">
                    {rating === 5 ? 'Excellent!' : 
                     rating === 4 ? 'Good!' : 
                     rating === 3 ? 'Okay' : 
                     rating === 2 ? 'Not great' : 'Poor'}
                  </span>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">What would you like to tell us about?</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="general">General feedback</option>
                <option value="bug">Bug report</option>
                <option value="feature">Feature request</option>
                <option value="ui-ux">UI/UX feedback</option>
                <option value="performance">Performance</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Tell us more (optional)</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts, suggestions, or report issues..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </>
        ) : (
          /* Thank You Message */
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smile className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Thank you!</h3>
            <p className="text-sm text-gray-600">
              Your feedback helps us improve InvoiceZap for everyone.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
