import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Sparkles, Target, BookOpen, ChevronRight, Eye, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Subject {
  id: string;
  name: string;
  code: string;
  scheme: string;
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

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  rating: number | null;
  review_count: number | null;
  preview_images: string[] | null;
  tags: string[] | null;
  file_format: string | null;
  file_size: string | null;
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
  const [generalContent, setGeneralContent] = useState<ContentItem[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<'K' | 'I'>('K');
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const materialInfo = materialType ? materialTitles[materialType] : null;
  const Icon = materialInfo?.icon || Star;

  // Fallback configuration for departments
  const deptConfig: Record<string, { name: string }> = {
    aiml: { name: 'AI & Machine Learning' },
    co: { name: 'Computer Engineering' },
    mech: { name: 'Mechanical Engineering' },
    civil: { name: 'Civil Engineering' },
  };

  // Map URL codes to DB codes
  const dbCodeMap: Record<string, string> = {
    mech: 'me',
    civil: 'ce',
    aiml: 'aiml',
    co: 'co'
  };

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!deptCode) return;
      
      // Try to fetch from DB first using mapped code if available
      const searchCode = dbCodeMap[deptCode.toLowerCase()] || deptCode;
      
      const { data } = await supabase
        .from('departments')
        .select('*')
        .ilike('code', searchCode)
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
          // Only set default semester if not already set (preserves selection on re-renders)
          if (!selectedSemester) {
            setSelectedSemester(semData[0].id);
          }
        }
      } else {
        // Fallback for missing DB entries
        const normalizedCode = deptCode.toLowerCase();
        if (deptConfig[normalizedCode]) {
          const fallbackDept = {
            id: normalizedCode, // Use code as ID for fallback
            name: deptConfig[normalizedCode].name,
            code: deptCode.toUpperCase()
          };
          setDepartment(fallbackDept);

          // Generate default semesters for fallback
          const defaultSemesters = Array.from({ length: 6 }, (_, i) => ({
            id: `sem${i + 1}`,
            name: `Semester ${i + 1}`,
            number: i + 1,
            department_id: normalizedCode
          }));
          setSemesters(defaultSemesters);
          setSelectedSemester(defaultSemesters[0].id);
        }
      }
      setLoading(false);
    };

    fetchDepartment();
  }, [deptCode]);

  useEffect(() => {
    const fetchData = async () => {
      if (!department || !selectedSemester) return;

      // Fetch subjects
      const subjectsPromise = supabase
        .from('subjects')
        .select('id, name, code, scheme')
        .eq('department_id', department.id)
        .eq('semester_id', selectedSemester)
        .eq('scheme', selectedScheme)
        .eq('is_active', true)
        .order('code');

      // Fetch general content (not linked to a specific subject)
      // Note: We don't filter by scheme for general content if it's null in DB, 
      // but usually it should match. If scheme is null in DB, we might want to show it for both schemes.
      // For now, we'll try to match scheme OR allow null scheme
      const contentPromise = supabase
        .from('content_items')
        .select('*')
        .eq('department_id', department.id)
        .eq('semester_id', selectedSemester)
        .eq('type', materialType)
        .is('subject_id', null)
        .eq('is_published', true)
        .or(`scheme.eq.${selectedScheme},scheme.is.null`)
        .order('created_at', { ascending: false });

      const [subjectsRes, contentRes] = await Promise.all([subjectsPromise, contentPromise]);

      if (subjectsRes.error) console.error('Error fetching subjects:', subjectsRes.error);
      if (contentRes.error) console.error('Error fetching content:', contentRes.error);
      
      setSubjects(subjectsRes.data || []);
      setGeneralContent(contentRes.data || []);
    };

    fetchData();
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
      <div className="pt-20 md:pt-24 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground pb-10 md:pb-14">
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
              <Target className="w-3 h-3" /> Exam Focused
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
          Subjects for Semester {selectedSemesterData?.number || 1} ({selectedScheme} Scheme)
        </h2>

        {/* General Content Section */}
        {generalContent.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              General {materialInfo.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generalContent.map((item) => (
                <div 
                  key={item.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {item.preview_images && item.preview_images[0] && (
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img 
                        src={item.preview_images[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{item.title}</h3>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {item.rating && (
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">{item.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary">₹{item.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/content/${item.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          <Eye className="w-4 h-4 mr-1" /> Preview
                        </Button>
                      </Link>
                      <Button className="flex-1" size="sm">
                        <Download className="w-4 h-4 mr-1" /> Buy
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {subjects.length === 0 && generalContent.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No subjects or content found for this selection.</p>
            <p className="text-sm text-muted-foreground mt-2">Please try different filters or check back later.</p>
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Link 
                key={subject.id}
                to={`/department/${deptCode}/${materialType}/${subject.id}`}
                className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-medium font-mono">
                      {subject.code}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {subject.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Access all {materialInfo.title.toLowerCase()} for {subject.name}.
                  </p>

                  <div className="flex items-center text-sm font-medium text-primary">
                    View Materials <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}