import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Download, Star, Eye, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Subject {
  id: string;
  name: string;
  code: string;
  bundle_price?: number;
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

const materialTitles: Record<string, string> = {
  vvimp: 'VVIMP',
  notes: 'Notes',
  imp_questions: 'Important Questions',
  pyq: 'Previous Year Questions',
  lab_manuals: 'Lab Manuals',
  model_answers: 'Model Answers',
};

export default function SubjectContentPage() {
  const { deptCode, materialType, subjectId } = useParams<{ 
    deptCode: string; 
    materialType: string; 
    subjectId: string;
  }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [totalSubjectValue, setTotalSubjectValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!subjectId || !materialType) return;

      const [subjectRes, contentRes, totalValueRes] = await Promise.all([
        supabase.from('subjects').select('*').eq('id', subjectId).maybeSingle(),
        supabase
          .from('content_items')
          .select('*')
          .eq('subject_id', subjectId)
          .eq('type', materialType)
          .eq('is_published', true)
          .order('created_at', { ascending: false }),
        supabase.rpc('get_subject_total_value', { subject_uuid: subjectId })
      ]);

      if (subjectRes.data) setSubject(subjectRes.data);
      if (contentRes.data) setContent(contentRes.data);
      if (totalValueRes.data) setTotalSubjectValue(totalValueRes.data);
      setLoading(false);
    };

    fetchData();
  }, [subjectId, materialType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const materialTitle = materialType ? materialTitles[materialType] || materialType : '';
  const bundlePrice = subject?.bundle_price;
  const hasBundle = bundlePrice !== undefined && bundlePrice !== null && bundlePrice < totalSubjectValue;

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link 
          to={`/department/${deptCode}/${materialType}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {materialTitle}
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {subject?.name || 'Subject'} - {materialTitle}
          </h1>
          <p className="text-muted-foreground mt-2">
            {content.length} {materialTitle.toLowerCase()} available for {subject?.code}
          </p>
        </div>

        {hasBundle && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Get Full Subject Bundle
              </h3>
              <p className="text-green-700 dark:text-green-400 text-sm">
                Unlock all materials for {subject?.name} at a special discounted price. 
                <span className="font-semibold ml-1">Save ₹{totalSubjectValue - (bundlePrice || 0)}!</span>
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase font-semibold">Total Value</div>
                <div className="text-sm text-muted-foreground line-through">₹{totalSubjectValue}</div>
              </div>
              <div className="text-right border-l pl-4 border-green-200 dark:border-green-800">
                <div className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold">Bundle Price</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">₹{bundlePrice}</div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all whitespace-nowrap">
                Buy Bundle Now
              </Button>
            </div>
          </div>
        )}

        {content.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No content available yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
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

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {item.rating && (
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      )}
                      {item.file_size && (
                        <span className="text-xs text-muted-foreground">{item.file_size}</span>
                      )}
                    </div>
                    <div className="text-right">
                      {item.original_price && item.original_price > item.price && (
                        <span className="text-xs text-muted-foreground line-through mr-2">
                          ₹{item.original_price}
                        </span>
                      )}
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
                      <Download className="w-4 h-4 mr-1" /> Buy ₹{item.price}
                    </Button>
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
