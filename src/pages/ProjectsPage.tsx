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
import { Search, Star, Download, Sparkles, FolderKanban, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string | null;
  price: number;
  rating: number | null;
  review_count: number | null;
  tags: string[] | null;
  preview_images: string[] | null;
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
            id, title, description, price, rating, review_count, tags, preview_images,
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
                  href="https://wa.me/918830217352?text=Hello%20DiploMate%20team%2C%20I%20need%20a%20custom%20project"
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
            {filteredProjects.map((project, index) => {
              // Helper to check if url is a google doc
              const isGoogleDoc = (url: string) => {
                return url.includes('docs.google.com') || url.includes('drive.google.com');
              };

              // Fallback images if no preview_image is available
              const fallbackImages = [
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', // Coding
                'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // Hardware
                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', // Cyber
                'https://images.unsplash.com/photo-1531297461136-821960712637?w=800&q=80', // AI
                'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80', // Robot
              ];
              
              // Find the first valid image that is NOT a google doc
              const validPreviewImage = project.preview_images?.find(img => !isGoogleDoc(img));

              const displayImage = validPreviewImage || fallbackImages[index % fallbackImages.length];

              return (
                <div
                  key={project.id}
                  className="group relative bg-white dark:bg-card rounded-2xl overflow-hidden card-shadow card-shadow-hover transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-border/50"
                >
                  {/* Image Header */}
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={displayImage} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay for text readability if needed, or just style */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    {/* Floating Badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-white/95 text-foreground backdrop-blur-md shadow-sm border-0 hover:bg-white px-3 py-1.5">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500 fill-amber-500" /> 
                        <span className="font-bold tracking-wide text-xs">PREMIUM</span>
                      </Badge>
                    </div>
                    
                    {/* Department Badge on Image */}
                    {project.departments && (
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-foreground border-0 shadow-sm">
                          {project.departments.name}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mb-3">
                      {project.rating ? (
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-sm font-bold">{project.rating}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                          <Star className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">New</span>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground">• {Math.floor(Math.random() * 50) + 10} sold</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                      {project.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Features List */}
                    <div className="mt-auto space-y-2.5 mb-6 pt-4 border-t border-border/40">
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="truncate">Complete Documentation & Report</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="truncate">Source Code & PPT Included</span>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Price</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-foreground">₹{project.price}</p>
                          {project.price > 500 && (
                            <p className="text-sm text-muted-foreground line-through decoration-red-500/50">
                              ₹{Math.round(project.price * 1.4)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Link to={`/content/${project.id}`} className="flex-1 max-w-[140px]">
                        <Button className="w-full rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-primary hover:bg-primary/90 h-11">
                          Buy Now <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
