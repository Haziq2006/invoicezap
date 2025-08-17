import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'InvoiceZap API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}
