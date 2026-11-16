import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AdminModel } from '@/models/Admin';
import { signAdminToken, setAdminCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const admin = await AdminModel.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await signAdminToken({
      adminId: admin._id.toString(),
      email: admin.email,
    });

    const response = NextResponse.json({
      success: true,
      data: { email: admin.email, name: admin.name },
    });

    setAdminCookie(response, token);
    return response;
  } catch (error) {
    console.error('[POST /api/admin/auth/login]', error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
