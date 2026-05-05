import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | Sartaj",
  description: "Support page for Sartaj Foods app users",
};

const faqs = [
  {
    question: "What types of products does Sartaj Foods offer?",
    answer:
      "Sartaj Foods offers a wide range of high-quality Indian food products, including spices, lentils, rice, snacks, and ready-to-eat meals.",
  },
  {
    question: "Where are Sartaj Foods products available for purchase?",
    answer:
      "Our products are available for purchase online through our website, as well as in select retail stores and supermarkets in Japan.",
  },
  {
    question: "Are Sartaj Foods products suitable for vegetarians and vegans?",
    answer:
      "Yes, the majority of our products are suitable for vegetarians and vegans. We clearly label our products to indicate if they contain any animal-derived ingredients.",
  },
  {
    question: "How can I place an order on the Sartaj Foods website?",
    answer:
      "To place an order, simply browse our product selection, add items to your cart, and proceed to checkout. Follow the prompts to enter your shipping and payment information to complete your purchase.",
  },
  {
    question: "What payment methods are accepted on the Sartaj Foods website?",
    answer:
      "Currently we accept payment on delivery, soon we will be accepting via credit/debit cards, PayPal, and other secure online payment methods.",
  },
  {
    question: "Can you explain how to register an account or create a new account?",
    answer: (
      <>
        Please access here ⇒{" "}
        <a
          href="https://www.sartajfoods.jp/register"
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.sartajfoods.jp/register
        </a>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Enter the required information.</li>
          <li>Read and agree to the terms and conditions.</li>
          <li>Follow the on-screen instructions.</li>
        </ul>
        <p className="mt-2 text-sm italic">
          *If you need assistance, please call: 072-751-1975
        </p>
      </>
    ),
  },
  {
    question: "I am not able to login",
    answer: "Kindly Reset your Password",
  },
  {
    question: "Can I purchase at wholesale prices for stores?",
    answer: "For wholesale price inquiries, please call (072-751-1975).",
  },
  {
    question: "I'm considering purchasing a restaurant. Are there prices for restaurants?",
    answer: "For inquiries about prices for restaurants, please call (072-751-1975).",
  },
  {
    question: "Where can I find information about shipping",
    answer: (
      <>
        Please access here ⇒{" "}
        <a
          href="https://sartajfoods.jp/eng/delivery_Information"
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://sartajfoods.jp/eng/delivery_Information
        </a>
      </>
    ),
  },
  {
    question: "Where can I check the terms and conditions for placing an order?",
    answer: (
      <>
        Please access here ⇒{" "}
        <a
          href="https://sartajfoods.jp/eng/terms_conditions"
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://sartajfoods.jp/eng/terms_conditions
        </a>
      </>
    ),
  },
  {
    question: "Are all prices on this site inclusive of tax?",
    answer:
      "Prices are exclusive of tax. From October 2023 onwards, all prices displayed on website are exclusive of tax.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Card */}
        <div className="bg-white p-8 md:p-12 shadow-sm rounded-lg border border-gray-100 border-t-4 border-t-primary">
          <div className="mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              Sartaj Support
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              Sartaj offer you a wide variety of Indian grocery foods with the
              best quality and outstanding service.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-5 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-primary font-semibold w-24 shrink-0">
                  Address
                </span>
                <span className="text-gray-600">
                  Osaka-Fu, Ikeda-Shi, Koda 2-10-23
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary font-semibold w-24 shrink-0">
                  Call Us
                </span>
                <a
                  href="tel:0727511975"
                  className="text-primary underline underline-offset-2"
                >
                  072-751-1975
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary font-semibold w-24 shrink-0">
                  Email
                </span>
                <a
                  href="mailto:info@sartajfoods.jp"
                  className="text-primary underline underline-offset-2"
                >
                  info@sartajfoods.jp
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-semibold w-24 shrink-0">
                  Hours
                </span>
                <span className="text-gray-600">
                  Monday to Saturday from 09:00AM-18:00PM
                  <br />
                  (except national holiday)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Card */}
        <div className="bg-white p-8 md:p-12 shadow-sm rounded-lg border border-gray-100 border-t-4 border-t-primary">
          <div className="mb-8 border-b pb-6">
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
              >
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  {faq.question}
                </h3>
                <div className="text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center text-sm text-gray-400 pb-6">
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
