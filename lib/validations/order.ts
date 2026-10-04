import { z } from 'zod';

export const nepalPhoneRegex = /^(?:\+?977[- ]?)?(?:98|97)\d{8}$/;

export const checkoutFormSchema = z.object({
  customer_name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters long' })
    .max(100, { message: 'Name is too long' })
    .trim(),
  phone: z
    .string()
    .trim()
    .refine((val) => nepalPhoneRegex.test(val.replace(/\s+/g, '')), {
      message: 'Please enter a valid 10-digit Nepal mobile number (e.g. 98XXXXXXXX or 97XXXXXXXX)',
    }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .trim()
    .toLowerCase(),
  delivery_address: z
    .string()
    .min(5, { message: 'Please provide a detailed delivery address (e.g. Ward, Street, Landmark)' })
    .max(250, { message: 'Address is too long' })
    .trim(),
  delivery_instructions: z
    .string()
    .max(500, { message: 'Delivery instructions must be under 500 characters' })
    .optional()
    .or(z.literal('')),
  payment_method: z.enum(['cod', 'esewa', 'khalti', 'bank_transfer'], {
    errorMap: () => ({ message: 'Please select a valid payment method' }),
  }),
  payment_reference: z
    .string()
    .max(100, { message: 'Reference ID is too long' })
    .optional()
    .or(z.literal('')),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  category_id: z.string().uuid('Invalid category'),
  description: z.string().min(5, 'Description is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  image_url: z.string().url().optional().or(z.literal('')).nullable(),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  display_order: z.coerce.number().default(0),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required').max(50),
  description: z.string().optional().or(z.literal('')).nullable(),
  image_url: z.string().url().optional().or(z.literal('')).nullable(),
  display_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

export const siteSettingsSchema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  phone: z.string().min(7, 'Phone number is required'),
  email: z.string().email('Invalid email'),
  address: z.string().min(3, 'Address is required'),
  delivery_fee: z.coerce.number().min(0, 'Delivery fee must be 0 or higher'),
  free_delivery_threshold: z.coerce.number().optional().nullable(),
  minimum_order_amount: z.coerce.number().optional().nullable(),
  esewa_qr_url: z.string().optional().nullable(),
  khalti_qr_url: z.string().optional().nullable(),
  bank_qr_url: z.string().optional().nullable(),
  bank_name: z.string().optional().nullable(),
  bank_account_name: z.string().optional().nullable(),
  bank_account_number: z.string().optional().nullable(),
});
