import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ContentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: string;
  editingItem: any;
  onSuccess: () => void;
}

interface Department { id: string; name: string; }
interface Semester { id: string; name: string; number: number; department_id: string; }
interface Subject { id: string; name: string; code: string; department_id: string; semester_id: string; scheme: string; }

const studyMaterialTypes = ['vvimp', 'notes', 'imp_questions', 'pyq', 'lab_manuals', 'model_answers'];

const typeLabels: Record<string, string> = {
  vvimp: 'VVIMP', notes: 'Notes', imp_questions: 'IMP Questions', pyq: 'PYQ',
  lab_manuals: 'Lab Manuals', model_answers: 'Model Answers', microproject: 'Microproject', capstone: 'Capstone',
};

export function ContentFormDialog({ open, onOpenChange, contentType, editingItem, onSuccess }: ContentFormDialogProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department_id: '',
    semester_id: '',
    price: 0,
    description: '',
    file_url: '',
    preview_images: '',
    tags: '',
    downloads_allowed: 3,
    is_published: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [deptRes, semRes, subRes] = await Promise.all([
        supabase.from('departments').select('id, name'),
        supabase.from('semesters').select('id, name, number, department_id'),
        supabase.from('subjects').select('id, name, code, department_id, semester_id, scheme'),
      ]);
      setDepartments(deptRes.data || []);
      setSemesters(semRes.data || []);
      setSubjects(subRes.data || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title || '',
        department_id: editingItem.department_id || '',
        semester_id: editingItem.semester_id || '',
        price: editingItem.price || 0,
        description: editingItem.description || '',
        file_url: editingItem.file_url || '',
        preview_images: editingItem.preview_images?.join(', ') || '',
        tags: editingItem.tags?.join(', ') || '',
        downloads_allowed: editingItem.downloads_allowed || 3,
        is_published: editingItem.is_published ?? true,
      });
    } else {
      setForm({
        title: '',
        department_id: '',
        semester_id: '',
        price: 0,
        description: '',
        file_url: '',
        preview_images: '',
        tags: '',
        downloads_allowed: 3,
        is_published: true,
      });
    }
  }, [editingItem, open]);

  const filteredSemesters = semesters.filter(s => s.department_id === form.department_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      title: form.title,
      type: contentType,
      department_id: form.department_id,
      semester_id: form.semester_id,
      price: form.price,
      description: form.description,
      file_url: form.file_url || null,
      preview_images: form.preview_images ? form.preview_images.split(',').map(s => s.trim()) : [],
      tags: form.tags ? form.tags.split(',').map(s => s.trim()) : [],
      downloads_allowed: form.downloads_allowed,
      is_published: form.is_published,
    };

    try {
      if (editingItem) {
        const { error } = await supabase.from('content_items').update(data).eq('id', editingItem.id);
        if (error) throw error;
        toast.success('Updated successfully');
      } else {
        const { error } = await supabase.from('content_items').insert(data);
        if (error) throw error;
        toast.success('Created successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit' : 'Create'} {contentType}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select value={form.department_id} onValueChange={(v) => setForm({ ...form, department_id: v, semester_id: '' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester *</Label>
              <Select value={form.semester_id} onValueChange={(v) => setForm({ ...form, semester_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSemesters.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₹) *</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Downloads Allowed</Label>
              <Input
                type="number"
                value={form.downloads_allowed}
                onChange={(e) => setForm({ ...form, downloads_allowed: parseInt(e.target.value) || 3 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>File URL</Label>
            <Input
              value={form.file_url}
              onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Preview Images (comma-separated URLs)</Label>
            <Input
              value={form.preview_images}
              onChange={(e) => setForm({ ...form, preview_images: e.target.value })}
              placeholder="https://..., https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={form.is_published}
              onCheckedChange={(v) => setForm({ ...form, is_published: v })}
            />
            <Label>Published</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
