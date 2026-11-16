export interface Project {
  _id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  price: number;
  thumbnail: string;
  screenshots: string[];
  features: string[];
  liveUrl?: string;
  demoVideo?: string;
  sourceFile?: string; // path to ZIP, never exposed to public
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectCategory = 'websites' | 'ecommerce' | 'saas' | 'applications' | 'other';

export interface Purchase {
  _id: string;
  projectId: string;
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
  downloadExpiry?: string;
  downloadCount: number;
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalSales: number;
  totalEarnings: number;
  recentPurchases: Purchase[];
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}
