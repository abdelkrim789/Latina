import { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

const mockOrders: Order[] = [
  { id: 'ORD001', customer: 'Sophie Laurent', email: 'sophie@example.com', amount: 1450, status: 'delivered', date: '2026-04-20' },
  { id: 'ORD002', customer: 'Amira Hassan', email: 'amira@example.com', amount: 890, status: 'shipped', date: '2026-04-22' },
  { id: 'ORD003', customer: 'Elena Rossi', email: 'elena@example.com', amount: 2340, status: 'processing', date: '2026-04-24' },
  { id: 'ORD004', customer: 'Nadia Benali', email: 'nadia@example.com', amount: 780, status: 'pending', date: '2026-04-26' },
  { id: 'ORD005', customer: 'Camille Dubois', email: 'camille@example.com', amount: 3200, status: 'delivered', date: '2026-04-27' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3 h-3 text-amber-500" />,
  processing: <div className="w-3 h-3 text-blue-500 animate-spin">↻</div>,
  shipped: <Truck className="w-3 h-3 text-purple-500" />,
  delivered: <CheckCircle2 className="w-3 h-3 text-green-500" />,
  cancelled: <XCircle className="w-3 h-3 text-red-500" />,
};

export default function AdminOrders() {
  const [orders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o =>
    o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: string, newStatus: string) => {
    toast.success(`Status updated to ${newStatus}.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-zinc-900">Order Management</h2>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Track and process acquisitions</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              placeholder="Search by order ID or client..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-100 text-xs focus:outline-none focus:border-zinc-300 rounded-lg"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50/50">
              <tr>
                {['Order', 'Client', 'Amount', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-bold text-zinc-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[10px] text-zinc-400">#{o.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-semibold">{o.customer}</p>
                    <p className="text-[10px] text-zinc-400">{o.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-serif italic">${o.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {statusIcons[o.status]}
                      <span className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded-full font-bold ${statusColors[o.status]}`}>
                        {o.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[10px] text-zinc-400">{o.date}</td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o.id, e.target.value)}
                      className="text-[9px] uppercase tracking-widest font-bold border border-zinc-200 px-3 py-1.5 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
