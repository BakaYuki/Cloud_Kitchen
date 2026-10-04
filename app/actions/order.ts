'use server';

import { checkoutFormSchema } from '@/lib/validations/order';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  getProductById,
  getSiteSettings,
  registerMemoryOrder,
} from '@/lib/supabase/data';
import { generateOrderNumber } from '@/lib/utils';
import { Order, OrderItem, PaymentMethod, PaymentStatus, OrderStatus } from '@/types';

interface OrderItemInput {
  productId: string;
  quantity: number;
}

export async function createOrderAction(formData: FormData) {
  try {
    const rawData = {
      customer_name: formData.get('customer_name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      delivery_address: formData.get('delivery_address') as string,
      delivery_instructions: (formData.get('delivery_instructions') as string) || '',
      payment_method: formData.get('payment_method') as PaymentMethod,
      payment_reference: (formData.get('payment_reference') as string) || '',
    };

    // 1. Validate Form Fields with Zod
    const validation = checkoutFormSchema.safeParse(rawData);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((i) => i.message).join('. ');
      return { success: false, error: errorMsg };
    }

    const {
      customer_name,
      phone,
      email,
      delivery_address,
      delivery_instructions,
      payment_method,
      payment_reference,
    } = validation.data;

    // 2. Parse and Validate Cart Items
    const itemsJson = formData.get('items') as string;
    if (!itemsJson) {
      return { success: false, error: 'Your cart is empty. Please add items to checkout.' };
    }

    let itemsInput: OrderItemInput[];
    try {
      itemsInput = JSON.parse(itemsJson);
      if (!Array.isArray(itemsInput) || itemsInput.length === 0) {
        return { success: false, error: 'Invalid or empty cart items.' };
      }
    } catch {
      return { success: false, error: 'Failed to parse cart items.' };
    }

    // 3. Fetch Real-time Product Prices from Database & verify availability
    let calculatedSubtotal = 0;
    const validatedItems: OrderItem[] = [];

    for (const item of itemsInput) {
      if (item.quantity <= 0) continue;

      const product = await getProductById(item.productId);
      if (!product) {
        return {
          success: false,
          error: `A product in your cart could not be found. Please check your cart.`,
        };
      }

      if (!product.is_available) {
        return {
          success: false,
          error: `"${product.name}" is currently unavailable. Please remove it from your cart before proceeding.`,
        };
      }

      const itemSubtotal = product.price * item.quantity;
      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    if (validatedItems.length === 0) {
      return { success: false, error: 'No valid items found in order.' };
    }

    // 4. Calculate Delivery Fee & Total Server-side
    const siteSettings = await getSiteSettings();
    let deliveryFee = siteSettings.delivery_fee || 100;
    const freeDeliveryThreshold = siteSettings.free_delivery_threshold || 1500;

    if (calculatedSubtotal >= freeDeliveryThreshold) {
      deliveryFee = 0;
    }

    const grandTotal = calculatedSubtotal + deliveryFee;

    // 5. Check Minimum Order Amount
    const minOrderAmount = siteSettings.minimum_order_amount || 0;
    if (calculatedSubtotal < minOrderAmount) {
      return {
        success: false,
        error: `Minimum order amount is NPR ${minOrderAmount}. Your subtotal is NPR ${calculatedSubtotal}.`,
      };
    }

    // 6. Handle Payment Screenshot Upload (if online payment)
    let paymentProofUrl: string | null = null;
    const proofFile = formData.get('payment_proof') as File | null;

    if (payment_method !== 'cod') {
      if (proofFile && proofFile.size > 0) {
        // Validate file type & size (max 5MB)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/jpg'];
        if (!allowedTypes.includes(proofFile.type)) {
          return {
            success: false,
            error: 'Payment screenshot must be an image file (JPEG, PNG, or WebP).',
          };
        }
        if (proofFile.size > 5 * 1024 * 1024) {
          return {
            success: false,
            error: 'Payment screenshot must be under 5MB.',
          };
        }

        const adminSupabase = createAdminClient();
        const fileExt = proofFile.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        if (adminSupabase) {
          const buffer = Buffer.from(await proofFile.arrayBuffer());
          const { data: uploadData, error: uploadError } = await adminSupabase.storage
            .from('payment-proofs')
            .upload(fileName, buffer, {
              contentType: proofFile.type,
              upsert: false,
            });

          if (!uploadError && uploadData) {
            paymentProofUrl = uploadData.path;
          } else {
            console.warn('Storage upload error, saving base64 preview fallback:', uploadError);
            const base64 = buffer.toString('base64');
            paymentProofUrl = `data:${proofFile.type};base64,${base64}`;
          }
        } else {
          // In development without Supabase credentials
          const buffer = Buffer.from(await proofFile.arrayBuffer());
          const base64 = buffer.toString('base64');
          paymentProofUrl = `data:${proofFile.type};base64,${base64}`;
        }
      }
    }

    // 7. Generate Human-Friendly Order Number
    const orderNumber = generateOrderNumber();

    const paymentStatus: PaymentStatus =
      payment_method === 'cod' ? 'cod_pending' : 'pending';
    const orderStatus: OrderStatus = 'pending';
    const now = new Date().toISOString();

    // 8. Create Order in Supabase or In-Memory Store
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      const { data: orderData, error: orderInsertError } = await adminSupabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name,
          phone,
          email,
          delivery_address,
          delivery_instructions: delivery_instructions || null,
          subtotal: calculatedSubtotal,
          delivery_fee: deliveryFee,
          total: grandTotal,
          payment_method,
          payment_status: paymentStatus,
          payment_reference: payment_reference || null,
          payment_proof_url: paymentProofUrl,
          status: orderStatus,
        })
        .select()
        .single();

      if (!orderInsertError && orderData) {
        // Insert order items
        const itemsToInsert = validatedItems.map((item) => ({
          order_id: orderData.id,
          product_id: item.product_id,
          product_name: item.product_name,
          unit_price: item.unit_price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }));

        const { error: itemsInsertError } = await adminSupabase
          .from('order_items')
          .insert(itemsToInsert);

        if (itemsInsertError) {
          console.error('Failed to insert order items:', itemsInsertError);
        }

        // Register in memory fallback as well for seamless instant retrieval
        registerMemoryOrder({
          ...orderData,
          order_items: validatedItems,
        });

        return {
          success: true,
          orderNumber,
        };
      } else {
        console.warn('Supabase order insert failed, using fallback:', orderInsertError);
      }
    }

    // Fallback order store
    const fallbackOrderObj: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name,
      phone,
      email,
      delivery_address,
      delivery_instructions: delivery_instructions || null,
      subtotal: calculatedSubtotal,
      delivery_fee: deliveryFee,
      total: grandTotal,
      payment_method,
      payment_status: paymentStatus,
      payment_reference: payment_reference || null,
      payment_proof_url: paymentProofUrl,
      status: orderStatus,
      created_at: now,
      updated_at: now,
      order_items: validatedItems,
    };

    registerMemoryOrder(fallbackOrderObj);

    return {
      success: true,
      orderNumber,
    };
  } catch (err: unknown) {
    console.error('Order creation error:', err);
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return {
      success: false,
      error: `Failed to place order: ${message}`,
    };
  }
}
