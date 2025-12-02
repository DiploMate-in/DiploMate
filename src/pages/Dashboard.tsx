import { Link, useNavigate } from 'react-router-dom';
import { Download, Eye, Clock, FileText, ArrowRight, Package, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { contentItems, departments } from '@/data/mockData';
import { toast } from 'sonner';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, purchases, wishlist } = useApp();

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
              <Button variant="outline" size="lg">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const purchasedItems = purchases.map(p => ({
    ...p,
    content: contentItems.find(c => c.id === p.contentItemId)!,
  })).filter(p => p.content);

  const handleDownload = (itemId: string) => {
    toast.success('Starting secure download with watermark...');
    // In production, this would trigger actual watermarked download
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Hey {user?.name}! 👋
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
            <div className="text-2xl font-bold">{purchases.reduce((acc, p) => acc + (p.downloadsRemaining || 0), 0)}</div>
            <div className="text-sm text-muted-foreground">Downloads Left</div>
          </div>
          <div className="bg-card rounded-xl p-4 border">
            <div className="text-2xl font-bold">₹{purchases.reduce((acc, p) => acc + p.price, 0)}</div>
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

          {purchasedItems.length > 0 ? (
            <div className="space-y-4">
              {purchasedItems.map(({ content, ...purchase }) => {
                const department = departments.find(d => d.id === content.departmentId);
                
                return (
                  <div key={purchase.id} className="bg-card rounded-xl border overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-48 h-32 sm:h-auto bg-secondary flex-shrink-0">
                        <img
                          src={content.previewImages[0]}
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant={content.departmentId as any}>{department?.code}</Badge>
                          <Badge variant={content.type as any} className="capitalize">{content.type}</Badge>
                        </div>

                        <h3 className="font-semibold text-foreground mb-1">{content.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{content.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Purchased {new Date(purchase.purchasedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{content.format} • {content.fileSize}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Button 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleDownload(content.id)}
                          >
                            <Download className="h-4 w-4" />
                            Download ({purchase.downloadsRemaining} left)
                          </Button>
                          <Link to={`/content/${content.id}`}>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
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
          <Link to="/wishlist" className="bg-card rounded-xl border p-6 hover:border-accent transition-colors group">
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

          <Link to="/support" className="bg-card rounded-xl border p-6 hover:border-primary transition-colors group">
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
    </div>
  );
}
