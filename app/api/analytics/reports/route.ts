import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/dataService'

// POST /api/analytics/reports - Generate business reports
export async function POST(request: NextRequest) {
  try {
    const { userId, reportType, filters } = await request.json()
    
    if (!userId || !reportType) {
      return NextResponse.json(
        { error: 'User ID and report type are required' },
        { status: 400 }
      )
    }

    // Generate report based on type
    let report
    switch (reportType) {
      case 'revenue':
        report = await dataService.generateRevenueReport(userId, filters)
        break
      case 'clients':
        report = await dataService.generateClientReport(userId, filters)
        break
      case 'invoices':
        report = await dataService.generateInvoiceReport(userId, filters)
        break
      case 'templates':
        report = await dataService.generateTemplateUsageReport(userId, filters)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        )
    }
    
    return NextResponse.json({
      report,
      reportType,
      generatedAt: new Date().toISOString(),
      filters
    })
  } catch (error) {
    console.error('Generate report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
