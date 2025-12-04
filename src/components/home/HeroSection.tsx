import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-6 min-h-screen flex items-center gradient-bg">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center animate-fade-in">
          {/* Badge */}
          <div
            className="inline-block px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(47, 111, 237, 0.08)',
              border: '1px solid rgba(47, 111, 237, 0.15)',
            }}
          >
            <span className="text-sm font-semibold tracking-wide" style={{ color: '#2F6FED' }}>
              🎓 FOR DIPLOMA STUDENTS
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="mb-6 leading-tight font-bold"
            style={{
              fontSize: 'clamp(36px, 8vw, 64px)',
              color: '#1B1B1B',
              letterSpacing: '-0.025em',
              maxWidth: '900px',
              margin: '0 auto 24px',
            }}
          >
            Your Diploma <span className="gradient-text">Study Mate</span>
          </h1>

          {/* Subheadline */}
          <p
            className="mb-10 md:mb-12"
            style={{
              fontSize: 'clamp(16px, 3vw, 20px)',
              color: '#4A4A4A',
              lineHeight: 1.7,
              maxWidth: '680px',
              margin: '0 auto 48px',
              fontWeight: 400,
            }}
          >
            Access premium notes, microprojects, and capstone projects for AIML, Computer,
            Mechanical, and Civil engineering students.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/browse"
              className="w-full sm:w-auto px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-105 text-base font-semibold text-white"
              style={{
                background: '#2F6FED',
                boxShadow: '0 4px 20px rgba(47, 111, 237, 0.3)',
              }}
            >
              Browse Notes
            </Link>

            <Link
              to="/projects/capstone"
              className="w-full sm:w-auto px-8 py-4 rounded-xl transition-all duration-200 hover:bg-[#F8FAFF] hover:scale-105 text-base font-semibold"
              style={{
                background: 'white',
                color: '#2F6FED',
                border: '2px solid #2F6FED',
              }}
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
