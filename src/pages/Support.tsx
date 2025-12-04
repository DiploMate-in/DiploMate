import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import {
  Headphones,
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  FileText,
  CreditCard,
  Home,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Support() {
  const whatsappNumber = '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello DiploMate team! I need help with...')}`;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFF' }}>
      <ModernNavbar />

      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link to="/" className="flex items-center hover:text-primary transition-colors">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-primary font-medium">Support</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
            <Headphones className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Support Center</h1>
          <p className="text-slate-500 text-lg">
            We're here to help! Choose your preferred way to reach us
          </p>
        </div>

        {/* Contact Us Section */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-center mb-8 text-slate-800">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-[#25D366]" />
              </div>
              <h3 className="font-bold text-lg mb-2">WhatsApp Support</h3>
              <p className="text-slate-500 text-sm mb-6">Chat with us instantly</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full h-11 font-medium">
                  Open WhatsApp
                </Button>
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email Support</h3>
              <p className="text-slate-500 text-sm mb-6">hello@diplomate.com</p>
              <a href="mailto:hello@diplomate.com" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-11 font-medium">
                  Send Email
                </Button>
              </a>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Phone Support</h3>
              <p className="text-slate-500 text-sm mb-6">+91 98765 43210</p>
              <a href="tel:+919876543210" className="w-full">
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-full h-11 font-medium">
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Help Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-center mb-8 text-slate-800">Quick Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* FAQs */}
            <Link
              to="/faqs"
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="mt-1">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                  FAQs
                </h3>
                <p className="text-slate-500 text-sm">Find quick answers</p>
              </div>
            </Link>

            {/* How to Buy */}
            <Link
              to="/how-to-buy"
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="mt-1">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                  How to Buy
                </h3>
                <p className="text-slate-500 text-sm">Purchase guide</p>
              </div>
            </Link>

            {/* Payment Help */}
            <Link
              to="/payment-help"
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="mt-1">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                  Payment Help
                </h3>
                <p className="text-slate-500 text-sm">Payment assistance</p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
