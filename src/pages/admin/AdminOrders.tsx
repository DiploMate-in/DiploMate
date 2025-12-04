import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Purchase {
  id: string;
  price: number;
  status: string;
  payment_provider: string;
  purchased_at: string;
  user_id: string;
  content_item_id: string;
  profiles: { email: string; name: string } | null;
  content_items: { title: string } | null;
}

export function AdminOrders() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('purchases')
      .select(
        `
        id, price, status, payment_provider, purchased_at, user_id, content_item_id,
        profiles:user_id(email, name),
        content_items:content_item_id(title)
      `,
      )
      .order('purchased_at', { ascending: false });

    if (error) {
      console.error('Error:', error);
    } else {
      setPurchases((data as any) || []);
    }
    setLoading(false);
  };

  const handleRefund = async (id: string) => {
    const { error } = await supabase.from('purchases').update({ status: 'refunded' }).eq('id', id);
    if (error) {
      toast.error('Failed to refund');
    } else {
      toast.success('Marked as refunded');
      fetchPurchases();
      setSelectedPurchase(null);
    }
  };

  const filteredPurchases = purchases.filter((p) => {
    const matchesSearch =
      p.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.content_items?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Orders / Purchases</h1>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by email or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
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
                  <th className="text-left p-4 font-medium text-slate-600">Order ID</th>
                  <th className="text-left p-4 font-medium text-slate-600">User</th>
                  <th className="text-left p-4 font-medium text-slate-600">Content</th>
                  <th className="text-left p-4 font-medium text-slate-600">Price</th>
                  <th className="text-left p-4 font-medium text-slate-600">Status</th>
                  <th className="text-left p-4 font-medium text-slate-600">Provider</th>
                  <th className="text-left p-4 font-medium text-slate-600">Date</th>
                  <th className="text-right p-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-mono text-xs text-slate-600">
                        {p.id.slice(0, 8)}...
                      </td>
                      <td className="p-4 text-slate-900">{p.profiles?.email || '-'}</td>
                      <td className="p-4 text-slate-600">{p.content_items?.title || '-'}</td>
                      <td className="p-4 text-slate-900 font-medium">₹{p.price}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            p.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : p.status === 'refunded'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 capitalize">
                        {p.payment_provider || 'test'}
                      </td>
                      <td className="p-4 text-slate-600">
                        {format(new Date(p.purchased_at), 'MMM d, yyyy')}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPurchase(p)}>
                          <Eye className="w-4 h-4" />
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedPurchase} onOpenChange={() => setSelectedPurchase(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Order ID</p>
                  <p className="font-mono">{selectedPurchase.id}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <p className="capitalize">{selectedPurchase.status}</p>
                </div>
                <div>
                  <p className="text-slate-500">User Email</p>
                  <p>{selectedPurchase.profiles?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Content</p>
                  <p>{selectedPurchase.content_items?.title || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Price</p>
                  <p className="font-medium">₹{selectedPurchase.price}</p>
                </div>
                <div>
                  <p className="text-slate-500">Payment Provider</p>
                  <p className="capitalize">{selectedPurchase.payment_provider || 'test'}</p>
                </div>
              </div>
              {selectedPurchase.status === 'completed' && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleRefund(selectedPurchase.id)}
                >
                  Mark as Refunded
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
