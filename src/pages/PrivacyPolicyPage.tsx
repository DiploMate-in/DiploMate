import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Shield, Lock, FileText, CheckCircle } from 'lucide-react';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col">
      <ModernNavbar />
      
      {/* Hero Header */}
      <div 
        className="pt-32 pb-32 text-white text-center px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(to right, #4f46e5, #3b82f6)' }}
      >
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-1/4 w-16 h-16 bg-white/5 rotate-45 rounded-xl"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 font-medium">Last updated: December 2, 2025</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/30 flex items-center gap-2 shadow-sm">
              <Lock className="h-4 w-4 text-yellow-300" fill="currentColor" />
              <span className="font-medium text-sm md:text-base">Secure & Private</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/30 flex items-center gap-2 shadow-sm">
              <FileText className="h-4 w-4 text-blue-200" fill="currentColor" />
              <span className="font-medium text-sm md:text-base">Transparent</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/30 flex items-center gap-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-300" fill="currentColor" />
              <span className="font-medium text-sm md:text-base">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <main className="flex-grow container mx-auto px-4 -mt-20 mb-20 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-16 max-w-4xl mx-auto">
          
          <div className="space-y-12 text-slate-600 leading-relaxed">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
              <p className="mb-4">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Name, email address, and phone number</li>
                <li>Department, semester, and educational details</li>
                <li>Payment information (processed securely through payment gateways)</li>
                <li>Download history and preferences</li>
                <li>Communication with our support team</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send purchase confirmations</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Personalize your experience and provide content relevant to your department</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Information Sharing</h2>
              <p className="mb-4">We do not sell or rent your personal information to third parties. We may share your information only in these circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>With payment processors to complete transactions</li>
                <li>With service providers who assist in operating our platform</li>
                <li>When required by law or to protect our rights</li>
                <li>With your consent for any other purpose</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information. All payment transactions are encrypted using SSL technology. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Cookies and Tracking</h2>
              <p>We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Children's Privacy</h2>
              <p>Our service is intended for diploma students (typically 16+ years old). We do not knowingly collect personal information from children under 16. If you believe we have collected information from a child under 16, please contact us.</p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to This Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Us</h2>
              <p className="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Email: hello@diplomate.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>WhatsApp: +91 98765 43210</li>
              </ul>
            </section>

          </div>
        </div>
      </main>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
