import { useState } from 'react';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What type of content do you offer?',
    answer:
      'We offer premium study notes, microprojects, and capstone projects for diploma engineering students across AIML, Computer, Mechanical, and Civil departments.',
  },
  {
    question: 'How do I download purchased content?',
    answer:
      'After purchase, go to your dashboard where you can download your content. Each purchase comes with a limited number of downloads for security purposes.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major payment methods including UPI, credit/debit cards, and net banking through our secure payment gateway.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'Due to the digital nature of our products, we generally do not offer refunds. However, if you face any issues with your purchase, please contact our support team.',
  },
  {
    question: 'Are the projects plagiarism-free?',
    answer:
      'Yes, all our projects are original and come with proper documentation. However, we recommend customizing them for your specific requirements.',
  },
  {
    question: 'How can I request a custom project?',
    answer:
      'You can submit a custom build request through our Custom Build page. Our team will review your requirements and get back to you with a quote.',
  },
];

export function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>
      <ModernNavbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#1B1B1B' }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg" style={{ color: '#4A4A4A' }}>
              Find answers to common questions about DiploMate
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border overflow-hidden"
                style={{ borderColor: 'rgba(0,0,0,0.06)' }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold" style={{ color: '#1B1B1B' }}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className="w-5 h-5 transition-transform"
                    style={{
                      color: '#6B7280',
                      transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                {openIndex === idx && (
                  <div className="px-6 pb-6">
                    <p style={{ color: '#4A4A4A', lineHeight: 1.7 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
