import { NextRequest, NextResponse } from 'next/server';

const PASSWORD = 'fadiisgreat';
const PASSWORD_COOKIE = 'site-auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      // Set authentication cookie (24 hours)
      response.cookies.set(PASSWORD_COOKIE, 'authenticated', {
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: false, // Allow client-side access for debugging
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, error: 'Incorrect password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

