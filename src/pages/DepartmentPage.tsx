import { useParams, Link } from 'react-router-dom';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { ContentCard } from '@/components/content/ContentCard';
import { contentItems, departments } from '@/data/mockData';
import { Brain, Monitor, Cog, Building2, FileText, Lightbulb, Trophy } from 'lucide-react';

const deptIcons: Record<string, any> = {
  aiml: Brain,
  computer: Monitor,
  mechanical: Cog,
  civil: Building2
};

export function DepartmentPage() {
  const { dept } = useParams();
  const department = departments.find(d => d.id === dept);
  const items = contentItems.filter(item => item.departmentId === dept);
  const Icon = deptIcons[dept || ''] || Brain;

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Department not found</p>
      </div>
    );
  }

  const notes = items.filter(i => i.type === 'notes');
  const microprojects = items.filter(i => i.type === 'microproject');
  const capstones = items.filter(i => i.type === 'capstone');

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>
      <ModernNavbar />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: `${department.color}15` }}
            >
              <Icon style={{ width: '40px', height: '40px', color: department.color }} />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#1B1B1B' }}>
              {department.name}
            </h1>
            <p className="text-lg" style={{ color: '#4A4A4A' }}>
              Browse notes, microprojects, and capstones for {department.name}
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Link
              to={`/department/${dept}/notes`}
              className="flex items-center gap-4 p-6 rounded-2xl bg-white border hover:-translate-y-1 transition-all"
              style={{ borderColor: 'rgba(0,0,0,0.06)' }}
            >
              <FileText className="w-8 h-8" style={{ color: '#2F6FED' }} />
              <div>
                <h3 className="font-semibold" style={{ color: '#1B1B1B' }}>Notes</h3>
                <p className="text-sm" style={{ color: '#4A4A4A' }}>{notes.length} items</p>
              </div>
            </Link>
            <Link
              to={`/department/${dept}/microprojects`}
              className="flex items-center gap-4 p-6 rounded-2xl bg-white border hover:-translate-y-1 transition-all"
              style={{ borderColor: 'rgba(0,0,0,0.06)' }}
            >
              <Lightbulb className="w-8 h-8" style={{ color: '#9333EA' }} />
              <div>
                <h3 className="font-semibold" style={{ color: '#1B1B1B' }}>Microprojects</h3>
                <p className="text-sm" style={{ color: '#4A4A4A' }}>{microprojects.length} items</p>
              </div>
            </Link>
            <Link
              to={`/department/${dept}/capstone`}
              className="flex items-center gap-4 p-6 rounded-2xl bg-white border hover:-translate-y-1 transition-all"
              style={{ borderColor: 'rgba(0,0,0,0.06)' }}
            >
              <Trophy className="w-8 h-8" style={{ color: '#F59E0B' }} />
              <div>
                <h3 className="font-semibold" style={{ color: '#1B1B1B' }}>Capstone Projects</h3>
                <p className="text-sm" style={{ color: '#4A4A4A' }}>{capstones.length} items</p>
              </div>
            </Link>
          </div>

          {/* All Items */}
          <h2 className="text-2xl font-semibold mb-6" style={{ color: '#1B1B1B' }}>
            All {department.name} Materials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
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
