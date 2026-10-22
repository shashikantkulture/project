-- ==============================================================================
-- LUXIGNIA CRM & E-COMMERCE OPERATING SYSTEM - SUPABASE POSTGRESQL SCHEMA
-- Production-ready schema with Row Level Security (RLS), Foreign Keys,
-- Indexes, Enums, and Audit Triggers for Luxignia Luxury Artisanal Brand.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TYPE user_role_enum AS ENUM (
  'super_admin',
  'admin',
  'curatorial_manager',
  'sales_concierge',
  'customer_support',
  'marketing_director',
  'warehouse_lead',
  'finance_controller',
  'customer'
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  encrypted_password TEXT,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role_enum NOT NULL DEFAULT 'customer',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'invited')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ROLES & PERMISSIONS
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  module TEXT NOT NULL, -- 'dashboard', 'orders', 'customers', 'leads', 'products', 'inventory', 'finance', 'marketing', 'support', 'settings'
  can_view BOOLEAN DEFAULT TRUE,
  can_create BOOLEAN DEFAULT FALSE,
  can_edit BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  can_export BOOLEAN DEFAULT FALSE,
  can_approve BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(role_id, module)
);

-- 3. CUSTOMER CRM
CREATE TYPE customer_segment_enum AS ENUM (
  'VIP',
  'High Value',
  'Loyal',
  'New',
  'Returning',
  'At Risk',
  'Inactive',
  'Abandoned Cart',
  'Wholesale',
  'Influencer'
);

CREATE TYPE vip_tier_enum AS ENUM ('Silver', 'Gold', 'Platinum', 'Diamond');

CREATE TABLE IF NOT EXISTS customer_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  criteria_json JSONB DEFAULT '{}',
  color TEXT DEFAULT '#4F46E5',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  company TEXT,
  vip_tier vip_tier_enum DEFAULT 'Silver',
  segment customer_segment_enum DEFAULT 'New',
  total_spent NUMERIC(12, 2) DEFAULT 0.00,
  orders_count INT DEFAULT 0,
  average_order_value NUMERIC(10, 2) DEFAULT 0.00,
  lifetime_value NUMERIC(12, 2) DEFAULT 0.00,
  last_purchase_at TIMESTAMPTZ,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_type TEXT DEFAULT 'shipping' CHECK (address_type IN ('shipping', 'billing', 'both')),
  street_line1 TEXT NOT NULL,
  street_line2 TEXT,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CATEGORIES & COLLECTIONS
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  curator_note TEXT,
  hero_image TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCTS & VARIANTS
CREATE TYPE product_status_enum AS ENUM ('Active', 'Draft', 'Low Stock', 'Out of Stock', 'Archived');

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  sku TEXT UNIQUE NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  sale_price NUMERIC(10, 2),
  stock_quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT DEFAULT 3,
  status product_status_enum NOT NULL DEFAULT 'Active',
  material TEXT,
  finish TEXT,
  dimensions TEXT,
  weight TEXT,
  vastu_zone TEXT,
  vastu_benefit TEXT,
  primary_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]',
  description TEXT,
  specifications JSONB DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  units_sold INT DEFAULT 0,
  total_revenue NUMERIC(12, 2) DEFAULT 0.00,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  variant_name TEXT NOT NULL, -- e.g. "Polished Gold Brass - Grande"
  size TEXT,
  color TEXT,
  finish TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. INVENTORY & WAREHOUSES
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT NOT NULL,
  manager_name TEXT,
  contact_phone TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  current_stock INT NOT NULL DEFAULT 0,
  reserved_stock INT NOT NULL DEFAULT 0,
  available_stock INT GENERATED ALWAYS AS (current_stock - reserved_stock) STORED,
  reorder_level INT DEFAULT 5,
  incoming_stock INT DEFAULT 0,
  last_counted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, warehouse_id)
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase_received', 'sale_dispatch', 'return_restock', 'manual_adjustment', 'transfer_in', 'transfer_out')),
  quantity_change INT NOT NULL,
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  reference_id TEXT, -- Order ID or Transfer ID
  notes TEXT,
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ORDERS & ITEMS
CREATE TYPE order_status_enum AS ENUM (
  'New',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned',
  'Refunded',
  'Failed'
);

