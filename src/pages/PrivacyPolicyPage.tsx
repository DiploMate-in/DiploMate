import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>
      <ModernNavbar />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8" style={{ color: '#1B1B1B' }}>
            Privacy Policy
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6" style={{ color: '#4A4A4A' }}>
            <p>Last updated: December 2024</p>
            
            <h2 className="text-2xl font-semibold" style={{ color: '#1B1B1B' }}>Information We Collect</h2>
            <p>We collect information you provide directly, including name, email, and payment information when making purchases.</p>
            
            <h2 className="text-2xl font-semibold" style={{ color: '#1B1B1B' }}>How We Use Your Information</h2>
            <p>We use your information to process orders, provide customer support, and improve our services.</p>
            
            <h2 className="text-2xl font-semibold" style={{ color: '#1B1B1B' }}>Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information.</p>
            
            <h2 className="text-2xl font-semibold" style={{ color: '#1B1B1B' }}>Contact Us</h2>
            <p>If you have questions about this policy, contact us via WhatsApp or email.</p>
          </div>
        </div>
      </main>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
