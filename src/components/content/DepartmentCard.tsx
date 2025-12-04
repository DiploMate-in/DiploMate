import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Department } from '@/types';
import { contentItems } from '@/data/mockData';

interface DepartmentCardProps {
  department: Department;
}

export function DepartmentCard({ department }: DepartmentCardProps) {
  const itemCount = contentItems.filter((item) => item.departmentId === department.id).length;

  return (
    <Link to={`/browse?department=${department.id}`} className="group block">
      <div
        className="relative p-6 rounded-2xl border overflow-hidden card-interactive"
        style={{
          background: `linear-gradient(135deg, ${department.color}08 0%, ${department.color}15 100%)`,
          borderColor: `${department.color}20`,
        }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${department.color}15` }}
        >
          {department.icon}
        </div>

        {/* Content */}
        <h3 className="font-semibold text-foreground mb-1">{department.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{itemCount} items available</p>

        {/* Arrow */}
        <div
          className="flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2"
          style={{ color: department.color }}
        >
          Explore
          <ArrowRight className="h-4 w-4" />
        </div>

        {/* Decorative circle */}
        <div
          className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-10 transition-transform duration-300 group-hover:scale-125"
          style={{ background: department.color }}
        />
      </div>
    </Link>
  );
}
