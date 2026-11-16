import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  technologies: string[];
  price: number;
  thumbnail: string;
  screenshots: string[];
  features: string[];
  liveUrl?: string;
  demoVideo?: string;
  sourceFile?: string;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['websites', 'ecommerce', 'saas', 'applications', 'other'],
      default: 'other',
    },
    technologies: [{ type: String, trim: true }],
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, default: '' },
    screenshots: [{ type: String }],
    features: [{ type: String }],
    liveUrl: { type: String, default: '' },
    demoVideo: { type: String, default: '' },
    sourceFile: { type: String, default: '' }, // internal path, never exposed
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_: unknown, ret: Record<string, unknown>) => {
        if (ret._id) ret._id = String(ret._id);
        // IMPORTANT: Never expose sourceFile to clients
        delete ret.sourceFile;
        return ret;
      },
    },
  }
);

ProjectSchema.index({ published: 1, featured: -1 });
ProjectSchema.index({ category: 1, published: 1 });

export const ProjectModel =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
