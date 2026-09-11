-- ============================================================
-- Orders, Payment Methods, and Notifications
-- ============================================================

-- Orders
CREATE TABLE orders (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userid           text        NOT NULL,
  items            jsonb       NOT NULL DEFAULT '[]'::jsonb,
  subtotal         numeric,
  shipping         numeric,
  tax              numeric,
  total            numeric,
  status           text        NOT NULL DEFAULT 'pending',
  shipping_address jsonb,
  payment_method   jsonb,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_userid ON orders(userid);

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Payment Methods
CREATE TABLE payment_methods (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userid       text        NOT NULL,
  type         text        NOT NULL,
  last4        text,
  brand        text,
  expiry_month integer,
  expiry_year  integer,
  is_default   boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_methods_userid ON payment_methods(userid);

-- Notifications
CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userid     text        NOT NULL,
  title      text        NOT NULL,
  message    text,
  type       text        NOT NULL DEFAULT 'system',
  is_read    boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_userid ON notifications(userid);

-- Row Level Security
ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on orders"          ON orders          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on payment_methods" ON payment_methods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on notifications"   ON notifications   FOR ALL USING (true) WITH CHECK (true);
