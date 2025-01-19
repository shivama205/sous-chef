import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { blogPosts } from "@/data/blogPosts";
import { CalendarDays, Clock, Tag } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(post => post.slug === slug);

  if (!post) {
    return (
      <BaseLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">Blog Post Not Found</h1>
            <p className="text-muted-foreground mt-2">The blog post you're looking for doesn't exist.</p>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Helmet>
        <title>{post.title} - SousChef AI</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {post.tags && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {post.tags.map(tag => (
                  <div key={tag} className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Author */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Written by {post.author}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Expert in nutrition and meal planning
                </p>
              </div>
            </div>
          </div>
        </article>
      </motion.main>
    </BaseLayout>
  );
};

export default BlogPost;