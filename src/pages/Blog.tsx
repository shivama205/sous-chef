import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Leaf, Apple, Brain, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";

const articles = [
  {
    id: 1,
    title: "Understanding Your Daily Macro Needs",
    slug: "understanding-macros",
    excerpt: "Learn how proteins, carbs, and fats work together for optimal health.",
    icon: <Sparkles className="w-6 h-6" />,
    readTime: "5 min read",
    category: "Nutrition",
    gradient: "bg-gradient-to-r from-primary/10 to-secondary/10"
  },
  {
    id: 2,
    title: "Smart Meal Planning: A Beginner's Guide",
    slug: "meal-planning-guide",
    excerpt: "Discover how meal planning can save time and improve your diet.",
    icon: <Brain className="w-6 h-6" />,
    readTime: "7 min read",
    category: "Planning",
    gradient: "bg-gradient-to-r from-secondary/10 to-primary/10"
  },
  {
    id: 3,
    title: "The Power of Healthy Food Swaps",
    slug: "healthy-food-swaps",
    excerpt: "Simple substitutions that can make your meals healthier without sacrificing taste.",
    icon: <Apple className="w-6 h-6" />,
    readTime: "6 min read",
    category: "Tips",
    gradient: "bg-gradient-to-r from-accent to-secondary/10"
  },
  {
    id: 4,
    title: "Building Sustainable Eating Habits",
    slug: "sustainable-eating",
    excerpt: "Learn how to create lasting healthy eating habits that stick.",
    icon: <Leaf className="w-6 h-6" />,
    readTime: "8 min read",
    category: "Lifestyle",
    gradient: "bg-gradient-to-r from-primary/10 to-accent"
  },
  {
    id: 5,
    title: "The Science Behind Balanced Nutrition",
    slug: "balanced-nutrition",
    excerpt: "Understanding how different nutrients work together for optimal health.",
    icon: <Heart className="w-6 h-6" />,
    readTime: "10 min read",
    category: "Science",
    gradient: "bg-gradient-to-r from-secondary/10 to-accent"
  }
];

export function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Healthy Living Blog
            </h1>
            <p className="text-muted-foreground">
              Discover tips, insights, and guidance for a healthier lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Link key={article.id} to={`/blog/${article.slug}`}>
                <Card className={`p-6 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${article.gradient}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-md">
                      {article.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {article.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {article.readTime}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                      <p className="text-muted-foreground">{article.excerpt}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default Blog;