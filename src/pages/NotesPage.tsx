import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Star, FileText, BookOpen } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  rating: number | null;
  tags: string[] | null;
  departments: { name: string; code: string } | null;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

export function NotesPage() {
  const [notes, setNotes] = useState<ContentItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const [notesRes, deptRes] = await Promise.all([
        supabase
          .from('content_items')
          .select(`
            id, title, description, price, rating, tags,
            departments:department_id(name, code)
          `)
          .eq('type', 'notes')
          .eq('is_published', true)
          .order('created_at', { ascending: false }),
        supabase.from('departments').select('id, name, code').eq('is_active', true)
      ]);

      setNotes(notesRes.data as any[] || []);
      setDepartments(deptRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredNotes = notes.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'all' || item.departments?.code?.toLowerCase() === filterDept.toLowerCase();
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Study Notes</h1>
          </div>
          <p className="text-muted-foreground">Premium notes for all diploma engineering departments</p>
          <p className="text-sm text-primary mt-1">{filteredNotes.length} Notes Available</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
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
                  <SelectItem key={d.id} value={d.code.toLowerCase()}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notes found.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for new notes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((item) => (
              <div 
                key={item.id}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">NOTES</Badge>
                  {item.rating && item.rating > 0 && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{item.title}</h3>
                
                {item.departments && (
                  <p className="text-sm text-primary mb-3">{item.departments.name}</p>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-lg font-bold text-foreground">₹{item.price}</span>
                  <Link to={`/content/${item.id}`}>
                    <Button size="sm">View Details</Button>
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