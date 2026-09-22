-- ============================================================
-- Tynoc E-Commerce — Complete Seed Data
-- ============================================================
-- Run AFTER schema.sql. Uses deterministic UUIDs so FKs resolve.
-- ON CONFLICT upserts so the script is idempotent.
-- Password: bcrypt hash of "password123"

-- ── Categories ─────────────────────────────────────────────────
INSERT INTO categories (id, name, slug, description, image, productcount, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Electronics',       'electronics',       'Latest gadgets and tech',              'https://cdn.dummyjson.com/products/images/electronics/airpods-max.jpg',                5, '2024-01-01T00:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Clothing',          'clothing',          'Fashion and apparel',                   'https://cdn.dummyjson.com/products/images/mens-shirts/blue-hawaiian-shirt.jpg',        4, '2024-01-01T00:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Home & Kitchen',    'home-kitchen',      'Furniture and appliances',              'https://cdn.dummyjson.com/products/images/furniture/marble-desk.jpg',                  4, '2024-01-01T00:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Sports & Outdoors', 'sports-outdoors',   'Athletic gear and equipment',           'https://cdn.dummyjson.com/products/images/sports-accessories/basketball.jpg',          4, '2024-01-01T00:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Books',             'books',             'Fiction and non-fiction',               'https://cdn.dummyjson.com/images/book-cover.png',                                      4, '2024-01-01T00:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Beauty',            'beauty',            'Skincare and cosmetics',                'https://cdn.dummyjson.com/products/images/skincare/cerave-moisturizing-cream.jpg',     4, '2024-01-01T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description,
  image = EXCLUDED.image, productcount = EXCLUDED.productcount;

-- ============================================================
-- Products
-- ============================================================

-- ── Electronics (5) ────────────────────────────────────────────

INSERT INTO products (id, name, slug, description, price, originalprice, images, categoryid, category, stock, rating, reviewcount, features, specifications, tags, isfeatured, isnew, isonsale, created_at, updated_at)
VALUES
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'Wireless Noise-Cancelling Headphones',
  'wireless-noise-cancelling-headphones',
  'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and Hi-Res Audio support. Perfect for commuters and audiophiles alike.',
  279.99, 349.99,
  '["https://cdn.dummyjson.com/products/images/electronics/airpods-max.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440001',
  '{"id":"550e8400-e29b-41d4-a716-446655440001","name":"Electronics","slug":"electronics","description":"Latest gadgets and tech","image":"https://cdn.dummyjson.com/products/images/electronics/airpods-max.jpg","productCount":5}'::jsonb,
  45, 4.7, 1283,
  '["Industry-leading noise cancellation","30-hour wireless battery life","Multipoint Bluetooth connection","Speak-to-Chat technology","Premium comfort fit"]'::jsonb,
  '{"Driver Size":"40mm","Frequency Response":"4Hz - 40kHz","Battery Life":"30 hours (NC ON)","Weight":"254g","Connectivity":"Bluetooth 5.2"}'::jsonb,
  '["headphones","wireless","noise-cancelling"]'::jsonb,
  true, false, true,
  '2024-06-15T10:00:00Z', '2024-11-20T14:30:00Z'
),
(
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  'Ultra-Slim 15" Laptop',
  'ultra-slim-15-laptop',
  'Powerful and portable laptop featuring the latest 13th-gen processor, 16GB RAM, and a stunning 2K display. Weighs under 3 lbs for effortless carry.',
  1199.00, 1199.00,
  '["https://cdn.dummyjson.com/products/images/electronics/macbook-pro-14.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440001',
  '{"id":"550e8400-e29b-41d4-a716-446655440001","name":"Electronics","slug":"electronics","description":"Latest gadgets and tech","image":"https://cdn.dummyjson.com/products/images/electronics/airpods-max.jpg","productCount":5}'::jsonb,
  22, 4.5, 847,
  '["13th Gen Intel Core i7 processor","16GB LPDDR5 RAM","15.6\" 2K IPS display","512GB NVMe SSD","All-day 12-hour battery"]'::jsonb,
  '{"Processor":"Intel Core i7-1360P","RAM":"16GB LPDDR5","Storage":"512GB NVMe SSD","Display":"15.6\" 2K (2560x1440) IPS","Weight":"1.32 kg"}'::jsonb,
  '["laptop","ultrabook","portable"]'::jsonb,
  true, true, false,
  '2024-09-01T08:00:00Z', '2024-11-15T10:00:00Z'
),
(
  'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
  'Smart Fitness Watch Pro',
  'smart-fitness-watch-pro',
  'Advanced fitness tracker with GPS, heart-rate monitoring, sleep analysis, and 7-day battery. Water-resistant to 50m for swimmers.',
  199.99, 249.99,
  '["https://cdn.dummyjson.com/products/images/electronics/apple-watch.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440001',
  '{"id":"550e8400-e29b-41d4-a716-446655440001","name":"Electronics","slug":"electronics","description":"Latest gadgets and tech","image":"https://cdn.dummyjson.com/products/images/electronics/airpods-max.jpg","productCount":5}'::jsonb,
  67, 4.3, 2156,
  '["Built-in GPS tracking","24/7 heart-rate monitoring","Advanced sleep analysis","7-day battery life","50m water resistance"]'::jsonb,
  '{"Display":"1.4\" AMOLED","Water Resistance":"5 ATM (50m)","Sensors":"HR, SpO2, GPS, Accelerometer","Battery":"Up to 7 days","Compatibility":"iOS & Android"}'::jsonb,
  '["fitness","smartwatch","wearable"]'::jsonb,
  false, false, true,
  '2024-03-20T12:00:00Z', '2024-10-10T16:45:00Z'
),
(
  'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80',
  '4K Ultra HD Action Camera',
  '4k-ultra-hd-action-camera',
  'Rugged 4K action camera with image stabilisation, waterproof housing, and Wi-Fi connectivity. Capture every adventure in cinematic detail.',
  329.00, 329.00,
  '["https://cdn.dummyjson.com/products/images/electronics/canon-camera.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440001',
  '{"id":"550e8400-e29b-41d4-a716-446655440001","name":"Electronics","slug":"electronics","description":"Latest gadgets and tech","image":"https://cdn.dummyjson.com/products/images/electronics/airpods-max.jpg","productCount":5}'::jsonb,
  34, 4.6, 562,
  '["4K60fps video recording","Electronic image stabilisation","Waterproof to 10m without housing","Wi-Fi & Bluetooth connectivity","Voice control activation"]'::jsonb,
  '{"Resolution":"4K @ 60fps","Field of View":"170° wide-angle","Water Resistance":"10m (裸机)","Storage":"microSD up to 1TB","Battery":"1800mAh (approx. 2 hours)"}'::jsonb,
  '["action-camera","4k","waterproof"]'::jsonb,
  false, true, false,
  '2024-10-05T09:00:00Z', '2024-11-01T11:30:00Z'
),
(
  'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8090',
  'Portable Bluetooth Speaker',
  'portable-bluetooth-speaker',
  'Powerful portable speaker with deep bass, 20-hour battery life, and IP67 waterproof rating. Perfect for outdoor adventures and pool parties.',
  59.99, 79.99,
  '["https://cdn.dummyjson.com/products/images/electronics/jbl-boombox.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440001',
  '{"id":"550e8400-e29b-41d4-a716-446655440001","name":"Electronics","slug":"electronics","description":"Latest gadgets and tech","image":"https://cdn.dummyjson.com/products/images/electronics/airpods-max.jpg","productCount":5}'::jsonb,
  120, 4.5, 892,
  '["360-degree immersive sound","20-hour playtime","IP67 waterproof and dustproof","Built-in powerbank","PartyBoost for chaining speakers"]'::jsonb,
  '{"Speaker Type":"Portable Bluetooth","Battery Life":"20 hours","Waterproof":"IP67","Weight":"960g","Connectivity":"Bluetooth 5.1"}'::jsonb,
  '["speaker","bluetooth","portable","waterproof"]'::jsonb,
  false, true, true,
  '2024-11-10T14:00:00Z', '2024-11-15T09:00:00Z'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description,
  price = EXCLUDED.price, originalprice = EXCLUDED.originalprice, images = EXCLUDED.images,
  categoryid = EXCLUDED.categoryid, category = EXCLUDED.category, stock = EXCLUDED.stock,
  rating = EXCLUDED.rating, reviewcount = EXCLUDED.reviewcount, features = EXCLUDED.features,
  specifications = EXCLUDED.specifications, tags = EXCLUDED.tags,
  isfeatured = EXCLUDED.isfeatured, isnew = EXCLUDED.isnew, isonsale = EXCLUDED.isonsale,
  updated_at = EXCLUDED.updated_at;

-- ── Clothing (4) ───────────────────────────────────────────────

INSERT INTO products (id, name, slug, description, price, originalprice, images, categoryid, category, stock, rating, reviewcount, features, specifications, tags, isfeatured, isnew, isonsale, created_at, updated_at)
VALUES
(
  'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8091',
  'Classic Oxford Button-Down Shirt',
  'classic-oxford-button-down-shirt',
  'Timeless oxford cotton shirt with a tailored fit. Wrinkle-resistant fabric makes it ideal for the office or casual weekends.',
  59.99, 79.99,
  '["https://cdn.dummyjson.com/products/images/mens-shirts/blue-hawaiian-shirt.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440002',
  '{"id":"550e8400-e29b-41d4-a716-446655440002","name":"Clothing","slug":"clothing","description":"Fashion and apparel","image":"https://cdn.dummyjson.com/products/images/mens-shirts/blue-hawaiian-shirt.jpg","productCount":4}'::jsonb,
  88, 4.4, 734,
  '["100% premium oxford cotton","Tailored modern fit","Wrinkle-resistant finish","Reinforced buttons","Machine washable"]'::jsonb,
  '{"Material":"100% Oxford Cotton","Fit":"Tailored","Care":"Machine wash cold","Collar":"Button-down","Available":"XS – XXL"}'::jsonb,
  '["shirt","oxford","menswear"]'::jsonb,
  false, false, true,
  '2024-02-10T08:00:00Z', '2024-09-25T14:00:00Z'
),
(
  'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f809102',
  'High-Waist Stretch Leggings',
  'high-waist-stretch-leggings',
  'Buttery-soft high-waist leggings with 4-way stretch. Squat-proof, moisture-wicking, and perfect for yoga or everyday wear.',
  44.99, 44.99,
  '["https://cdn.dummyjson.com/products/images/womens-dresses/silk-midi-dress.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440002',
  '{"id":"550e8400-e29b-41d4-a716-446655440002","name":"Clothing","slug":"clothing","description":"Fashion and apparel","image":"https://cdn.dummyjson.com/products/images/mens-shirts/blue-hawaiian-shirt.jpg","productCount":4}'::jsonb,
  120, 4.8, 3412,
  '["4-way stretch fabric","Squat-proof design","Moisture-wicking technology","High-rise waistband","Hidden waistband pocket"]'::jsonb,
  '{"Material":"78% Nylon, 22% Spandex","Rise":"High-waist","Inseam":"27\"","Care":"Machine wash, hang dry","Available":"XS – XL"}'::jsonb,
  '["leggings","activewear","yoga"]'::jsonb,
  true, false, false,
  '2024-04-18T11:00:00Z', '2024-11-05T09:15:00Z'
),
(
  'a7b8c9d0-e1f2-4a3b-4c5d-6e7f80910213',
  'Waterproof Trail Running Jacket',
  'waterproof-trail-running-jacket',
  'Lightweight, fully-seam-sealed jacket with breathable membrane. Packs into its own pocket for easy storage on the go.',
  149.00, 189.00,
  '["https://cdn.dummyjson.com/products/images/mens-shirts/blue-hawaiian-shirt.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440002',
  '{"id":"550e8400-e29b-41d4-a716-446655440002","name":"Clothing","slug":"clothing","description":"Fashion and apparel","image":"https://cdn.dummyjson.com/products/images/mens-shirts/blue-hawaiian-shirt.jpg","productCount":4}'::jsonb,
  41, 4.6, 289,
  '["10,000mm waterproof rating","Fully seam-sealed","Breathable membrane","Packs into internal pocket","Adjustable hood & cuffs"]'::jsonb,
  '{"Material":"100% Recycled Polyester","Waterproof Rating":"10,000mm","Weight":"280g","Seams":"Fully sealed","Care":"Machine wash cool"}'::jsonb,
  '["jacket","waterproof","running"]'::jsonb,
  false, true, true,
  '2024-08-22T07:30:00Z', '2024-11-18T13:00:00Z'
),
(
  'b8c9d0e1-f2a3-4b4c-5d6e-7f8091021324',
  'Merino Wool Crew Socks (3-Pack)',
  'merino-wool-crew-socks-3-pack',
  'Ultra-soft merino wool socks with cushioned sole and arch support. Temperature-regulating and odour-resistant for all-day comfort.',
  28.99, 28.99,
  '["https://cdn.dummyjson.com/products/images/mens-shoes/air-max-90.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440002',
  '{"id":"550e8400-e29b-41d4-a716-446655440002","name":"Clothing","slug":"clothing","description":"Fashion and apparel","image":"https://cdn.dummyjson.com/products/images/mens-shirts/blue-hawaiian-shirt.jpg","productCount":4}'::jsonb,
  200, 4.7, 1587,
  '["70% merino wool blend","Cushioned sole","Arch support band","Temperature-regulating","Odour-resistant"]'::jsonb,
  '{"Material":"70% Merino Wool, 25% Nylon, 5% Spandex","Height":"Crew (mid-calf)","Sizes":"S, M, L","Pack":"3 pairs","Care":"Machine wash warm"}'::jsonb,
  '["socks","merino","wool"]'::jsonb,
  false, false, false,
  '2024-01-05T10:00:00Z', '2024-06-12T15:20:00Z'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description,
  price = EXCLUDED.price, originalprice = EXCLUDED.originalprice, images = EXCLUDED.images,
  categoryid = EXCLUDED.categoryid, category = EXCLUDED.category, stock = EXCLUDED.stock,
  rating = EXCLUDED.rating, reviewcount = EXCLUDED.reviewcount, features = EXCLUDED.features,
  specifications = EXCLUDED.specifications, tags = EXCLUDED.tags,
  isfeatured = EXCLUDED.isfeatured, isnew = EXCLUDED.isnew, isonsale = EXCLUDED.isonsale,
  updated_at = EXCLUDED.updated_at;

-- ── Home & Kitchen (4) ─────────────────────────────────────────

INSERT INTO products (id, name, slug, description, price, originalprice, images, categoryid, category, stock, rating, reviewcount, features, specifications, tags, isfeatured, isnew, isonsale, created_at, updated_at)
VALUES
(
  'c9d0e1f2-a3b4-4c5d-6e7f-809102132435',
  'Stainless Steel French Press Coffee Maker',
  'stainless-steel-french-press-coffee-maker',
  'Double-wall insulated French press that brews rich, full-bodied coffee in 4 minutes. Makes 8 cups of café-quality coffee at home.',
  39.99, 49.99,
  '["https://cdn.dummyjson.com/products/images/kitchen-accessories/coffee-mixing-spoon.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440003',
  '{"id":"550e8400-e29b-41d4-a716-446655440003","name":"Home & Kitchen","slug":"home-kitchen","description":"Furniture and appliances","image":"https://cdn.dummyjson.com/products/images/furniture/marble-desk.jpg","productCount":4}'::jsonb,
  73, 4.5, 2891,
  '["Double-wall vacuum insulation","Borosilicate glass beaker","316 stainless steel mesh filter","Makes 8 cups (34 oz)","Dishwasher safe"]'::jsonb,
  '{"Material":"18/10 Stainless Steel & Glass","Capacity":"34 oz (1 litre)","Insulation":"Double-wall vacuum","Filter":"Multi-layer mesh","Dishwasher":"Yes"}'::jsonb,
  '["coffee","french-press","kitchen"]'::jsonb,
  true, false, true,
  '2024-03-01T08:00:00Z', '2024-10-28T12:00:00Z'
),
(
  'd0e1f2a3-b4c5-4d6e-7f80-910213243546',
  'Ergonomic Office Chair with Lumbar Support',
  'ergonomic-office-chair-with-lumbar-support',
  'Fully adjustable mesh office chair with breathable back, adjustable lumbar, 4D armrests, and reclining seat. Supports up to 300 lbs.',
  549.00, 549.00,
  '["https://cdn.dummyjson.com/products/images/furniture/marble-desk.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440003',
  '{"id":"550e8400-e29b-41d4-a716-446655440003","name":"Home & Kitchen","slug":"home-kitchen","description":"Furniture and appliances","image":"https://cdn.dummyjson.com/products/images/furniture/marble-desk.jpg","productCount":4}'::jsonb,
  15, 4.8, 4521,
  '["Adjustable lumbar support","Breathable mesh back","4D adjustable armrests","Reclining 135° tilt","Supports up to 300 lbs"]'::jsonb,
  '{"Material":"Mesh, aluminium base","Max Weight":"300 lbs (136 kg)","Recline":"90° – 135°","Armrests":"4D adjustable","Warranty":"12-year limited"}'::jsonb,
  '["chair","ergonomic","office"]'::jsonb,
  true, false, false,
  '2024-02-14T14:00:00Z', '2024-11-10T09:30:00Z'
),
(
  'e1f2a3b4-c5d6-4e7f-8091-021324354657',
  'Robot Vacuum & Mop Combo',
  'robot-vacuum-mop-combo',
  'Smart robot vacuum with LiDAR navigation, 2500Pa suction, and simultaneous mopping. App-controlled with voice assistant support.',
  399.99, 499.99,
  '["https://cdn.dummyjson.com/products/images/home-decoration/ceramic-vase.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440003',
  '{"id":"550e8400-e29b-41d4-a716-446655440003","name":"Home & Kitchen","slug":"home-kitchen","description":"Furniture and appliances","image":"https://cdn.dummyjson.com/products/images/furniture/marble-desk.jpg","productCount":4}'::jsonb,
  28, 4.4, 1834,
  '["LiDAR precision navigation","2500Pa strong suction","Vacuum & mop simultaneously","App & voice control","180-minute runtime"]'::jsonb,
  '{"Suction":"2500Pa","Navigation":"LiDAR + SLAM","Runtime":"Up to 180 minutes","Dustbin":"450ml + 270ml water tank","Connectivity":"Wi-Fi, Alexa, Google Home"}'::jsonb,
  '["robot-vacuum","smart-home","cleaning"]'::jsonb,
  false, true, true,
  '2024-07-10T10:00:00Z', '2024-11-22T16:00:00Z'
),
(
  'f2a3b4c5-d6e7-4f80-9102-132435465768',
  'Ceramic Non-Stick Cookware Set (10-Piece)',
  'ceramic-non-stick-cookware-set-10-piece',
  'PFOA-free ceramic cookware set with even heat distribution. Includes frypans, saucepans, stockpot, and glass lids. Oven safe to 400°F.',
  189.99, 249.99,
  '["https://cdn.dummyjson.com/products/images/kitchen-accessories/coffee-mixing-spoon.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440003',
  '{"id":"550e8400-e29b-41d4-a716-446655440003","name":"Home & Kitchen","slug":"home-kitchen","description":"Furniture and appliances","image":"https://cdn.dummyjson.com/products/images/furniture/marble-desk.jpg","productCount":4}'::jsonb,
  37, 4.3, 956,
  '["PFOA-free ceramic coating","Even heat distribution","Dishwasher & oven safe","Cool-touch silicone handles","10-piece comprehensive set"]'::jsonb,
  '{"Coating":"Ceramic (PFOA-free)","Oven Safe":"Up to 400°F / 204°C","Pieces":"10 (frypans, saucepans, stockpot, lids)","Base":"Aluminium core","Dishwasher":"Yes"}'::jsonb,
  '["cookware","ceramic","kitchen-set"]'::jsonb,
  false, false, true,
  '2024-05-20T09:00:00Z', '2024-10-30T11:45:00Z'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description,
  price = EXCLUDED.price, originalprice = EXCLUDED.originalprice, images = EXCLUDED.images,
  categoryid = EXCLUDED.categoryid, category = EXCLUDED.category, stock = EXCLUDED.stock,
  rating = EXCLUDED.rating, reviewcount = EXCLUDED.reviewcount, features = EXCLUDED.features,
  specifications = EXCLUDED.specifications, tags = EXCLUDED.tags,
  isfeatured = EXCLUDED.isfeatured, isnew = EXCLUDED.isnew, isonsale = EXCLUDED.isonsale,
  updated_at = EXCLUDED.updated_at;

-- ── Sports & Outdoors (4) ──────────────────────────────────────

INSERT INTO products (id, name, slug, description, price, originalprice, images, categoryid, category, stock, rating, reviewcount, features, specifications, tags, isfeatured, isnew, isonsale, created_at, updated_at)
VALUES
(
  'a3b4c5d6-e7f8-4091-0213-243546576879',
  'Carbon Fiber Road Bike Frame',
  'carbon-fiber-road-bike-frame',
  'Lightweight T800 carbon fibre road frame with internal cable routing and tapered head tube. Available in sizes S, M, L.',
  899.00, 899.00,
  '["https://cdn.dummyjson.com/products/images/mountain-bike/black-steel-bottle.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440004',
  '{"id":"550e8400-e29b-41d4-a716-446655440004","name":"Sports & Outdoors","slug":"sports-outdoors","description":"Athletic gear and equipment","image":"https://cdn.dummyjson.com/products/images/sports-accessories/basketball.jpg","productCount":4}'::jsonb,
  12, 4.7, 178,
  '["T800 carbon fibre construction","Internal cable routing","Tapered head tube","Flat-mount disc brake tabs","Weight: 850g (size M)"]'::jsonb,
  '{"Material":"T800 Carbon Fibre","Weight":"850g (size M)","Head Tube":"Tapered 1-1/8\" to 1-1/2\"","Brakes":"Flat-mount disc","Sizes":"S, M, L"}'::jsonb,
  '["bike","carbon-fiber","road"]'::jsonb,
  false, true, false,
  '2024-09-15T08:00:00Z', '2024-11-12T10:00:00Z'
),
(
  'b4c5d6e7-f809-4102-1324-35465768798a',
  '2-Person Ultralight Camping Tent',
  '2-person-ultralight-camping-tent',
  'Freestanding ultralight tent weighing just 1.5 kg. Double-layer waterproof design with mesh inner for ventilation. Sets up in under 5 minutes.',
  259.99, 299.99,
  '["https://cdn.dummyjson.com/products/images/mens-shirts/blue-hawaiian-shirt.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440004',
  '{"id":"550e8400-e29b-41d4-a716-446655440004","name":"Sports & Outdoors","slug":"sports-outdoors","description":"Athletic gear and equipment","image":"https://cdn.dummyjson.com/products/images/sports-accessories/basketball.jpg","productCount":4}'::jsonb,
  19, 4.5, 643,
  '["Ultralight 1.5 kg total","3000mm waterproof rating","Freestanding design","Quick 5-minute setup","Compact stuff sack included"]'::jsonb,
  '{"Weight":"1.5 kg (3.3 lbs)","Capacity":"2 persons","Waterproof Rating":"3000mm","Material":"20D ripstop nylon","Packed":"45 × 15 cm"}'::jsonb,
  '["tent","camping","ultralight"]'::jsonb,
  true, false, true,
  '2024-04-05T11:00:00Z', '2024-11-08T14:20:00Z'
),
(
  'c5d6e7f8-0910-4213-2435-465768798a9b',
  'Adjustable Dumbbell Set (5-52.5 lbs)',
  'adjustable-dumbbell-set-5-52-5-lbs',
  'Space-saving adjustable dumbbells replacing 15 sets of weights. Quick-change dial adjusts from 5 to 52.5 lbs in 2.5 lb increments.',
  349.00, 429.00,
  '["https://cdn.dummyjson.com/products/images/sports-accessories/basketball.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440004',
  '{"id":"550e8400-e29b-41d4-a716-446655440004","name":"Sports & Outdoors","slug":"sports-outdoors","description":"Athletic gear and equipment","image":"https://cdn.dummyjson.com/products/images/sports-accessories/basketball.jpg","productCount":4}'::jsonb,
  24, 4.6, 2178,
  '["Replaces 15 sets of dumbbells","5 – 52.5 lbs per dumbbell","2.5 lb increment adjustments","Quick-change dial system","Compact storage cradle included"]'::jsonb,
  '{"Weight":"5 – 52.5 lbs per dumbbell","Increments":"2.5 lbs","Dumbbells":"2 included","Replaces":"15 pairs of fixed dumbbells","Material":"Steel, ABS plastic"}'::jsonb,
  '["dumbbells","home-gym","adjustable"]'::jsonb,
  false, false, true,
  '2024-01-20T13:00:00Z', '2024-09-15T10:30:00Z'
),
(
  'd6e7f809-1021-4324-3546-5768798a9b0c',
  'Insulated Stainless Steel Water Bottle (32 oz)',
  'insulated-stainless-steel-water-bottle-32-oz',
  'Triple-insulated water bottle keeps drinks cold for 24 hours or hot for 12. Leak-proof cap with wide mouth for easy cleaning.',
  34.99, 34.99,
  '["https://cdn.dummyjson.com/products/images/sports-accessories/basketball.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440004',
  '{"id":"550e8400-e29b-41d4-a716-446655440004","name":"Sports & Outdoors","slug":"sports-outdoors","description":"Athletic gear and equipment","image":"https://cdn.dummyjson.com/products/images/sports-accessories/basketball.jpg","productCount":4}'::jsonb,
  156, 4.8, 4523,
  '["Triple-wall vacuum insulation","Keeps cold 24h / hot 12h","18/8 stainless steel interior","Leak-proof screw cap","Wide mouth for ice cubes"]'::jsonb,
  '{"Capacity":"32 oz (946 ml)","Material":"18/8 Stainless Steel","Insulation":"Triple-wall vacuum","Cold Retention":"24 hours","Hot Retention":"12 hours"}'::jsonb,
  '["water-bottle","insulated","outdoors"]'::jsonb,
  true, false, false,
  '2024-06-01T07:00:00Z', '2024-11-14T08:45:00Z'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description,
  price = EXCLUDED.price, originalprice = EXCLUDED.originalprice, images = EXCLUDED.images,
  categoryid = EXCLUDED.categoryid, category = EXCLUDED.category, stock = EXCLUDED.stock,
  rating = EXCLUDED.rating, reviewcount = EXCLUDED.reviewcount, features = EXCLUDED.features,
  specifications = EXCLUDED.specifications, tags = EXCLUDED.tags,
  isfeatured = EXCLUDED.isfeatured, isnew = EXCLUDED.isnew, isonsale = EXCLUDED.isonsale,
  updated_at = EXCLUDED.updated_at;

-- ── Books (4) ──────────────────────────────────────────────────

INSERT INTO products (id, name, slug, description, price, originalprice, images, categoryid, category, stock, rating, reviewcount, features, specifications, tags, isfeatured, isnew, isonsale, created_at, updated_at)
VALUES
(
  'e7f80910-2132-4435-4657-68798a9b0c1d',
  'The Art of Clean Code',
  'the-art-of-clean-code',
  'A practical guide to writing maintainable, readable, and efficient code. Covers refactoring patterns, testing strategies, and architecture principles.',
  39.99, 39.99,
  '["https://cdn.dummyjson.com/images/book-cover.png"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440005',
  '{"id":"550e8400-e29b-41d4-a716-446655440005","name":"Books","slug":"books","description":"Fiction and non-fiction","image":"https://cdn.dummyjson.com/images/book-cover.png","productCount":4}'::jsonb,
  85, 4.9, 3267,
  '["350+ pages of practical advice","Real-world code examples","Refactoring patterns chapter","Companion GitHub repository","Foreword by industry expert"]'::jsonb,
  '{"Pages":"352","Format":"Paperback & eBook","Publisher":"Tech Press","ISBN":"978-1-234567-01-2","Language":"English"}'::jsonb,
  '["programming","clean-code","software-engineering"]'::jsonb,
  true, false, false,
  '2024-03-10T10:00:00Z', '2024-10-20T12:00:00Z'
),
(
  'f8091021-3243-4546-5768-798a9b0c1d2e',
  'Mindful Running: A Guide to Meditative Movement',
  'mindful-running-a-guide-to-meditative-movement',
  'Discover the intersection of mindfulness and running. Learn breathing techniques, mental training, and how to turn every run into a moving meditation.',
  18.99, 24.99,
  '["https://cdn.dummyjson.com/images/book-cover.png"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440005',
  '{"id":"550e8400-e29b-41d4-a716-446655440005","name":"Books","slug":"books","description":"Fiction and non-fiction","image":"https://cdn.dummyjson.com/images/book-cover.png","productCount":4}'::jsonb,
  62, 4.3, 412,
  '["Practical mindfulness exercises","Breathing technique tutorials","Race-day mental strategies","8-week training programme","Author is a certified coach"]'::jsonb,
  '{"Pages":"240","Format":"Paperback","Publisher":"Wellness Books","ISBN":"978-1-234567-02-9","Language":"English"}'::jsonb,
  '["running","mindfulness","self-help"]'::jsonb,
  false, true, true,
  '2024-08-05T09:00:00Z', '2024-11-01T14:30:00Z'
),
(
  '09102132-4354-4657-6879-8a9b0c1d2e3f',
  'The Midnight Garden',
  'the-midnight-garden',
  'A hauntingly beautiful novel about love, loss, and the secrets hidden in an overgrown garden. Winner of the 2024 Literary Prize.',
  22.99, 22.99,
  '["https://cdn.dummyjson.com/images/book-cover.png"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440005',
  '{"id":"550e8400-e29b-41d4-a716-446655440005","name":"Books","slug":"books","description":"Fiction and non-fiction","image":"https://cdn.dummyjson.com/images/book-cover.png","productCount":4}'::jsonb,
  48, 4.6, 1843,
  '["Winner of 2024 Literary Prize","Translated into 20+ languages","Author of 3 bestselling novels","Includes reading group questions","Hardcover with dust jacket"]'::jsonb,
  '{"Pages":"312","Format":"Hardcover & Paperback","Publisher":"Fiction House","ISBN":"978-1-234567-03-6","Language":"English"}'::jsonb,
  '["fiction","literary","award-winner"]'::jsonb,
  false, true, false,
  '2024-10-15T11:00:00Z', '2024-11-20T09:00:00Z'
),
(
  '10213243-5465-4768-798a-9b0c1d2e3f40',
  'The Complete Cookbook for Young Scientists',
  'the-complete-cookbook-for-young-scientists',
  'Over 75 recipes that blend cooking with science experiments. Learn the chemistry behind baking, emulsions, and fermentation.',
  26.99, 32.99,
  '["https://cdn.dummyjson.com/images/book-cover.png"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440005',
  '{"id":"550e8400-e29b-41d4-a716-446655440005","name":"Books","slug":"books","description":"Fiction and non-fiction","image":"https://cdn.dummyjson.com/images/book-cover.png","productCount":4}'::jsonb,
  70, 4.7, 876,
  '["75+ science-infused recipes","Kitchen-safe experiments","Full-colour photography","STEM learning integration","Ages 10+ with adult supervision"]'::jsonb,
  '{"Pages":"288","Format":"Hardcover","Publisher":"Science Kitchen Press","ISBN":"978-1-234567-04-3","Language":"English"}'::jsonb,
  '["cookbook","science","young-readers"]'::jsonb,
  false, false, true,
  '2024-05-12T08:00:00Z', '2024-10-25T13:15:00Z'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description,
  price = EXCLUDED.price, originalprice = EXCLUDED.originalprice, images = EXCLUDED.images,
  categoryid = EXCLUDED.categoryid, category = EXCLUDED.category, stock = EXCLUDED.stock,
  rating = EXCLUDED.rating, reviewcount = EXCLUDED.reviewcount, features = EXCLUDED.features,
  specifications = EXCLUDED.specifications, tags = EXCLUDED.tags,
  isfeatured = EXCLUDED.isfeatured, isnew = EXCLUDED.isnew, isonsale = EXCLUDED.isonsale,
  updated_at = EXCLUDED.updated_at;

-- ── Beauty (4) ─────────────────────────────────────────────────

INSERT INTO products (id, name, slug, description, price, originalprice, images, categoryid, category, stock, rating, reviewcount, features, specifications, tags, isfeatured, isnew, isonsale, created_at, updated_at)
VALUES
(
  '21324354-6576-4879-8a9b-0c1d2e3f4051',
  'Vitamin C Brightening Serum',
  'vitamin-c-brightening-serum',
  'Lightweight serum with 20% L-ascorbic acid, vitamin E, and ferulic acid. Fades dark spots, evens skin tone, and boosts radiance.',
  38.00, 38.00,
  '["https://cdn.dummyjson.com/products/images/skincare/cerave-moisturizing-cream.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440006',
  '{"id":"550e8400-e29b-41d4-a716-446655440006","name":"Beauty","slug":"beauty","description":"Skincare and cosmetics","image":"https://cdn.dummyjson.com/products/images/skincare/cerave-moisturizing-cream.jpg","productCount":4}'::jsonb,
  94, 4.7, 5123,
  '["20% L-ascorbic acid","Vitamin E & ferulic acid","Fades dark spots in 4 weeks","Lightweight, fast-absorbing","Dermatologist tested"]'::jsonb,
  '{"Volume":"30 ml / 1 fl oz","Key Ingredient":"20% L-ascorbic Acid","SkinType":"All skin types","Usage":"Morning, after cleansing","ShelfLife":"12 months after opening"}'::jsonb,
  '["serum","vitamin-c","brightening"]'::jsonb,
  true, false, false,
  '2024-02-28T10:00:00Z', '2024-11-18T11:30:00Z'
),
(
  '32435465-7687-498a-9b0c-1d2e3f405162',
  'Retinol Night Repair Cream',
  'retinol-night-repair-cream',
  'Rich night cream with encapsulated retinol (0.5%), hyaluronic acid, and peptides. Reduces fine lines while you sleep without irritation.',
  52.00, 64.00,
  '["https://cdn.dummyjson.com/products/images/skincare/clinique-moisturizer.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440006',
  '{"id":"550e8400-e29b-41d4-a716-446655440006","name":"Beauty","slug":"beauty","description":"Skincare and cosmetics","image":"https://cdn.dummyjson.com/products/images/skincare/cerave-moisturizing-cream.jpg","productCount":4}'::jsonb,
  53, 4.5, 2341,
  '["0.5% encapsulated retinol","Hyaluronic acid for hydration","Peptide complex for firmness","Non-irritating slow-release formula","Visible results in 6 weeks"]'::jsonb,
  '{"Volume":"50 ml / 1.7 fl oz","Key Ingredient":"0.5% Retinol","SkinType":"Mature & combination","Usage":"Evening, after cleansing","ShelfLife":"18 months after opening"}'::jsonb,
  '["retinol","night-cream","anti-aging"]'::jsonb,
  false, false, true,
  '2024-04-10T12:00:00Z', '2024-11-05T15:00:00Z'
),
(
  '43546576-8798-4a9b-0c1d-2e3f40516273',
  'Hydrating Hyaluronic Acid Moisturiser',
  'hydrating-hyaluronic-acid-moisturiser',
  'Gel-cream moisturiser with triple-weight hyaluronic acid, squalane, and ceramides. 72-hour hydration without heaviness.',
  32.00, 32.00,
  '["https://cdn.dummyjson.com/products/images/skincare/cerave-moisturizing-cream.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440006',
  '{"id":"550e8400-e29b-41d4-a716-446655440006","name":"Beauty","slug":"beauty","description":"Skincare and cosmetics","image":"https://cdn.dummyjson.com/products/images/skincare/cerave-moisturizing-cream.jpg","productCount":4}'::jsonb,
  110, 4.8, 3890,
  '["Triple-weight hyaluronic acid","Squalane & ceramide complex","72-hour lasting hydration","Lightweight gel-cream texture","Fragrance-free formula"]'::jsonb,
  '{"Volume":"50 ml / 1.7 fl oz","Key Ingredient":"Triple-weight HA","SkinType":"All skin types","Usage":"Morning & evening","ShelfLife":"24 months after opening"}'::jsonb,
  '["moisturiser","hyaluronic-acid","hydration"]'::jsonb,
  true, true, false,
  '2024-10-20T09:00:00Z', '2024-11-22T10:00:00Z'
),
(
  '54657687-989a-4b0c-1d2e-3f4051627384',
  'Matte Liquid Lipstick Duo',
  'matte-liquid-lipstick-duo',
  'Long-wear matte liquid lipstick set with two complementary shades. Infused with vitamin E for comfortable, non-drying wear up to 12 hours.',
  28.99, 34.99,
  '["https://cdn.dummyjson.com/products/images/skincare/clinique-moisturizer.jpg"]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440006',
  '{"id":"550e8400-e29b-41d4-a716-446655440006","name":"Beauty","slug":"beauty","description":"Skincare and cosmetics","image":"https://cdn.dummyjson.com/products/images/skincare/cerave-moisturizing-cream.jpg","productCount":4}'::jsonb,
  77, 4.4, 1256,
  '["12-hour wear time","Vitamin E infused","Two complementary shades","Non-drying matte finish","Cruelty-free & vegan"]'::jsonb,
  '{"Volume":"2 × 3 ml / 2 × 0.1 fl oz","Finish":"Matte","Wear Time":"Up to 12 hours","Ingredients":"Vitamin E, Jojoba Oil","Certifications":"Cruelty-free, Vegan"}'::jsonb,
  '["lipstick","matte","long-wear"]'::jsonb,
  false, false, true,
  '2024-07-15T11:00:00Z', '2024-11-12T14:00:00Z'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description,
  price = EXCLUDED.price, originalprice = EXCLUDED.originalprice, images = EXCLUDED.images,
  categoryid = EXCLUDED.categoryid, category = EXCLUDED.category, stock = EXCLUDED.stock,
  rating = EXCLUDED.rating, reviewcount = EXCLUDED.reviewcount, features = EXCLUDED.features,
  specifications = EXCLUDED.specifications, tags = EXCLUDED.tags,
  isfeatured = EXCLUDED.isfeatured, isnew = EXCLUDED.isnew, isonsale = EXCLUDED.isonsale,
  updated_at = EXCLUDED.updated_at;

-- ============================================================
-- Demo User (bcrypt hash of "password123") - ADMIN
-- ============================================================
INSERT INTO users (id, name, email, password, avatar, is_admin, created_at)
VALUES
  ('660e8400-e29b-41d4-a716-446655440099', 'Demo User', 'demo@example.com',
   '$2b$10$rT3JfSm0bnOLl1U5gUYujucmM0HV3AjDHGZUSlRSBRC04zCZRKSkK',
   'https://picsum.photos/seed/avatar/100/100', true, '2024-01-01T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, password = EXCLUDED.password,
  avatar = EXCLUDED.avatar, is_admin = EXCLUDED.is_admin;

-- ============================================================
-- Regular User (bcrypt hash of "password123")
-- ============================================================
INSERT INTO users (id, name, email, password, avatar, is_admin, created_at)
VALUES
  ('770e8400-e29b-41d4-a716-446655440099', 'Regular User', 'user@example.com',
   '$2b$10$rT3JfSm0bnOLl1U5gUYujucmM0HV3AjDHGZUSlRSBRC04zCZRKSkK',
   'https://picsum.photos/seed/avatar2/100/100', false, '2024-01-15T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, password = EXCLUDED.password,
  avatar = EXCLUDED.avatar, is_admin = EXCLUDED.is_admin;
