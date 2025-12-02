import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { ContentCard } from '@/components/content/ContentCard';
import { contentItems } from '@/data/mockData';

export function MicroprojectsPage() {
  const microprojects = contentItems.filter(item => item.type === 'microproject');

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>
      <ModernNavbar />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#1B1B1B' }}>
              <span className="gradient-text">Microprojects</span>
            </h1>
            <p className="text-lg" style={{ color: '#4A4A4A' }}>
              Quick, semester-long projects with complete documentation
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {microprojects.map(item => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
