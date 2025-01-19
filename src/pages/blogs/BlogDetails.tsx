import { useParams, useNavigate } from "react-router-dom"
import { BaseLayout } from "@/components/layouts/BaseLayout"
import { Button } from "@/components/ui/button"
import { SEO } from "@/components/SEO"
import { BlogPost } from "@/types/blog"
import { ArrowLeft, Clock, User, Calendar, Tag, Image as ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypePrism from 'rehype-prism-plus'
import type { ReactNode } from 'react'

// This will be replaced by actual blog post from your content files
const blogPost: BlogPost = {
  id: "1",
  title: "Understanding Macros: A Beginner's Guide",
  slug: "understanding-macros",
  excerpt: "Learn the basics of macronutrients and how they affect your body. Discover how to balance proteins, carbs, and fats for optimal health.",
  content: `
# Understanding Macros: A Beginner's Guide

Macronutrients, or "macros," are the three main categories of nutrients that make up the calories in your diet: proteins, carbohydrates, and fats. Understanding how these nutrients work together is crucial for achieving your health and fitness goals.

## What Are Macronutrients?

Macronutrients are essential nutrients that your body needs in large amounts to function properly:

1. **Proteins** (4 calories per gram)
   - Building blocks for muscles
   - Essential for tissue repair
   - Helps with enzyme production

2. **Carbohydrates** (4 calories per gram)
   - Primary energy source
   - Fuels brain function
   - Spares protein from being used for energy

3. **Fats** (9 calories per gram)
   - Essential for hormone production
   - Protects organs
   - Helps absorb vitamins

## Why Track Macros?

Tracking macros, rather than just counting calories, can help you:
- Optimize body composition
- Improve athletic performance
- Maintain steady energy levels
- Support muscle growth and recovery

## Getting Started with Macro Tracking

1. Calculate your daily calorie needs
2. Determine your macro ratios based on goals
3. Use a food tracking app to monitor intake
4. Adjust ratios based on results and energy levels

Remember, there's no one-size-fits-all approach to macro ratios. Experiment to find what works best for you while maintaining a balanced, sustainable diet.
  `,
  author: {
    name: "Sarah Johnson",
    role: "Nutrition Expert",
    avatar: "/authors/sarah.jpg"
  },
  category: "Nutrition",
  tags: ["macros", "nutrition", "health", "diet"],
  publishedAt: "2024-02-15",
  readTime: "5 min read",
  imageUrl: "/blogs/placeholder.png",
  seoDescription: "Learn the basics of macronutrients and how they affect your body. Discover how to balance proteins, carbs, and fats for optimal health.",
  seoKeywords: ["macros", "nutrition", "health", "diet", "protein", "carbs", "fats", "macro tracking"]
}

// Placeholder image for blogs without an image
const PLACEHOLDER_IMAGE = "/placeholder-blog.jpg"

function BlogImage({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`bg-secondary/5 flex items-center justify-center ${className}`}>
        <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
      </div>
    )
  }

  return (
    <img 
      src={src || PLACEHOLDER_IMAGE}
      alt={alt}
      className={`object-cover w-full h-full ${className}`}
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.src = PLACEHOLDER_IMAGE
      }}
    />
  )
}

function AuthorAvatar({ author }: { author: BlogPost['author'] }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-12 w-12 border-2 border-white shadow-md">
        {author.avatar ? (
          <AvatarImage 
            src={author.avatar} 
            alt={author.name}
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = PLACEHOLDER_IMAGE
            }}
          />
        ) : (
          <AvatarFallback className="bg-primary/10 text-primary">
            {author.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <div className="font-medium">{author.name}</div>
        <div className="text-sm text-muted-foreground">{author.role}</div>
      </div>
    </div>
  )
}

interface MarkdownProps {
  children?: ReactNode
  className?: string
  href?: string
  src?: string
  alt?: string
}

const MarkdownComponents: Partial<Components> = {
  h1: ({ children }: MarkdownProps) => (
    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
      {children}
    </h1>
  ),
  h2: ({ children }: MarkdownProps) => (
    <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
      {children}
    </h2>
  ),
  h3: ({ children }: MarkdownProps) => (
    <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
      {children}
    </h3>
  ),
  p: ({ children }: MarkdownProps) => (
    <p className="text-gray-700 leading-relaxed mb-4">
      {children}
    </p>
  ),
  ul: ({ children }: MarkdownProps) => (
    <ul className="space-y-2 my-4 list-none">
      {children}
    </ul>
  ),
  ol: ({ children }: MarkdownProps) => (
    <ol className="space-y-2 my-4 list-decimal pl-4">
      {children}
    </ol>
  ),
  li: ({ children }: MarkdownProps) => (
    <li className="flex items-start before:content-['•'] before:text-primary before:mr-2 before:font-bold">
      {children}
    </li>
  ),
  strong: ({ children }: MarkdownProps) => (
    <strong className="text-gray-900 font-semibold">
      {children}
    </strong>
  ),
  blockquote: ({ children }: MarkdownProps) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-gray-700 relative before:content-['\u201C'] before:text-4xl before:text-primary before:absolute before:-left-4 before:-top-2">
      {children}
    </blockquote>
  ),
  img: ({ src, alt = "" }: MarkdownProps) => (
    <div className="my-6">
      <BlogImage 
        src={src} 
        alt={alt || ''} 
        className="rounded-lg shadow-md" 
      />
    </div>
  ),
  code: ({ className, children }: MarkdownProps & { className?: string }) => {
    const match = /language-(\w+)/.exec(className || '')
    return match ? (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
        <code className={className}>
          {children}
        </code>
      </pre>
    ) : (
      <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">
        {children}
      </code>
    )
  },
  a: ({ children, href }: MarkdownProps) => (
    <a 
      href={href}
      className="text-primary hover:text-primary/80 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  hr: () => (
    <hr className="my-8 border-gray-200" />
  )
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  // In production, fetch the blog post based on the slug
  const post = blogPost // This will be replaced by actual fetching logic
  
  if (!post) {
    return (
      <BaseLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Blog Post Not Found</h1>
            <p className="text-muted-foreground">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/blog")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout>
      <SEO 
        title={post.title}
        description={post.seoDescription || post.excerpt}
        keywords={post.seoKeywords || post.tags}
        image={post.imageUrl}
        type="article"
      />
      
      <article className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/10 to-background border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-6">
              <Button 
                variant="ghost" 
                className="mb-4"
                onClick={() => navigate("/blog")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {post.title}
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-4">
                  <AuthorAvatar author={post.author} />
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.publishedAt}>
                      {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[21/9] relative overflow-hidden rounded-xl shadow-xl">
              <BlogImage 
                src={post.imageUrl} 
                alt={post.title}
              />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-primary mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <ReactMarkdown
                className="markdown-content"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize, rehypePrism]}
                components={MarkdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </div>
            
            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm hover:bg-secondary/20 transition-colors cursor-pointer"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </BaseLayout>
  )
}