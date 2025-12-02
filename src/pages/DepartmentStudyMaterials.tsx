import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Star, FileText, HelpCircle, History, FlaskConical, Award, ArrowRight, Cpu, Monitor, Cog, Building2 } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
  color: string | null;
  icon: string | null;
}

const studyMaterials = [
  { 
    type: 'vvimp', 
    title: 'VVIMP', 
    description: 'Very Very Important questions and topics for exams',
    icon: Star,
    color: 'bg-amber-100 text-amber-600'
  },
  { 
    type: 'notes', 
    title: 'Notes', 
    description: 'Comprehensive chapter-wise study notes',
    icon: FileText,
    color: 'bg-blue-100 text-blue-600'
  },
  { 
    type: 'imp_questions', 
    title: 'IMP Questions', 
    description: 'Important questions frequently asked in exams',
    icon: HelpCircle,
    color: 'bg-purple-100 text-purple-600'
  },
  { 
    type: 'pyq', 
    title: 'PYQ', 
    description: 'Previous Year Questions with detailed solutions',
    icon: History,
    color: 'bg-green-100 text-green-600'
  },
  { 
    type: 'lab_manuals', 
    title: 'Lab Manuals', 
    description: 'Step-by-step practical experiments and observations',
    icon: FlaskConical,
    color: 'bg-orange-100 text-orange-600'
  },
  { 
    type: 'model_answers', 
    title: 'Model Answers', 
    description: 'High-scoring answer patterns and formats',
    icon: Award,
    color: 'bg-pink-100 text-pink-600'
  },
];

const deptIcons: Record<string, React.ElementType> = {
  aiml: Cpu,
  co: Monitor,
  mech: Cog,
  civil: Building2,
};

export default function DepartmentStudyMaterials() {
  const { deptCode } = useParams<{ deptCode: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!deptCode) return;
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .ilike('code', deptCode)
        .maybeSingle();
      
      if (!error && data) {
        setDepartment(data);
      }
      setLoading(false);
    };

    fetchDepartment();
  }, [deptCode]);

  const DeptIcon = deptCode ? deptIcons[deptCode.toLowerCase()] || Cpu : Cpu;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-background">
        <ModernNavbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Department not found</h1>
          <Link to="/" className="text-primary mt-4 inline-block">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      
      {/* Hero Section */}
      <div className="pt-20 md:pt-24 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground pb-12 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <DeptIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">{department.name}</h1>
              <p className="text-primary-foreground/80 mt-1">
                Master {department.code} concepts with comprehensive notes and cutting-edge projects
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Study Materials Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Study Materials</h2>
          <p className="text-muted-foreground mt-2">Choose the type of study material you need</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {studyMaterials.map((material) => {
            const Icon = material.icon;
            return (
              <Link 
                key={material.type}
                to={`/department/${deptCode}/${material.type}`}
                className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30"
              >
                <div className={`w-14 h-14 ${material.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{material.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{material.description}</p>
                <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
