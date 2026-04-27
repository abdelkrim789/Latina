import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getAdminInsights } from '../services/aiService';
import { Skeleton } from '../components/ui/skeleton';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        customers: 0,
        products: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [revenueData, setRevenueData] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch Stats
                const ordersSnap = await getDocs(collection(db, 'orders'));
                const productsSnap = await getDocs(collection(db, 'products'));
                const usersSnap = await getDocs(collection(db, 'users'));
                
                const orders = ordersSnap.docs.map(d => d.data());
                const products = productsSnap.docs.map(d => ({id: d.id, ...d.data()}));
                
                const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
                
                setStats({
                    revenue: totalRevenue,
                    orders: orders.length,
                    customers: usersSnap.docs.length,
                    products: products.length
                });

                // Recent Orders
                const recentOrdersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
                const recentSnap = await getDocs(recentOrdersQuery);
                setRecentOrders(recentSnap.docs.map(d => ({id: d.id, ...d.data()})));

                // Chart Data (Mocking daily revenue from recent orders)
                const mockChart = [
                    { name: 'Mon', revenue: 4500 },
                    { name: 'Tue', revenue: 5200 },
                    { name: 'Wed', revenue: 4800 },
                    { name: 'Thu', revenue: 6100 },
                    { name: 'Fri', revenue: stats.orders > 0 ? totalRevenue : 3200 },
                    { name: 'Sat', revenue: 1200 },
                    { name: 'Sun', revenue: 2400 },
                ];
                setRevenueData(mockChart);

                // AI Insights
                if (orders.length > 0) {
                    const aiResult = await getAdminInsights(orders, products);
                    setInsights(aiResult);
                }

            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const metricCards = [
        { title: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%', isUp: true },
        { title: 'Units Sold', value: stats.orders, icon: ShoppingBag, trend: '+5.2%', isUp: true },
        { title: 'Customers', value: stats.customers, icon: Users, trend: '-2.1%', isUp: false },
        { title: 'Listed Products', value: stats.products, icon: Zap, trend: 'Stable', isUp: true },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Metric Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricCards.map((m, i) => (
                    <Card key={i} className="border-zinc-200 shadow-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                                    <m.icon className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${m.isUp ? 'text-green-500' : 'text-red-400'}`}>
                                    {m.trend}
                                </span>
                            </div>
                            <h3 className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">{m.title}</h3>
                            <p className="text-3xl font-serif text-zinc-900 tracking-tight">{loading ? <Skeleton className="h-9 w-24" /> : m.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2 border-zinc-200 shadow-sm p-8">
                    <CardHeader className="p-0 mb-10">
                        <CardTitle className="font-serif text-xl">Revenue Architecture</CardTitle>
                        <CardDescription className="text-[10px] uppercase tracking-widest">Performance over the current cycle</CardDescription>
                    </CardHeader>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f1f1" />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#888" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(v) => v.toUpperCase()}
                                />
                                <YAxis 
                                    stroke="#888" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(v) => `$${v}`}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '0px', 
                                        border: '1px solid #141414', 
                                        fontSize: '10px', 
                                        fontFamily: 'Montserrat', 
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }} 
                                />
                                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                                    {revenueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 4 ? '#18181b' : '#e4e4e7'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* AI Insights & Recent Orders */}
                <div className="space-y-8">
                    {/* Gemini Insights */}
                    <Card className="border-zinc-900 bg-zinc-900 text-white shadow-2xl overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-20 h-20" />
                         </div>
                         <CardHeader>
                            <CardTitle className="font-serif text-lg flex items-center">
                                <Sparkles className="mr-2 w-4 h-4 text-zinc-400" />
                                Elite Insights
                            </CardTitle>
                            <CardDescription className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Curated by Gemini 3.1 Pro</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-6">
                            {loading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-full bg-zinc-800" />
                                    <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                                    <Skeleton className="h-4 w-full bg-zinc-800" />
                                </div>
                            ) : insights ? (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Analysis</h4>
                                        <p className="text-xs leading-relaxed text-zinc-300 italic">
                                            {typeof insights === 'string' ? insights : insights.executive_summary || insights.summary || "Catalog performing optimally. Inventory circulation is healthy with a focus on high-ticket stiletto units."}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Strategic Movements</h4>
                                        <div className="p-3 bg-zinc-800/50 border border-zinc-700/50 text-[10px] uppercase tracking-wider text-zinc-300">
                                            Increase Bespoke allocation for Q3
                                        </div>
                                        <div className="p-3 bg-zinc-800/50 border border-zinc-700/50 text-[10px] uppercase tracking-wider text-zinc-300">
                                            Restock Obsidian Series
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-500 italic">Establish more orders to unlock elite forecasting metrics.</p>
                            )}
                         </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card className="border-zinc-200">
                         <CardHeader>
                            <CardTitle className="font-serif text-lg">Acquisitions</CardTitle>
                            <CardDescription className="text-[10px] uppercase tracking-widest">Global client activity</CardDescription>
                         </CardHeader>
                         <CardContent className="px-0">
                            <div className="space-y-2">
                                {recentOrders.length === 0 ? (
                                    <p className="px-6 py-10 text-center text-xs text-zinc-400 font-serif italic">No recent activity recorded.</p>
                                ) : recentOrders.map((o) => (
                                    <div key={o.id} className="flex items-center justify-between px-6 py-3 hover:bg-zinc-50 transition-colors cursor-pointer">
                                        <div>
                                            <p className="text-xs font-semibold">{o.customerEmail.split('@')[0]}</p>
                                            <p className="text-[9px] uppercase tracking-tighter text-zinc-400">{o.status}</p>
                                        </div>
                                        <span className="text-xs font-serif italic font-bold">${o.totalAmount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                         </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
