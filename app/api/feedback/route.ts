import { NextRequest, NextResponse } from 'next/server'

interface FeedbackData {
  rating: number
  category: string
  message: string
  userAgent: string
  timestamp: string
  userId?: string
}

export async function POST(request: NextRequest) {
  try {
    const feedbackData: FeedbackData = await request.json()
    
    // Validate required fields
    if (!feedbackData.rating || !feedbackData.category) {
      return NextResponse.json(
        { error: 'Rating and category are required' },
        { status: 400 }
      )
    }

    // Store feedback in database (you can replace this with your preferred storage)
    // For now, we'll log it and could store in Supabase, MongoDB, etc.
    console.log('User Feedback Received:', {
      rating: feedbackData.rating,
      category: feedbackData.category,
      message: feedbackData.message,
      userId: feedbackData.userId,
      timestamp: feedbackData.timestamp,
      userAgent: feedbackData.userAgent
    })

    // TODO: Store in your database
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('user_feedback')
    //   .insert([feedbackData])
    
    // Example with MongoDB:
    // await db.collection('feedback').insertOne(feedbackData)

    // Send notification to your team (optional)
    if (feedbackData.rating <= 2) {
      // Send urgent notification for low ratings
      console.log('⚠️ Low rating received - consider immediate attention')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    })

  } catch (error) {
    console.error('Error processing feedback:', error)
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    )
  }
}
