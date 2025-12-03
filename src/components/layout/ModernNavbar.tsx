import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, BookOpen, Code, Wrench, Building2, Lightbulb, Trophy, Zap, User, HelpCircle, MessageCircle, Brain, Monitor, Cog, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function ModernNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
  const [isDepartmentsDropdownOpen, setIsDepartmentsDropdownOpen] = useState(false);
  const [mobileNotesExpanded, setMobileNotesExpanded] = useState(false);
  const [mobileProjectsExpanded, setMobileProjectsExpanded] = useState(false);
  const [mobileSupportExpanded, setMobileSupportExpanded] = useState(false);
  
  const location = useLocation();
  const { isAuthenticated, logout, user } = useApp();

  const departments = [
    { id: 'aiml', name: 'AIML', icon: Brain, color: '#2F6FED' },
    { id: 'co', name: 'Computer', icon: Monitor, color: '#35C2A0' },
    { id: 'mech', name: 'Mechanical', icon: Cog, color: '#FF6B6B' },
    { id: 'civil', name: 'Civil', icon: Building2, color: '#FFA726' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileNotesExpanded(false);
    setMobileProjectsExpanded(false);
    setMobileSupportExpanded(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 md:py-4 glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
          <img 
            src="/logo.png" 
            alt="DiploMate Logo" 
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <div style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="text-lg md:text-xl font-bold" style={{ color: '#2F6FED' }}>Diplo</span>
            <span className="text-lg md:text-xl font-bold" style={{ color: '#35C2A0' }}>Mate</span>
          </div>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          <Link
            to="/"
            className="relative py-2 transition-colors duration-200"
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: isActive('/') ? '#2F6FED' : '#4A4A4A',
            }}
          >
            Home
            {isActive('/') && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded gradient-primary" />
            )}
          </Link>

          {/* Projects Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsProjectsDropdownOpen(true)}
            onMouseLeave={() => setIsProjectsDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 py-2 transition-colors duration-200"
              style={{ fontSize: '15px', fontWeight: 500, color: '#4A4A4A' }}
            >
              Projects
              <ChevronDown 
                className="transition-transform duration-200"
                style={{ 
                  width: '16px', height: '16px',
                  transform: isProjectsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }} 
              />
            </button>

            {isProjectsDropdownOpen && (
              <div className="absolute top-full left-0 pt-2" style={{ zIndex: 1000 }}>
                <div
                  className="rounded-xl overflow-hidden animate-slide-down"
                  style={{
                    background: 'white',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    minWidth: '240px'
                  }}
                >
                  <Link
                    to="/microprojects"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFF] transition-colors duration-200 group"
                  >
                    <Lightbulb className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: '#9333EA' }} />
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#1B1B1B' }}>Microprojects</div>
                      <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Quick, semester-long projects</div>
                    </div>
                  </Link>
                  <Link
                    to="/capstone-projects"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFF] transition-colors duration-200 group"
                  >
                    <Trophy className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: '#F59E0B' }} />
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#1B1B1B' }}>Capstone Projects</div>
                      <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Final year major projects</div>
                    </div>
                  </Link>
                  <Link
                    to="/custom-build"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFF] transition-colors duration-200 group border-t"
                    style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}
                  >
                    <Zap className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: '#2F6FED', fill: '#2F6FED' }} />
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#1B1B1B' }}>Custom Build Request</div>
                      <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Tailored project solutions</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Departments Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsDepartmentsDropdownOpen(true)}
            onMouseLeave={() => setIsDepartmentsDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 py-2 transition-colors duration-200"
              style={{ fontSize: '15px', fontWeight: 500, color: '#4A4A4A' }}
            >
              Departments
              <ChevronDown 
                className="transition-transform duration-200"
                style={{ 
                  width: '16px', height: '16px',
                  transform: isDepartmentsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }} 
              />
            </button>

            {isDepartmentsDropdownOpen && (
              <div className="absolute top-full left-0 pt-2" style={{ zIndex: 1000 }}>
                <div
                  className="rounded-xl overflow-hidden animate-slide-down"
                  style={{
                    background: 'white',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    minWidth: '220px'
                  }}
                >
                  {departments.map((dept) => {
                    const Icon = dept.icon;
                    return (
                      <Link
                        key={dept.id}
                        to={`/department/${dept.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFF] transition-colors duration-200"
                        style={{ fontSize: '14px', fontWeight: 500, color: '#1B1B1B' }}
                      >
                        <Icon style={{ width: '18px', height: '18px', color: dept.color }} />
                        {dept.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/support"
            className="transition-colors duration-200"
            style={{ fontSize: '15px', fontWeight: 500, color: isActive('/support') ? '#2F6FED' : '#4A4A4A' }}
          >
            Support
          </Link>

          <Link
            to="/faqs"
            className="relative py-2 transition-colors duration-200"
            style={{ fontSize: '15px', fontWeight: 500, color: isActive('/faqs') ? '#2F6FED' : '#4A4A4A' }}
          >
            FAQs
            {isActive('/faqs') && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded gradient-primary" />
            )}
          </Link>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="p-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100"
                style={{ border: '1px solid rgba(0, 0, 0, 0.06)' }}
                title="Dashboard"
              >
                <User style={{ width: '20px', height: '20px', color: '#4A4A4A' }} />
              </Link>
              <button
                onClick={logout}
                className="p-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100"
                style={{ border: '1px solid rgba(0, 0, 0, 0.06)' }}
                title="Logout"
              >
                <LogOut style={{ width: '20px', height: '20px', color: '#4A4A4A' }} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 gradient-primary text-white text-sm font-semibold"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ color: '#2F6FED' }}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[68px] bg-white z-40 overflow-y-auto animate-slide-down">
          <div className="px-5 py-6">
            {/* Notes Section */}
            <div className="mb-2">
              <button
                onClick={() => setMobileNotesExpanded(!mobileNotesExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: mobileNotesExpanded ? '#F8FAFF' : 'transparent',
                  border: `1px solid ${mobileNotesExpanded ? 'rgba(47, 111, 237, 0.12)' : 'transparent'}`
                }}
              >
                <div className="flex items-center gap-3">
                  <BookOpen style={{ width: '20px', height: '20px', color: '#2F6FED' }} />
                  <span className="text-base font-semibold" style={{ color: '#1B1B1B' }}>Notes</span>
                </div>
                <ChevronDown 
                  className="transition-transform duration-200"
                  style={{ 
                    width: '20px', height: '20px', color: '#6B7280',
                    transform: mobileNotesExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} 
                />
              </button>
              
              {mobileNotesExpanded && (
                <div className="mt-2 ml-4 pl-6 border-l-2" style={{ borderColor: '#E8EBF0' }}>
                  {departments.map((dept) => {
                    const Icon = dept.icon;
                    return (
                      <Link
                        key={dept.id}
                        to={`/department/${dept.id}`}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors active:bg-[#F8FAFF]"
                        style={{ fontSize: '15px', fontWeight: 500, color: '#1B1B1B' }}
                      >
                        <Icon style={{ width: '18px', height: '18px', color: dept.color }} />
                        {dept.name} Notes
                      </Link>
                    );
                  })}
                  <Link
                    to="/browse"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1"
                    style={{ fontSize: '15px', fontWeight: 500, color: '#2F6FED' }}
                  >
                    <ChevronRight className="w-4 h-4" />
                    All Notes
                  </Link>
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div className="mb-2">
              <button
                onClick={() => setMobileProjectsExpanded(!mobileProjectsExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: mobileProjectsExpanded ? '#F8FAFF' : 'transparent',
                  border: `1px solid ${mobileProjectsExpanded ? 'rgba(47, 111, 237, 0.12)' : 'transparent'}`
                }}
              >
                <div className="flex items-center gap-3">
                  <Lightbulb style={{ width: '20px', height: '20px', color: '#9333EA' }} />
                  <span className="text-base font-semibold" style={{ color: '#1B1B1B' }}>Projects</span>
                </div>
                <ChevronDown 
                  className="transition-transform duration-200"
                  style={{ 
                    width: '20px', height: '20px', color: '#6B7280',
                    transform: mobileProjectsExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} 
                />
              </button>
              
              {mobileProjectsExpanded && (
                <div className="mt-2 ml-4 pl-6 border-l-2" style={{ borderColor: '#E8EBF0' }}>
                  <Link to="/microprojects" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ fontSize: '15px', fontWeight: 500, color: '#1B1B1B' }}>
                    <Lightbulb style={{ width: '18px', height: '18px', color: '#9333EA' }} />
                    Microprojects
                  </Link>
                  <Link to="/capstone-projects" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ fontSize: '15px', fontWeight: 500, color: '#1B1B1B' }}>
                    <Trophy style={{ width: '18px', height: '18px', color: '#F59E0B' }} />
                    Capstone Projects
                  </Link>
                  <Link to="/custom-build" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1" style={{ fontSize: '15px', fontWeight: 600, color: '#2F6FED' }}>
                    <Zap style={{ width: '18px', height: '18px', fill: '#2F6FED' }} />
                    Custom Build Request
                  </Link>
                </div>
              )}
            </div>

            {/* Support Section */}
            <div className="mb-2">
              <button
                onClick={() => setMobileSupportExpanded(!mobileSupportExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: mobileSupportExpanded ? '#F8FAFF' : 'transparent',
                  border: `1px solid ${mobileSupportExpanded ? 'rgba(47, 111, 237, 0.12)' : 'transparent'}`
                }}
              >
                <div className="flex items-center gap-3">
                  <MessageCircle style={{ width: '20px', height: '20px', color: '#EF4444' }} />
                  <span className="text-base font-semibold" style={{ color: '#1B1B1B' }}>Support</span>
                </div>
                <ChevronDown 
                  className="transition-transform duration-200"
                  style={{ 
                    width: '20px', height: '20px', color: '#6B7280',
                    transform: mobileSupportExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} 
                />
              </button>
              
              {mobileSupportExpanded && (
                <div className="mt-2 ml-4 pl-6 border-l-2" style={{ borderColor: '#E8EBF0' }}>
                  <Link to="/faqs" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ fontSize: '15px', fontWeight: 500, color: '#1B1B1B' }}>
                    <ChevronRight className="w-4 h-4" style={{ color: '#6B7280' }} />
                    FAQs
                  </Link>
                  <Link to="/support" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ fontSize: '15px', fontWeight: 500, color: '#1B1B1B' }}>
                    <ChevronRight className="w-4 h-4" style={{ color: '#6B7280' }} />
                    Contact Support
                  </Link>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-4" />

            {/* Login Button */}
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="block px-4 py-4 rounded-xl text-center font-semibold gradient-primary text-white"
                  style={{ boxShadow: '0 4px 16px rgba(47, 111, 237, 0.25)' }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); closeMobileMenu(); }}
                  className="w-full px-4 py-3 rounded-xl text-center font-semibold border"
                  style={{ color: '#EF4444', borderColor: '#EF4444' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block px-4 py-4 rounded-xl text-center font-semibold gradient-primary text-white"
                style={{ boxShadow: '0 4px 16px rgba(47, 111, 237, 0.25)' }}
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
