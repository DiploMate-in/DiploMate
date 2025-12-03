import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaterialCardProps {
  type: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColorClass: string; // e.g. "text-amber-600"
  iconBgClass: string;    // e.g. "bg-amber-100"
  deptCode: string;
}

export function MaterialCard({
  type,
  title,
  description,
  icon: Icon,
  iconColorClass,
  iconBgClass,
  deptCode
}: MaterialCardProps) {
  return (
    <Link 
      to={`/department/${deptCode}/${type}`}
      className="group bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:border-primary/30 flex flex-col h-full"
    >
      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", iconBgClass)}>
        <Icon className={cn("w-7 h-7", iconColorClass)} />
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm mb-6 flex-grow leading-relaxed">
        {description}
      </p>
      
      <div className={cn("flex items-center font-semibold text-sm transition-all group-hover:gap-2", iconColorClass)}>
        Explore <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  );
}
