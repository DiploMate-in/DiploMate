import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Star, FileText, Download, Shield, CheckCircle, ChevronLeft, ChevronRight, Eye, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SecurePDFViewer } from '@/components/content/SecurePDFViewer';
import { SecureViewerWrapper } from '@/components/content/SecureViewerWrapper';
import { fetchSecureDocument } from '@/services/documentService';

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
  file_url: string | null;
  downloads_allowed: number;
  type: string;
  department_id: string;
  semester_id: string;
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
}

export function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, isInWishlist, toggleWishlist, getPurchasedItem, addPurchase } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [item, setItem] = useState<ContentItem | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [semester, setSemester] = useState<Semester | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Secure Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [secureBlobUrl, setSecureBlobUrl] = useState<string | null>(null);
  const [isFetchingDoc, setIsFetchingDoc] = useState(false);
  const [isGoogleDocContent, setIsGoogleDocContent] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;

      try {
        // Fetch content item
        const { data: contentData, error: contentError } = await supabase
          .from('content_items')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (contentError) throw contentError;
        
        if (contentData) {
          setItem(contentData);

          // Fetch department and semester details
          const [deptRes, semRes] = await Promise.all([
            supabase.from('departments').select('*').eq('id', contentData.department_id).maybeSingle(),
            supabase.from('semesters').select('*').eq('id', contentData.semester_id).maybeSingle()
          ]);

          if (deptRes.data) setDepartment(deptRes.data);
          if (semRes.data) setSemester(semRes.data);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load content details');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Content not found</h2>
          <p className="text-muted-foreground mb-4">The content you're looking for doesn't exist.</p>
          <Link to="/browse">
            <Button>Browse Content</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPurchased = !!getPurchasedItem(item.id);
  const purchase = getPurchasedItem(item.id);
  const inWishlist = isInWishlist(item.id);
  const previewImages = item.preview_images || [];

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to purchase');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const purchaseItem = {
      id: item.id,
      title: item.title,
      price: item.price,
      type: item.type as any,
      departmentId: item.department_id,
      semesterId: item.semester_id,
      description: item.description || '',
      previewImages: item.preview_images || [],
      tags: item.tags || [],
      downloadsAllowed: item.downloads_allowed,
      fileSize: item.file_size || 'Unknown',
      format: item.file_format || 'PDF',
      rating: item.rating || 0,
      reviewCount: item.review_count || 0,
      createdAt: new Date().toISOString()
    };
    
    addPurchase(purchaseItem);
    setIsProcessing(false);
    toast.success('Purchase successful! You can now download.');
    navigate('/dashboard');
  };

  const handleSecureView = async () => {
    if (!item || !isPurchased) return;

    try {
      setIsFetchingDoc(true);
      
      // Check for Google Docs
      if (item.file_url && (item.file_url.includes('docs.google.com') || item.file_url.includes('drive.google.com'))) {
        setIsGoogleDocContent(true);
        let embedUrl = item.file_url;
        if (embedUrl.includes('/edit')) embedUrl = embedUrl.replace('/edit', '/preview');
        else if (embedUrl.includes('/view')) embedUrl = embedUrl.replace('/view', '/preview');
        setSecureBlobUrl(embedUrl);
        setIsViewerOpen(true);
        return;
      }
      
      setIsGoogleDocContent(false);
      toast.info("Preparing secure document...");
      
      const blobUrl = await fetchSecureDocument(item.id);
      setSecureBlobUrl(blobUrl);
      setIsViewerOpen(true);
      toast.dismiss();
      toast.success("Document ready for viewing");
    } catch (error: any) {
      console.error("Failed to open secure viewer:", error);
      toast.error(error.message || "Failed to load secure document. Please try again.");
    } finally {
      setIsFetchingDoc(false);
    }
  };

  const handleDownload = () => {
    if (!isPurchased) return;
    
    const downloadUrl = item.file_url || (isGoogleDoc(previewImages[0]) ? previewImages[0] : null);

    if (downloadUrl) {
      toast.success('Opening content...');
      window.open(downloadUrl, '_blank');
    } else {
      toast.error('Download link not available');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === previewImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };

  const isGoogleDoc = (url: string) => {
    return url.includes('docs.google.com') || url.includes('drive.google.com');
  };

  const getGoogleDocEmbedUrl = (url: string) => {
    if (url.includes('/edit')) {
      return url.replace('/edit', '/preview');
    }
    if (url.includes('/view')) {
      return url.replace('/view', '/preview');
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] bg-secondary rounded-2xl overflow-hidden">
              {previewImages.length > 0 ? (
                isGoogleDoc(previewImages[currentImageIndex]) ? (
                  <iframe 
                    src={getGoogleDocEmbedUrl(previewImages[currentImageIndex])}
                    className="w-full h-full border-0"
                    allow="autoplay"
                    title="Document Preview"
                  />
                ) : (
                  <img
                    src={previewImages[currentImageIndex]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                  <FileText className="h-16 w-16" />
                </div>
              )}

              {previewImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {previewImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-sm">
                  {currentImageIndex + 1} / {previewImages.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {previewImages.length > 1 && (
              <div className="flex gap-2">
                {previewImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors relative",
                      currentImageIndex === idx ? "border-primary" : "border-transparent"
                    )}
                  >
                    {isGoogleDoc(img) ? (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                    ) : (
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {department && <Badge variant="outline">{department.code}</Badge>}
              {semester && <Badge variant="secondary">{semester.name}</Badge>}
              <Badge variant="outline" className="capitalize">{item.type}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{item.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(item.rating || 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted"
                    )}
                  />
                ))}
                <span className="ml-2 font-medium">{item.rating || 0}</span>
              </div>
              <span className="text-muted-foreground">({item.review_count || 0} reviews)</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{item.description}</p>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-secondary rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* File Info */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Format:</span>
                <span className="font-medium">{item.file_format || 'PDF'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">{item.file_size || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Downloads:</span>
                <span className="font-medium">{item.downloads_allowed} allowed</span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="bg-secondary/50 rounded-2xl p-6 space-y-4">
              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">₹{item.price}</span>
                {item.original_price && item.original_price > item.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₹{item.original_price}</span>
                    <Badge variant="destructive" className="font-bold">
                      {Math.round((1 - item.price / item.original_price) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {isPurchased ? (
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button size="lg" className="flex-1 gap-2" onClick={handleSecureView} disabled={isFetchingDoc}>
                      {isFetchingDoc ? <Lock className="h-5 w-5 animate-pulse" /> : <Eye className="h-5 w-5" />}
                      {isFetchingDoc ? 'Loading...' : 'View Securely'}
                    </Button>
                    {/* Download button removed as per Secure Viewer requirement */}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button 
                      size="lg" 
                      className="flex-1 gap-2"
                      onClick={handleBuyNow}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Buy Now'}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => isAuthenticated ? toggleWishlist(item.id) : navigate('/login')}
                      className={cn(inWishlist && "text-accent border-accent")}
                    >
                      <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                    </Button>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-accent" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="border rounded-xl p-6">
              <h3 className="font-semibold mb-4">What's Included</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>Complete {item.type === 'notes' ? 'study notes' : 'project files'}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>Well-organized and easy to understand</span>
                </li>
                {item.type !== 'notes' && (
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                    <span>Source code & documentation</span>
                  </li>
                )}
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>{item.downloads_allowed} secure downloads</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Secure Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-full w-screen h-screen flex flex-col p-0 gap-0 bg-slate-50 rounded-none border-none focus:outline-none">
          <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm shrink-0 z-10">
             <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setIsViewerOpen(false)} className="gap-2 hover:bg-slate-100">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="h-6 w-px bg-slate-200" />
                <h2 className="font-semibold flex items-center gap-2 text-lg">
                   <Shield className="h-5 w-5 text-primary" />
                   Secure Document Viewer
                </h2>
             </div>
          </div>
          <div className="flex-1 overflow-hidden relative bg-slate-100">
            {secureBlobUrl && (
              <SecureViewerWrapper watermarkText={user?.email || user?.id || 'DiploMate User'}>
                {isGoogleDocContent ? (
                  <iframe 
                    src={secureBlobUrl} 
                    className="w-full h-full border-0 min-h-[80vh]" 
                    allow="autoplay"
                    title="Secure Document Viewer"
                  />
                ) : (
                  <SecurePDFViewer 
                    fileUrl={secureBlobUrl} 
                    watermarkText={user?.email || user?.id || 'DiploMate User'} 
                  />
                )}
              </SecureViewerWrapper>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
