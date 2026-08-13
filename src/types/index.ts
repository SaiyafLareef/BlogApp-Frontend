export interface User {
  id: string;
  name?: string | null;
  username: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  author: User;
  authorId: string;
  coverImage?: string | null;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  tags: Tag[];
  
  // Custom metrics or aggregations
  views?: number;
  readingTime?: number;
  likes?: number;
  bookmarks?: number;
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface Comment {
  id: string;
  postId: string;
  user: User;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string | null;
  replies?: Comment[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  posts: T[];
  meta?: PaginationMeta;
}
