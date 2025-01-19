import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Macros: A Beginner's Guide",
    excerpt: "Learn the basics of macronutrients and how they affect your body. Discover how to balance proteins, carbs, and fats for optimal health.",
    category: "Nutrition",
    date: "Jan 15, 2024",
    readTime: "5 min read",
    imageUrl: "/blog/macros-guide.jpg"
  },
  {
    id: "2",
    title: "Meal Prep 101: Save Time and Eat Better",
    excerpt: "Master the art of meal preparation with these time-saving tips and strategies. Learn how to plan, shop, and cook efficiently.",
    category: "Meal Planning",
    date: "Jan 12, 2024",
    readTime: "7 min read",
    imageUrl: "/blog/meal-prep.jpg"
  },
  {
    id: "3",
    title: "Plant-Based Protein Sources",
    excerpt: "Discover delicious and nutritious plant-based protein sources. Perfect for vegetarians, vegans, or anyone looking to reduce meat consumption.",
    category: "Nutrition",
    date: "Jan 10, 2024",
    readTime: "6 min read",
    imageUrl: "/blog/plant-protein.jpg"
  }
];

export function Blog() {
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="text-2xl font-medium text-foreground/90 mb-2">Nutrition & Meal Planning Blog</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Discover tips, guides, and insights about nutrition, meal planning, and healthy living.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary/10 backdrop-blur-sm rounded-full text-xs font-medium text-primary">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-lg font-semibold leading-snug hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}

export default Blog;