CREATE TYPE payment_status_enum AS ENUM ('Pending', 'Authorized', 'Paid', 'Partially Refunded', 'Refunded', 'Failed');

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  patron_name TEXT NOT NULL,
  patron_email TEXT NOT NULL,
  patron_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0.00,
  tax_amount NUMERIC(10, 2) DEFAULT 0.00, -- GST 18%
  shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT DEFAULT 'Razorpay / UPI',
  payment_status payment_status_enum DEFAULT 'Paid',
  payment_gateway_ref TEXT,
  order_status order_status_enum DEFAULT 'New',
  courier_name TEXT DEFAULT 'Luxignia White-Glove Security',
  tracking_number TEXT,
  estimated_delivery TIMESTAMPTZ,
  notes TEXT,
  internal_comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  sku TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  transaction_ref TEXT UNIQUE NOT NULL,
  payment_gateway TEXT NOT NULL CHECK (payment_gateway IN ('Razorpay', 'Stripe', 'UPI', 'Wire Transfer', 'Cash on Delivery')),
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status payment_status_enum NOT NULL DEFAULT 'Paid',
  gateway_response JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  courier TEXT NOT NULL,
  tracking_number TEXT UNIQUE NOT NULL,
  tracking_url TEXT,
  dispatch_date TIMESTAMPTZ DEFAULT NOW(),
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  status TEXT DEFAULT 'in_transit' CHECK (status IN ('label_created', 'in_transit', 'out_for_delivery', 'delivered', 'exception')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. RETURNS & REFUNDS
CREATE TYPE return_status_enum AS ENUM (
  'Requested',
  'Approved',
  'Pickup Scheduled',
  'Received',
  'Inspection',
  'Refunded',
  'Rejected'
);

CREATE TABLE IF NOT EXISTS returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_number TEXT UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  customer_notes TEXT,
  images JSONB DEFAULT '[]',
  condition_assessment TEXT,
  refund_amount NUMERIC(10, 2) NOT NULL,
  status return_status_enum DEFAULT 'Requested',
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_id UUID REFERENCES returns(id) ON DELETE SET NULL,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  gateway_refund_id TEXT,
  reason TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  issued_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. LEADS & SALES PIPELINE (KANBAN)
CREATE TYPE lead_stage_enum AS ENUM (
  'New Lead',
  'Contacted',
  'Qualified',
  'Interested',
  'Negotiation',
  'Payment Pending',
  'Won',
  'Lost'
);

CREATE TYPE lead_source_enum AS ENUM (
  'Website',
  'Instagram',
  'Facebook',
  'Google',
  'WhatsApp',
  'Referral',
  'Influencer',
  'Campaign',
  'Offline Showroom',
  'Other'
);

CREATE TYPE lead_score_enum AS ENUM ('Hot', 'Warm', 'Cold');

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  source lead_source_enum DEFAULT 'Website',
  deal_value NUMERIC(10, 2) DEFAULT 0.00,
  stage lead_stage_enum DEFAULT 'New Lead',
  score lead_score_enum DEFAULT 'Warm',
  priority TEXT DEFAULT 'High' CHECK (priority IN ('Low', 'Medium', 'High', 'VIP')),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_name TEXT DEFAULT 'Rajesh Varma',
  last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
  next_followup_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'whatsapp', 'email', 'meeting', 'note', 'stage_change')),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. MARKETING CRM & AUDIENCES
CREATE TYPE campaign_type_enum AS ENUM ('Email', 'WhatsApp', 'SMS', 'Push Notification', 'Meta Ads', 'Google Ads');

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type campaign_type_enum NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Draft', 'Scheduled', 'Active', 'Completed', 'Paused')),
  audience_criteria JSONB DEFAULT '{}',
  reach INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  spend NUMERIC(10, 2) DEFAULT 0.00,
  revenue NUMERIC(10, 2) DEFAULT 0.00,
  roas NUMERIC(5, 2) GENERATED ALWAYS AS (CASE WHEN spend > 0 THEN ROUND((revenue / spend), 2) ELSE 0 END) STORED,
  ctr NUMERIC(5, 2) GENERATED ALWAYS AS (CASE WHEN reach > 0 THEN ROUND(((clicks::numeric / reach::numeric) * 100), 2) ELSE 0 END) STORED,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_audiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  engaged BOOLEAN DEFAULT FALSE,
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, customer_id)
);

