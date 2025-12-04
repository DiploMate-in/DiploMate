import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Download, Sparkles, FolderKanban, Wrench } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string | null;
  price: number;
  rating: number | null;
  review_count: number | null;
  tags: string[] | null;
  departments: { name: string; code: string } | null;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

const projectTypes: Record<
  string,
  { title: string; subtitle: string; icon: React.ElementType; color: string; dbType: string }
> = {
  microprojects: {
    title: 'Microprojects',
    subtitle: 'Ready-to-submit microprojects with documentation',
    icon: FolderKanban,
    color: 'text-blue-500',
    dbType: 'microproject',
  },
  capstone: {
    title: 'Capstone Projects',
    subtitle: 'Complete final year projects with documentation',
    icon: Sparkles,
    color: 'text-amber-500',
    dbType: 'capstone',
  },
  'custom-build': {
    title: 'Custom Build Request',
    subtitle: 'Get a custom project built for your requirements',
    icon: Wrench,
    color: 'text-green-500',
    dbType: 'custom_build',
  },
};

export default function ProjectsPage() {
  const { projectType: paramType } = useParams<{ projectType: string }>();
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [loading, setLoading] = useState(true);

  // Determine project type from URL path or param
  const getProjectType = (): string => {
    if (paramType) return paramType;
    // Fallback for legacy or direct access if needed, though routes should handle it
    return 'microprojects';
  };

  const projectType = getProjectType();
  const typeInfo = projectTypes[projectType] || projectTypes['microprojects'];
  const dbType = typeInfo?.dbType || 'microproject';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [projectsRes, deptRes] = await Promise.all([
        supabase
          .from('content_items')
          .select(
            `
            id, title, description, price, rating, review_count, tags,
            departments:department_id(name, code)
          `,
          )
          .eq('type', dbType)
          .eq('is_published', true)
          .order('created_at', { ascending: false }),
        supabase.from('departments').select('id, name, code').eq('is_active', true),
      ]);

      setProjects((projectsRes.data as any[]) || []);
      setDepartments(deptRes.data || []);
      setLoading(false);
    };

    if (dbType) fetchData();
  }, [dbType]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      filterDept === 'all' || p.departments?.code?.toLowerCase() === filterDept.toLowerCase();
    return matchesSearch && matchesDept;
  });

  const Icon = typeInfo?.icon || FolderKanban;

  if (projectType === 'custom-build') {
    return (
      <div className="min-h-screen bg-background">
        <ModernNavbar />

        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Custom Build Request
            </h1>
            <p className="text-muted-foreground mb-8">
              Need a custom project built specifically for your requirements? Contact us via
              WhatsApp and we'll help you out!
            </p>

            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-4">What we offer:</h2>
              <ul className="text-left space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Custom microprojects as per your syllabus
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Custom capstone projects with full documentation
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Modifications to existing projects
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Project guidance and support
                </li>
              </ul>

              <Button size="lg" className="w-full md:w-auto" asChild>
                <a
                  href="https://wa.me/919999999999?text=Hello%20DiploMate%20team%2C%20I%20need%20a%20custom%20project"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>

        <FooterSection />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />

      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Icon className={`w-8 h-8 ${typeInfo?.color}`} />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{typeInfo?.title}</h1>
          </div>
          <p className="text-muted-foreground">{typeInfo?.subtitle}</p>
          <p className="text-sm text-primary mt-1">{filteredProjects.length} Premium Projects</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${typeInfo?.title?.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.code.toLowerCase()}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find any {typeInfo?.title.toLowerCase()} matching your criteria. Try
              adjusting your filters or request a custom build.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setFilterDept('all');
                }}
              >
                Clear Filters
              </Button>
              <Link to="/projects/custom-build">
                <Button className="gap-2">
                  <Wrench className="w-4 h-4" />
                  Request Custom Build
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge className="bg-amber-500 text-white hover:bg-amber-600">PREMIUM</Badge>
                  {project.rating && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{project.rating}</span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{project.title}</h3>

                {project.departments && (
                  <p className="text-sm text-primary mb-3">{project.departments.name}</p>
                )}

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Download className="w-4 h-4" />
                    <span>{Math.floor(Math.random() * 200) + 50}</span>
                  </div>
                  <Link to={`/content/${project.id}`}>
                    <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                      ₹{project.price}
                    </Button>
                  </Link>
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
