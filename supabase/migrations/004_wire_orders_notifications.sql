-- ============================================================
-- Orders and Notifications tables with correct constraints
-- ============================================================

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

ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on orders' AND tablename = 'orders'
  ) THEN
    CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on notifications' AND tablename = 'notifications'
  ) THEN
    CREATE POLICY "Allow all on notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Ensure updated_at trigger exists on orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_orders_updated_at'
  ) THEN
    CREATE TRIGGER set_orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
