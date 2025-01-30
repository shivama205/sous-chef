import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChefHat, 
  Clock, 
  Leaf,
  ArrowRight,
  Star,
  Instagram,
  Trophy,
  Check,
  PlayCircle,
  Heart,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { SEO } from '@/components/SEO';
import { LoginDialog } from '@/components/LoginDialog';
import NavigationBar from '@/components/NavigationBar';
import { useNavigate } from 'react-router-dom';
import DashboardView from '@/components/dashboard/DashboardView';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const { user, isLoading } = useStore();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is logged in, show dashboard
  if (user) {
    return (
      <>
        <NavigationBar />
        <DashboardView />
      </>
    );
  }

  // If user is not logged in, show marketing landing page
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10">
      <SEO 
        title="HealthyChef - Professional Recipe Creation & Monetization Platform for Home Chefs"
        description="Join 10,000+ home chefs creating, sharing, and monetizing healthy recipes. Get AI-powered tools, automatic nutritional analysis, and build your culinary brand."
        keywords={[
          "recipe creation platform",
          "healthy recipe sharing",
          "food community",
          "home chef tools",
          "recipe monetization",
          "cooking platform",
          "healthy meal planning",
          "nutritional analysis",
          "culinary brand building",
          "food content creation",
          "recipe management",
          "cooking automation"
        ]}
      />

      <NavigationBar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24" aria-labelledby="hero-heading">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center bg-primary/10 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="text-primary font-medium">Trusted by 10,000+ Home Chefs</span>
          </motion.div>
          
          <motion.h1 
            id="hero-heading"
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"
          >
            Transform Your Kitchen into a Professional Culinary Studio
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            Create, share, and monetize your healthy recipes while building your personal brand. Perfect for busy home chefs and health enthusiasts.
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => setShowLoginDialog(true)}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary-dark transition-all duration-300 group"
            >
              Start Your Culinary Journey
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 flex items-center gap-2"
              onClick={() => setShowVideo(true)}
            >
              <PlayCircle className="w-5 h-5" aria-hidden="true" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600"
          >
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>Free to Start</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-16 bg-white/50 backdrop-blur-sm rounded-3xl my-16" aria-labelledby="features-heading">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-gray-600">Professional tools designed for home chefs</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <FeatureCard
            icon={<ChefHat className="w-8 h-8" />}
            title="Recipe Creation Studio"
            description="Professional tools to create beautiful, detailed recipes with nutritional information"
            isNew
          />
          <FeatureCard
            icon={<Clock className="w-8 h-8" />}
            title="Time-Saving Tools"
            description="AI-powered assistance to help busy professionals create and plan meals efficiently"
          />
          <FeatureCard
            icon={<Leaf className="w-8 h-8" />}
            title="Health Focus"
            description="Automatic nutritional analysis and healthy ingredient suggestions"
          />
          <FeatureCard
            icon={<Instagram className="w-8 h-8" />}
            title="Social Integration"
            description="Share your creations directly to social media with beautiful, auto-generated visuals"
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Chef Rankings"
            description="Build your reputation and get discovered in our vibrant community"
          />
          <FeatureCard
            icon={<Heart className="w-8 h-8" />}
            title="Community Features"
            description="Connect with other chefs, share tips, and get inspired"
          />
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-16" aria-labelledby="testimonials-heading">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold mb-4">Loved by Home Chefs</h2>
          <p className="text-xl text-gray-600">See what our community has to say</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            quote="HealthyChef has transformed my cooking hobby into a thriving business. The AI tools are game-changing!"
            author="Sarah Johnson"
            role="Food Blogger"
            image="/testimonials/sarah.jpg"
          />
          <TestimonialCard
            quote="As a busy professional, the meal planning features save me hours each week. Plus, the community is amazing!"
            author="Michael Chen"
            role="Home Chef"
            image="/testimonials/michael.jpg"
          />
          <TestimonialCard
            quote="The nutritional analysis tools help me create healthier versions of my favorite recipes. My followers love it!"
            author="Emma Davis"
            role="Health Coach"
            image="/testimonials/emma.jpg"
          />
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-16" aria-label="Platform statistics">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm">
              <Star className="w-8 h-8 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-3xl font-bold mb-2">10,000+</h3>
              <p className="text-gray-600">Active Chefs</p>
            </div>
            <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm">
              <Heart className="w-8 h-8 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-3xl font-bold mb-2">50,000+</h3>
              <p className="text-gray-600">Recipes Shared</p>
            </div>
            <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm">
              <Users className="w-8 h-8 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-3xl font-bold mb-2">100,000+</h3>
              <p className="text-gray-600">Community Members</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 mb-16" aria-labelledby="cta-heading">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-primary text-white rounded-3xl p-12 text-center"
        >
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Culinary Journey?</h2>
          <p className="text-xl mb-8 text-white/90">Join thousands of home chefs who are sharing their passion for healthy cooking</p>
          <Button 
            size="lg"
            variant="secondary"
            onClick={() => setShowLoginDialog(true)}
            className="bg-white text-primary hover:bg-white/90 transition-all duration-300"
          >
            Get Started Now
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-primary">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-primary">Pricing</a></li>
                <li><a href="#testimonials" className="text-gray-600 hover:text-primary">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-600 hover:text-primary">About Us</a></li>
                <li><a href="/blog" className="text-gray-600 hover:text-primary">Blog</a></li>
                <li><a href="/careers" className="text-gray-600 hover:text-primary">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/help" className="text-gray-600 hover:text-primary">Help Center</a></li>
                <li><a href="/guides" className="text-gray-600 hover:text-primary">Guides</a></li>
                <li><a href="/api" className="text-gray-600 hover:text-primary">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-600 hover:text-primary">Privacy</a></li>
                <li><a href="/terms" className="text-gray-600 hover:text-primary">Terms</a></li>
                <li><a href="/cookies" className="text-gray-600 hover:text-primary">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-center text-gray-600">© 2024 HealthyChef. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Dialog */}
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
        redirectPath="/dashboard"
      />
    </main>
  );
}

function FeatureCard({ icon, title, description, isNew = false }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  isNew?: boolean;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="p-6 rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 relative group"
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        {isNew && (
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">New</span>
        )}
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, image }: {
  quote: string;
  author: string;
  role: string;
  image: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="p-6 rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center gap-4 mb-4">
        <img src={image} alt={author} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h3 className="font-semibold">{author}</h3>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 italic">"{quote}"</p>
    </motion.div>
  );
} 