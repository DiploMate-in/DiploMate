export type Department = {
  id: string;
  name: string;
  code: string;
  color: string;
  icon: string;
};

export type Semester = {
  id: string;
  departmentId: string;
  number: number;
  name: string;
};

export type ContentType = 'notes' | 'microproject' | 'capstone';

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  departmentId: string;
  semesterId: string;
  price: number;
  originalPrice?: number;
  previewImages: string[];
  tags: string[];
  downloadsAllowed: number;
  fileSize: string;
  format: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  featured?: boolean;
};

export type Purchase = {
  id: string;
  userId: string;
  contentItemId: string;
  price: number;
  status: 'completed' | 'pending' | 'failed';
  purchasedAt: string;
  downloadsRemaining: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type WishlistItem = {
  id: string;
  userId: string;
  contentItemId: string;
  addedAt: string;
};

export type DownloadLog = {
  id: string;
  userId: string;
  contentItemId: string;
  timestamp: string;
};
