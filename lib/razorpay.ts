import Razorpay from 'razorpay';
import crypto from 'crypto';

export function getRazorpay(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Please define RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables');
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret || !signature) return false;

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  const expected = Buffer.from(expectedSignature, 'hex');
  const received = Buffer.from(signature, 'hex');
  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(expected, received);
}

export function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getDownloadExpiry(hours = 24): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
}
