/**
 * Test script to verify Resend API key and email sending
 * Run with: npx tsx scripts/test-resend.ts
 */

import { Resend } from 'resend';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const apiKey = process.env.RESEND_API_KEY || 're_5p4LQDS1_3CCofpDyeH6LfzZx1AbjAhwy';

console.log('Testing Resend API...');
console.log('API Key:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5));
console.log('API Key length:', apiKey.length);
console.log('API Key format valid:', apiKey.startsWith('re_'));

const resend = new Resend(apiKey);

async function testResend() {
  try {
    console.log('\nAttempting to send test email...');
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['fadi.abousader@lignecarre.com'],
      subject: 'Test Email from Ligne Carré',
      html: '<h1>Test Email</h1><p>This is a test email to verify Resend API is working.</p>',
    });

    if (error) {
      console.error('❌ Resend Error:');
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (data && data.id) {
      console.log('✅ Email sent successfully!');
      console.log('Email ID:', data.id);
    } else {
      console.error('❌ Unexpected response:');
      console.error(JSON.stringify({ data, error }, null, 2));
    }
  } catch (error: any) {
    console.error('❌ Exception occurred:');
    console.error(error.message);
    console.error(error);
  }
}

testResend();

