import { BaseLayout } from "@/components/layouts/BaseLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Shield } from "lucide-react";

export default function Privacy() {
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PageHeader
          icon={Shield}
          title="Privacy Policy"
          description="Last updated: March 2024"
        />
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-gray-600">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Dietary preferences and restrictions</li>
              <li>Meal planning data and preferences</li>
              <li>Usage data and interactions with our service</li>
            </ul>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Provide and maintain our services</li>
              <li>Personalize your experience</li>
              <li>Improve our services</li>
              <li>Communicate with you about updates and offers</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your personal information.
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">4. No Refund Policy</h2>
            <p className="text-gray-600">
              All purchases are final and non-refundable. By making a purchase, you acknowledge
              and agree that refunds will not be provided under any circumstances.
            </p>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about this Privacy Policy, please contact us at:
              support@souschef.com
            </p>
          </section>
        </div>
      </div>
    </BaseLayout>
  );
}