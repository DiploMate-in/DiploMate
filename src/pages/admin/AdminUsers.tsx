import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Search, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  is_blocked: boolean;
  created_at: string;
  purchase_count?: number;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userPurchases, setUserPurchases] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    // Fetch profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error:', error);
      setLoading(false);
      return;
    }

    // Fetch purchase counts
    const { data: purchases } = await supabase.from('purchases').select('user_id');

    const purchaseCounts: Record<string, number> = {};
    purchases?.forEach((p) => {
      purchaseCounts[p.user_id] = (purchaseCounts[p.user_id] || 0) + 1;
    });

    const usersWithCounts =
      profiles?.map((u) => ({
        ...u,
        purchase_count: purchaseCounts[u.id] || 0,
      })) || [];

    setUsers(usersWithCounts);
    setLoading(false);
  };

  const handleBlockToggle = async (userId: string, isBlocked: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_blocked: isBlocked })
      .eq('id', userId);

    if (error) {
      toast.error('Failed to update user');
    } else {
      toast.success(isBlocked ? 'User blocked' : 'User unblocked');
      fetchUsers();
    }
  };

  const viewUserDetails = async (user: UserProfile) => {
    setSelectedUser(user);

    const { data } = await supabase
      .from('purchases')
      .select(
        `
        id, price, status, purchased_at,
        content_items:content_item_id(title)
      `,
      )
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false })
      .limit(10);

    setUserPurchases(data || []);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Users</h1>

      {/* Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
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
                  <th className="text-left p-4 font-medium text-slate-600">Name</th>
                  <th className="text-left p-4 font-medium text-slate-600">Email</th>
                  <th className="text-left p-4 font-medium text-slate-600">Purchases</th>
                  <th className="text-left p-4 font-medium text-slate-600">Joined</th>
                  <th className="text-left p-4 font-medium text-slate-600">Blocked</th>
                  <th className="text-right p-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-900">{user.name || '-'}</td>
                      <td className="p-4 text-slate-600">{user.email}</td>
                      <td className="p-4 text-slate-600">{user.purchase_count}</td>
                      <td className="p-4 text-slate-600">
                        {format(new Date(user.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="p-4">
                        <Switch
                          checked={user.is_blocked}
                          onCheckedChange={(v) => handleBlockToggle(user.id, v)}
                        />
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => viewUserDetails(user)}>
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

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Name</p>
                  <p className="font-medium">{selectedUser.name || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-slate-500">Joined</p>
                  <p>{format(new Date(selectedUser.created_at), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <p className={selectedUser.is_blocked ? 'text-red-600' : 'text-green-600'}>
                    {selectedUser.is_blocked ? 'Blocked' : 'Active'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recent Purchases</h4>
                {userPurchases.length === 0 ? (
                  <p className="text-sm text-slate-500">No purchases</p>
                ) : (
                  <div className="space-y-2">
                    {userPurchases.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between text-sm p-2 bg-slate-50 rounded"
                      >
                        <span>{p.content_items?.title || 'Unknown'}</span>
                        <span className="font-medium">₹{p.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
