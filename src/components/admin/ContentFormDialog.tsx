import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ContentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: string;
  editingItem: any;
  onSuccess: () => void;
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
interface Subject {
  id: string;
  name: string;
  code: string;
  department_id: string;
  semester_id: string;
  scheme: string;
}

const studyMaterialTypes = [
  'vvimp',
  'notes',
  'imp_questions',
  'pyq',
  'lab_manuals',
  'model_answers',
];
const projectTypes = ['microproject', 'capstone', 'custom_build'];

const typeLabels: Record<string, string> = {
  vvimp: 'VVIMP',
  notes: 'Notes',
  imp_questions: 'IMP Questions',
  pyq: 'PYQ',
  lab_manuals: 'Lab Manuals',
  model_answers: 'Model Answers',
  microproject: 'Microproject',
  capstone: 'Capstone',
  custom_build: 'Custom Build',
};

export function ContentFormDialog({
  open,
  onOpenChange,
  contentType,
  editingItem,
  onSuccess,
}: ContentFormDialogProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Track images for cleanup
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [sessionUploadedImages, setSessionUploadedImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: '',
    department_id: '',
    semester_id: '',
    scheme: '' as 'K' | 'I' | '',
    subject_id: '',
    subject_name: '',
    subject_code: '',
    price: 0,
    description: '',
    file_url: '',
    preview_images: '',
    tags: '',
    downloads_allowed: 3,
    is_published: true,
  });

  const isStudyMaterial = studyMaterialTypes.includes(contentType);
  const isProject = projectTypes.includes(contentType);

  useEffect(() => {
    const fetchData = async () => {
      const [deptRes, semRes, subRes] = await Promise.all([
        supabase.from('departments').select('id, name').eq('is_active', true),
        supabase.from('semesters').select('id, name, number, department_id').order('number'),
        supabase
          .from('subjects')
          .select('id, name, code, department_id, semester_id, scheme')
          .eq('is_active', true),
      ]);
      setDepartments(deptRes.data || []);
      setSemesters(semRes.data || []);
      setSubjects(subRes.data || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loadFormData = async () => {
      if (editingItem?.id) {
        // Fetch full details to avoid data loss (Blank Form Bug Fix)
        const { data, error } = await supabase
          .from('content_items')
          .select('*')
          .eq('id', editingItem.id)
          .single();

        if (data) {
          const images = data.preview_images || [];
          setOriginalImages(images);
          setSessionUploadedImages([]);
          setForm({
            title: data.title || '',
            department_id: data.department_id || '',
            semester_id: data.semester_id || '',
            scheme: (data.scheme as 'K' | 'I' | '') || '',
            subject_id: data.subject_id || '',
            subject_name: data.subject_name || '',
            subject_code: data.subject_code || '',
            price: data.price || 0,
            description: data.description || '',
            file_url: data.file_url || '',
            preview_images: data.preview_images?.join(', ') || '',
            tags: data.tags?.join(', ') || '',
            downloads_allowed: data.downloads_allowed || 3,
            is_published: data.is_published ?? true,
          });
        }
      } else {
        // Reset form for create mode
        setOriginalImages([]);
        setSessionUploadedImages([]);
        setForm({
          title: '',
          department_id: '',
          semester_id: '',
          scheme: '',
          subject_id: '',
          subject_name: '',
          subject_code: '',
          price: 0,
          description: '',
          file_url: '',
          preview_images: '',
          tags: '',
          downloads_allowed: 3,
          is_published: true,
        });
      }
    };

    if (open) {
      loadFormData();
    }
  }, [editingItem, open]);

  // Filter semesters by department
  const filteredSemesters = semesters.filter((s) => s.department_id === form.department_id);

  // Filter subjects by department, semester, and scheme
  const filteredSubjects = subjects.filter(
    (s) =>
      s.department_id === form.department_id &&
      s.semester_id === form.semester_id &&
      (form.scheme ? s.scheme === form.scheme : true),
  );

  // Validation: Check if required fields are filled
  const isFormValid = () => {
    if (!form.title.trim()) return false;
    if (!form.department_id) return false;
    if (!form.semester_id) return false;
    // Scheme is required for all study materials
    if (isStudyMaterial && !form.scheme) return false;
    return true;
  };

  const handleDepartmentChange = (value: string) => {
    setForm({
      ...form,
      department_id: value,
      semester_id: '',
      subject_id: '',
      subject_name: '',
      subject_code: '',
    });
  };

  const handleSemesterChange = (value: string) => {
    setForm({
      ...form,
      semester_id: value,
      subject_id: '',
      subject_name: '',
      subject_code: '',
    });
  };

  const handleSchemeChange = (value: 'K' | 'I') => {
    setForm({
      ...form,
      scheme: value,
      subject_id: '',
      subject_name: '',
      subject_code: '',
    });
  };

  const handleSubjectChange = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    setForm({
      ...form,
      subject_id: subjectId,
      subject_name: subject?.name || '',
      subject_code: subject?.code || '',
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploading(true);

    try {
      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('project_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get Public URL
      const { data } = supabase.storage.from('project_images').getPublicUrl(filePath);
      
      if (data) {
        const currentImages = form.preview_images
          ? form.preview_images.split(',').map(s => s.trim()).filter(Boolean)
          : [];
        
        const newImages = [...currentImages, data.publicUrl];
        
        setSessionUploadedImages(prev => [...prev, data.publicUrl]);
        setForm({
          ...form,
          preview_images: newImages.join(', '),
        });
        
        toast.success('Image uploaded successfully');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      if (error.message === 'Bucket not found') {
        toast.error('Error: "project_images" bucket missing. Please run the SQL migration.');
      } else {
        toast.error(error.message || 'Failed to upload image');
      }
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    const currentImages = form.preview_images
      ? form.preview_images.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    
    const newImages = currentImages.filter((_, index) => index !== indexToRemove);
    
    setForm({
      ...form,
      preview_images: newImages.join(', '),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    const data: any = {
      title: form.title,
      type: contentType,
      department_id: form.department_id,
      semester_id: form.semester_id,
      price: form.price,
      description: form.description,
      file_url: form.file_url || null,
      preview_images: form.preview_images
        ? form.preview_images
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      tags: form.tags
        ? form.tags
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      downloads_allowed: form.downloads_allowed,
      is_published: form.is_published,
    };

    // Add study material specific fields
    if (isStudyMaterial) {
      data.scheme = form.scheme || null;
      data.subject_id = form.subject_id || null;
      data.subject_name = form.subject_name || null;
      data.subject_code = form.subject_code || null;
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('content_items')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
        toast.success('Updated successfully');
      } else {
        const { error } = await supabase.from('content_items').insert(data);
        if (error) throw error;
        toast.success('Created successfully');
      }

      // CLEANUP LOGIC: Delete images that were removed or replaced
      const currentImages = form.preview_images
        ? form.preview_images.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const imagesToDelete = [
        ...originalImages,
        ...sessionUploadedImages,
      ].filter((img) => !currentImages.includes(img));

      // Deduplicate just in case
      const uniqueImagesToDelete = [...new Set(imagesToDelete)];

      if (uniqueImagesToDelete.length > 0) {
        const pathsToDelete = uniqueImagesToDelete
          .map((url) => {
            const parts = url.split('/project_images/');
            return parts.length > 1 ? parts[1] : null;
          })
          .filter((p) => p !== null) as string[];

        if (pathsToDelete.length > 0) {
          console.log('Cleaning up images:', pathsToDelete);
          await supabase.storage.from('project_images').remove(pathsToDelete);
        }
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
          <DialogTitle>
            {editingItem ? 'Edit' : 'Create'} {typeLabels[contentType] || contentType}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter title"
              required
            />
          </div>

          {/* Department & Semester Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select value={form.department_id} onValueChange={handleDepartmentChange}>
                <SelectTrigger className={!form.department_id ? 'text-muted-foreground' : ''}>
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
                onValueChange={handleSemesterChange}
                disabled={!form.department_id}
              >
                <SelectTrigger className={!form.semester_id ? 'text-muted-foreground' : ''}>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSemesters.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scheme & Subject Row (only for study materials) */}
          {isStudyMaterial && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Scheme *</Label>
                <Select value={form.scheme} onValueChange={handleSchemeChange}>
                  <SelectTrigger className={!form.scheme ? 'text-muted-foreground' : ''}>
                    <SelectValue placeholder="Select scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I">I-Scheme</SelectItem>
                    <SelectItem value="K">K-Scheme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  value={form.subject_id}
                  onValueChange={handleSubjectChange}
                  disabled={!form.department_id || !form.semester_id}
                >
                  <SelectTrigger className={!form.subject_id ? 'text-muted-foreground' : ''}>
                    <SelectValue placeholder="Select subject (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Price & Downloads Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₹) *</Label>
              <Input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Downloads Allowed</Label>
              <Input
                type="number"
                min="1"
                value={form.downloads_allowed}
                onChange={(e) =>
                  setForm({ ...form, downloads_allowed: parseInt(e.target.value) || 3 })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          {/* File URL */}
          <div className="space-y-2">
            <Label>File URL</Label>
            <Input
              value={form.file_url}
              onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              placeholder="https://drive.google.com/..."
            />
          </div>

          {/* Preview Images */}
          <div className="space-y-3">
            <Label>Preview Images</Label>
            
            {/* Image List */}
            {form.preview_images && (
              <div className="grid grid-cols-3 gap-4 mb-2">
                {form.preview_images.split(',').map((url, idx) => {
                  const trimmedUrl = url.trim();
                  if (!trimmedUrl) return null;
                  return (
                    <div key={idx} className="relative group aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                      <img 
                        src={trimmedUrl} 
                        alt={`Preview ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  value={form.preview_images}
                  onChange={(e) => setForm({ ...form, preview_images: e.target.value })}
                  placeholder="https://..., https://..."
                  className="text-xs font-mono"
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="secondary"
                  disabled={uploading}
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="gap-2"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload images or paste URLs. Supported formats: JPG, PNG, WEBP.
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          {/* Published Toggle */}
          <div className="flex items-center gap-2">
            <Switch
              checked={form.is_published}
              onCheckedChange={(v) => setForm({ ...form, is_published: v })}
            />
            <Label>Published</Label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isFormValid()}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
