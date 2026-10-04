import { Category, Product, Order, SiteSettings, OrderStatus, PaymentStatus } from '@/types';
import { createServerSupabaseClient } from './server';
import { createAdminClient } from './admin';

// Default / fallback seed data for immediate usability & offline resilience
export const fallbackSiteSettings: SiteSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  business_name: 'Himalayan Cloud Kitchen',
  phone: '+977 9801234567',
  email: 'order@himalayanfood.com.np',
  address: 'Bhaktapur, Nepal',
  delivery_fee: 100,
  free_delivery_threshold: 1500,
  minimum_order_amount: 200,
  opening_hours: [
    { day: 'Sunday', open: '11:00 AM', close: '11:00 PM', is_closed: false },
    { day: 'Monday', open: '11:00 AM', close: '11:00 PM', is_closed: false },
    { day: 'Tuesday', open: '11:00 AM', close: '11:00 PM', is_closed: false },
    { day: 'Wednesday', open: '11:00 AM', close: '11:00 PM', is_closed: false },
    { day: 'Thursday', open: '11:00 AM', close: '11:00 PM', is_closed: false },
    { day: 'Friday', open: '11:00 AM', close: '12:00 AM', is_closed: false },
    { day: 'Saturday', open: '11:00 AM', close: '12:00 AM', is_closed: false },
  ],
  esewa_qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=esewa://payment?id=9801234567&name=HimalayanCloudKitchen',
  khalti_qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=khalti://payment?id=9801234567&name=HimalayanCloudKitchen',
  bank_qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=nabilbank://transfer?ac=01201017500123&name=HimalayanCloudKitchen',
  bank_name: 'Nabil Bank Limited',
  bank_account_name: 'Himalayan Cloud Kitchen Pvt. Ltd.',
  bank_account_number: '01201017500123',
  updated_at: new Date().toISOString(),
};

