import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, Folder, CheckCircle, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentCard } from '@/components/content/ContentCard';
import { DepartmentCard } from '@/components/content/DepartmentCard';
import { departments, contentItems } from '@/data/mockData';

export function Home() {
  const featuredItems = contentItems.filter(item => item.featured).slice(0, 4);
  const popularNotes = contentItems.filter(item => item.type === 'notes').slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-surface">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <Badge variant="primary" className="mb-6 text-sm py-1.5 px-4">
              🎓 Made for Diploma Students
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Your Diploma{' '}
              <span className="gradient-text">Study Mate</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Access premium notes, microprojects, and capstone projects for AIML, Computer, Mechanical, and Civil engineering students.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/browse">
                <Button size="lg" className="gap-2 min-w-[180px]">
                  Browse Content
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/browse?type=notes">
                <Button variant="outline" size="lg" className="gap-2 min-w-[180px]">
                  <BookOpen className="h-4 w-4" />
                  View Notes
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>Verified Content</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-accent" />
                <span>Instant Download</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
      </section>

      {/* Departments Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Browse by Department</h2>
              <p className="text-muted-foreground">Find content specific to your engineering branch</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>
      </section>

      {/* Content Types Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">What We Offer</h2>
            <p className="text-muted-foreground">Everything you need for your diploma journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Notes */}
            <Link to="/browse?type=notes" className="group">
              <div className="bg-card rounded-2xl p-6 border card-interactive h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Study Notes</h3>
                <p className="text-muted-foreground mb-4">Comprehensive, well-organized notes covering all subjects and topics.</p>
                <div className="flex items-center gap-1 text-primary text-sm font-medium">
                  Browse Notes
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Microprojects */}
            <Link to="/browse?type=microproject" className="group">
              <div className="bg-card rounded-2xl p-6 border card-interactive h-full">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Microprojects</h3>
                <p className="text-muted-foreground mb-4">Ready-to-submit microprojects with code, documentation, and presentations.</p>
                <div className="flex items-center gap-1 text-accent text-sm font-medium">
                  Browse Projects
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Capstone */}
            <Link to="/browse?type=capstone" className="group">
              <div className="bg-card rounded-2xl p-6 border card-interactive h-full">
                <div className="w-14 h-14 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Folder className="h-7 w-7 text-[#8B5CF6]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Capstone Projects</h3>
                <p className="text-muted-foreground mb-4">Complete final-year projects with source code, reports, and all documentation.</p>
                <div className="flex items-center gap-1 text-[#8B5CF6] text-sm font-medium">
                  Browse Capstone
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Featured Content</h2>
              <p className="text-muted-foreground">Handpicked resources to boost your academics</p>
            </div>
            <Link to="/browse" className="hidden md:block">
              <Button variant="ghost" className="gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/browse">
              <Button variant="outline" className="gap-1">
                View All Content
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Notes */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Popular Notes</h2>
              <p className="text-muted-foreground">Top-rated study materials by students</p>
            </div>
            <Link to="/browse?type=notes" className="hidden md:block">
              <Button variant="ghost" className="gap-1">
                View All Notes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularNotes.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to ace your exams?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of diploma students who trust DiploMate for quality study materials.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-secondary/50 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">D</span>
                </div>
                <span className="font-bold text-xl">DiploMate</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted companion for diploma studies.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Content</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/browse?type=notes" className="hover:text-foreground">Notes</Link></li>
                <li><Link to="/browse?type=microproject" className="hover:text-foreground">Microprojects</Link></li>
                <li><Link to="/browse?type=capstone" className="hover:text-foreground">Capstone</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/support" className="hover:text-foreground">Help Center</Link></li>
                <li><Link to="/support/faq" className="hover:text-foreground">FAQs</Link></li>
                <li><Link to="/support/contact" className="hover:text-foreground">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link to="/refund" className="hover:text-foreground">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} DiploMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
