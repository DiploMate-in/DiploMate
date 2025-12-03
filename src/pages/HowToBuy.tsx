import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { ShoppingBag, Search, ShoppingCart, CreditCard, Download, Lightbulb, CheckCircle, Zap, Shield, Clock } from 'lucide-react';

export function HowToBuy() {
  const steps = [
    {
      id: 1,
      icon: Search,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
      title: 'Browse Resources',
      description: 'Explore our collection of notes, microprojects, and capstone projects. Use filters to find exactly what you need by department, semester, and scheme.',
      stepLabel: 'Step 1',
      stepColor: 'text-blue-600'
    },
    {
      id: 2,
      icon: ShoppingCart,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50',
      title: 'Add to Cart',
      description: 'Click "Buy Now" on any resource. Review the details, price, and what\'s included before proceeding to checkout.',
      stepLabel: 'Step 2',
      stepColor: 'text-green-600'
    },
    {
      id: 3,
      icon: CreditCard,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50',
      title: 'Complete Payment',
      description: 'Choose your payment method (UPI, Cards, Net Banking, Wallets). Enter details and confirm payment securely.',
      stepLabel: 'Step 3',
      stepColor: 'text-red-600'
    },
    {
      id: 4,
      icon: Download,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-50',
      title: 'Download Instantly',
      description: 'Get immediate access to download links via email and your account dashboard. Download anytime, anywhere!',
      stepLabel: 'Step 4',
      stepColor: 'text-orange-600'
    }
  ];

  const notes = [
    'All payments are 100% secure and encrypted',
    'You get lifetime access to downloaded resources',
    'Download links are sent to your email immediately',
    'No subscription needed - pay only for what you need',
    '24-hour support available for any issues'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col">
      <ModernNavbar />
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 pt-32 pb-20 text-white text-center px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Buy & Download</h1>
          <p className="text-lg md:text-xl text-white/90 mb-10">Simple 4-step process to get your study materials instantly</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-300" fill="currentColor" />
              <span className="font-medium">Instant Access</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-300" fill="currentColor" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-200" />
              <span className="font-medium">Lifetime Access</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-16 max-w-5xl">
        {/* Steps */}
        <div className="space-y-6 mb-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                  <div className={`w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center`}>
                    <Icon className={`h-8 w-8 ${step.iconColor}`} />
                  </div>
                  <span className={`text-sm font-bold ${step.stepColor}`}>{step.stepLabel}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50/50 rounded-3xl p-8 md:p-10 border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="h-6 w-6 text-yellow-500" fill="currentColor" />
            <h3 className="text-xl font-bold text-slate-900">Important Notes:</h3>
          </div>
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="#22c55e" color="white" />
                <span className="text-slate-700 font-medium">{note}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
