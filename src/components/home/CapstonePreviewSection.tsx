import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CapstonePreviewSection() {
  const capstoneProjects = [
    {
      id: '1',
      title: 'AI-Based Smart Attendance System',
      description: 'Full final-year capstone with code, documentation, and report.',
      department: 'AIML',
      image: 'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?w=600&q=80',
      color: '#2F6FED',
    },
    {
      id: '2',
      title: 'IoT Plant Monitoring & Automation',
      description: 'Complete IoT solution with hardware integration and mobile app.',
      department: 'CO',
      image: 'https://images.unsplash.com/photo-1605387132052-357a341cc515?w=600&q=80',
      color: '#35C2A0',
    },
    {
      id: '3',
      title: 'Object Detection Using YOLOv7',
      description: 'Advanced computer vision project with real-time detection capabilities.',
      department: 'AIML',
      image: 'https://images.unsplash.com/photo-1569693799105-4eb645d89aea?w=600&q=80',
      color: '#2F6FED',
    },
  ];

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
          {capstoneProjects.map((project, idx) => (
            <div
              key={project.id}
              className="group rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 card-shadow card-shadow-hover animate-slide-up"
              style={{
                background: 'white',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                animationDelay: `${idx * 100}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {/* Thumbnail Image */}
              <div className="overflow-hidden h-48 relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
                />

                {/* Badge */}
                <div
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold tracking-wide"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: project.color,
                    border: `1.5px solid ${project.color}30`,
                  }}
                >
                  CAPSTONE
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3
                  className="mb-3 transition-colors duration-200 group-hover:text-[#2F6FED] text-xl font-semibold leading-tight"
                  style={{ color: '#1B1B1B' }}
                >
                  {project.title}
                </h3>

                <p className="mb-5 text-sm" style={{ color: '#4A4A4A', lineHeight: 1.6 }}>
                  {project.description}
                </p>

                {/* Bottom Section */}
                <div
                  className="flex items-center justify-between pt-4 border-t"
                  style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}
                >
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      color: project.color,
                      border: `1.5px solid ${project.color}40`,
                    }}
                  >
                    {project.department}
                  </span>

                  <Link
                    to={`/content/${project.id}`}
                    className="px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-[#E9F0FF] text-sm"
                    style={{ color: '#2F6FED', border: '1.5px solid #2F6FED' }}
                  >
                    View Project
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            to="/projects/capstone"
            className="inline-block px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 mb-4 text-white btn-shadow-primary"
            style={{ background: '#2F6FED' }}
          >
            View All Capstone Projects
          </Link>
          <div>
            <Link
              to="/browse?type=capstone"
              className="group inline-flex items-center gap-2 transition-all duration-200 text-sm"
              style={{ color: '#2F6FED' }}
            >
              <span className="group-hover:underline">Browse department-wise capstone ideas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
