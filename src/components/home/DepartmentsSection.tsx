import { Link } from 'react-router-dom';
import { Brain, Monitor, Cog, Building2 } from 'lucide-react';

export function DepartmentsSection() {
  const departments = [
    {
      id: 'aiml',
      icon: Brain,
      title: 'AIML',
      subtitle: 'Artificial Intelligence & Machine Learning',
      color: '#2F6FED',
    },
    {
      id: 'computer',
      icon: Monitor,
      title: 'Computer Engineering',
      subtitle: 'Computer Engineering',
      color: '#2F6FED',
    },
    {
      id: 'mechanical',
      icon: Cog,
      title: 'Mechanical Engineering',
      subtitle: 'Mechanical Engineering',
      color: '#35C2A0',
    },
    {
      id: 'civil',
      icon: Building2,
      title: 'Civil Engineering',
      subtitle: 'Civil Engineering',
      color: '#35C2A0',
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2
          className="text-center mb-12 text-3xl font-semibold"
          style={{ color: '#1B1B1B', letterSpacing: '-0.01em' }}
        >
          Select Your Department
        </h2>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, idx) => (
            <Link
              key={dept.id}
              to={`/department/${dept.id}`}
              className="group block rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 animate-slide-up"
              style={{
                background: '#F8FAFF',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                animationDelay: `${idx * 100}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-200 group-hover:scale-105"
                style={{ background: `${dept.color}15` }}
              >
                <dept.icon
                  style={{
                    width: '32px',
                    height: '32px',
                    color: dept.color,
                    strokeWidth: '2px',
                  }}
                />
              </div>

              {/* Title */}
              <h3
                className="text-center mb-2 transition-colors duration-200 group-hover:text-[#2F6FED] text-lg font-semibold"
                style={{ color: '#1B1B1B' }}
              >
                {dept.title}
              </h3>

              {/* Subtitle */}
              <p className="text-center text-sm" style={{ color: '#4A4A4A', lineHeight: 1.5 }}>
                {dept.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
