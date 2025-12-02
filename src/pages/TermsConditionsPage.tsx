import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

export function TermsConditionsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>
      <ModernNavbar />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8" style={{ color: '#1B1B1B' }}>
            Terms & Conditions
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6" style={{ color: '#4A4A4A' }}>
            <p>Last updated: December 2024</p>
            
            <h2 className="text-2xl font-semibold" style={{ color: '#1B1B1B' }}>Use of Content</h2>
            <p>All content purchased from DiploMate is for personal educational use only. Redistribution or resale is strictly prohibited.</p>
            
            <h2 className="text-2xl font-semibold" style={{ color: '#1B1B1B' }}>Purchases</h2>
            <p>All sales are final. Due to the digital nature of our products, refunds are generally not available.</p>
            
            <h2 className="text-2xl font-semibold" style={{ color: '#1B1B1B' }}>Download Limits</h2>
            <p>Each purchase comes with a limited number of downloads. These limits are in place for content security.</p>
            
            <h2 className="text-2xl font-semibold" style={{ color: '#1B1B1B' }}>Account Responsibility</h2>
            <p>You are responsible for maintaining the security of your account credentials.</p>
          </div>
        </div>
      </main>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
