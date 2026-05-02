export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'shoes' | 'handbags' | 'accessories';
  images: string[];
  description: string;
  material: string;
  origin: string;
  isFeatured: boolean;
  isNew: boolean;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Velvet Noir Heel',
    price: 890,
    category: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=2085&auto=format&fit=crop',
    ],
    description: 'A sculptural heel carved from a single block of Italian calfskin. The silhouette is architectural — a conversation between structure and softness.',
    material: '100% Italian Calfskin',
    origin: 'Florence, Italy',
    isFeatured: true,
    isNew: true,
    stock: 8,
  },
  {
    id: '2',
    name: 'Obsidian Mule',
    price: 650,
    category: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=2085&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2070&auto=format&fit=crop',
    ],
    description: 'Effortless authority. The Obsidian Mule is designed for the woman who commands every room she enters.',
    material: 'Suede & Patent Leather',
    origin: 'Milan, Italy',
    isFeatured: true,
    isNew: false,
    stock: 12,
  },
  {
    id: '3',
    name: 'Crest Tote',
    price: 1450,
    category: 'handbags',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop',
    ],
    description: 'The Crest Tote is a study in restraint. Structured, silent, and impossibly refined.',
    material: 'Grained Calfskin & Gold Hardware',
    origin: 'Paris, France',
    isFeatured: true,
    isNew: true,
    stock: 5,
  },
  {
    id: '4',
    name: 'Minuit Clutch',
    price: 780,
    category: 'handbags',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop',
    ],
    description: 'For the night that becomes a memory. The Minuit Clutch holds everything you need and nothing you don\'t.',
    material: 'Satin & Brushed Gold',
    origin: 'Paris, France',
    isFeatured: false,
    isNew: true,
    stock: 15,
  },
  {
    id: '5',
    name: 'Soleil Silk Scarf',
    price: 320,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
    ],
    description: 'Hand-painted in Lyon. Each Soleil scarf is a unique work of art — no two are identical.',
    material: '100% Mulberry Silk',
    origin: 'Lyon, France',
    isFeatured: false,
    isNew: false,
    stock: 20,
  },
  {
    id: '6',
    name: 'Arc Belt',
    price: 290,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2070&auto=format&fit=crop',
    ],
    description: 'The Arc Belt redefines the waist. A single curved piece of vegetable-tanned leather with a sculptural brass buckle.',
    material: 'Vegetable-Tanned Leather & Brass',
    origin: 'Florence, Italy',
    isFeatured: true,
    isNew: false,
    stock: 18,
  },
  {
    id: '7',
    name: 'Lumière Pump',
    price: 720,
    category: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2070&auto=format&fit=crop',
    ],
    description: 'Light captured in leather. The Lumière Pump catches every angle of every room.',
    material: 'Patent Leather',
    origin: 'Florence, Italy',
    isFeatured: false,
    isNew: true,
    stock: 10,
  },
  {
    id: '8',
    name: 'Dusk Shoulder Bag',
    price: 1180,
    category: 'handbags',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2076&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop',
    ],
    description: 'The hour between day and night. The Dusk Shoulder Bag transitions effortlessly from boardroom to dinner.',
    material: 'Nappa Leather & Silver Hardware',
    origin: 'Milan, Italy',
    isFeatured: true,
    isNew: false,
    stock: 7,
  },
];

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Every step, a statement.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2070&auto=format&fit=crop',
    count: 24,
  },
  {
    id: '2',
    name: 'Handbags',
    slug: 'handbags',
    description: 'Carry your world with grace.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop',
    count: 18,
  },
  {
    id: '3',
    name: 'Accessories',
    slug: 'accessories',
    description: 'The details that define you.',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2070&auto=format&fit=crop',
    count: 31,
  },
];

export const FEATURED_PRODUCTS = PRODUCTS.filter(p => p.isFeatured);
export const NEW_ARRIVALS = PRODUCTS.filter(p => p.isNew);