export const fallbackCategories: Category[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    name: 'Momos',
    description: 'Authentic handmade Tibetan and Nepali steamed, fried, and jhol dumplings.',
    image_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name: 'Chowmein',
    description: 'Wok-tossed noodles with garden-fresh veggies and secret Himalayan spices.',
    image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name: 'Thukpa',
    description: 'Hearty and comforting Himalayan noodle soup infused with mountain herbs.',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    name: 'Snacks & Sekuwa',
    description: 'Crispy traditional bites, spiced sekuwa skewers, and tongue-tingling sadeko.',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    name: 'Drinks & Beverages',
    description: 'Refreshing sweet lassi, authentic masala chiya, and cold thirst-quenchers.',
    image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const fallbackProducts: Product[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    category_id: '11111111-1111-1111-1111-111111111101',
    name: 'Steamed Chicken Momo',
    description: 'Ten juicy minced chicken dumplings seasoned with fresh ginger, cilantro, and served with spicy tomato sesame achar.',
    price: 180,
    image_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    category_id: '11111111-1111-1111-1111-111111111101',
    name: 'Buff Steam Momo',
    description: 'Classic Kathmandu-style spiced minced water buffalo dumplings wrapped in tender dough with hot yellow timur chutney.',
    price: 170,
    image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    category_id: '11111111-1111-1111-1111-111111111101',
    name: 'Chicken Jhol Momo',
    description: 'Steamed chicken momos served submerged in a warm, tangy roasted sesame, soybean, and tomato broth.',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    category_id: '11111111-1111-1111-1111-111111111101',
    name: 'Spicy Chilli (C-Momo) Chicken',
    description: 'Crispy pan-fried chicken momos tossed with onions, green bell peppers, garlic, and fiery homemade hot sauce.',
    price: 240,
    image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222205',
    category_id: '11111111-1111-1111-1111-111111111101',
    name: 'Veg Paneer Steam Momo',
    description: 'Delicate parcels stuffed with grated cottage cheese, crisp cabbage, carrots, spring onions, and fragrant herbs.',
    price: 160,
    image_url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222206',
    category_id: '11111111-1111-1111-1111-111111111102',
    name: 'Chicken Chowmein',
    description: 'Street-style wok-fried noodles with shredded chicken breast, crunchy cabbage, carrots, dark soy sauce, and scallions.',
    price: 190,
    image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222207',
    category_id: '11111111-1111-1111-1111-111111111102',
    name: 'Buff Chowmein',
    description: 'Savory stir-fried noodles loaded with spicy sauteed buff strips, capsicum, green chillies, and aromatic spices.',
    price: 180,
    image_url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    display_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222208',
    category_id: '11111111-1111-1111-1111-111111111102',
    name: 'Veg Himalayan Chowmein',
    description: 'Crisp vegetable stir-fry with tender noodles tossed in light sesame oil and mountain pepper.',
    price: 150,
    image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    display_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222209',
    category_id: '11111111-1111-1111-1111-111111111103',
    name: 'Himalayan Chicken Thukpa',
    description: 'Traditional Tibetan winter noodle soup loaded with slow-cooked shredded chicken, shredded vegetables, and warm ginger broth.',
    price: 210,
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    display_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222210',
    category_id: '11111111-1111-1111-1111-111111111103',
    name: 'Veg Mountain Thukpa',
    description: 'Rich vegetable noodle broth enriched with mushrooms, spinach, carrots, and roasted garlic.',
    price: 160,
    image_url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    display_order: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222211',
    category_id: '11111111-1111-1111-1111-111111111104',
    name: 'Charcoal Chicken Sekuwa',
    description: 'Tender boneless chicken marinated in authentic Dharan-style mustard oil, fenugreek, and cumin roasted over open coals.',
    price: 260,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    display_order: 11,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222212',
    category_id: '11111111-1111-1111-1111-111111111104',
    name: 'Aloo Sadeko',
    description: 'Boiled potatoes marinated in toasted fenugreek mustard oil, green chilies, cilantro, and freshly squeezed lemon juice.',
    price: 120,
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    display_order: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222213',
    category_id: '11111111-1111-1111-1111-111111111104',
    name: 'Buff Sukuti Sadeko',
    description: 'Crispy sun-dried spiced buffalo meat tossed with raw shallots, roasted garlic, mustard oil, and fiery timur.',
    price: 290,
    image_url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',
    is_available: false, // Currently unavailable for testing UX
    is_featured: false,
    display_order: 13,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222214',
    category_id: '11111111-1111-1111-1111-111111111105',
    name: 'Sweet Himalayan Mint Lassi',
    description: 'Chilled creamy yogurt blended with Himalayan blossom honey, fresh mint leaves, and cardamom powder.',
    price: 120,
    image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    display_order: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222215',
    category_id: '11111111-1111-1111-1111-111111111105',
    name: 'Authentic Masala Chiya',
    description: 'Rich milk tea simmered with fresh mountain ginger, cloves, cardamom pods, and black tea leaves.',
    price: 50,
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    display_order: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222216',
    category_id: '11111111-1111-1111-1111-111111111105',
    name: 'Fresh Lemon Soda',
    description: 'Fizzy bubbly club soda with fresh lime juice, rock salt, and optional mint syrup.',
    price: 90,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    display_order: 16,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Fallback initial orders for admin dashboard demonstration
export const fallbackOrders: Order[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    order_number: 'ORD-20261004-8F4K',
    customer_name: 'Aarav Shrestha',
    phone: '9841234567',
    email: 'aarav.shrestha@example.com',
    delivery_address: 'Bakhundole, Pulchowk, Lalitpur (Opposite Hotel Himalaya)',
    delivery_instructions: 'Please call when arriving at the gate.',
    subtotal: 580,
    delivery_fee: 100,
    total: 680,
    payment_method: 'esewa',
    payment_status: 'verified',
    payment_reference: 'ESW-99238472',
    payment_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    status: 'preparing',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    order_items: [
      {
        id: '44444444-4444-4444-4444-444444444401',
        product_id: '22222222-2222-2222-2222-222222222201',
        product_name: 'Steamed Chicken Momo',
        unit_price: 180,
        quantity: 2,
        subtotal: 360,
      },
      {
        id: '44444444-4444-4444-4444-444444444402',
        product_id: '22222222-2222-2222-2222-222222222203',
        product_name: 'Chicken Jhol Momo',
        unit_price: 220,
        quantity: 1,
        subtotal: 220,
      },
    ],
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    order_number: 'ORD-20261004-9C1M',
    customer_name: 'Pooja Thapa',
    phone: '9801987654',
    email: 'pooja.thapa@example.com',
    delivery_address: 'Baluwatar, Kathmandu (Near Russian Embassy)',
    delivery_instructions: 'Leave at front security desk.',
    subtotal: 450,
    delivery_fee: 100,
    total: 550,
    payment_method: 'cod',
    payment_status: 'cod_pending',
    payment_reference: null,
    payment_proof_url: null,
    status: 'confirmed',
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    order_items: [
      {
        id: '44444444-4444-4444-4444-444444444403',
        product_id: '22222222-2222-2222-2222-222222222206',
        product_name: 'Chicken Chowmein',
        unit_price: 190,
        quantity: 1,
        subtotal: 190,
      },
      {
        id: '44444444-4444-4444-4444-444444444404',
        product_id: '22222222-2222-2222-2222-222222222211',
        product_name: 'Charcoal Chicken Sekuwa',
        unit_price: 260,
        quantity: 1,
        subtotal: 260,
      },
    ],
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    order_number: 'ORD-20261004-3K7X',
    customer_name: 'Bikash Adhikari',
    phone: '9812345678',
    email: 'bikash.adhikari@example.com',
    delivery_address: 'Kupondole, Lalitpur (Near St. Xavier College)',
    delivery_instructions: 'Extra hot tomato achar please.',
    subtotal: 820,
    delivery_fee: 100,
    total: 920,
    payment_method: 'khalti',
    payment_status: 'pending',
    payment_reference: 'KHLT-884190',
    payment_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    status: 'pending',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    order_items: [
      {
        id: '44444444-4444-4444-4444-444444444405',
        product_id: '22222222-2222-2222-2222-222222222204',
        product_name: 'Spicy Chilli (C-Momo) Chicken',
        unit_price: 240,
        quantity: 2,
        subtotal: 480,
      },
      {
        id: '44444444-4444-4444-4444-444444444406',
        product_id: '22222222-2222-2222-2222-222222222214',
        product_name: 'Sweet Himalayan Mint Lassi',
        unit_price: 120,
        quantity: 2,
        subtotal: 240,
      },
      {
        id: '44444444-4444-4444-4444-444444444407',
        product_id: '22222222-2222-2222-2222-222222222215',
        product_name: 'Authentic Masala Chiya',
        unit_price: 50,
        quantity: 2,
        subtotal: 100,
      },
    ],
  },
];

// Global in-memory fallback cache for development/demo mode
const memoryStore = {
  categories: [...fallbackCategories],
  products: [...fallbackProducts],
  siteSettings: { ...fallbackSiteSettings },
  orders: [...fallbackOrders],
};

// ----------------- DATA ACCESS METHODS -----------------

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Falling back to local categories:', err);
  }
  return memoryStore.categories.filter((c) => c.is_active);
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Falling back to all categories:', err);
  }
  return memoryStore.categories;
}

