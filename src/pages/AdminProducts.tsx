import { useState } from 'react';
import { PRODUCTS, Product } from '../data/mockData';
import { Plus, Search, Trash2, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', price: '', category: 'shoes' as Product['category'],
    description: '', material: '', origin: '', isFeatured: false, isNew: false,
  });

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: String(Date.now()),
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      description: form.description,
      material: form.material,
      origin: form.origin,
      images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2070&auto=format&fit=crop'],
      stock: 10,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
    };
    setProducts(prev => [newProduct, ...prev]);
    setShowForm(false);
    setForm({ name: '', price: '', category: 'shoes', description: '', material: '', origin: '', isFeatured: false, isNew: false });
    toast.success('Product added to archive.');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Remove this piece from the archive?')) return;
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.info('Product removed.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-zinc-900">Product Archive</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Manage inventory</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => toast.info('Seed data already loaded from mockData.')}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-200 text-xs text-zinc-500 hover:bg-zinc-50 rounded-lg transition-colors"
          >
            <Database size={14} />
            Seed Data
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs uppercase tracking-widest rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <Plus size={14} />
            Add Piece
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h3 className="font-serif text-lg mb-6">New Archive Item</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:border-zinc-900 rounded-lg" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Price ($) *</label>
              <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:border-zinc-900 rounded-lg" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Product['category'] })}
                className="w-full border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:border-zinc-900 rounded-lg bg-white">
                <option value="shoes">Shoes</option>
                <option value="handbags">Handbags</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Material</label>
              <input value={form.material} onChange={e => setForm({ ...form, material: e.target.value })}
                className="w-full border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:border-zinc-900 rounded-lg" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:border-zinc-900 rounded-lg resize-none" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isNew} onChange={e => setForm({ ...form, isNew: e.target.checked })} />
                New Arrival
              </label>
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-zinc-200 text-sm rounded-lg hover:bg-zinc-50 transition-colors">
                Cancel
              </button>
              <button type="submit"
                className="px-6 py-2 bg-zinc-900 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors">
                Save to Archive
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              placeholder="Search archive..."
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
                {['Product', 'Category', 'Price', 'Stock', 'Status', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-bold text-zinc-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 overflow-hidden rounded flex-shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{p.name}</p>
                        {p.isFeatured && (
                          <span className="text-[8px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded uppercase tracking-wider">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] uppercase tracking-widest border border-zinc-200 text-zinc-500 px-2 py-1 rounded">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-serif italic">${p.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold ${p.stock <= 5 ? 'text-red-500' : 'text-zinc-600'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {p.isNew && (
                      <span className="text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1 rounded uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-zinc-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
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
