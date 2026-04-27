import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  PackageCheck, 
  Image as ImageIcon, 
  Upload,
  Database
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';

const AdminProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<any>({
        name: '',
        description: '',
        price: '',
        category: 'shoes',
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop'],
        stock: 10,
        isFeatured: false
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            await addDoc(collection(db, 'products'), productData);
            toast.success("Success", { description: "Product catalog updated." });
            setIsAdding(false);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'shoes',
                images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop'],
                stock: 10,
                isFeatured: false
            });
            fetchProducts();
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Error", { description: "Failed to add product." });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to archive this unit?")) return;
        try {
            await deleteDoc(doc(db, 'products', id));
            toast.info("Deleted", { description: "Product has been removed from the archive." });
            fetchProducts();
        } catch (error) {
            toast.error("Error", { description: "Failed to delete product." });
        }
    };

    const seedData = async () => {
        const initialProducts = [
            {
                name: "Atelier S01 Stiletto",
                description: "Hand-sculpted in white calf leather with a signature architectural bronze heel. Designed for the 2026 avant-garde aesthetic.",
                price: 1450,
                category: "shoes",
                images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2070&auto=format&fit=crop"],
                stock: 12,
                isFeatured: true,
                createdAt: new Date().toISOString()
            },
            {
                name: "Geometric Obsidian Tote",
                description: "Crafted from obsidian suede with a high-polished gold geometric clasp. A masterclass in structural minimalism.",
                price: 3200,
                category: "bags",
                images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop"],
                stock: 5,
                isFeatured: true,
                createdAt: new Date().toISOString()
            },
            {
                name: "Monolith Silver Timepiece",
                description: "A minimalist silver watch carved from a single block of surgical-grade steel. Features a sapphire crystal face.",
                price: 5400,
                category: "accessories",
                images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"],
                stock: 3,
                isFeatured: false,
                createdAt: new Date().toISOString()
            }
        ];

        try {
            for (const p of initialProducts) {
                await addDoc(collection(db, 'products'), p);
            }
            toast.success("Atelier Seeded", { description: "Initial collection items added to the database." });
            fetchProducts();
        } catch (error) {
            console.error("Seed error:", error);
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-serif text-zinc-900 tracking-tight">Product Archive</h2>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Manage atelier inventory and stock levels</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" onClick={seedData} className="text-[10px] uppercase tracking-widest h-10 border-zinc-200">
                        <Database className="mr-2 w-3 h-3 text-zinc-500" />
                        Seed Initial data
                    </Button>
                    <Dialog open={isAdding} onOpenChange={setIsAdding}>
                        <DialogTrigger>
                            <Button className="bg-zinc-900 text-white rounded-lg px-6 h-10 text-[10px] uppercase tracking-widest font-bold">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Unit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle className="font-serif">New Archive Item</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSave} className="grid gap-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-bold">Item Name</Label>
                                        <Input 
                                            id="name" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                            placeholder="e.g. Atelier S01" 
                                            className="text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-[10px] uppercase tracking-widest font-bold">Price ($)</Label>
                                        <Input 
                                            id="price" 
                                            type="number"
                                            value={formData.price} 
                                            onChange={(e) => setFormData({...formData, price: e.target.value})} 
                                            placeholder="1200" 
                                            className="text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-[10px] uppercase tracking-widest font-bold">Category</Label>
                                    <Select 
                                        value={formData.category} 
                                        onValueChange={(v) => setFormData({...formData, category: v})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Archive" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="shoes">Shoes</SelectItem>
                                            <SelectItem value="bags">Handbags</SelectItem>
                                            <SelectItem value="accessories">Accessories</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="desc" className="text-[10px] uppercase tracking-widest font-bold">Description</Label>
                                    <Textarea 
                                        id="desc" 
                                        value={formData.description} 
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="text-sm min-h-[100px]"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg">
                                    <Label htmlFor="featured" className="text-[10px] uppercase tracking-widest font-bold">Featured Placement</Label>
                                    <Switch 
                                        id="featured" 
                                        checked={formData.isFeatured} 
                                        onCheckedChange={(c) => setFormData({...formData, isFeatured: c})}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full bg-zinc-900 text-white uppercase tracking-widest text-[10px] font-bold">Save to Archive</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters and Table */}
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                        <Input 
                            placeholder="Search archive..." 
                            className="pl-10 h-10 text-xs border-zinc-100 bg-zinc-50"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow>
                                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Product</TableHead>
                                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Category</TableHead>
                                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Price</TableHead>
                                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Stock</TableHead>
                                <TableHead className="text-[10px] uppercase tracking-widest font-bold text-right px-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20 text-zinc-400 font-serif italic">Curating inventory...</TableCell>
                                </TableRow>
                            ) : filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20 text-zinc-400 font-serif italic">Archive is currently empty</TableCell>
                                </TableRow>
                            ) : filteredProducts.map((p) => (
                                <TableRow key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center space-x-4 py-2">
                                            <div className="w-12 h-16 bg-zinc-100 rounded overflow-hidden flex-shrink-0">
                                                <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{p.name}</p>
                                                {p.isFeatured && <Badge variant="secondary" className="text-[8px] uppercase tracking-tighter mt-1 bg-zinc-100 text-zinc-600">Featured</Badge>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-zinc-200 text-zinc-500">{p.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm font-serif italic">${p.price.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <p className={cn("text-xs font-semibold", p.stock <= 5 ? "text-red-500" : "text-zinc-600")}>{p.stock} Units</p>
                                    </TableCell>
                                    <TableCell className="text-right px-8 space-x-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-zinc-100" onClick={() => handleDelete(p.id)}>
                                            <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-500" />
                                        </Button>
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

export default AdminProducts;
