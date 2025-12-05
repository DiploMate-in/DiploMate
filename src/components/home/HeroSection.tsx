import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-6 min-h-screen flex items-center gradient-bg relative overflow-hidden">
      {/* Decorative animated background blobs - purely visual */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <svg className="absolute left-1/2 -translate-x-1/2 top-10 opacity-60 hero-blob" width="1100" height="600" viewBox="0 0 1100 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#2F6FED" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#35C2A0" stopOpacity="0.95" />
            </linearGradient>
            <filter id="blur1" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="60" />
            </filter>
          </defs>
          <g filter="url(#blur1)">
            <path d="M200 100C320 30 480 10 600 80C720 150 880 170 940 260C1000 350 860 480 720 520C580 560 360 520 220 460C80 400 80 170 200 100Z" fill="url(#g1)" />
          </g>
        </svg>

        <svg className="absolute -left-24 bottom-0 opacity-30 hero-blob-2" width="700" height="500" viewBox="0 0 700 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0%" stopColor="#FFD166" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF7A90" stopOpacity="0.9" />
            </linearGradient>
            <filter id="blur2" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="50" />
            </filter>
          </defs>
          <g filter="url(#blur2)">
            <path d="M50 200C90 120 180 80 280 100C380 120 480 140 560 200C640 260 600 360 520 420C440 480 260 460 160 420C60 380 10 300 50 200Z" fill="url(#g2)" />
          </g>
        </svg>
      </div>

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

          {/* CTA Buttons - removed "Browse Notes" per request */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
