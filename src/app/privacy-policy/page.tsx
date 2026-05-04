import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Sartaj",
  description: "Privacy Policy for Sartaj Foods",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-sm rounded-lg border border-gray-100 border-t-4 border-t-primary">
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Sartaj Privacy Policy
          </h1>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            This website and its owners take a proactive approach to user
            privacy, and ensure the necessary steps are taken to protect the
            privacy of its users throughout their visiting experience.
          </p>

          <p>
            All the information customers share with Sartaj will be surely kept
            safely.
          </p>

          <p>
            We will use your information to respond you, regarding the reason
            you contacted us.
          </p>

          <p>
            We will not share your information with any third party outside of
            our organization, other than as necessary to fulfill your request
            e.g to ship an order.
          </p>

          <p>
            Unless you ask us not to, we may contact you via email in the future
            to tell you about specials, new products, or services or changes to
            this privacy policy.
          </p>

          <p>
            We take precaution to protect you information when you submit
            sensitive information via the website, your information is protected
            both online and offline.
          </p>

          <p>
            Wherever we collect sensitive information such as credit card /
            debit card, that information is encrypted and transmitted to us in a
            secure way.
          </p>

          <p>
            Our privacy policy may change from time to time, and any updates
            will be posted on this page.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t text-sm text-gray-500">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
