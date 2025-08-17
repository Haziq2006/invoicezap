import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Type declaration for jsPDF autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void
  }
}

export interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  clientName: string
  clientEmail: string
  clientAddress: string
  lineItems: Array<{
    description: string
    quantity: number
    rate: number
    amount: number
  }>
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes?: string
  template: string
  companyName?: string
  companyAddress?: string
  companyEmail?: string
  companyPhone?: string
  includePaymentLink?: boolean
  paymentLinkType?: 'stripe' | 'custom' | 'none'
  customPaymentLink?: string
  customPaymentText?: string
}

export class PDFGenerator {
  private doc: jsPDF
  private currentY: number = 0
  private pageWidth: number = 210
  private pageHeight: number = 297
  private margin: number = 20

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.currentY = this.margin
  }

  private addHeader(companyName: string = 'Your Company Name', companyAddress: string = 'Your Address', companyEmail: string = 'your@email.com', companyPhone: string = '+44 20 1234 5678') {
    // Company Logo/Name
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(59, 130, 246) // Blue color
    this.doc.text(companyName, this.margin, this.currentY)
    
    this.currentY += 8
    
    // Company Details
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(75, 85, 99) // Gray color
    
    this.doc.text(companyAddress, this.margin, this.currentY)
    this.currentY += 5
    this.doc.text(`Email: ${companyEmail}`, this.margin, this.currentY)
    this.currentY += 5
    this.doc.text(`Phone: ${companyPhone}`, this.margin, this.currentY)
    
    this.currentY += 15
  }

  private addInvoiceInfo(invoiceData: InvoiceData) {
    // Invoice Title
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(17, 24, 39) // Dark gray
    this.doc.text('INVOICE', this.pageWidth - this.margin, this.currentY, { align: 'right' })
    
    this.currentY += 8
    
    // Invoice Number
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(75, 85, 99)
    this.doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, this.pageWidth - this.margin, this.currentY, { align: 'right' })
    
    this.currentY += 5
    
    // Dates
    this.doc.text(`Issue Date: ${this.formatDate(invoiceData.issueDate)}`, this.pageWidth - this.margin, this.currentY, { align: 'right' })
    this.currentY += 5
    this.doc.text(`Due Date: ${this.formatDate(invoiceData.dueDate)}`, this.pageWidth - this.margin, this.currentY, { align: 'right' })
    
    this.currentY += 15
  }

  private addClientInfo(invoiceData: InvoiceData) {
    // Client Section
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(17, 24, 39)
    this.doc.text('Bill To:', this.margin, this.currentY)
    
    this.currentY += 8
    
    // Client Details
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(75, 85, 99)
    
    this.doc.text(invoiceData.clientName, this.margin, this.currentY)
    this.currentY += 5
    
    if (invoiceData.clientEmail) {
      this.doc.text(invoiceData.clientEmail, this.margin, this.currentY)
      this.currentY += 5
    }
    
    if (invoiceData.clientAddress) {
      this.doc.text(invoiceData.clientAddress, this.margin, this.currentY)
      this.currentY += 5
    }
    
    this.currentY += 15
  }

  private addLineItems(invoiceData: InvoiceData) {
    // Table Headers
    const headers = [['Description', 'Qty', 'Rate', 'Amount']]
    
    // Table Data
    const data = invoiceData.lineItems.map(item => [
      item.description || 'Item description',
      item.quantity.toString(),
      `£${item.rate.toFixed(2)}`,
      `£${item.amount.toFixed(2)}`
    ])
    
    // Add totals row
    data.push(['', '', 'Subtotal:', `£${invoiceData.subtotal.toFixed(2)}`])
    data.push(['', '', `Tax (${invoiceData.taxRate}%):`, `£${invoiceData.taxAmount.toFixed(2)}`])
    data.push(['', '', 'Total:', `£${invoiceData.total.toFixed(2)}`])
    
    // Create table
    this.doc.autoTable({
      head: headers,
      body: data,
      startY: this.currentY,
      margin: { left: this.margin, right: this.margin },
      styles: {
        fontSize: 10,
        cellPadding: 5,
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        }
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' }
      },
      didDrawPage: (data: any) => {
        this.currentY = data.cursor.y + 10
      }
    })
  }

  private addNotes(invoiceData: InvoiceData) {
    if (invoiceData.notes) {
      this.currentY += 10
      
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(17, 24, 39)
      this.doc.text('Notes:', this.margin, this.currentY)
      
      this.currentY += 5
      
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(75, 85, 99)
      
      // Handle long notes with word wrapping
      const maxWidth = this.pageWidth - (2 * this.margin)
      const words = invoiceData.notes.split(' ')
      let line = ''
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const testWidth = this.doc.getTextWidth(testLine)
        
        if (testWidth > maxWidth && i > 0) {
          this.doc.text(line, this.margin, this.currentY)
          this.currentY += 5
          line = words[i] + ' '
        } else {
          line = testLine
        }
      }
      
      if (line) {
        this.doc.text(line, this.margin, this.currentY)
        this.currentY += 5
      }
    }
  }

  private addFooter(invoiceData?: InvoiceData) {
    let footerY = this.pageHeight - 30
    
    // Add payment information if applicable
    if (invoiceData?.includePaymentLink && invoiceData.paymentLinkType !== 'none') {
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(37, 99, 235) // Blue color
      
      if (invoiceData.paymentLinkType === 'stripe') {
        this.doc.text('💳 Pay Online Securely', this.margin, footerY)
        this.doc.setFontSize(10)
        this.doc.setFont('helvetica', 'normal')
        this.doc.setTextColor(75, 85, 99)
        this.doc.text('A secure payment link will be included in your email.', this.margin, footerY + 5)
        this.doc.text('Accepts: Credit Cards • Apple Pay • Google Pay • Bank Transfers', this.margin, footerY + 10)
      } else if (invoiceData.paymentLinkType === 'custom' && invoiceData.customPaymentLink) {
        this.doc.text(`💳 ${invoiceData.customPaymentText || 'Pay Now'}`, this.margin, footerY)
        this.doc.setFontSize(10)
        this.doc.setFont('helvetica', 'normal')
        this.doc.setTextColor(75, 85, 99)
        this.doc.text('Payment Link:', this.margin, footerY + 5)
        this.doc.setTextColor(37, 99, 235)
        this.doc.text(invoiceData.customPaymentLink, this.margin, footerY + 10)
      }
      
      footerY += 20
    }
    
    // Standard footer
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(156, 163, 175)
    this.doc.text('Thank you for your business!', this.margin, footerY)
    
    this.doc.text('Generated by InvoiceZap', this.pageWidth - this.margin, footerY, { align: 'right' })
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  private checkPageBreak(requiredSpace: number = 20) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage()
      this.currentY = this.margin
    }
  }

  public generatePDF(invoiceData: InvoiceData): jsPDF {
    // Reset position
    this.currentY = this.margin
    
    // Add header
    this.addHeader(
      invoiceData.companyName,
      invoiceData.companyAddress,
      invoiceData.companyEmail,
      invoiceData.companyPhone
    )
    
    // Check page break
    this.checkPageBreak(80)
    
    // Add invoice info
    this.addInvoiceInfo(invoiceData)
    
    // Check page break
    this.checkPageBreak(60)
    
    // Add client info
    this.addClientInfo(invoiceData)
    
    // Check page break
    this.checkPageBreak(100)
    
    // Add line items
    this.addLineItems(invoiceData)
    
    // Check page break
    this.checkPageBreak(40)
    
    // Add notes
    this.addNotes(invoiceData)
    
    // Add footer
    this.addFooter(invoiceData)
    
    return this.doc
  }

  public downloadPDF(invoiceData: InvoiceData, filename?: string): void {
    const doc = this.generatePDF(invoiceData)
    const fileName = filename || `invoice-${invoiceData.invoiceNumber}.pdf`
    doc.save(fileName)
  }

  public getPDFBlob(invoiceData: InvoiceData): Blob {
    const doc = this.generatePDF(invoiceData)
    return doc.output('blob')
  }

  public getPDFBase64(invoiceData: InvoiceData): string {
    const doc = this.generatePDF(invoiceData)
    return doc.output('datauristring')
  }
}

