import { NextRequest, NextResponse } from 'next/server'
import { TemplateRecommender } from '@/lib/templateRecommender'

// POST /api/recommendations - Get personalized template recommendations
export async function POST(request: NextRequest) {
  try {
    const { userProfile, limit = 5 } = await request.json()
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      )
    }

    const recommendations = await TemplateRecommender.getRecommendations(
      userProfile, 
      limit
    )
    
    return NextResponse.json({
      recommendations,
      userProfile,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Get recommendations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/recommendations/quick-start - Get quick start profile recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileType = searchParams.get('profile')
    
    if (profileType) {
      const profile = TemplateRecommender.getQuickStartProfile(profileType)
      if (!profile) {
        return NextResponse.json(
          { error: 'Profile type not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ profile })
    }

    // Return all available quick start profiles
    const profiles = TemplateRecommender.getAvailableQuickStartProfiles()
    return NextResponse.json({ profiles })
  } catch (error) {
    console.error('Get quick start profiles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
