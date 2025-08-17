import { NextRequest, NextResponse } from 'next/server'
import { TemplateManager } from '@/lib/templateManager'

// POST /api/templates/import - Import a template
export async function POST(request: NextRequest) {
  try {
    const { templateData, userId } = await request.json()
    
    if (!templateData || !userId) {
      return NextResponse.json(
        { error: 'Template data and user ID are required' },
        { status: 400 }
      )
    }

    // Validate template data structure
    if (!templateData.name || !templateData.config) {
      return NextResponse.json(
        { error: 'Invalid template data structure' },
        { status: 400 }
      )
    }

    const importedTemplate = await TemplateManager.importTemplate(templateData, userId)
    
    return NextResponse.json(importedTemplate, { status: 201 })
  } catch (error) {
    console.error('Import template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
