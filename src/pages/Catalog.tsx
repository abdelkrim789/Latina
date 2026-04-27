import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, SlidersHorizontal, ArrowRight, Grid, List as ListIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { cn } from '../lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';

const Catalog = () => {
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
                
                if (categoryFilter) {
                    q = query(collection(db, 'products'), where('category', '==', categoryFilter), orderBy('createdAt', 'desc'));
                }
                
                const querySnapshot = await getDocs(q);
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

        fetchProducts();
    }, [categoryFilter]);

    // Sorting logic (client side for simplicity)
    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0; // Default newest (already sorted by query)
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-zinc-400 mb-4">
                        <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-zinc-900 font-bold">Collections</span>
                        {categoryFilter && (
                            <>
                                <span>/</span>
                                <span className="text-zinc-900 font-bold">{categoryFilter}</span>
                            </>
                        )}
                    </nav>
                    <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight">
                        {categoryFilter ? (
                            <span className="capitalize">{categoryFilter}</span>
                        ) : 'All Collections'}
                    </h1>
                </div>

                <div className="flex items-center space-x-4">
                    {/* View Controls */}
                    <div className="hidden sm:flex items-center space-x-2 bg-zinc-50 p-1 rounded-lg border border-zinc-100">
                        <Button 
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon className="w-4 h-4" />
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline" size="sm" className="text-[10px] uppercase tracking-widest border-zinc-200">
                                <SlidersHorizontal className="mr-2 h-3 w-3" />
                                Sort By: {sortBy.replace('-', ' ')}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest">Sorting Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                                <DropdownMenuRadioItem value="newest" className="text-xs">Newest Arrivals</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="price-low" className="text-xs">Price: Low to High</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="price-high" className="text-xs">Price: High to Low</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-[3/4] w-full bg-zinc-100 rounded-none" />
                            <Skeleton className="h-4 w-3/4 bg-zinc-100" />
                            <Skeleton className="h-4 w-1/4 bg-zinc-100" />
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="py-40 text-center flex flex-col items-center">
                    <p className="text-zinc-400 font-serif italic text-xl mb-8">This collection is currently empty.</p>
                    <Link to="/">
                         <Button variant="outline" className="rounded-none px-8 py-6 text-[10px] uppercase tracking-widest">Return Home</Button>
                    </Link>
                </div>
            ) : (
                <div className={cn(
                    viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1px bg-luxury-border border border-luxury-border"
                    : "space-y-0"
                )}>
                    <AnimatePresence mode="popLayout">
                        {sortedProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.8, delay: idx * 0.05 }}
                                className={cn(
                                    "group bg-luxury-deep p-8 flex flex-col justify-between hover:bg-luxury-obsidian transition-all duration-700 relative overflow-hidden",
                                    viewMode === 'list' && "flex-row items-center gap-12 border-b border-luxury-border"
                                )}
                            >
                                <Link to={`/product/${product.id}`} className={cn(viewMode === 'list' ? "w-1/3" : "block")}>
                                    <div className="aspect-[3/4] overflow-hidden bg-black relative">
                                        <img 
                                            src={product.images?.[0] || 'https://picsum.photos/seed/lux/800/1000'} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-90"
                                            referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-luxury-gold/0 group-hover:bg-luxury-gold/10 transition-colors duration-500" />
                                        <div className="absolute top-4 right-4 text-[8px] tracking-[0.3em] opacity-30 font-mono">CODE_{product.id.substring(0,6).toUpperCase()}</div>
                                    </div>
                                </Link>
                                
                                <div className={cn("mt-8", viewMode === 'list' && "mt-0 flex-1")}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-serif italic tracking-wide group-hover:text-luxury-gold transition-colors">{product.name}</h3>
                                        <span className="text-lg font-light tracking-widest">${product.price.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mb-6">{product.category} / Limited Series</p>
                                    
                                    {viewMode === 'list' && (
                                        <p className="text-sm text-white/50 mb-10 max-w-2xl line-clamp-2 font-light tracking-wide leading-relaxed">{product.description}</p>
                                    )}

                                    <Link to={`/product/${product.id}`}>
                                        <button 
                                            className="w-full lg:w-auto px-10 py-4 border border-white/10 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-black hover:border-white transition-all duration-500"
                                        >
                                            Explore Archive
                                        </button>
                                    </Link>
                                </div>

                                {/* Corner Accents */}
                                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-luxury-gold opacity-0 group-hover:opacity-30 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-luxury-gold opacity-0 group-hover:opacity-30 transition-opacity"></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

// Utility for class merging
export default Catalog;
