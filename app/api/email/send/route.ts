import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text, from } = await request.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'To, subject, and content (html or text) are required' },
        { status: 400 }
      );
    }

    const msg = {
      to,
      from: from || process.env.SENDGRID_FROM_EMAIL!,
      subject,
      html,
      text,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
