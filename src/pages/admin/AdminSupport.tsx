import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setTickets(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('support_tickets').update({ status }).eq('id', id);
    if (error) {
      toast.error('Failed to update');
    } else {
      toast.success('Status updated');
      fetchTickets();
      if (selectedTicket?.id === id) {
        setSelectedTicket({ ...selectedTicket, status });
      }
    }
  };

  const filteredTickets = tickets.filter(
    (t) => filterStatus === 'all' || t.status === filterStatus,
  );

  const statusColors: Record<string, string> = {
    open: 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-600">Subject</th>
                  <th className="text-left p-4 font-medium text-slate-600">Email</th>
                  <th className="text-left p-4 font-medium text-slate-600">Status</th>
                  <th className="text-left p-4 font-medium text-slate-600">Created</th>
                  <th className="text-right p-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr key={t.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-900">{t.subject}</td>
                      <td className="p-4 text-slate-600">{t.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs capitalize ${statusColors[t.status]}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        {format(new Date(t.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(t)}>
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

      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Subject</p>
                <p className="font-medium">{selectedTicket.subject}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">From</p>
                <p>{selectedTicket.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Message</p>
                <p className="text-sm bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                  {selectedTicket.message}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">Update Status</p>
                <div className="flex gap-2">
                  {['open', 'in-progress', 'resolved'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedTicket.status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateStatus(selectedTicket.id, status)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
