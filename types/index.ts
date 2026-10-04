export type PaymentMethod = 'cod' | 'esewa' | 'khalti' | 'bank_transfer';

export type PaymentStatus = 'pending' | 'verified' | 'rejected' | 'cod_pending';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string | null;
  is_available: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  created_at?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string;
  delivery_address: string;
  delivery_instructions?: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_reference?: string | null;
  payment_proof_url?: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OpeningHourItem {
  day: string;
  open: string;
  close: string;
  is_closed: boolean;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  phone: string;
  email: string;
  address: string;
  delivery_fee: number;
  free_delivery_threshold?: number | null;
  minimum_order_amount?: number | null;
  opening_hours: OpeningHourItem[];
  esewa_qr_url?: string | null;
  khalti_qr_url?: string | null;
  bank_qr_url?: string | null;
  bank_name?: string | null;
  bank_account_name?: string | null;
  bank_account_number?: string | null;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