export async function getProducts(categoryId?: string): Promise<Product[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('display_order', { ascending: true });

      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Falling back to local products:', err);
  }

  let products = memoryStore.products;
  if (categoryId && categoryId !== 'all') {
    products = products.filter((p) => p.category_id === categoryId);
  }

  return products.map((p) => ({
    ...p,
    category: memoryStore.categories.find((c) => c.id === p.category_id),
  }));
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Falling back to local all products:', err);
  }

  return memoryStore.products.map((p) => ({
    ...p,
    category: memoryStore.categories.find((c) => c.id === p.category_id),
  }));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_featured', true)
        .eq('is_available', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Falling back to featured products:', err);
  }

  return memoryStore.products
    .filter((p) => p.is_featured && p.is_available)
    .map((p) => ({
      ...p,
      category: memoryStore.categories.find((c) => c.id === p.category_id),
    }));
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Falling back to local product by ID:', err);
  }

  const p = memoryStore.products.find((prod) => prod.id === id);
  if (!p) return null;
  return {
    ...p,
    category: memoryStore.categories.find((c) => c.id === p.category_id),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (!error && data) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Falling back to local site settings:', err);
  }

  return memoryStore.siteSettings;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      const { data: orderData, error: orderError } = await adminSupabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('order_number', orderNumber)
        .single();

      if (!orderError && orderData) {
        return orderData;
      }
    }
  } catch (err) {
    console.warn('Falling back to local getOrderByNumber:', err);
  }

  const found = memoryStore.orders.find((o) => o.order_number === orderNumber);
  return found || null;
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      const { data: orderData, error: orderError } = await adminSupabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .single();

      if (!orderError && orderData) {
        return orderData;
      }
    }
  } catch (err) {
    console.warn('Falling back to local getOrderById:', err);
  }

  const found = memoryStore.orders.find((o) => o.id === id);
  return found || null;
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      const { data, error } = await adminSupabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Falling back to local getAllOrders:', err);
  }

  return [...memoryStore.orders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// ----------------- MUTATIONS FOR ADMIN & ORDERS -----------------

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  try {
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      const { data, error } = await adminSupabase
        .from('site_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', memoryStore.siteSettings.id)
        .select()
        .single();

      if (!error && data) {
        memoryStore.siteSettings = data;
        return data;
      }
    }
  } catch (err) {
    console.warn('Supabase site settings update failed, saving in memory:', err);
  }

  memoryStore.siteSettings = {
    ...memoryStore.siteSettings,
    ...settings,
    updated_at: new Date().toISOString(),
  };
  return memoryStore.siteSettings;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus
): Promise<boolean> {
  try {
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      const updatePayload: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (paymentStatus) {
        updatePayload.payment_status = paymentStatus;
      }

      const { error } = await adminSupabase
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId);

      if (!error) {
        // Also update memory cache
        const idx = memoryStore.orders.findIndex((o) => o.id === orderId);
        if (idx !== -1) {
          memoryStore.orders[idx].status = status;
          if (paymentStatus) memoryStore.orders[idx].payment_status = paymentStatus;
          memoryStore.orders[idx].updated_at = new Date().toISOString();
        }
        return true;
      }
    }
  } catch (err) {
    console.warn('Supabase update order status error:', err);
  }

  const idx = memoryStore.orders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    memoryStore.orders[idx].status = status;
    if (paymentStatus) memoryStore.orders[idx].payment_status = paymentStatus;
    memoryStore.orders[idx].updated_at = new Date().toISOString();
    return true;
  }
  return false;
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
): Promise<boolean> {
  try {
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      const { error } = await adminSupabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (!error) {
        const idx = memoryStore.orders.findIndex((o) => o.id === orderId);
        if (idx !== -1) {
          memoryStore.orders[idx].payment_status = paymentStatus;
          memoryStore.orders[idx].updated_at = new Date().toISOString();
        }
        return true;
      }
    }
  } catch (err) {
    console.warn('Supabase update payment status error:', err);
  }

  const idx = memoryStore.orders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    memoryStore.orders[idx].payment_status = paymentStatus;
    memoryStore.orders[idx].updated_at = new Date().toISOString();
    return true;
  }
  return false;
}

