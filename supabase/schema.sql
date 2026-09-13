-- ============================================================
-- Tynoc E-Commerce — Complete Supabase Schema
-- ============================================================
-- Idempotent: safe to run multiple times (CREATE IF NOT EXISTS).

-- ── Helper ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── Categories ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id           uuid PRIMARY KEY,
  name         text        NOT NULL,
  slug         text        NOT NULL UNIQUE,
  description  text,
  image        text,
  productcount integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── Products ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id             uuid PRIMARY KEY,
  name           text        NOT NULL,
  slug           text        NOT NULL UNIQUE,
  description    text,
  price          numeric     NOT NULL,
  originalprice  numeric,
  images         jsonb       NOT NULL DEFAULT '[]'::jsonb,
  categoryid     uuid        NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  category       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  stock          integer     NOT NULL DEFAULT 0,
  rating         numeric,
  reviewcount    integer     NOT NULL DEFAULT 0,
  features       jsonb       NOT NULL DEFAULT '[]'::jsonb,
  specifications jsonb       NOT NULL DEFAULT '{}'::jsonb,
  tags           jsonb       NOT NULL DEFAULT '[]'::jsonb,
  isfeatured     boolean     NOT NULL DEFAULT false,
  isnew          boolean     NOT NULL DEFAULT false,
  isonsale       boolean     NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_products_updated_at') THEN
    CREATE TRIGGER set_products_updated_at
      BEFORE UPDATE ON products
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_categoryid ON products(categoryid);
CREATE INDEX IF NOT EXISTS idx_products_isfeatured ON products(isfeatured);
CREATE INDEX IF NOT EXISTS idx_products_isnew      ON products(isnew);
CREATE INDEX IF NOT EXISTS idx_products_onsale     ON products(isonsale);

-- ── Users ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         uuid PRIMARY KEY,
  name       text        NOT NULL,
  email      text        NOT NULL UNIQUE,
  password   text,
  avatar     text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Cart ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  productid  text        NOT NULL,
  product    jsonb       NOT NULL DEFAULT '{}'::jsonb,
  quantity   integer     NOT NULL DEFAULT 1,
  userid     text        NOT NULL,
  added_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_userid ON cart(userid);
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_user_product ON cart(userid, productid);

-- ── Wishlist ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  productid  text        NOT NULL,
  product    jsonb       NOT NULL DEFAULT '{}'::jsonb,
  userid     text        NOT NULL,
  added_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wishlist_userid ON wishlist(userid);
CREATE UNIQUE INDEX IF NOT EXISTS idx_wishlist_user_product ON wishlist(userid, productid);

-- ── Orders ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userid           text        NOT NULL,
  items            jsonb       NOT NULL DEFAULT '[]'::jsonb,
  subtotal         numeric     NOT NULL DEFAULT 0,
  shipping         numeric     NOT NULL DEFAULT 0,
  tax              numeric     NOT NULL DEFAULT 0,
  total            numeric     NOT NULL DEFAULT 0,
  status           text        NOT NULL DEFAULT 'pending',
  shipping_address jsonb,
  payment_method   jsonb,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_userid ON orders(userid);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_orders_updated_at') THEN
    CREATE TRIGGER set_orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ── Notifications ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userid     text        NOT NULL,
  title      text        NOT NULL,
  message    text,
  type       text        NOT NULL DEFAULT 'system',
  is_read    boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_userid ON notifications(userid);

-- ── Row Level Security ─────────────────────────────────────────
ALTER TABLE categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart          ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist      ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on categories' AND tablename = 'categories') THEN
    CREATE POLICY "Allow all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on products' AND tablename = 'products') THEN
    CREATE POLICY "Allow all on products" ON products FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on users' AND tablename = 'users') THEN
    CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on cart' AND tablename = 'cart') THEN
    CREATE POLICY "Allow all on cart" ON cart FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on wishlist' AND tablename = 'wishlist') THEN
    CREATE POLICY "Allow all on wishlist" ON wishlist FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on orders' AND tablename = 'orders') THEN
    CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on notifications' AND tablename = 'notifications') THEN
    CREATE POLICY "Allow all on notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
