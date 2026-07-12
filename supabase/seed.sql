-- AssetFlow Sample Seed Data
-- =======================================

-- WARNING: Only run this after the initial schema has been created!

-- Step 1: Create a sample organization
INSERT INTO public.organizations (id, name, code, industry, address)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'AssetFlow Demo Inc.',
    'AF-DEMO',
    'Technology',
    '123 Tech Boulevard, San Francisco, CA 94105'
);

-- Step 2: Create sample locations
INSERT INTO public.locations (id, organization_id, name, building, floor, room)
VALUES
    ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Headquarters', 'Building A', 'Ground', 'Lobby'),
    ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Headquarters', 'Building A', '1st', 'Engineering'),
    ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Headquarters', 'Building A', '2nd', 'Executive');

-- Step 3: Create sample departments
INSERT INTO public.departments (id, organization_id, name, code, description, is_active)
VALUES
    ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'Engineering', 'ENG', 'Software Development and IT', true),
    ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', 'Operations', 'OPS', 'Facilities and Operations Management', true),
    ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', 'Finance', 'FIN', 'Accounting and Finance', true);

-- Step 4: Create sample asset categories
INSERT INTO public.asset_categories (id, organization_id, name, code, icon, default_warranty_months)
VALUES
    ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', 'Laptop', 'LAP', '💻', 24),
    ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', 'Monitor', 'MON', '🖥️', 24),
    ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000001', 'Printer', 'PRN', '🖨️', 12),
    ('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000001', 'Phone', 'PHN', '📱', 12);

-- Step 5: Create sample desks
INSERT INTO public.desks (id, organization_id, location_id, desk_code, label, map_x, map_y)
VALUES
    ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'DESK-001', 'John Doe', 100, 100),
    ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'DESK-002', 'Jane Smith', 200, 100),
    ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'DESK-003', 'Bob Johnson', 300, 100);

-- Step 6: Create sample assets
INSERT INTO public.assets (id, organization_id, asset_tag, name, category_id, serial_number, condition, status, department_id, location_id, desk_id, acquisition_date, acquisition_cost, manufacturer, model)
VALUES
    ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001', 'AF-0001', 'MacBook Pro 16"', '00000000-0000-0000-0000-000000000301', 'SN-MAC-001', 'excellent', 'available', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000401', '2024-01-15', 2499.00, 'Apple', 'MacBook Pro 16" M3'),
    ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000001', 'AF-0002', 'Dell XPS 15', '00000000-0000-0000-0000-000000000301', 'SN-DELL-001', 'good', 'available', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000402', '2024-02-20', 1899.00, 'Dell', 'XPS 15 9530'),
    ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000001', 'AF-0003', 'HP LaserJet Pro', '00000000-0000-0000-0000-000000000303', 'SN-HP-001', 'good', 'available', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000102', NULL, '2023-11-10', 349.99, 'HP', 'LaserJet Pro MFP'),
    ('00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000001', 'AF-0004', 'LG 27UL850-W', '00000000-0000-0000-0000-000000000302', 'SN-LG-001', 'new', 'available', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000102', NULL, '2024-03-05', 499.99, 'LG', '27" 4K Monitor');

-- =======================================
-- Sample Seed Data Complete
-- =======================================
-- NOTE: To test with sample user profiles, you'll need to create users in Supabase Auth first!
-- =======================================

