import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import {
  CreditCard,
  Smartphone,
  Landmark,
  Wallet,
  Lock,
  HelpCircle,
  ShieldCheck,
  Zap,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PaymentHelp() {
  const paymentMethods = [
    {
      icon: Smartphone,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
      title: 'UPI Payment',
      items: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Any UPI App'],
    },
    {
      icon: CreditCard,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50',
      title: 'Cards',
      items: ['Visa', 'Mastercard', 'RuPay', 'Maestro', 'Credit & Debit Cards'],
    },
    {
      icon: Landmark,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50',
      title: 'Net Banking',
      items: ['All Major Banks', 'SBI', 'HDFC', 'ICICI', 'Axis & More'],
    },
    {
      icon: Wallet,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-50',
      title: 'Digital Wallets',
      items: ['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay', 'Mobikwik'],
    },
  ];

  const securityFeatures = [
    '256-bit SSL encryption',
    'PCI DSS compliant',
    'Secure payment gateway',
    'No card details stored',
    'Two-factor authentication',
  ];

  const commonIssues = [
    'Payment failed? Check your bank balance',
    'Money deducted but no download? Contact support',
    'Card declined? Try another payment method',
    'UPI not working? Use net banking',
    'Need invoice? Email us after purchase',
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col">
      <ModernNavbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-400 to-blue-600 pt-32 pb-20 text-white text-center px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Help</h1>
          <p className="text-lg md:text-xl text-white/90 mb-10">
            Safe, secure, and convenient payment options for everyone
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-yellow-300" fill="currentColor" />
              <span className="font-medium">Bank-Level Security</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-200" />
              <span className="font-medium">Multiple Options</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-300" fill="currentColor" />
              <span className="font-medium">Instant Processing</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-16 max-w-6xl">
        {/* Accepted Payment Methods */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-10 text-slate-900">
            Accepted Payment Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${method.iconBg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`h-6 w-6 ${method.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-4 text-slate-900">{method.title}</h3>
                  <ul className="space-y-2">
                    {method.items.map((item, i) => (
                      <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Payment Security */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-6 w-6 text-orange-500" fill="currentColor" />
              <h3 className="text-xl font-bold text-slate-900">Payment Security</h3>
            </div>
            <div className="space-y-4">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-slate-600 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Issues */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-bold text-slate-900">Payment Issues?</h3>
            </div>
            <div className="space-y-4">
              {commonIssues.map((issue, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span className="text-slate-600 font-medium">{issue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assistance Footer */}
        <div className="bg-blue-50/50 rounded-3xl p-10 text-center border border-blue-100">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Need Payment Assistance?</h3>
          <p className="text-slate-500 mb-6">
            Our support team is available 24/7 to help with payment issues
          </p>
          <a href="https://wa.me/918830217352" target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg h-11 px-8 font-medium">
              Contact Support on WhatsApp
            </Button>
          </a>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
