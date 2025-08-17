import { NextRequest, NextResponse } from 'next/server'
import { TemplateManager } from '@/lib/templateManager'

// POST /api/templates/export - Export a template
export async function POST(request: NextRequest) {
  try {
    const { templateId, userId, format = 'json' } = await request.json()
    
    if (!templateId || !userId) {
      return NextResponse.json(
        { error: 'Template ID and user ID are required' },
        { status: 400 }
      )
    }

    const template = await TemplateManager.getTemplateById(templateId)
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if user owns this template or if it's built-in
    // For now, allow export of all templates (built-in templates don't have userId)
    // TODO: Implement proper user ownership check when Supabase is integrated

    const exportedTemplate = await TemplateManager.exportTemplate(templateId)
    
    return NextResponse.json({
      template: exportedTemplate,
      format,
      exportedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Export template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
