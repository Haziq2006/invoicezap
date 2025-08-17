import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text, from } = await request.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'To, subject, and content (html or text) are required' },
        { status: 400 }
      );
    }

    const emailService = new EmailService();
    const result = await emailService.sendEmail({
      to,
      from,
      subject,
      content: text || html,
      html
    });

    if (result.success) {
      return NextResponse.json({ 
        message: 'Email sent successfully',
        messageId: result.messageId 
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
