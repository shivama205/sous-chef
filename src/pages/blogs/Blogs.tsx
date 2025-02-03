import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { ArrowRight, Clock, User, Tag, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BlogPostMetadata } from "@/types/blog";

// Placeholder image for blogs without an image
const PLACEHOLDER_IMAGE = "/blog-placeholder.png";

// This will be replaced by actual blog posts from your content files
const blogPosts: BlogPostMetadata[] = [
  {
    id: "1",
    title: "Understanding Macros: A Beginner's Guide",
    slug: "understanding-macros",
    excerpt: "Learn the basics of macronutrients and how they affect your body. Discover how to balance proteins, carbs, and fats for optimal health.",
    author: {
      name: "Sarah Johnson",
      role: "Nutrition Expert",
      avatar: "/authors/sarah.jpg"
    },
    category: "Nutrition",
    tags: ["macros", "nutrition", "health", "diet"],
    publishedAt: "2024-02-15",
    readTime: "5 min read",
    imageUrl: "/blog/macros-guide.jpg"
  },
  {
    id: "2",
    title: "Meal Prep 101: Save Time and Eat Better",
    slug: "meal-prep-101",
    excerpt: "Master the art of meal preparation with these time-saving tips and strategies. Learn how to plan, shop, and cook efficiently.",
    author: {
      name: "Mike Chen",
      role: "Chef & Meal Prep Expert",
      avatar: "/authors/mike.jpg"
    },
    category: "Meal Planning",
    tags: ["meal prep", "cooking", "time management"],
    publishedAt: "2024-02-12",
    readTime: "7 min read",
    imageUrl: "/blog/meal-prep.jpg"
  }
];

function BlogImage({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`bg-secondary/5 flex items-center justify-center ${className}`}>
        <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <img 
      src={src || PLACEHOLDER_IMAGE}
      alt={alt}
      className={`object-cover w-full h-full hover:scale-105 transition-transform duration-300 ${className}`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = PLACEHOLDER_IMAGE;
      }}
    />
  );
}

function BlogCard({ post, featured = false }: { post: BlogPostMetadata; featured?: boolean }) {
  const navigate = useNavigate();

  if (featured) {
    return (
      <Card 
        className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
        onClick={() => navigate(`/blog/${post.slug}`)}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-[16/9] md:aspect-auto relative overflow-hidden">
            <BlogImage 
              src={post.imageUrl} 
              alt={post.title}
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-2xl font-bold hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{post.author.name}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <BlogImage 
          src={post.imageUrl} 
          alt={post.title}
        />
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </span>
        </div>
        <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function Blog() {
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Nutrition & Meal Planning Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover expert tips, guides, and insights about nutrition, meal planning, and healthy living.
          </p>
        </section>

        {/* Blog Posts Grid */}
        {blogPosts.length > 0 && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* No Posts Message */}
        {blogPosts.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Blog Posts Yet</h2>
            <p className="text-muted-foreground">
              Check back soon for new articles about nutrition and meal planning.
            </p>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}

export default Blog;