import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download,
  Eye,
  Clock,
  FileText,
  ArrowRight,
  ArrowLeft,
  Package,
  Heart,
  Shield,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SecurePDFViewer } from '@/components/content/SecurePDFViewer';
import { SecureViewerWrapper } from '@/components/content/SecureViewerWrapper';
import { fetchSecureDocument } from '@/services/documentService';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

// Define interfaces for Supabase data
interface ContentItemDB {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: string;
  department_id: string;
  preview_images: string[] | null;
  file_format: string | null;
  file_size: string | null;
  file_url: string | null;
  downloads_allowed: number;
}

interface DepartmentDB {
  id: string;
  code: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, purchases, wishlist, isDataLoading } = useApp();
  const [purchasedContent, setPurchasedContent] = useState<ContentItemDB[]>([]);
  const [departments, setDepartments] = useState<Record<string, DepartmentDB>>({});
  const [loading, setLoading] = useState(true);

  // Secure Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [secureBlobUrl, setSecureBlobUrl] = useState<string | null>(null);
  const [isFetchingDoc, setIsFetchingDoc] = useState(false);
  const [currentDocTitle, setCurrentDocTitle] = useState<string>('');
  const [isGoogleDoc, setIsGoogleDoc] = useState(false);

  useEffect(() => {
    const fetchPurchasedContent = async () => {
      if (isDataLoading) return; // Wait for data to load

      if (purchases.length === 0) {
        setLoading(false);
        return;
      }

      const contentIds = purchases.map((p) => p.contentItemId);

      try {
        // Fetch content items
        const { data: contentData, error: contentError } = await supabase
          .from('content_items')
          .select('*')
          .in('id', contentIds);

        if (contentError) throw contentError;

        if (contentData) {
          setPurchasedContent(contentData);

          // Fetch departments for these items
          const deptIds = [...new Set(contentData.map((item) => item.department_id))];
          if (deptIds.length > 0) {
            const { data: deptData, error: deptError } = await supabase
              .from('departments')
              .select('id, code')
              .in('id', deptIds);

            if (deptError) throw deptError;

            if (deptData) {
              const deptMap = deptData.reduce(
                (acc, dept) => {
                  acc[dept.id] = dept;
                  return acc;
                },
                {} as Record<string, DepartmentDB>,
              );
              setDepartments(deptMap);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load purchased content');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPurchasedContent();
    } else {
      setLoading(false);
    }
  }, [purchases, isAuthenticated, isDataLoading]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sign in to view your dashboard</h2>
          <p className="text-muted-foreground mb-6">Access your purchased content and downloads</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login">
              <Button size="lg">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const purchasedItems = purchases
    .map((p) => {
      const content = purchasedContent.find((c) => c.id === p.contentItemId);
      return content ? { ...p, content } : null;
    })
    .filter((item): item is (typeof purchases)[0] & { content: ContentItemDB } => item !== null);

  const handleSecureView = async (item: ContentItemDB) => {
    try {
      setIsFetchingDoc(true);
      setCurrentDocTitle(item.title);

      // Check for Google Docs
      if (
        item.file_url &&
        (item.file_url.includes('docs.google.com') || item.file_url.includes('drive.google.com'))
      ) {
        setIsGoogleDoc(true);
        let embedUrl = item.file_url;
        if (embedUrl.includes('/edit')) embedUrl = embedUrl.replace('/edit', '/preview');
        else if (embedUrl.includes('/view')) embedUrl = embedUrl.replace('/view', '/preview');
        setSecureBlobUrl(embedUrl);
        setIsViewerOpen(true);
        return;
      }

      setIsGoogleDoc(false);
      toast.info('Preparing secure document...');

      const blobUrl = await fetchSecureDocument(item.id);
      setSecureBlobUrl(blobUrl);
      setIsViewerOpen(true);
      toast.dismiss();
      toast.success('Document ready for viewing');
    } catch (error: any) {
      console.error('Failed to open secure viewer:', error);
      toast.error(error.message || 'Failed to load secure document. Please try again.');
    } finally {
      setIsFetchingDoc(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <ModernNavbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Hey {user?.user_metadata?.name || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">Welcome back to your dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border">
            <div className="text-2xl font-bold text-primary">{purchases.length}</div>
            <div className="text-sm text-muted-foreground">Purchases</div>
          </div>
          <div className="bg-card rounded-xl p-4 border">
            <div className="text-2xl font-bold text-accent">{wishlist.length}</div>
            <div className="text-sm text-muted-foreground">Wishlist</div>
          </div>
          <div className="bg-card rounded-xl p-4 border">
            <div className="text-2xl font-bold">
              {purchases.reduce((acc, p) => acc + (p.downloadsRemaining || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Downloads Left</div>
          </div>
          <div className="bg-card rounded-xl p-4 border">
            <div className="text-2xl font-bold">
              ₹{purchases.reduce((acc, p) => acc + p.price, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </div>
        </div>

        {/* Purchased Content */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Purchases</h2>
            <Link to="/browse">
              <Button variant="ghost" size="sm" className="gap-1">
                Browse More
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading || isDataLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : purchasedItems.length > 0 ? (
            <div className="space-y-4">
              {purchasedItems.map(({ content, ...purchase }) => {
                const department = departments[content.department_id];
                const previewImage = content.preview_images?.[0] || '';

                return (
                  <div key={purchase.id} className="bg-card rounded-xl border overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-48 h-32 sm:h-auto bg-secondary flex-shrink-0">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt={content.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <FileText className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {department && <Badge variant="outline">{department.code}</Badge>}
                          <Badge variant="secondary" className="capitalize">
                            {content.type}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-foreground mb-1">{content.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                          {content.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Purchased {new Date(purchase.purchasedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>
                              {content.file_format || 'PDF'} • {content.file_size || 'Unknown'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => handleSecureView(content)}
                            disabled={isFetchingDoc}
                          >
                            {isFetchingDoc && currentDocTitle === content.title ? (
                              <Lock className="h-4 w-4 animate-pulse" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            View Securely
                          </Button>
                          <Link to={`/content/${content.id}`}>
                            <Button variant="outline" size="sm" className="gap-2">
                              <FileText className="h-4 w-4" />
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-xl border p-8 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
              <p className="text-muted-foreground mb-4">Start exploring our content library</p>
              <Link to="/browse">
                <Button>Browse Content</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/wishlist"
            className="bg-card rounded-xl border p-6 hover:border-accent transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Wishlist</h3>
                <p className="text-sm text-muted-foreground">{wishlist.length} items saved</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:text-accent transition-colors" />
            </div>
          </Link>

          <Link
            to="/support"
            className="bg-card rounded-xl border p-6 hover:border-primary transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">Contact support</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>
      </div>

      {/* Secure Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-full w-screen h-screen flex flex-col p-0 gap-0 bg-slate-50 rounded-none border-none focus:outline-none">
          <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm shrink-0 z-10">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsViewerOpen(false)}
                className="gap-2 hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="h-6 w-px bg-slate-200" />
              <h2 className="font-semibold flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                {currentDocTitle || 'Secure Document Viewer'}
              </h2>
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative bg-slate-100">
            {secureBlobUrl && (
              <SecureViewerWrapper watermarkText={user?.email || user?.id || 'DiploMate User'}>
                {isGoogleDoc ? (
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
      <BottomNav />
      <WhatsAppButton />
    </div>
  );
}