// Template-specific generators
export class InvoiceTemplateGenerator {
  static generateBasic(invoiceData: InvoiceData): jsPDF {
    const generator = new PDFGenerator()
    return generator.generatePDF(invoiceData)
  }

  static generatePro(invoiceData: InvoiceData): jsPDF {
    const generator = new PDFGenerator()
    // Add custom styling for Pro template
    return generator.generatePDF(invoiceData)
  }

  static generateEtsy(invoiceData: InvoiceData): jsPDF {
    const generator = new PDFGenerator()
    // Add custom styling for Etsy template
    return generator.generatePDF(invoiceData)
  }

  static generateByTemplate(invoiceData: InvoiceData): jsPDF {
    switch (invoiceData.template) {
      case 'pro':
        return this.generatePro(invoiceData)
      case 'etsy':
        return this.generateEtsy(invoiceData)
      case 'basic':
      default:
        return this.generateBasic(invoiceData)
    }
  }
}

// Utility functions
export const generateInvoicePDF = (invoiceData: InvoiceData, template?: string): jsPDF => {
  if (template) {
    invoiceData.template = template
  }
  return InvoiceTemplateGenerator.generateByTemplate(invoiceData)
}

export const downloadInvoicePDF = (invoiceData: InvoiceData, filename?: string): void => {
  const generator = new PDFGenerator()
  generator.downloadPDF(invoiceData, filename)
}

export const getInvoicePDFBlob = (invoiceData: InvoiceData): Blob => {
  const generator = new PDFGenerator()
  return generator.getPDFBlob(invoiceData)
}
