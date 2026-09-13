import { supabase } from "@/lib/db/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results: Record<string, any> = {};

  // Check if orders table exists
  try {
    const { data, error } = await (supabase as any)
      .from("orders")
      .select("id")
      .limit(1);

    if (error) {
      results.orders = { exists: false, error: error.message, code: error.code };

      // Try to create the orders table via RPC or raw SQL
      // Since we can't do raw SQL, we'll try inserting a test row to get a more specific error
      const testInsert = await (supabase as any)
        .from("orders")
        .insert({
          id: "00000000-0000-0000-0000-000000000000",
          userid: "__test__",
          items: [],
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (testInsert.error) {
        results.ordersCreate = {
          error: testInsert.error.message,
          code: testInsert.error.code,
          details: testInsert.error.details,
          hint: testInsert.error.hint,
        };

        // If it's a missing table, the hint/code will tell us
        if (testInsert.error.code === "42P01") {
          (results.orders as any).migrationNeeded = true;
          results.migrationSQL = `
Please run this SQL in your Supabase Dashboard > SQL Editor:

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

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on orders' AND tablename = 'orders'
  ) THEN
    CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Ensure the updated_at trigger function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
          `.trim();
        }
      } else {
        // Test insert succeeded, clean it up
        await (supabase as any).from("orders").delete().eq("id", "00000000-0000-0000-0000-000000000000");
        results.orders = { exists: true, insertWorks: true };
      }
    } else {
      results.orders = { exists: true, count: data?.length };
    }
  } catch (e: unknown) {
    results.orders = { exception: e instanceof Error ? e.message : String(e) };
  }

  // Also check notifications table
  try {
    const { data, error } = await (supabase as any)
      .from("notifications")
      .select("id")
      .limit(1);
    results.notifications = error
      ? { exists: false, error: error.message, code: error.code }
      : { exists: true };
  } catch (e: unknown) {
    results.notifications = { exception: e instanceof Error ? e.message : String(e) };
  }

  return Response.json(results, { status: 200 });
}
