interface Author {
  name: string
  role: string
  avatar?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: Author
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  imageUrl: string
  seoDescription?: string
  seoKeywords?: string[]
}

export interface BlogPostMetadata {
  id: string
  title: string
  slug: string
  excerpt: string
  author: Author
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  imageUrl: string
} 