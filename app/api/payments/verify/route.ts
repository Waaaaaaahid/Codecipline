import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PurchaseModel } from '@/models/Purchase';
import { ProjectModel } from '@/models/Project';
import { verifyRazorpaySignature, generateDownloadToken, getDownloadExpiry } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      buyerEmail,
      buyerName,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });
    }

    // CRITICAL: Verify signature on server side
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    await connectDB();

    // Find the pending purchase
    const purchase = await PurchaseModel.findOne({ razorpayOrderId: razorpay_order_id });
    if (!purchase) {
      return NextResponse.json({ success: false, error: 'Purchase record not found' }, { status: 404 });
    }

    // Prevent double processing
    if (purchase.status === 'completed') {
      return NextResponse.json({
        success: true,
        data: { token: purchase.downloadToken, expiry: purchase.downloadExpiry },
      });
    }

    // Generate secure download token
    const downloadToken = generateDownloadToken();
    const downloadExpiry = getDownloadExpiry(24); // 24 hour link

    // Update purchase record
    purchase.razorpayPaymentId = razorpay_payment_id;
    purchase.razorpaySignature = razorpay_signature;
    purchase.status = 'completed';
    purchase.downloadToken = downloadToken;
    purchase.downloadExpiry = downloadExpiry;
    if (buyerEmail) purchase.buyerEmail = buyerEmail;
    if (buyerName) purchase.buyerName = buyerName;
    await purchase.save();

    // TODO: Send confirmation email with download link

    return NextResponse.json({
      success: true,
      data: {
        token: downloadToken,
        expiry: downloadExpiry.toISOString(),
        projectName: purchase.projectName,
      },
    });
  } catch (error) {
    console.error('[POST /api/payments/verify]', error);
    return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 500 });
  }
}
