import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/content/ContentCard';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ContentItem } from '@/types';

interface DepartmentDB {
  id: string;
  code: string;
}

export function Wishlist() {
  const { isAuthenticated, wishlist } = useApp();
  const [wishlistItems, setWishlistItems] = useState<ContentItem[]>([]);
  const [departments, setDepartments] = useState<Record<string, DepartmentDB>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (wishlist.length === 0) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      try {
        const { data: contentData, error: contentError } = await supabase
          .from('content_items')
          .select('*')
          .in('id', wishlist);

        if (contentError) throw contentError;

        if (contentData) {
          // Map to ContentItem type
          const items: ContentItem[] = contentData.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            type: item.type as any,
            departmentId: item.department_id,
            semesterId: item.semester_id,
            price: item.price,
            originalPrice: item.original_price || undefined,
            previewImages: item.preview_images || [],
            tags: item.tags || [],
            downloadsAllowed: item.downloads_allowed,
            fileSize: item.file_size || 'Unknown',
            format: item.file_format || 'PDF',
            rating: item.rating || 0,
            reviewCount: item.review_count || 0,
            createdAt: item.created_at
          }));
          
          setWishlistItems(items);

          // Fetch departments
          const deptIds = [...new Set(contentData.map(item => item.department_id))];
          if (deptIds.length > 0) {
            const { data: deptData, error: deptError } = await supabase
              .from('departments')
              .select('id, code')
              .in('id', deptIds);

            if (deptError) throw deptError;

            if (deptData) {
              const deptMap = deptData.reduce((acc, dept) => {
                acc[dept.id] = dept;
                return acc;
              }, {} as Record<string, DepartmentDB>);
              setDepartments(deptMap);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist items');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchWishlistItems();
    } else {
      setLoading(false);
    }
  }, [wishlist, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sign in to view your wishlist</h2>
          <p className="text-muted-foreground mb-6">Save your favorite items and access them anytime</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login">
              <Button size="lg">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {/* Content */}
        {loading ? (
           <div className="flex justify-center py-8">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
           </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <ContentCard 
                key={item.id} 
                item={item} 
                departmentCode={departments[item.departmentId]?.code}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border p-8 text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">
              Start browsing and save items you love by tapping the heart icon
            </p>
            <Link to="/browse">
              <Button className="gap-2">
                Browse Content
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
