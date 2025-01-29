import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";

const testimonials = [
  {
    content: "SousChef helped me turn my passion for Indian fusion cuisine into a thriving online community. The recipe sharing and social features are game-changing!",
    author: "Priya Sharma",
    role: "Food Influencer",
    rating: 5,
    image: "/avatars/priya.jpg",
    stats: {
      followers: "50K+",
      recipes: "200+",
      monthlyViews: "100K+"
    }
  },
  {
    content: "From sharing family recipes to building a community of health-conscious cooks, SousChef has been instrumental in growing my culinary brand.",
    author: "Arjun Patel",
    role: "Wellness Chef",
    rating: 5,
    image: "/avatars/arjun.jpg",
    stats: {
      followers: "25K+",
      recipes: "150+",
      monthlyViews: "75K+"
    }
  },
  {
    content: "The AI-powered features combined with the community aspect make SousChef unique. I've connected with amazing chefs and grown my following significantly.",
    author: "Meera Desai",
    role: "Recipe Creator",
    rating: 5,
    image: "/avatars/meera.jpg",
    stats: {
      followers: "35K+",
      recipes: "180+",
      monthlyViews: "90K+"
    }
  }
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="relative"
    >
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
          ))}
        </div>
        <blockquote className="text-lg mb-6 text-card-foreground">
          "{testimonial.content}"
        </blockquote>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-12 w-12">
            <img
              src={testimonial.image}
              alt={testimonial.author}
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold">{testimonial.author}</div>
            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-sm font-semibold">{testimonial.stats.followers}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold">{testimonial.stats.recipes}</div>
            <div className="text-xs text-muted-foreground">Recipes</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold">{testimonial.stats.monthlyViews}</div>
            <div className="text-xs text-muted-foreground">Monthly Views</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Testimonials = () => {
  return (
    <section className="py-20 sm:py-32 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center space-x-2 mb-8"
          >
            <Users className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">Success Stories</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Meet Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Featured Chefs
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Discover how home chefs are building their culinary brands and sharing their passion with the world through SousChef.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="text-sm text-muted-foreground">
            Join our community of <span className="font-semibold text-foreground">10,000+</span> passionate home chefs
          </div>
          <div className="mt-6 flex justify-center gap-8">
            {/* Add featured-in logos here */}
          </div>
        </motion.div>
      </div>
    </section>
  );
};