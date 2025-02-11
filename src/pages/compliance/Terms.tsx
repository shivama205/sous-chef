import { FileText } from 'lucide-react'
import { BaseLayout } from '@/components/layouts/BaseLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { SEO } from "@/components/SEO"

export default function Terms() {
  return (
    <BaseLayout>
      <SEO 
        title="Terms of Service"
        description="Review SideChef's terms of service and usage conditions."
        keywords="terms of service, user agreement, service terms, legal terms, usage policy"
        type="website"
        canonical="https://mysidechef.com/terms"
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PageHeader
          icon={FileText}
          title="Terms & Conditions"
          description="Last updated: February 2025"
        />
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">1. User Account, Password, and Security</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                If You use the Platform, You shall be responsible for maintaining the confidentiality of your Display Name and Password and You shall be responsible for all activities that occur under your Display Name and Password.
              </p>
              <p>
                You agree that if You provide any information that is untrue, inaccurate, not current or incomplete, We shall have the right to indefinitely suspend or terminate or block access of your membership on the Platform.
              </p>
              <p>
                You agree to immediately notify MySideChef of any unauthorized use / breach of your password or account and ensure that you exit from your account at the end of each session.
              </p>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">2. Services Offered</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                MySideChef provides a number of Internet-based services through the Platform. Our services include meal planning, recipe management, and nutritional analysis tools (collectively, "Services"). The Services can be accessed through the Platform through various subscription plans offered.
              </p>
              <p>
                The use of Services shall be additionally governed by specific policies, including but not limited to subscription policy, cancellation policy, refund policy, etc. (which are found on the FAQ tab on the Platform and all of which are incorporated here by reference).
              </p>
              <p>
                It is clarified that for any subscription cancellation request, users are required to follow the cancellation procedure outlined in our FAQ section. Refunds, if applicable, will be processed according to our refund policy. MySideChef assumes no liability for subscriptions that are cancelled outside of the specified cancellation window.
              </p>
              <p>
                MySideChef does not warrant that Service descriptions or other content on the Platform is accurate, complete, reliable, current, or error-free and assumes no liability in this regard.
              </p>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">3. Platform Usage</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                You agree, understand and acknowledge that MySideChef is an online platform that enables you to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create and manage personalized meal plans</li>
                <li>Access and save recipes</li>
                <li>Track nutritional information</li>
                <li>Generate shopping lists</li>
                <li>Access premium features based on your subscription plan</li>
              </ul>
              <p>
                The Platform and its contents are intended solely for personal, non-commercial use by users and may not be used in connection with any commercial endeavors.
              </p>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property Rights</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                All content present on the Platform, including but not limited to text, recipes, meal plans, graphics, user interface, visual interface, photographs, trademarks, logos, sounds, music, artwork and computer code (collectively, "Content"), including but not limited to the design, structure, selection, coordination, expression, look and feel and arrangement of such Content is owned, controlled or licensed by or to MySideChef and is protected by trade dress, copyright, patent and trademark laws, and various other intellectual property rights.
              </p>
              <p>
                Except as expressly provided in these Terms of Use, no part of the Platform and no Content may be copied, reproduced, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted or distributed in any way to any other computer, server, website or other medium for publication or distribution or for any commercial enterprise, without MySideChef's express prior written consent.
              </p>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">5. Indemnification</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                You shall indemnify and hold harmless MySideChef, its owners, licensees, affiliates, subsidiaries, group companies (as applicable) and their respective officers, directors, agents, and employees, from any claim or demand, or actions including reasonable attorneys' fees, made by any third party or penalty imposed due to or arising out of:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your breach of these Terms of Use, Privacy Policy or other Policies</li>
                <li>Your violation of any law, rules or regulations</li>
                <li>Your violation of any rights (including infringement of intellectual property rights) of a third party</li>
                <li>Your use or misuse of the Platform or Services</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                In no event shall MySideChef, its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any errors, mistakes, or inaccuracies of content</li>
                <li>Personal injury or property damage, of any nature whatsoever, resulting from your access to and use of our Services</li>
                <li>Any unauthorized access to or use of our secure servers and/or any and all personal information stored therein</li>
                <li>Any interruption or cessation of transmission to or from our Services</li>
                <li>Any bugs, viruses, trojan horses, or the like, which may be transmitted to or through our Services by any third party</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                For any questions about these Terms & Conditions, please contact us at:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> support@souschef.in</li>
                <li><strong>Response Time:</strong> We aim to respond to all inquiries within 48 hours</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </BaseLayout>
  );
} 