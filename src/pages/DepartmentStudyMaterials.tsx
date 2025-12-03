import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Star, FileText, HelpCircle, History, FlaskConical, Award, Cpu, Monitor, Cog, Building2, Code, Wrench } from 'lucide-react';
import { DepartmentHeader } from '@/components/department/DepartmentHeader';
import { MaterialCard } from '@/components/department/MaterialCard';

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
    iconColorClass: 'text-amber-500',
    iconBgClass: 'bg-amber-50'
  },
  { 
    type: 'notes', 
    title: 'Notes', 
    description: 'Comprehensive chapter-wise study notes',
    icon: FileText,
    iconColorClass: 'text-blue-500',
    iconBgClass: 'bg-blue-50'
  },
  { 
    type: 'imp_questions', 
    title: 'IMP Questions', 
    description: 'Important questions frequently asked in exams',
    icon: HelpCircle,
    iconColorClass: 'text-purple-500',
    iconBgClass: 'bg-purple-50'
  },
  { 
    type: 'pyq', 
    title: 'PYQ', 
    description: 'Previous Year Questions with detailed solutions',
    icon: History,
    iconColorClass: 'text-teal-500',
    iconBgClass: 'bg-teal-50'
  },
  { 
    type: 'lab_manuals', 
    title: 'Lab Manuals', 
    description: 'Step-by-step practical experiments and observations',
    icon: FlaskConical,
    iconColorClass: 'text-orange-500',
    iconBgClass: 'bg-orange-50'
  },
  { 
    type: 'model_answers', 
    title: 'Model Answers', 
    description: 'High-scoring answer patterns and formats',
    icon: Award,
    iconColorClass: 'text-pink-500',
    iconBgClass: 'bg-pink-50'
  },
];

const deptConfig: Record<string, { icon: any, color: string, description: string }> = {
  aiml: { 
    icon: Cpu, 
    color: '#2F6FED',
    description: 'Complete resources for AI & Machine Learning diploma students'
  },
  co: { 
    icon: Code, 
    color: '#35C2A0', // Green
    description: 'Complete resources for computer engineering diploma students'
  },
  mech: { 
    icon: Wrench, 
    color: '#FF6B6B', // Red/Pink
    description: 'Engineering mechanics, designs, and manufacturing resources'
  },
  civil: { 
    icon: Building2, 
    color: '#FFA726', // Orange
    description: 'Structural design, construction, and surveying materials'
  },
};

export default function DepartmentStudyMaterials() {
  const { deptCode } = useParams<{ deptCode: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!deptCode) return;
      
      // Try to fetch from DB first
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .ilike('code', deptCode)
        .maybeSingle();
      
      if (!error && data) {
        setDepartment(data);
      } else {
        // Fallback for when DB might be empty or missing specific codes but we want to show the UI
        // This is useful if the user hasn't populated the DB yet but wants the pages to work
        const normalizedCode = deptCode.toLowerCase();
        if (deptConfig[normalizedCode]) {
           setDepartment({
             id: normalizedCode,
             name: getDepartmentName(normalizedCode),
             code: deptCode.toUpperCase(),
             color: deptConfig[normalizedCode].color,
             icon: null
           });
        }
      }
      setLoading(false);
    };

    fetchDepartment();
  }, [deptCode]);

  const getDepartmentName = (code: string) => {
    switch(code) {
      case 'aiml': return 'AI & Machine Learning';
      case 'co': return 'Computer Engineering';
      case 'mech': return 'Mechanical Engineering';
      case 'civil': return 'Civil Engineering';
      default: return code.toUpperCase();
    }
  };

  const normalizedCode = deptCode?.toLowerCase() || 'co';
  const config = deptConfig[normalizedCode] || deptConfig['co'];

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
          <p className="text-muted-foreground mt-2">The department "{deptCode}" could not be found.</p>
          <Link to="/" className="text-primary mt-4 inline-block hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      
      <DepartmentHeader 
        title={department.name}
        description={config.description}
        icon={config.icon}
        color={config.color}
        className="pt-28 pb-20"
      />

      {/* Study Materials Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Study Materials</h2>
          <p className="text-muted-foreground">Choose the type of study material you need</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {studyMaterials.map((material) => (
            <MaterialCard 
              key={material.type}
              {...material}
              deptCode={deptCode || 'co'}
            />
          ))}
        </div>
      </div>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
