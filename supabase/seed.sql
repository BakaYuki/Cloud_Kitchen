-- Seed Data for Himalayan Cloud Kitchen (Nepal)

-- 1. Insert Initial Site Settings
insert into site_settings (
  id,
  business_name,
  phone,
  email,
  address,
  delivery_fee,
  free_delivery_threshold,
  minimum_order_amount,
  opening_hours,
  esewa_qr_url,
  khalti_qr_url,
  bank_qr_url,
  bank_name,
  bank_account_name,
  bank_account_number
) values (
  '00000000-0000-0000-0000-000000000001',
  'Himalayan Cloud Kitchen',
  '+977 9801234567',
  'order@himalayanfood.com.np',
  'Jhamsikhel, Lalitpur, Nepal',
  100,
  1500,
  200,
  '[
    {"day": "Sunday", "open": "10:00 AM", "close": "10:00 PM", "is_closed": false},
    {"day": "Monday", "open": "10:00 AM", "close": "10:00 PM", "is_closed": false},
    {"day": "Tuesday", "open": "10:00 AM", "close": "10:00 PM", "is_closed": false},
    {"day": "Wednesday", "open": "10:00 AM", "close": "10:00 PM", "is_closed": false},
    {"day": "Thursday", "open": "10:00 AM", "close": "10:00 PM", "is_closed": false},
    {"day": "Friday", "open": "10:00 AM", "close": "10:30 PM", "is_closed": false},
    {"day": "Saturday", "open": "10:00 AM", "close": "10:30 PM", "is_closed": false}
  ]'::jsonb,
  'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=esewa://payment?id=9801234567&name=HimalayanCloudKitchen',
  'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=khalti://payment?id=9801234567&name=HimalayanCloudKitchen',
  'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=nabilbank://transfer?ac=01201017500123&name=HimalayanCloudKitchen',
  'Nabil Bank Limited',
  'Himalayan Cloud Kitchen Pvt. Ltd.',
  '01201017500123'
) on conflict (id) do nothing;

-- 2. Insert Categories
insert into categories (id, name, description, image_url, display_order, is_active) values
  ('11111111-1111-1111-1111-111111111101', 'Momos', 'Authentic handmade Tibetan and Nepali steamed, fried, and jhol dumplings.', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80', 1, true),
  ('11111111-1111-1111-1111-111111111102', 'Chowmein', 'Wok-tossed noodles with garden-fresh veggies and secret Himalayan spices.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80', 2, true),
  ('11111111-1111-1111-1111-111111111103', 'Thukpa', 'Hearty and comforting Himalayan noodle soup infused with mountain herbs.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', 3, true),
  ('11111111-1111-1111-1111-111111111104', 'Snacks & Sekuwa', 'Crispy traditional bites, spiced sekuwa skewers, and tongue-tingling sadeko.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', 4, true),
  ('11111111-1111-1111-1111-111111111105', 'Drinks & Beverages', 'Refreshing sweet lassi, authentic masala chiya, and cold thirst-quenchers.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', 5, true)
on conflict (id) do nothing;

-- 3. Insert Products
insert into products (id, category_id, name, description, price, image_url, is_available, is_featured, display_order) values
  -- Momos
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'Steamed Chicken Momo', 'Ten juicy minced chicken dumplings seasoned with fresh ginger, cilantro, and served with spicy tomato sesame achar.', 180, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', true, true, 1),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', 'Buff Steam Momo', 'Classic Kathmandu-style spiced minced water buffalo dumplings wrapped in tender dough with hot yellow timur chutney.', 170, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', true, true, 2),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111101', 'Chicken Jhol Momo', 'Steamed chicken momos served submerged in a warm, tangy roasted sesame, soybean, and tomato broth.', 220, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80', true, true, 3),
  ('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111101', 'Spicy Chilli (C-Momo) Chicken', 'Crispy pan-fried chicken momos tossed with onions, green bell peppers, garlic, and fiery homemade hot sauce.', 240, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80', true, true, 4),
  ('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111101', 'Veg Paneer Steam Momo', 'Delicate parcels stuffed with grated cottage cheese, crisp cabbage, carrots, spring onions, and fragrant herbs.', 160, 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80', true, false, 5),

  -- Chowmein
  ('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111102', 'Chicken Chowmein', 'Street-style wok-fried noodles with shredded chicken breast, crunchy cabbage, carrots, dark soy sauce, and scallions.', 190, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', true, true, 6),
  ('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111102', 'Buff Chowmein', 'Savory stir-fried noodles loaded with spicy sauteed buff strips, capsicum, green chillies, and aromatic spices.', 180, 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', true, false, 7),
  ('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111102', 'Veg Himalayan Chowmein', 'Crisp vegetable stir-fry with tender noodles tossed in light sesame oil and mountain pepper.', 150, 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80', true, false, 8),

  -- Thukpa
  ('22222222-2222-2222-2222-222222222209', '11111111-1111-1111-1111-111111111103', 'Himalayan Chicken Thukpa', 'Traditional Tibetan winter noodle soup loaded with slow-cooked shredded chicken, shredded vegetables, and warm ginger broth.', 210, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', true, true, 9),
  ('22222222-2222-2222-2222-222222222210', '11111111-1111-1111-1111-111111111103', 'Veg Mountain Thukpa', 'Rich vegetable noodle broth enriched with mushrooms, spinach, carrots, and roasted garlic.', 160, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80', true, false, 10),

  -- Snacks & Sekuwa
  ('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111104', 'Charcoal Chicken Sekuwa', 'Tender boneless chicken marinated in authentic Dharan-style mustard oil, fenugreek, and cumin roasted over open coals.', 260, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', true, true, 11),
  ('22222222-2222-2222-2222-222222222212', '11111111-1111-1111-1111-111111111104', 'Aloo Sadeko', 'Boiled potatoes marinated in toasted fenugreek mustard oil, green chilies, cilantro, and freshly squeezed lemon juice.', 120, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', true, false, 12),
  ('22222222-2222-2222-2222-222222222213', '11111111-1111-1111-1111-111111111104', 'Buff Sukuti Sadeko', 'Crispy sun-dried spiced buffalo meat tossed with raw shallots, roasted garlic, mustard oil, and fiery timur.', 290, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80', false, false, 13),

  -- Drinks & Beverages
  ('22222222-2222-2222-2222-222222222214', '11111111-1111-1111-1111-111111111105', 'Sweet Himalayan Mint Lassi', 'Chilled creamy yogurt blended with Himalayan blossom honey, fresh mint leaves, and cardamom powder.', 120, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80', true, true, 14),
  ('22222222-2222-2222-2222-222222222215', '11111111-1111-1111-1111-111111111105', 'Authentic Masala Chiya', 'Rich milk tea simmered with fresh mountain ginger, cloves, cardamom pods, and black tea leaves.', 50, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', true, false, 15),
  ('22222222-2222-2222-2222-222222222216', '11111111-1111-1111-1111-111111111105', 'Fresh Lemon Soda (Salted/Sweet)', 'Fizzy bubbly club soda with fresh lime juice, rock salt, and optional mint syrup.', 90, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', true, false, 16)
on conflict (id) do nothing;
