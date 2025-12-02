import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ContentFormDialog } from '@/components/admin/ContentFormDialog';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  price: number;
  is_published: boolean;
  created_at: string;
  departments: { name: string } | null;
  semesters: { name: string } | null;
}

interface Department {
  id: string;
  name: string;
}

export function AdminContent() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterPublished, setFilterPublished] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  const contentType = type === 'microprojects' ? 'microproject' : type === 'capstone' ? 'capstone' : 'notes';
  const pageTitle = type === 'microprojects' ? 'Microprojects' : type === 'capstone' ? 'Capstone Projects' : 'Notes';

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contentRes, deptRes] = await Promise.all([
        supabase
          .from('content_items')
          .select(`
            id, title, type, price, is_published, created_at,
            departments:department_id(name),
            semesters:semester_id(name)
          `)
          .eq('type', contentType)
          .order('created_at', { ascending: false }),
        supabase.from('departments').select('id, name'),
      ]);

      setContent(contentRes.data as any || []);
      setDepartments(deptRes.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from('content_items').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Deleted successfully');
      fetchData();
    }
  };

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'all' || item.departments?.name === filterDept;
    const matchesPublished = filterPublished === 'all' || 
      (filterPublished === 'published' ? item.is_published : !item.is_published);
    return matchesSearch && matchesDept && matchesPublished;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
        <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPublished} onValueChange={setFilterPublished}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-600">Title</th>
                  <th className="text-left p-4 font-medium text-slate-600">Department</th>
                  <th className="text-left p-4 font-medium text-slate-600">Semester</th>
                  <th className="text-left p-4 font-medium text-slate-600">Price</th>
                  <th className="text-left p-4 font-medium text-slate-600">Status</th>
                  <th className="text-left p-4 font-medium text-slate-600">Created</th>
                  <th className="text-right p-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">Loading...</td></tr>
                ) : filteredContent.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">No content found</td></tr>
                ) : (
                  filteredContent.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-900">{item.title}</td>
                      <td className="p-4 text-slate-600">{item.departments?.name || '-'}</td>
                      <td className="p-4 text-slate-600">{item.semesters?.name || '-'}</td>
                      <td className="p-4 text-slate-600">₹{item.price}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">{format(new Date(item.created_at), 'MMM d, yyyy')}</td>
                      <td className="p-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => { setEditingItem(item); setDialogOpen(true); }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ContentFormDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        contentType={contentType}
        editingItem={editingItem}
        onSuccess={fetchData}
      />
    </div>
  );
}
