import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Blog() {
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-primary mb-4">Nutrition & Meal Planning Blog</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover tips, guides, and insights about nutrition, meal planning, and healthy living.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`}>
                <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-300">
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
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-lg font-semibold leading-snug text-foreground hover:text-primary transition-colors">
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
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}

export default Blog;