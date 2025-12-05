import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CORRECT_PASSWORD = 'fadiisgreat';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === CORRECT_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set('site-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });

      return NextResponse.json({ success: true });
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

