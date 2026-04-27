import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { toast } from 'sonner';

const AdminOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            setOrders(querySnapshot.docs.map(d => ({id: d.id, ...d.data()})));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
            toast.success("Status Updated", { description: `Order status changed to ${newStatus}.` });
            fetchOrders();
        } catch (error) {
            toast.error("Error", { description: "Failed to update status." });
        }
    };

    const filteredOrders = orders.filter(o => o.customerEmail.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search));

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'pending': return <Clock className="w-3 h-3 text-amber-500" />;
            case 'processing': return <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />;
            case 'shipped': return <Truck className="w-3 h-3 text-purple-500" />;
            case 'delivered': return <CheckCircle2 className="w-3 h-3 text-green-500" />;
            case 'cancelled': return <XCircle className="w-3 h-3 text-red-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
             <div>
                <h2 className="text-2xl font-serif text-zinc-900 tracking-tight">Order Management</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Track and process client acquisitions</p>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                        <Input 
                            placeholder="Search by order ID or email..." 
                            className="pl-10 h-10 text-xs border-zinc-100 bg-zinc-50"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-zinc-50/50">
                                <TableHead className="text-[10px] uppercase font-bold px-8">Order ID</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold">Client</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold">Value</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold">Status</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold">Date</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-right px-8">Process</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-20 font-serif italic text-zinc-400">Loading acquisitions...</TableCell></TableRow>
                            ) : filteredOrders.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-20 font-serif italic text-zinc-400">No transactions found.</TableCell></TableRow>
                            ) : filteredOrders.map((o) => (
                                <TableRow key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <TableCell className="px-8 font-mono text-[10px] text-zinc-400">#{o.id.slice(0, 8).toUpperCase()}</TableCell>
                                    <TableCell>
                                        <p className="text-xs font-semibold">{o.customerEmail}</p>
                                    </TableCell>
                                    <TableCell className="text-sm font-serif italic">${o.totalAmount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(o.status)}
                                            <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-zinc-200">
                                                {o.status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-[10px] text-zinc-400">
                                        {new Date(o.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                                            <SelectTrigger className="h-8 w-32 text-[9px] uppercase tracking-widest font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="processing">Processing</SelectItem>
                                                <SelectItem value="shipped">Shipped</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

// Mock RefreshCw since it's not in my list but used it by mistake
const RefreshCw = ({className}: any) => <div className={className}>↻</div>;

export default AdminOrders;