export async function saveProduct(
  productData: Partial<Product> & { name: string; category_id: string; price: number; description: string }
): Promise<Product> {
  const isNew = !productData.id;
  const id = productData.id || `prod-${Date.now()}`;
  const now = new Date().toISOString();

  try {
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      if (isNew) {
        const { data, error } = await adminSupabase
          .from('products')
          .insert({
            category_id: productData.category_id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image_url: productData.image_url,
            is_available: productData.is_available ?? true,
            is_featured: productData.is_featured ?? false,
            display_order: productData.display_order ?? 0,
          })
          .select()
          .single();

        if (!error && data) {
          memoryStore.products.push(data);
          return data;
        }
      } else {
        const { data, error } = await adminSupabase
          .from('products')
          .update({
            category_id: productData.category_id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image_url: productData.image_url,
            is_available: productData.is_available,
            is_featured: productData.is_featured,
            display_order: productData.display_order,
            updated_at: now,
          })
          .eq('id', productData.id)
          .select()
          .single();

        if (!error && data) {
          const idx = memoryStore.products.findIndex((p) => p.id === data.id);
          if (idx !== -1) memoryStore.products[idx] = data;
          return data;
        }
      }
    }
  } catch (err) {
    console.warn('Supabase product save error:', err);
  }

  // Fallback memory mutation
  const product: Product = {
    id,
    category_id: productData.category_id,
    name: productData.name,
    description: productData.description,
    price: productData.price,
    image_url: productData.image_url || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    is_available: productData.is_available ?? true,
    is_featured: productData.is_featured ?? false,
    display_order: productData.display_order ?? 0,
    created_at: now,
    updated_at: now,
  };

  const existingIdx = memoryStore.products.findIndex((p) => p.id === id);
  if (existingIdx !== -1) {
    memoryStore.products[existingIdx] = { ...memoryStore.products[existingIdx], ...product };
    return memoryStore.products[existingIdx];
  } else {
    memoryStore.products.push(product);
    return product;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      // Soft-delete: set is_available = false so historical orders don't break
      const { error } = await adminSupabase
        .from('products')
        .update({ is_available: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (!error) {
        const idx = memoryStore.products.findIndex((p) => p.id === id);
        if (idx !== -1) memoryStore.products[idx].is_available = false;
        return true;
      }
    }
  } catch (err) {
    console.warn('Supabase delete product error:', err);
  }

  const idx = memoryStore.products.findIndex((p) => p.id === id);
  if (idx !== -1) {
    memoryStore.products[idx].is_available = false;
    return true;
  }
  return false;
}

