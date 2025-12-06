import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { ContentFormDialog } from '@/components/admin/ContentFormDialog';
import { ResourceTable } from '@/components/admin/ResourceTable';

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

const typeLabels: Record<string, string> = {
  vvimp: 'VVIMP',
  notes: 'Notes',
  imp_questions: 'IMP Questions',
  pyq: 'PYQ',
  lab_manuals: 'Lab Manuals',
  model_answers: 'Model Answers',
  microproject: 'Microprojects',
  capstone: 'Capstone Projects',
  custom_build: 'Custom Build Requests',
};

export function AdminContent() {
  const { type } = useParams<{ type: string }>();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterPublished, setFilterPublished] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // Normalize type from URL to database type
  const contentType = type === 'microprojects' ? 'microproject' : type || 'notes';
  const pageTitle = typeLabels[contentType] || 'Content';

  useEffect(() => {
    fetchData();
  }, [contentType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contentRes, deptRes] = await Promise.all([
        supabase
          .from('content_items')
          .select(
            `
            id, title, type, price, is_published, created_at,
            departments:department_id(name),
            semesters:semester_id(name)
          `,
          )
          .eq('type', contentType)
          .order('created_at', { ascending: false }),
        supabase.from('departments').select('id, name'),
      ]);

      setContent((contentRes.data as any) || []);
      setDepartments(deptRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item? This will also delete associated images.')) return;

    try {
      // 1. Fetch item to get images for cleanup (Cascading Delete)
      const { data: item } = await supabase
        .from('content_items')
        .select('preview_images')
        .eq('id', id)
        .single();

      // 2. Delete images from storage if they exist
      if (item?.preview_images && item.preview_images.length > 0) {
        const filesToDelete = item.preview_images
          .map((url: string) => {
            // Extract path from URL: .../project_images/filename.ext
            const parts = url.split('/project_images/');
            return parts.length > 1 ? parts[1] : null;
          })
          .filter((path: string | null) => path !== null) as string[];

        if (filesToDelete.length > 0) {
          const { error: storageError } = await supabase.storage.from('project_images').remove(filesToDelete);
          if (storageError) console.error('Failed to delete images from storage:', storageError);
        }
      }

      // 3. Delete the database record
      const { error } = await supabase.from('content_items').delete().eq('id', id);
      
      if (error) throw error;

      toast.success('Deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    }
  };

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'all' || item.departments?.name === filterDept;
    const matchesPublished =
      filterPublished === 'all' ||
      (filterPublished === 'published' ? item.is_published : !item.is_published);
    return matchesSearch && matchesDept && matchesPublished;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
        <Button
          onClick={() => {
            setEditingItem(null);
            setDialogOpen(true);
          }}
        >
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
                  <SelectItem key={d.id} value={d.name}>
                    {d.name}
                  </SelectItem>
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
          <ResourceTable
            data={filteredContent}
            loading={loading}
            onEdit={(item) => {
              setEditingItem(item);
              setDialogOpen(true);
            }}
            onDelete={handleDelete}
          />
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
