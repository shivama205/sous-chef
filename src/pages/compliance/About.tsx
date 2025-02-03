import { Info } from 'lucide-react'
import { BaseLayout } from '@/components/layouts/BaseLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { SEO } from "@/components/SEO"

export default function About() {
  return (
    <BaseLayout>
      <SEO 
        title="About SousChef"
        description="Learn about SousChef, your AI-powered kitchen assistant. Discover our mission to make healthy cooking and meal planning easier for everyone."
        keywords="about souschef, AI kitchen assistant, meal planning app, cooking assistant, healthy eating platform"
        type="website"
        canonical="https://sous-chef.in/about"
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PageHeader
          icon={Info}
          title="About SousChef"
          description="Empowering healthy eating through smart meal planning"
        />
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                At SousChef, we believe that healthy eating shouldn't be complicated. Our mission is to make nutritious meal planning accessible, enjoyable, and sustainable for everyone. We combine cutting-edge technology with nutritional expertise to help you make informed decisions about your diet.
              </p>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                SousChef is more than just a meal planning platform. We're your personal nutrition assistant, helping you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create personalized meal plans based on your dietary preferences and goals</li>
                <li>Discover healthy alternatives to your favorite dishes</li>
                <li>Track your nutritional intake with detailed analytics</li>
                <li>Generate smart shopping lists to make grocery shopping effortless</li>
                <li>Access a vast library of nutritionist-approved recipes</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                We understand that everyone's nutritional needs are different. That's why we've built a platform that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Adapts to your dietary restrictions and preferences</li>
                <li>Provides scientifically-backed nutritional recommendations</li>
                <li>Offers flexible meal planning options</li>
                <li>Makes healthy eating sustainable and enjoyable</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                SousChef is built by a passionate team of nutritionists, software engineers, and food enthusiasts. We combine expertise in:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nutrition and dietetics</li>
                <li>Software development and AI</li>
                <li>User experience design</li>
                <li>Food science and culinary arts</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Start your journey to healthier eating with SousChef today. Whether you're looking to maintain a balanced diet, achieve specific health goals, or simply make meal planning easier, we're here to help.
              </p>
              <p>
                Have questions or suggestions? We'd love to hear from you at support@souschef.in
              </p>
            </div>
          </section>
        </div>
      </div>
    </BaseLayout>
  );
} 