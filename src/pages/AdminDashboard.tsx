import { PRODUCTS, FEATURED_PRODUCTS } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Zap } from 'lucide-react';

const mockOrders = [
  { id: 'ORD001', customer: 'Sophie Laurent', email: 'sophie@example.com', amount: 1450, status: 'delivered', date: '2026-04-20' },
  { id: 'ORD002', customer: 'Amira Hassan', email: 'amira@example.com', amount: 890, status: 'shipped', date: '2026-04-22' },
  { id: 'ORD003', customer: 'Elena Rossi', email: 'elena@example.com', amount: 2340, status: 'processing', date: '2026-04-24' },
  { id: 'ORD004', customer: 'Nadia Benali', email: 'nadia@example.com', amount: 780, status: 'pending', date: '2026-04-26' },
  { id: 'ORD005', customer: 'Camille Dubois', email: 'camille@example.com', amount: 3200, status: 'delivered', date: '2026-04-27' },
];

const revenueData = [
  { name: 'Mon', revenue: 4500 },
  { name: 'Tue', revenue: 5200 },
  { name: 'Wed', revenue: 3800 },
  { name: 'Thu', revenue: 6100 },
  { name: 'Fri', revenue: 7400 },
  { name: 'Sat', revenue: 5900 },
  { name: 'Sun', revenue: 3200 },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const totalRevenue = mockOrders.reduce((acc, o) => acc + o.amount, 0);

  const metrics = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%', up: true },
    { label: 'Orders', value: mockOrders.length, icon: ShoppingBag, trend: '+5.2%', up: true },
    { label: 'Products', value: PRODUCTS.length, icon: Zap, trend: 'Stable', up: true },
    { label: 'Customers', value: 142, icon: Users, trend: '+8.1%', up: true },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-xl p-6 group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <m.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${m.up ? 'text-green-500' : 'text-red-400'}`}>
                {m.trend}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">{m.label}</p>
            <p className="text-3xl font-serif text-zinc-900">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-8">
          <h3 className="font-serif text-xl text-zinc-900 mb-1">Revenue This Week</h3>
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-8">Daily performance</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="name" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '11px' }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {revenueData.map((_, i) => (
                    <Cell key={i} fill={i === 4 ? '#18181b' : '#e4e4e7'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h3 className="font-serif text-lg text-zinc-900 mb-1">Top Pieces</h3>
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-6">By revenue</p>
          <div className="space-y-4">
            {FEATURED_PRODUCTS.slice(0, 4).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-10 h-12 overflow-hidden rounded flex-shrink-0">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{p.name}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{p.category}</p>
                </div>
                <span className="text-xs font-serif italic text-zinc-700">${p.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100">
          <h3 className="font-serif text-lg text-zinc-900">Recent Acquisitions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50/50">
              <tr>
                {['Order', 'Client', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-bold text-zinc-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {mockOrders.map(o => (
                <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[10px] text-zinc-400">#{o.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-semibold">{o.customer}</p>
                    <p className="text-[10px] text-zinc-400">{o.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-serif italic">${o.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded-full font-bold ${statusColors[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] text-zinc-400">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
