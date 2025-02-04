import { Shield } from 'lucide-react'
import { BaseLayout } from '@/components/layouts/BaseLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { SEO } from "@/components/SEO"

export default function Privacy() {
  return (
    <BaseLayout>
      <SEO 
        title="Privacy Policy"
        description="Read about how SideChef protects your privacy and handles your data."
        keywords="privacy policy, data protection, user privacy, data security, privacy rights, data handling"
        type="website"
        canonical="https://mysidechef.com/privacy"
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PageHeader
          icon={Shield}
          title="Privacy Policy"
          description="Last updated: March 2024"
        />
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">1. Information Collection and Processing</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                MySideChef ("we", "us", "our") takes every reasonable step to ensure that your personal information that we process is accurate and, where necessary, kept up to date, and any of your personal information that we process that you inform us is inaccurate (having regard to the purposes for which they are processed) is erased or rectified.
              </p>
              <p>
                We collect and process the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email, profile picture)</li>
                <li>Usage data (meal plans, saved recipes, preferences)</li>
                <li>Device information (browser type, IP address)</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">2. Information Access and Control</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                You may access, correct, and update your personal information directly through the functionalities provided on the Platform:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Profile settings and preferences</li>
                <li>Account information</li>
                <li>Dietary restrictions</li>
                <li>Nutritional goals</li>
                <li>Saved recipes and meal plans</li>
              </ul>
              <p>
                You may delete certain non-mandatory information by logging into our website and visiting Profile and Settings sections.
              </p>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">3. Consent Management</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                You have an option to withdraw your consent that you have already provided by writing to us at support@souschef.in. Please mention "for withdrawal of consent" in the subject line of your communication.
              </p>
              <p>
                We will verify such requests before acting upon your request. Please note, however, that withdrawal of consent:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Will not be retroactive</li>
                <li>Will be in accordance with the terms of this Privacy Policy, related Terms of Use and applicable laws</li>
                <li>May hamper your access to the Platform or restrict provision of our services to you for which we consider that information to be necessary</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of personal data during transmission</li>
                <li>Regular testing and evaluation of security measures</li>
                <li>Secure access controls to personal information</li>
                <li>Regular security assessments and audits</li>
                <li>Employee training on data protection and security</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Our Platform may integrate with third-party services for specific functionalities. These services may collect and process your information according to their own privacy policies. Third-party services we use include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment processors</li>
                <li>Analytics providers</li>
                <li>Authentication services</li>
                <li>Cloud storage providers</li>
              </ul>
              <p>
                We ensure that our third-party service providers maintain appropriate security standards for protecting your personal information.
              </p>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide you with our services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
              <p>
                When personal information is no longer necessary for these purposes, it is securely deleted or anonymized.
              </p>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">7. International Data Transfers</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. When we transfer your information, we:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Implement appropriate safeguards</li>
                <li>Ensure adequate levels of protection for your personal information</li>
                <li>Comply with applicable data protection laws</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">8. Payment and Refund Policy</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                All purchases and subscription payments made on the Platform are final and non-refundable. By making a purchase or subscribing to any of our services, you explicitly acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No refunds will be provided under any circumstances</li>
                <li>All subscription charges are final and non-negotiable</li>
              </ul>
              <p className="mt-4">
                This no-refund policy applies to all services, including premium subscriptions, one-time purchases, and any other paid features offered through the Platform.
              </p>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                For any privacy-related concerns or requests, please contact us at:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> support@souschef.in</li>
                <li><strong>Name:</strong> Shivam Aggarwal</li>
                <li><strong>Subject Line for Consent Withdrawal:</strong> "For Withdrawal of Consent"</li>
                <li><strong>Response Time:</strong> We aim to respond to all privacy-related requests within 48 hours</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </BaseLayout>
  );
}