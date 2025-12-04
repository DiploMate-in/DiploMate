import { useEffect, useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Subject {
  id: string;
  name: string;
  code: string;
  scheme: string;
  is_active: boolean;
  departments: { name: string } | null;
  semesters: { name: string; number: number } | null;
}

interface Department {
  id: string;
  name: string;
}
interface Semester {
  id: string;
  name: string;
  number: number;
  department_id: string;
}

export function AdminSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Subject | null>(null);
  const [form, setForm] = useState({
    name: '',
    code: '',
    department_id: '',
    semester_id: '',
    scheme: 'K' as 'K' | 'I',
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [subjectsRes, deptRes, semRes] = await Promise.all([
      supabase
        .from('subjects')
        .select(
          `
          id, name, code, scheme, is_active,
          departments:department_id(name),
          semesters:semester_id(name, number)
        `,
        )
        .order('created_at', { ascending: false }),
      supabase.from('departments').select('id, name'),
      supabase.from('semesters').select('id, name, number, department_id'),
    ]);

    setSubjects((subjectsRes.data as any[]) || []);
    setDepartments(deptRes.data || []);
    setSemesters(semRes.data || []);
    setLoading(false);
  };

  const handleEdit = (item: Subject) => {
    setEditingItem(item);
    // We need to fetch the full subject to get department_id and semester_id
    supabase
      .from('subjects')
      .select('*')
      .eq('id', item.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            name: data.name,
            code: data.code,
            department_id: data.department_id,
            semester_id: data.semester_id,
            scheme: data.scheme as 'K' | 'I',
            is_active: data.is_active,
          });
        }
      });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setForm({
      name: '',
      code: '',
      department_id: '',
      semester_id: '',
      scheme: 'K',
      is_active: true,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: form.name,
      code: form.code.toUpperCase(),
      department_id: form.department_id,
      semester_id: form.semester_id,
      scheme: form.scheme,
      is_active: form.is_active,
    };

    try {
      if (editingItem) {
        const { error } = await supabase.from('subjects').update(data).eq('id', editingItem.id);
        if (error) throw error;
        toast.success('Subject updated');
      } else {
        const { error } = await supabase.from('subjects').insert(data);
        if (error) throw error;
        toast.success('Subject created');
      }
      fetchData();
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subject?')) return;
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else {
      toast.success('Deleted');
      fetchData();
    }
  };

  const filteredSemesters = semesters.filter((s) => s.department_id === form.department_id);

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'all' || s.departments?.name === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Subjects</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Subject
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search subjects..."
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
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-600">Code</th>
                  <th className="text-left p-4 font-medium text-slate-600">Name</th>
                  <th className="text-left p-4 font-medium text-slate-600">Department</th>
                  <th className="text-left p-4 font-medium text-slate-600">Semester</th>
                  <th className="text-left p-4 font-medium text-slate-600">Scheme</th>
                  <th className="text-left p-4 font-medium text-slate-600">Status</th>
                  <th className="text-right p-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No subjects found
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-mono text-slate-900">{item.code}</td>
                      <td className="p-4 font-medium text-slate-900">{item.name}</td>
                      <td className="p-4 text-slate-600">{item.departments?.name || '-'}</td>
                      <td className="p-4 text-slate-600">Sem {item.semesters?.number || '-'}</td>
                      <td className="p-4 text-slate-600">{item.scheme} Scheme</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Create'} Subject</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Subject Code *</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g., EM101"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Subject Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Engineering Mathematics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select
                value={form.department_id}
                onValueChange={(v) => setForm({ ...form, department_id: v, semester_id: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester *</Label>
              <Select
                value={form.semester_id}
                onValueChange={(v) => setForm({ ...form, semester_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSemesters.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      Semester {s.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scheme *</Label>
              <Select
                value={form.scheme}
                onValueChange={(v: 'K' | 'I') => setForm({ ...form, scheme: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="K">K Scheme</SelectItem>
                  <SelectItem value="I">I Scheme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
