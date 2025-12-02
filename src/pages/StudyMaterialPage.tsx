import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Sparkles, Target, FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  file_format: string | null;
  file_size: string | null;
  rating: number | null;
  preview_images: string[] | null;
  tags: string[] | null;
  subject_name: string | null;
  subject_code: string | null;
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
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
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
    const fetchContent = async () => {
      if (!department || !selectedSemester || !materialType) return;

      const { data, error } = await supabase
        .from('content_items')
        .select('id, title, description, price, original_price, file_format, file_size, rating, preview_images, tags, subject_name, subject_code')
        .eq('department_id', department.id)
        .eq('semester_id', selectedSemester)
        .eq('scheme', selectedScheme)
        .eq('type', materialType)
        .eq('is_published', true);

      if (error) {
        console.error('Error fetching content:', error);
      }
      
      setContentItems(data || []);
    };

    fetchContent();
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
              <span className="w-2 h-2 bg-white rounded-full"></span> All Content
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

        {/* Content Cards */}
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          {materialInfo.title} for Semester {selectedSemesterData?.number || 1} ({selectedScheme} Scheme)
        </h2>

        {contentItems.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No {materialInfo.title.toLowerCase()} available for this selection.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later or try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map((item) => (
              <div 
                key={item.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Preview Image */}
                {item.preview_images && item.preview_images.length > 0 ? (
                  <div className="h-40 bg-muted overflow-hidden">
                    <img 
                      src={item.preview_images[0]} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-primary/30" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-foreground line-clamp-2">{item.title}</h3>
                    {item.subject_code && (
                      <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-medium shrink-0">
                        {item.subject_code}
                      </span>
                    )}
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    {item.file_format && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {item.file_format.toUpperCase()}
                      </span>
                    )}
                    {item.file_size && (
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {item.file_size}
                      </span>
                    )}
                    {item.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500" />
                        {item.rating}
                      </span>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-foreground">₹{item.price}</span>
                      {item.original_price && item.original_price > item.price && (
                        <span className="text-sm text-muted-foreground line-through">₹{item.original_price}</span>
                      )}
                    </div>
                    <Link to={`/content/${item.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
