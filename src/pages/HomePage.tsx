import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { HeroSection } from '@/components/home/HeroSection';
import { DepartmentsSection } from '@/components/home/DepartmentsSection';
import { CapstonePreviewSection } from '@/components/home/CapstonePreviewSection';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

export function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>
      <ModernNavbar />
      <HeroSection />
      <DepartmentsSection />
      <CapstonePreviewSection />
      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
