import { NextRequest, NextResponse } from 'next/server'
import { TemplateManager } from '@/lib/templateManager'

// GET /api/templates - Get all templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const userId = searchParams.get('userId')

    let templates
    
    if (userId) {
      // Get user's custom templates + built-in templates
      templates = await TemplateManager.getUserTemplates(userId, { 
        category: category || undefined, 
        search: search || undefined 
      })
    } else {
      // Get all built-in templates
      templates = await TemplateManager.getBuiltInTemplates({ 
        category: category || undefined, 
        search: search || undefined 
      })
    }
    
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Get templates error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create a new custom template
export async function POST(request: NextRequest) {
  try {
    const templateData = await request.json()
    
    if (!templateData.name || !templateData.userId) {
      return NextResponse.json(
        { error: 'Template name and user ID are required' },
        { status: 400 }
      )
    }

    const template = await TemplateManager.createTemplate(templateData)
    
    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Create template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