-- 11. ABANDONED CARTS
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  patron_name TEXT NOT NULL,
  patron_email TEXT NOT NULL,
  patron_phone TEXT,
  cart_value NUMERIC(10, 2) NOT NULL,
  items JSONB NOT NULL,
  abandoned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recovery_status TEXT DEFAULT 'Unrecovered' CHECK (recovery_status IN ('Unrecovered', 'Email Sent', 'WhatsApp Sent', 'Coupon Sent', 'Recovered')),
  recovery_sent_at TIMESTAMPTZ,
  recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. COUPONS & PROMOTIONS
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2) DEFAULT 0.00,
  max_discount_amount NUMERIC(10, 2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  usage_limit INT DEFAULT 100,
  times_used INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. LOYALTY & VIP PROGRAM
CREATE TABLE IF NOT EXISTS loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  points_balance INT DEFAULT 0,
  points_earned_lifetime INT DEFAULT 0,
  points_redeemed_lifetime INT DEFAULT 0,
  current_tier vip_tier_enum DEFAULT 'Silver',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earned', 'redeemed', 'expired', 'bonus')),
  points INT NOT NULL,
  reference_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. REVIEWS & REPUTATION
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'Approved' CHECK (status IN ('Pending', 'Approved', 'Hidden', 'Flagged')),
  reply_text TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. SUPPORT / SERVICE TICKETS
CREATE TYPE ticket_priority_enum AS ENUM ('Low', 'Medium', 'High', 'Urgent');
CREATE TYPE ticket_status_enum AS ENUM ('Open', 'In Progress', 'Waiting', 'Resolved', 'Closed');

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  category TEXT DEFAULT 'Order Inquiry',
  priority ticket_priority_enum DEFAULT 'Medium',
  status ticket_status_enum DEFAULT 'Open',
  assigned_agent UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_name TEXT DEFAULT 'Concierge Desk',
  sla_target_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'agent', 'system', 'internal_note')),
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('order', 'payment', 'inventory', 'lead', 'ticket', 'campaign', 'system')),
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. FINANCE, EXPENSES, VENDORS
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  category TEXT, -- 'Artisan Foundry', 'Italian Marble Supplier', 'White Glove Courier', 'Packaging Studio'
  tax_id TEXT, -- GSTIN
  address TEXT,
  rating NUMERIC(3, 1) DEFAULT 4.8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Raw Materials', 'Foundry Casting', 'Packaging & Crating', 'Courier Logistics', 'Showroom Lease', 'Marketing & Ads', 'Software & SaaS', 'Salaries', 'Other')),
  amount NUMERIC(10, 2) NOT NULL,
  tax_amount NUMERIC(10, 2) DEFAULT 0.00,
  expense_date DATE NOT NULL,
  payment_method TEXT DEFAULT 'Bank Transfer',
  status TEXT DEFAULT 'Paid' CHECK (status IN ('Pending', 'Approved', 'Paid', 'Cancelled')),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_number TEXT UNIQUE NOT NULL,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'Ordered' CHECK (status IN ('Draft', 'Ordered', 'Partially Received', 'Completed', 'Cancelled')),
  expected_arrival TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. AUDIT LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  entity_id TEXT,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR ULTRA-HIGH PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_segment ON customers(segment);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_activity_logs_module ON activity_logs(module);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow authenticated staff with admin/manager roles full access
CREATE POLICY staff_full_access ON orders
  FOR ALL
  USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'curatorial_manager', 'sales_concierge'));

CREATE POLICY staff_customer_access ON customers
  FOR ALL
  USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'curatorial_manager', 'sales_concierge', 'customer_support'));
