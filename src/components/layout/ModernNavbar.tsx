import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, BookOpen, Code, Wrench, Building2, Lightbulb, Trophy, Zap, User, HelpCircle, MessageCircle, Brain, Monitor, Cog, LogOut, Home } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function ModernNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
  const [isDepartmentsDropdownOpen, setIsDepartmentsDropdownOpen] = useState(false);
  
  // Mobile Dropdown States
  const [mobileProjectsExpanded, setMobileProjectsExpanded] = useState(false);
  const [mobileDepartmentsExpanded, setMobileDepartmentsExpanded] = useState(false);
  
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
    setMobileProjectsExpanded(false);
    setMobileDepartmentsExpanded(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 md:py-4 glass bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-50">
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

        {/* Desktop Navigation - Centered (> 768px) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 transform -translate-x-1/2">
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

        {/* Right Section (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
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

        {/* Mobile Menu Button (< 768px) */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ color: '#2F6FED' }}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 overflow-y-auto animate-slide-down h-[100dvh]">
          <div className="pt-24 px-5 pb-6 flex flex-col gap-2">
            
            {/* Home Link */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50"
            >
              <Home className="w-5 h-5 text-gray-500" />
              <span className="text-base font-semibold text-gray-800">Home</span>
            </Link>

            {/* Projects Section */}
            <div className="rounded-xl overflow-hidden">
              <button
                onClick={() => setMobileProjectsExpanded(!mobileProjectsExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50"
                style={{
                  background: mobileProjectsExpanded ? '#F8FAFF' : 'transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  <span className="text-base font-semibold text-gray-800">Projects</span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${mobileProjectsExpanded ? 'rotate-180' : ''}`}
                />
              </button>
              
              {mobileProjectsExpanded && (
                <div className="bg-gray-50/50 px-4 py-2 space-y-1">
                  <Link to="/microprojects" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Microprojects
                  </Link>
                  <Link to="/capstone-projects" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Capstone Projects
                  </Link>
                  <Link to="/custom-build" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-blue-600 font-medium hover:bg-white hover:shadow-sm transition-all">
                    <Zap className="w-4 h-4 fill-blue-600" />
                    Custom Build Request
                  </Link>
                </div>
              )}
            </div>

            {/* Departments Section */}
            <div className="rounded-xl overflow-hidden">
              <button
                onClick={() => setMobileDepartmentsExpanded(!mobileDepartmentsExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50"
                style={{
                  background: mobileDepartmentsExpanded ? '#F8FAFF' : 'transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-base font-semibold text-gray-800">Departments</span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${mobileDepartmentsExpanded ? 'rotate-180' : ''}`}
                />
              </button>
              
              {mobileDepartmentsExpanded && (
                <div className="bg-gray-50/50 px-4 py-2 space-y-1">
                  {departments.map((dept) => {
                    const Icon = dept.icon;
                    return (
                      <Link
                        key={dept.id}
                        to={`/department/${dept.id}`}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all"
                      >
                        <Icon style={{ width: '16px', height: '16px', color: dept.color }} />
                        {dept.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Support & FAQs */}
            <Link
              to="/support"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50"
            >
              <MessageCircle className="w-5 h-5 text-red-500" />
              <span className="text-base font-semibold text-gray-800">Support</span>
            </Link>

            <Link
              to="/faqs"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50"
            >
              <HelpCircle className="w-5 h-5 text-green-500" />
              <span className="text-base font-semibold text-gray-800">FAQs</span>
            </Link>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-2" />

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="space-y-3 pt-2">
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl font-semibold gradient-primary text-white shadow-lg shadow-blue-500/20"
                >
                  <User className="w-5 h-5" />
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { logout(); closeMobileMenu(); }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl font-semibold border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl font-semibold gradient-primary text-white shadow-lg shadow-blue-500/20"
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
