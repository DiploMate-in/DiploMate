import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  department: string;
  image: string;
  color: string;
}

export function CapstonePreviewSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('content_items')
          .select(`
            id,
            title,
            description,
            preview_images,
            departments (
              name
            )
          `)
          .eq('type', 'capstone')
          .eq('is_published', true)
          .limit(3)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const mappedProjects = data.map((item: any) => {
            // Determine color based on department (simple mapping)
            const deptName = item.departments?.name || 'General';
            let color = '#2F6FED'; // Default Blue
            if (['CO', 'Computer', 'IT'].some(d => deptName.includes(d))) color = '#35C2A0'; // Green
            
            // Get first image or fallback
            let image = 'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?w=600&q=80';
            if (item.preview_images && item.preview_images.length > 0) {
               image = item.preview_images[0];
            }

            return {
              id: item.id,
              title: item.title,
              description: item.description || 'No description available.',
              department: deptName,
              image: image,
              color: color
            };
          });
          setProjects(mappedProjects);
        }
      } catch (error) {
        console.error('Error fetching capstone projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 bg-white">
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null; // Don't show section if no projects
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-14">
          <h2
            className="mb-3 text-3xl font-semibold"
            style={{ color: '#1B1B1B', letterSpacing: '-0.01em' }}
          >
            Capstone Projects Preview
          </h2>
          <p style={{ fontSize: '16px', color: '#4A4A4A' }}>
            Explore professionally-built final year projects with documentation, code, and reports.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, idx) => (
            <Link
              to={`/content/${project.id}`}
              key={project.id}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              style={{
                animationDelay: `${idx * 100}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {/* Thumbnail Image */}
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge */}
                <div
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-md bg-white/90"
                  style={{ color: project.color }}
                >
                  Capstone
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-col flex-1 p-5">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-50 text-slate-600"
                  >
                    {project.department}
                  </span>

                  <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            to="/projects/capstone"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            View All Capstone Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
