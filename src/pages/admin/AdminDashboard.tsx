import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalContent: number;
}

interface RecentPurchase {
  id: string;
  price: number;
  status: string;
  purchased_at: string;
  profiles: { email: string } | null;
  content_items: { title: string } | null;
}

interface RecentContent {
  id: string;
  title: string;
  type: string;
  created_at: string;
  departments: { name: string } | null;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalContent: 0,
  });
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);
  const [recentContent, setRecentContent] = useState<RecentContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const [purchasesRes, usersRes, contentRes] = await Promise.all([
          supabase.from('purchases').select('price, status'),
          supabase.from('profiles').select('id', { count: 'exact' }),
          supabase.from('content_items').select('id', { count: 'exact' }),
        ]);

        const totalRevenue =
          purchasesRes.data
            ?.filter((p) => p.status === 'completed')
            .reduce((sum, p) => sum + (p.price || 0), 0) || 0;

        setStats({
          totalRevenue,
          totalOrders: purchasesRes.data?.length || 0,
          totalUsers: usersRes.count || 0,
          totalContent: contentRes.count || 0,
        });

        // Fetch recent purchases
        const { data: purchases } = await supabase
          .from('purchases')
          .select(
            `
            id, price, status, purchased_at,
            profiles:user_id(email),
            content_items:content_item_id(title)
          `,
          )
          .order('purchased_at', { ascending: false })
          .limit(5);

        setRecentPurchases((purchases as any) || []);

        // Fetch recent content
        const { data: content } = await supabase
          .from('content_items')
          .select(
            `
            id, title, type, created_at,
            departments:department_id(name)
          `,
          )
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentContent((content as any) || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-500' },
    { title: 'Active Users', value: stats.totalUsers, icon: Users, color: 'bg-purple-500' },
    { title: 'Content Items', value: stats.totalContent, icon: FileText, color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPurchases.length === 0 ? (
                <p className="text-slate-500 text-sm">No purchases yet</p>
              ) : (
                recentPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-slate-900 text-sm">
                        {purchase.content_items?.title || 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {purchase.profiles?.email || 'Unknown user'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">₹{purchase.price}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          purchase.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Content */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Latest Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContent.length === 0 ? (
                <p className="text-slate-500 text-sm">No content yet</p>
              ) : (
                recentContent.map((content) => (
                  <div
                    key={content.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{content.title}</p>
                      <p className="text-xs text-slate-500">
                        {content.departments?.name || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                        {content.type}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        {format(new Date(content.created_at), 'MMM d')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
