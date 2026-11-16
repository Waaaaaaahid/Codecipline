import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
  projectId: mongoose.Types.ObjectId;
  projectName: string;
  projectSlug: string;
  buyerEmail: string;
  buyerName: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  status: 'pending' | 'completed' | 'failed';
  downloadToken?: string;
  downloadExpiry?: Date;
  downloadCount: number;
  createdAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    projectName: { type: String, required: true },
    projectSlug: { type: String, required: true },
    buyerEmail: { type: String, required: true, lowercase: true, trim: true },
    buyerName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    downloadToken: { type: String, default: '' },
    downloadExpiry: { type: Date },
    downloadCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_: unknown, ret: Record<string, unknown>) => {
        if (ret._id) ret._id = String(ret._id);
        if (ret.projectId) ret.projectId = String(ret.projectId);
        return ret;
      },
    },
  }
);

PurchaseSchema.index({ buyerEmail: 1 });
PurchaseSchema.index({ status: 1 });
PurchaseSchema.index({ downloadToken: 1 });

export const PurchaseModel =
  mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);
