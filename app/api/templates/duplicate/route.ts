import { NextRequest, NextResponse } from 'next/server'
import { TemplateManager } from '@/lib/templateManager'

// POST /api/templates/duplicate - Duplicate a template
export async function POST(request: NextRequest) {
  try {
    const { templateId, userId, newName } = await request.json()
    
    if (!templateId || !userId) {
      return NextResponse.json(
        { error: 'Template ID and user ID are required' },
        { status: 400 }
      )
    }

    const duplicatedTemplate = await TemplateManager.duplicateTemplate(
      templateId, 
      newName
    )
    
    if (!duplicatedTemplate) {
      return NextResponse.json(
        { error: 'Template not found or cannot be duplicated' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(duplicatedTemplate, { status: 201 })
  } catch (error) {
    console.error('Duplicate template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
