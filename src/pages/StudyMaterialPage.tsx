import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Subject {
  id: string;
  name: string;
  code: string;
  department_id: string;
  semester_id: string;
  scheme: string;
}

interface ContentCount {
  subject_id: string;
  count: number;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Semester {
  id: string;
  name: string;
  number: number;
  department_id: string;
}

const materialTitles: Record<string, { title: string; subtitle: string; icon: React.ElementType }> = {
  vvimp: { title: 'Very Very Important Questions', subtitle: 'Crucial topics and questions that frequently appear in exams', icon: Star },
  notes: { title: 'Study Notes', subtitle: 'Comprehensive chapter-wise study notes', icon: Sparkles },
  imp_questions: { title: 'Important Questions', subtitle: 'Important questions frequently asked in exams', icon: Target },
  pyq: { title: 'Previous Year Questions', subtitle: 'Past exam papers with detailed solutions', icon: Star },
  lab_manuals: { title: 'Lab Manuals', subtitle: 'Step-by-step practical experiments and observations', icon: Sparkles },
  model_answers: { title: 'Model Answers', subtitle: 'High-scoring answer patterns and formats', icon: Target },
};

export default function StudyMaterialPage() {
  const { deptCode, materialType } = useParams<{ deptCode: string; materialType: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [contentCounts, setContentCounts] = useState<ContentCount[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<'K' | 'I'>('K');
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const materialInfo = materialType ? materialTitles[materialType] : null;
  const Icon = materialInfo?.icon || Star;

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!deptCode) return;
      
      const { data } = await supabase
        .from('departments')
        .select('*')
        .ilike('code', deptCode)
        .maybeSingle();
      
      if (data) {
        setDepartment(data);
        
        // Fetch semesters for this department
        const { data: semData } = await supabase
          .from('semesters')
          .select('*')
          .eq('department_id', data.id)
          .order('number');
        
        if (semData && semData.length > 0) {
          setSemesters(semData);
          setSelectedSemester(semData[0].id);
        }
      }
      setLoading(false);
    };

    fetchDepartment();
  }, [deptCode]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!department || !selectedSemester) return;

      const { data: subjectData } = await supabase
        .from('subjects')
        .select('*')
        .eq('department_id', department.id)
        .eq('semester_id', selectedSemester)
        .eq('scheme', selectedScheme)
        .eq('is_active', true);

      setSubjects(subjectData || []);

      // Fetch content counts for each subject
      if (subjectData && subjectData.length > 0 && materialType) {
        const { data: countData } = await supabase
          .from('content_items')
          .select('subject_id')
          .eq('type', materialType)
          .eq('is_published', true)
          .in('subject_id', subjectData.map(s => s.id));

        if (countData) {
          const counts = subjectData.map(sub => ({
            subject_id: sub.id,
            count: countData.filter(c => c.subject_id === sub.id).length
          }));
          setContentCounts(counts);
        }
      }
    };

    fetchSubjects();
  }, [department, selectedSemester, selectedScheme, materialType]);

  const selectedSemesterData = semesters.find(s => s.id === selectedSemester);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!department || !materialInfo) {
    return (
      <div className="min-h-screen bg-background">
        <ModernNavbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          <Link to="/" className="text-primary mt-4 inline-block">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-10 md:py-14">
        <div className="container mx-auto px-4">
          <Link 
            to={`/department/${deptCode}`}
            className="inline-flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {department.name}
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-amber-900" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">{materialInfo.title}</h1>
              <p className="text-primary-foreground/80 mt-1">{materialInfo.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full"></span> All Subjects
            </span>
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Target className="w-3 h-3" /> Exam Ready
            </span>
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Updated Content
            </span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Scheme Selector */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-3">Select Scheme</label>
              <div className="flex gap-2">
                <Button
                  variant={selectedScheme === 'K' ? 'default' : 'outline'}
                  onClick={() => setSelectedScheme('K')}
                  className={cn(
                    "px-6",
                    selectedScheme === 'K' && "bg-primary text-primary-foreground"
                  )}
                >
                  K Scheme
                </Button>
                <Button
                  variant={selectedScheme === 'I' ? 'default' : 'outline'}
                  onClick={() => setSelectedScheme('I')}
                  className={cn(
                    "px-6",
                    selectedScheme === 'I' && "bg-primary text-primary-foreground"
                  )}
                >
                  I Scheme
                </Button>
              </div>
            </div>

            {/* Semester Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-3">Select Semester</label>
              <div className="flex flex-wrap gap-2">
                {semesters.map((sem) => (
                  <Button
                    key={sem.id}
                    variant={selectedSemester === sem.id ? 'default' : 'outline'}
                    onClick={() => setSelectedSemester(sem.id)}
                    className={cn(
                      "px-4",
                      selectedSemester === sem.id && "bg-primary text-primary-foreground"
                    )}
                  >
                    Sem {sem.number}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subject Cards */}
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          {materialInfo.title.split(' ')[0]} for Semester {selectedSemesterData?.number || 1} ({selectedScheme} Scheme)
        </h2>

        {subjects.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No subjects found for this selection.</p>
            <p className="text-sm text-muted-foreground mt-2">Admins can add subjects from the admin dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const count = contentCounts.find(c => c.subject_id === subject.id)?.count || 0;
              return (
                <div 
                  key={subject.id}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-500" />
                    </div>
                    <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
                      {subject.code}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">{subject.name}</h3>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-foreground">{count}</span>
                    <span className="text-sm text-muted-foreground ml-1">{materialInfo.title.split(' ')[0]} Available</span>
                  </div>

                  <Link to={`/department/${deptCode}/${materialType}/${subject.id}`}>
                    <Button className="w-full">
                      View {materialInfo.title.split(' ')[0]}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
