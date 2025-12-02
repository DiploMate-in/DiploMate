import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number;
  used_count: number;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
}

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 10,
    max_uses: 100,
    valid_from: '',
    valid_to: '',
    is_active: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setCoupons(data || []);
    setLoading(false);
  };

  const openDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setForm({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        max_uses: coupon.max_uses,
        valid_from: coupon.valid_from.split('T')[0],
        valid_to: coupon.valid_to.split('T')[0],
        is_active: coupon.is_active,
      });
    } else {
      setEditingCoupon(null);
      setForm({
        code: '',
        discount_type: 'percentage',
        discount_value: 10,
        max_uses: 100,
        valid_from: '',
        valid_to: '',
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      max_uses: form.max_uses,
      valid_from: new Date(form.valid_from).toISOString(),
      valid_to: new Date(form.valid_to).toISOString(),
      is_active: form.is_active,
    };

    try {
      if (editingCoupon) {
        const { error } = await supabase.from('coupons').update(data).eq('id', editingCoupon.id);
        if (error) throw error;
        toast.success('Coupon updated');
      } else {
        const { error } = await supabase.from('coupons').insert(data);
        if (error) throw error;
        toast.success('Coupon created');
      }
      setDialogOpen(false);
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Deleted');
      fetchCoupons();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase.from('coupons').update({ is_active: isActive }).eq('id', id);
    if (!error) fetchCoupons();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Coupons</h1>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-600">Code</th>
                  <th className="text-left p-4 font-medium text-slate-600">Discount</th>
                  <th className="text-left p-4 font-medium text-slate-600">Usage</th>
                  <th className="text-left p-4 font-medium text-slate-600">Valid Period</th>
                  <th className="text-left p-4 font-medium text-slate-600">Active</th>
                  <th className="text-right p-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading...</td></tr>
                ) : coupons.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">No coupons yet</td></tr>
                ) : (
                  coupons.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-mono font-medium text-slate-900">{c.code}</td>
                      <td className="p-4 text-slate-600">
                        {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                      </td>
                      <td className="p-4 text-slate-600">{c.used_count} / {c.max_uses}</td>
                      <td className="p-4 text-slate-600 text-sm">
                        {format(new Date(c.valid_from), 'MMM d')} - {format(new Date(c.valid_to), 'MMM d, yyyy')}
                      </td>
                      <td className="p-4">
                        <Switch checked={c.is_active} onCheckedChange={(v) => toggleActive(c.id, v)} />
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openDialog(c)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(c.id)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit' : 'Create'} Coupon</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SAVE20"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select value={form.discount_type} onValueChange={(v) => setForm({ ...form, discount_type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="flat">Flat Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  value={form.discount_value}
                  onChange={(e) => setForm({ ...form, discount_value: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Max Uses</Label>
              <Input
                type="number"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valid From</Label>
                <Input
                  type="date"
                  value={form.valid_from}
                  onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Valid To</Label>
                <Input
                  type="date"
                  value={form.valid_to}
                  onChange={(e) => setForm({ ...form, valid_to: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
