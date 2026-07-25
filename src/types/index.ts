// Global TypeScript interfaces and types
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  views: number;
  likes?: number;
  bookmarks?: number;
  imageUrl: string;
  readingTime?: number;
  status?: 'draft' | 'published';
  slug?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  parentId?: string | null;
}
