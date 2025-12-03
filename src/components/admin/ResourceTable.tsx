import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

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

interface ResourceTableProps {
  data: ContentItem[];
  loading: boolean;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
}

export function ResourceTable({ data, loading, onEdit, onDelete }: ResourceTableProps) {
  return (
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
          ) : data.length === 0 ? (
            <tr><td colSpan={7} className="p-8 text-center text-slate-500">No content found</td></tr>
          ) : (
            data.map((item) => (
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
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
