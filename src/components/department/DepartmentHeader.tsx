import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DepartmentHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string; // Hex code or Tailwind class
  className?: string;
}

export function DepartmentHeader({ 
  title, 
  description, 
  icon: Icon, 
  color,
  className 
}: DepartmentHeaderProps) {
  // Determine if color is a hex code or tailwind class
  const isHex = color.startsWith('#');
  const style = isHex ? { backgroundColor: color } : undefined;
  const bgClass = !isHex ? color : '';

  return (
    <div 
      className={cn(
        "w-full py-16 md:py-24 text-white transition-colors duration-500", 
        bgClass,
        className
      )}
      style={style}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Icon className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{title}</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
