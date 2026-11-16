import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ProjectModel } from '@/models/Project';
import { PurchaseModel } from '@/models/Purchase';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, projectSlug, buyerName, buyerEmail } = body;

    if (!projectSlug || !buyerName || !buyerEmail) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Fetch project
    const project = await ProjectModel.findOne({ slug: projectSlug, published: true });
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: project.price * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        projectSlug,
        buyerEmail,
        buyerName,
      },
    });

    // Save pending purchase
    await PurchaseModel.create({
      projectId: project._id,
      projectName: project.name,
      projectSlug: project.slug,
      buyerEmail,
      buyerName,
      amount: project.price,
      currency: 'INR',
      razorpayOrderId: order.id,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('[POST /api/payments/create-order]', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
