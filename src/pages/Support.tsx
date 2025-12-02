import { Link } from 'react-router-dom';
import { MessageCircle, Mail, HelpCircle, CreditCard, FileQuestion, ChevronRight, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Support() {
  const whatsappNumber = '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello DiploMate team! I need help with...')}`;

  const supportCategories = [
    {
      icon: HelpCircle,
      title: 'FAQs',
      description: 'Find answers to common questions',
      href: '/support/faq',
    },
    {
      icon: CreditCard,
      title: 'Payment Help',
      description: 'Issues with payments or refunds',
      href: '/support/payment',
    },
    {
      icon: FileQuestion,
      title: 'How to Buy & Download',
      description: 'Step-by-step guide to purchasing',
      href: '/support/how-to-buy',
    },
  ];

  const faqs = [
    {
      question: 'How do I download my purchased content?',
      answer: 'After purchase, go to your Dashboard, find the item, and click the Download button. Each purchase has a limited number of downloads.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, debit/credit cards, net banking, and popular wallets like Paytm and PhonePe through our secure payment gateway.',
    },
    {
      question: 'Can I get a refund?',
      answer: 'Due to the digital nature of our products, refunds are only provided if you face technical issues downloading. Contact support within 24 hours of purchase.',
    },
    {
      question: 'Are the files watermarked?',
      answer: 'Yes, all downloaded files include a watermark with your unique ID to prevent unauthorized sharing. This helps us maintain quality content at affordable prices.',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">How can we help?</h1>
          <p className="text-muted-foreground">Get quick answers or reach out to our team</p>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-6 hover:bg-[#25D366]/15 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#25D366] rounded-xl flex items-center justify-center">
                <MessageCircle className="h-7 w-7 text-white" fill="white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Chat on WhatsApp</h3>
                <p className="text-sm text-muted-foreground">Quick response, usually within minutes</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </a>

          <a
            href="mailto:support@diplomate.in"
            className="bg-primary/10 border border-primary/20 rounded-2xl p-6 hover:bg-primary/15 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                <Mail className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@diplomate.in</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </a>
        </div>

        {/* Support Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Browse by Topic</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {supportCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.href}
                  to={category.href}
                  className="bg-card rounded-xl border p-5 hover:border-primary/50 transition-colors group"
                >
                  <Icon className="h-6 w-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card rounded-xl border p-5">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Hours */}
        <div className="bg-secondary/50 rounded-2xl p-6 text-center">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Support Hours</h3>
          <p className="text-muted-foreground text-sm">
            Monday to Saturday: 9 AM - 8 PM IST<br />
            Sunday: 10 AM - 5 PM IST
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            WhatsApp usually responds faster!
          </p>
        </div>
      </div>
    </div>
  );
}
