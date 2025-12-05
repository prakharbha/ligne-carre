import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    if (!resend) {
      console.error('❌ RESEND_API_KEY is not set');
      return NextResponse.json(
        { success: false, error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      console.error('❌ Newsletter subscription failed: Missing email field');
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Newsletter subscription failed: Invalid email format', { email });
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create email content
    const emailHtml = `
      <h2>New Newsletter Subscription</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
    `;

    // Send email
    console.log('📧 Attempting to send newsletter subscription email...');
    console.log('📧 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('📧 Email details:', {
      to: 'fadi.abousader@lignecarre.com',
      subscriberEmail: email,
      subject: 'New Newsletter Subscription',
    });
    
    try {
      // Use verified email address (fadi.abousader@lignecarre.com) as recipient
      const recipientEmail = 'fadi.abousader@lignecarre.com';
      
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [recipientEmail],
        replyTo: email, // Subscriber's email as reply-to
        subject: `New Newsletter Subscription: ${email}`,
        html: emailHtml,
      });

      console.log('📧 Resend response:', { data, error });

      if (error) {
        console.error('❌ Resend error details:', JSON.stringify(error, null, 2));
        console.error('❌ Newsletter subscription email FAILED to send');
        return NextResponse.json(
          { 
            success: false, 
            error: `Failed to send email: ${error.message || JSON.stringify(error)}` 
          },
          { status: 500 }
        );
      }

      if (!data || !data.id) {
        console.error('❌ Resend returned no data or email ID. Response:', { data, error });
        console.error('❌ Newsletter subscription email FAILED to send');
        return NextResponse.json(
          { success: false, error: 'Email service returned an unexpected response' },
          { status: 500 }
        );
      }

      console.log('✅ Newsletter subscription email sent successfully!');
      console.log('✅ Email ID:', data.id);
      console.log('✅ Subscriber email:', email);
      console.log('✅ Sent to:', recipientEmail);
      return NextResponse.json({ success: true, data, emailId: data.id });
    } catch (resendError: any) {
      console.error('❌ Exception while sending newsletter subscription email:', resendError);
      console.error('❌ Error message:', resendError.message);
      console.error('❌ Error stack:', resendError.stack);
      return NextResponse.json(
        { 
          success: false, 
          error: `Email sending failed: ${resendError.message || 'Unknown error'}` 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Newsletter subscription error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

