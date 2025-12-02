import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Star, FileText, Download, Shield, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { contentItems, departments, semesters } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isInWishlist, toggleWishlist, getPurchasedItem, addPurchase } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const item = contentItems.find(i => i.id === id);

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

  const department = departments.find(d => d.id === item.departmentId);
  const semester = semesters.find(s => s.id === item.semesterId);
  const isPurchased = !!getPurchasedItem(item.id);
  const purchase = getPurchasedItem(item.id);
  const inWishlist = isInWishlist(item.id);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to purchase');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    addPurchase(item);
    setIsProcessing(false);
    toast.success('Purchase successful! You can now download.');
    navigate('/dashboard');
  };

  const handleDownload = () => {
    if (!isPurchased) return;
    toast.success('Starting download...');
    // In production, this would trigger actual watermarked download
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === item.previewImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? item.previewImages.length - 1 : prev - 1
    );
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
              <img
                src={item.previewImages[currentImageIndex]}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              {item.previewImages.length > 1 && (
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
              {item.previewImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-sm">
                  {currentImageIndex + 1} / {item.previewImages.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {item.previewImages.length > 1 && (
              <div className="flex gap-2">
                {item.previewImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                      currentImageIndex === idx ? "border-primary" : "border-transparent"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={item.departmentId as any}>{department?.code}</Badge>
              <Badge variant="secondary">{semester?.name}</Badge>
              <Badge variant={item.type as any} className="capitalize">{item.type}</Badge>
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
                      i < Math.floor(item.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted"
                    )}
                  />
                ))}
                <span className="ml-2 font-medium">{item.rating}</span>
              </div>
              <span className="text-muted-foreground">({item.reviewCount} reviews)</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{item.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-secondary rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* File Info */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Format:</span>
                <span className="font-medium">{item.format}</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">{item.fileSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Downloads:</span>
                <span className="font-medium">{item.downloadsAllowed} allowed</span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="bg-secondary/50 rounded-2xl p-6 space-y-4">
              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">₹{item.price}</span>
                {item.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₹{item.originalPrice}</span>
                    <Badge variant="destructive" className="font-bold">
                      {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isPurchased ? (
                  <Button size="lg" className="flex-1 gap-2" onClick={handleDownload}>
                    <Download className="h-5 w-5" />
                    Download ({purchase?.downloadsRemaining} left)
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="flex-1 gap-2"
                    onClick={handleBuyNow}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Buy Now'}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => isAuthenticated ? toggleWishlist(item.id) : navigate('/login')}
                  className={cn(inWishlist && "text-accent border-accent")}
                >
                  <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                </Button>
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
                  <span>{item.downloadsAllowed} secure downloads</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
