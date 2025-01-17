import { BaseLayout } from "@/components/layouts/BaseLayout";

export default function Privacy() {
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            We at SousChef take every reasonable step to ensure that your personal information
            that we process is accurate and, where necessary, kept up to date, and any of your
            personal information that we process that you inform us is inaccurate (having regard
            to the purposes for which they are processed) is erased or rectified. You may access,
            correct, and update your personal information directly through the functionalities
            provided on the Platform.
          </p>

          <p className="text-lg leading-relaxed">
            You may delete certain non-mandatory information by logging into our website and visiting
            Profile and Settings sections. You can also write to us at the contact information
            provided below to assist you with these requests.
          </p>

          <p className="text-lg leading-relaxed">
            You have an option to withdraw your consent that you have already provided by writing to
            us at the contact information provided below. Please mention "for withdrawal of
            consent" in the subject line of your communication. We will verify such requests
            before acting upon your request.
          </p>

          <p className="text-lg leading-relaxed">
            Please note, however, that withdrawal of consent will not be retroactive and will be in
            accordance with the terms of this Privacy Policy, related Terms of Use and applicable
            laws. In the event you withdraw consent given to us under this Privacy Policy, such
            withdrawal may hamper your access to the Platform or restrict provision of our services
            to you for which we consider that information to be necessary.
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-lg">
              Email: support@souschef.in<br />
            </p>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
} 