import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    // Here you would send an email (e.g., via Nodemailer, Resend, SendGrid, etc.)
    // For now we log it and return success
    console.log('[Contact Form]', { name, email, subject, message: message.substring(0, 100) });

    // TODO: Integrate email service
    // await sendEmail({ to: process.env.CONTACT_EMAIL, from: email, subject, body: message });

    return NextResponse.json({
      success: true,
      message: 'Message received. I will get back to you soon!',
    });
  } catch (error) {
    console.error('[POST /api/contact]', error);
    return NextResponse.json({ success: false, error: 'Failed to process message' }, { status: 500 });
  }
}