export async function saveCategory(
  categoryData: Partial<Category> & { name: string }
): Promise<Category> {
  const isNew = !categoryData.id;
  const id = categoryData.id || `cat-${Date.now()}`;
  const now = new Date().toISOString();

  try {
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      if (isNew) {
        const { data, error } = await adminSupabase
          .from('categories')
          .insert({
            name: categoryData.name,
            description: categoryData.description,
            image_url: categoryData.image_url,
            display_order: categoryData.display_order ?? 0,
            is_active: categoryData.is_active ?? true,
          })
          .select()
          .single();

        if (!error && data) {
          memoryStore.categories.push(data);
          return data;
        }
      } else {
        const { data, error } = await adminSupabase
          .from('categories')
          .update({
            name: categoryData.name,
            description: categoryData.description,
            image_url: categoryData.image_url,
            display_order: categoryData.display_order,
            is_active: categoryData.is_active,
            updated_at: now,
          })
          .eq('id', categoryData.id)
          .select()
          .single();

        if (!error && data) {
          const idx = memoryStore.categories.findIndex((c) => c.id === data.id);
          if (idx !== -1) memoryStore.categories[idx] = data;
          return data;
        }
      }
    }
  } catch (err) {
    console.warn('Supabase category save error:', err);
  }

  const category: Category = {
    id,
    name: categoryData.name,
    description: categoryData.description,
    image_url: categoryData.image_url || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80',
    display_order: categoryData.display_order ?? 0,
    is_active: categoryData.is_active ?? true,
    created_at: now,
    updated_at: now,
  };

  const existingIdx = memoryStore.categories.findIndex((c) => c.id === id);
  if (existingIdx !== -1) {
    memoryStore.categories[existingIdx] = { ...memoryStore.categories[existingIdx], ...category };
    return memoryStore.categories[existingIdx];
  } else {
    memoryStore.categories.push(category);
    return category;
  }
}

export function registerMemoryOrder(newOrder: Order) {
  memoryStore.orders.unshift(newOrder);
}
