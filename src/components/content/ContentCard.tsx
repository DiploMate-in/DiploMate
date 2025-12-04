import { Link } from 'react-router-dom';
import { Heart, Star, FileText, Code, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentItem } from '@/types';
import { departments } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  item: ContentItem;
  className?: string;
  departmentCode?: string;
}

const typeIcons = {
  notes: FileText,
  microproject: Code,
  capstone: Folder,
};

const typeLabels = {
  notes: 'Notes',
  microproject: 'Microproject',
  capstone: 'Capstone',
};

export function ContentCard({ item, className, departmentCode }: ContentCardProps) {
  const { isInWishlist, toggleWishlist, isAuthenticated, getPurchasedItem } = useApp();
  // Fallback to mock data if departmentCode is not provided (for backward compatibility or if not fetched yet)
  const department = departments.find(d => d.id === item.departmentId);
  const displayCode = departmentCode || department?.code;
  
  const Icon = typeIcons[item.type];
  const isPurchased = !!getPurchasedItem(item.id);
  const inWishlist = isInWishlist(item.id);

  const isGoogleDoc = (url: string) => {
    return url && (url.includes('docs.google.com') || url.includes('drive.google.com'));
  };

  return (
    <div className={cn("group bg-card rounded-xl border overflow-hidden card-interactive", className)}>
      {/* Image */}
      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
        {isGoogleDoc(item.previewImages[0]) ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
        ) : (
          <img
            src={item.previewImages[0]}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={item.type as any} className="text-xs">
            <Icon className="h-3 w-3 mr-1" />
            {typeLabels[item.type]}
          </Badge>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (isAuthenticated) toggleWishlist(item.id);
          }}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
            inWishlist
              ? "bg-accent text-accent-foreground"
              : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-accent"
          )}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
        </button>

        {/* Discount Badge */}
        {item.originalPrice && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="destructive" className="text-xs font-bold">
              {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Department & Rating */}
        <div className="flex items-center justify-between mb-2">
          <Badge 
            variant={item.departmentId as any} 
            className="text-xs"
          >
            {displayCode}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{item.rating}</span>
            <span>({item.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">₹{item.price}</span>
            {item.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{item.originalPrice}</span>
            )}
          </div>
          
          <Link to={`/content/${item.id}`}>
            <Button size="sm" variant={isPurchased ? "secondary" : "default"}>
              {isPurchased ? "View" : "Preview"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
