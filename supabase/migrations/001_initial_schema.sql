-- AssetFlow Database Schema (v1 - Final, No Order Issues)
-- =======================================

-- =======================================
-- 1. CORE ENUM TYPES
-- =======================================

CREATE TYPE user_role AS ENUM (
    'admin',
    'asset_manager',
    'department_head',
    'employee',
    'auditor',
    'technician'
);

CREATE TYPE asset_status AS ENUM (
    'available',
    'allocated',
    'reserved',
    'under_maintenance',
    'lost',
    'retired',
    'disposed'
);

CREATE TYPE asset_condition AS ENUM (
    'new',
    'excellent',
    'good',
    'fair',
    'damaged',
    'unusable'
);

CREATE TYPE allocation_status AS ENUM (
    'active',
    'returned',
    'overdue',
    'cancelled'
);

CREATE TYPE transfer_status AS ENUM (
    'requested',
    'approved',
    'rejected',
    'completed',
    'cancelled'
);

CREATE TYPE booking_status AS ENUM (
    'upcoming',
    'ongoing',
    'completed',
    'cancelled'
);

CREATE TYPE maintenance_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'technician_assigned',
    'in_progress',
    'resolved',
    'cancelled'
);

CREATE TYPE maintenance_priority AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

CREATE TYPE audit_status AS ENUM (
    'draft',
    'scheduled',
    'in_progress',
    'completed',
    'closed'
);

CREATE TYPE audit_verification AS ENUM (
    'pending',
    'verified',
    'missing',
    'damaged',
    'wrong_location'
);

CREATE TYPE notification_type AS ENUM (
    'asset_assigned',
    'transfer_requested',
    'transfer_approved',
    'transfer_rejected',
    'maintenance_requested',
    'maintenance_approved',
    'maintenance_rejected',
    'booking_confirmed',
    'booking_cancelled',
    'booking_reminder',
    'overdue_return',
    'audit_assigned',
    'audit_discrepancy',
    'general'
);

-- =======================================
-- 2. DATABASE TABLES
-- =======================================

-- Organizations Table
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    industry TEXT,
    email_domain TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    employee_code TEXT,
    phone TEXT,
    avatar_url TEXT,
    department_id UUID,
    role user_role NOT NULL DEFAULT 'employee',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Departments Table
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    parent_department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    department_head_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    location_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Asset Categories Table
CREATE TABLE public.asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    default_warranty_months INT DEFAULT 12,
    custom_fields JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Locations Table
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    building TEXT,
    floor TEXT,
    room TEXT,
    address TEXT,
    map_position_x NUMERIC,
    map_position_y NUMERIC,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Desks Table
CREATE TABLE public.desks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    desk_code TEXT NOT NULL,
    label TEXT,
    assigned_employee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    map_x NUMERIC(10,2) NOT NULL,
    map_y NUMERIC(10,2) NOT NULL,
    width NUMERIC(10,2) NOT NULL DEFAULT 100,
    height NUMERIC(10,2) NOT NULL DEFAULT 100,
    qr_code_value TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assets Table
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    asset_tag TEXT NOT NULL,
    name TEXT NOT NULL,
    category_id UUID REFERENCES public.asset_categories(id) ON DELETE SET NULL,
    serial_number TEXT,
    description TEXT,
    acquisition_date DATE,
    acquisition_cost NUMERIC(15,2),
    warranty_expiry_date DATE,
    condition asset_condition NOT NULL DEFAULT 'good',
    status asset_status NOT NULL DEFAULT 'available',
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    desk_id UUID REFERENCES public.desks(id) ON DELETE SET NULL,
    assigned_employee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_shared BOOLEAN DEFAULT false,
    is_bookable BOOLEAN DEFAULT false,
    image_url TEXT,
    document_url TEXT,
    qr_code_value TEXT,
    manufacturer TEXT,
    model TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    expected_retirement_date DATE,
    next_maintenance_date DATE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_asset_tag_organization UNIQUE (organization_id, asset_tag),
    CONSTRAINT unique_serial_number_organization UNIQUE (organization_id, serial_number)
);

-- Asset Allocations Table
CREATE TABLE public.asset_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    allocated_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    allocation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_return_date DATE,
    actual_return_date DATE,
    check_out_condition asset_condition,
    check_out_notes TEXT,
    check_in_condition asset_condition,
    check_in_notes TEXT,
    status allocation_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT allocation_has_recipient CHECK (
        (employee_id IS NOT NULL) OR (department_id IS NOT NULL)
    )
);

-- Transfer Requests Table
CREATE TABLE public.transfer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    current_allocation_id UUID REFERENCES public.asset_allocations(id) ON DELETE SET NULL,
    requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    from_employee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    from_department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    to_employee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    to_department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    reason TEXT,
    status transfer_status NOT NULL DEFAULT 'requested',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resource Bookings Table
CREATE TABLE public.resource_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    booked_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    purpose TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status booking_status NOT NULL DEFAULT 'upcoming',
    attendee_count INT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT booking_times_valid CHECK (end_time > start_time)
);

-- Maintenance Requests Table
CREATE TABLE public.maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    raised_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_technician_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    issue_description TEXT,
    priority maintenance_priority NOT NULL DEFAULT 'medium',
    status maintenance_status NOT NULL DEFAULT 'pending',
    image_url TEXT,
    estimated_cost NUMERIC(15,2),
    actual_cost NUMERIC(15,2),
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Cycles Table
CREATE TABLE public.audit_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status audit_status NOT NULL DEFAULT 'draft',
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    closed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Assignments Table
CREATE TABLE public.audit_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_cycle_id UUID NOT NULL REFERENCES public.audit_cycles(id) ON DELETE CASCADE,
    auditor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Items Table
CREATE TABLE public.audit_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_cycle_id UUID NOT NULL REFERENCES public.audit_cycles(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    expected_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    actual_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    verification_status audit_verification NOT NULL DEFAULT 'pending',
    notes TEXT,
    evidence_url TEXT,
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ
);

-- Notifications Table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    notification_type notification_type NOT NULL DEFAULT 'general',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity Logs Table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Asset Status History Table
CREATE TABLE public.asset_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    previous_status asset_status,
    new_status asset_status NOT NULL,
    reason TEXT,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Saved AI Queries Table
CREATE TABLE public.saved_ai_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    generated_filters JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chatbot Conversations Table
CREATE TABLE public.chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chatbot Messages Table
CREATE TABLE public.chatbot_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    tool_name TEXT,
    tool_result JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =======================================
-- 3. HELPER & UTILITY FUNCTIONS
-- =======================================

-- Helper function to get current organization id from JWT
CREATE OR REPLACE FUNCTION current_organization_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT nullif(current_setting('request.jwt.claims', true)::json->>'organization_id', '')::uuid;
$$;

-- Helper function to get current user's role from profiles table
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT current_user_role() = 'admin';
$$;

-- Helper function to check if current user is asset manager
CREATE OR REPLACE FUNCTION is_asset_manager()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT current_user_role() IN ('admin', 'asset_manager');
$$;

-- Helper function to check if current user is department head (of given dept)
CREATE OR REPLACE FUNCTION is_department_head(target_department_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.departments d
        WHERE d.id = target_department_id
        AND d.department_head_id = auth.uid()
    ) OR is_asset_manager();
$$;

-- Helper function to check if user belongs to a department
CREATE OR REPLACE FUNCTION belongs_to_department(target_department_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
        AND p.department_id = target_department_id
    ) OR is_department_head(target_department_id);
$$;

-- Function to auto-generate asset tags
CREATE OR REPLACE FUNCTION generate_asset_tag(org_id UUID)
RETURNS TEXT
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    last_tag TEXT;
    tag_num INT;
BEGIN
    SELECT asset_tag INTO last_tag
    FROM public.assets
    WHERE organization_id = org_id
    ORDER BY asset_tag DESC
    LIMIT 1;

    IF last_tag IS NULL THEN
        RETURN 'AF-0001';
    END IF;

    tag_num := (split_part(last_tag, '-', 2)::INT) + 1;
    RETURN 'AF-' || lpad(tag_num::TEXT, 4, '0');
END;
$$;

-- Function to identify overdue allocations
CREATE OR REPLACE FUNCTION mark_overdue_allocations()
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.asset_allocations
    SET status = 'overdue'
    WHERE status = 'active'
    AND expected_return_date IS NOT NULL
    AND expected_return_date < NOW();
END;
$$;

-- Function to update booking statuses
CREATE OR REPLACE FUNCTION update_booking_statuses()
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Mark as ongoing if start time reached
    UPDATE public.resource_bookings
    SET status = 'ongoing'
    WHERE status = 'upcoming'
    AND start_time <= NOW()
    AND end_time > NOW();

    -- Mark as completed if end time reached
    UPDATE public.resource_bookings
    SET status = 'completed'
    WHERE status IN ('upcoming', 'ongoing')
    AND end_time <= NOW();
END;
$$;

-- =======================================
-- 4. DATABASE TRIGGERS
-- =======================================

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Asset status history trigger function
CREATE OR REPLACE FUNCTION public.log_asset_status_change()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.asset_status_history (
            organization_id,
            asset_id,
            previous_status,
            new_status,
            changed_by,
            reason
        ) VALUES (
            NEW.organization_id,
            NEW.id,
            OLD.status,
            NEW.status,
            auth.uid(),
            'Automatic status update'
        );
    END IF;
    RETURN NEW;
END;
$$;

-- Apply updated_at triggers to all tables that have updated_at column
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_departments_updated_at
BEFORE UPDATE ON public.departments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_asset_categories_updated_at
BEFORE UPDATE ON public.asset_categories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_assets_updated_at
BEFORE UPDATE ON public.assets
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER log_asset_status_changes
AFTER UPDATE ON public.assets
FOR EACH ROW
EXECUTE FUNCTION public.log_asset_status_change();

CREATE TRIGGER update_asset_allocations_updated_at
BEFORE UPDATE ON public.asset_allocations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_resource_bookings_updated_at
BEFORE UPDATE ON public.resource_bookings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_maintenance_requests_updated_at
BEFORE UPDATE ON public.maintenance_requests
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_chatbot_conversations_updated_at
BEFORE UPDATE ON public.chatbot_conversations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =======================================
-- 5. INDEXES
-- =======================================

CREATE INDEX idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_department_id ON public.profiles(department_id);

CREATE INDEX idx_departments_organization_id ON public.departments(organization_id);
CREATE INDEX idx_departments_parent_id ON public.departments(parent_department_id);

CREATE INDEX idx_asset_categories_organization_id ON public.asset_categories(organization_id);
CREATE INDEX idx_locations_organization_id ON public.locations(organization_id);
CREATE INDEX idx_desks_organization_id ON public.desks(organization_id);

CREATE INDEX idx_assets_organization_id ON public.assets(organization_id);
CREATE INDEX idx_assets_status ON public.assets(status);
CREATE INDEX idx_assets_category_id ON public.assets(category_id);
CREATE INDEX idx_assets_department_id ON public.assets(department_id);
CREATE INDEX idx_assets_assigned_id ON public.assets(assigned_employee_id);

CREATE INDEX idx_asset_allocations_organization_id ON public.asset_allocations(organization_id);
CREATE INDEX idx_asset_allocations_asset_id ON public.asset_allocations(asset_id);
CREATE INDEX idx_asset_allocations_status ON public.asset_allocations(status);

CREATE INDEX idx_transfer_requests_organization_id ON public.transfer_requests(organization_id);
CREATE INDEX idx_transfer_requests_asset_id ON public.transfer_requests(asset_id);
CREATE INDEX idx_transfer_requests_status ON public.transfer_requests(status);

CREATE INDEX idx_resource_bookings_organization_id ON public.resource_bookings(organization_id);
CREATE INDEX idx_resource_bookings_asset_id ON public.resource_bookings(asset_id);
CREATE INDEX idx_resource_bookings_status ON public.resource_bookings(status);
CREATE INDEX idx_resource_bookings_times ON public.resource_bookings(start_time, end_time);

CREATE INDEX idx_maintenance_requests_organization_id ON public.maintenance_requests(organization_id);
CREATE INDEX idx_maintenance_requests_asset_id ON public.maintenance_requests(asset_id);
CREATE INDEX idx_maintenance_requests_status ON public.maintenance_requests(status);
CREATE INDEX idx_maintenance_requests_priority ON public.maintenance_requests(priority);

CREATE INDEX idx_audit_cycles_organization_id ON public.audit_cycles(organization_id);
CREATE INDEX idx_audit_cycles_status ON public.audit_cycles(status);
CREATE INDEX idx_audit_items_cycle_id ON public.audit_items(audit_cycle_id);
CREATE INDEX idx_audit_items_asset_id ON public.audit_items(asset_id);
CREATE INDEX idx_audit_assignments_cycle_id ON public.audit_assignments(audit_cycle_id);
CREATE INDEX idx_audit_assignments_auditor_id ON public.audit_assignments(auditor_id);

CREATE INDEX idx_notifications_organization_id ON public.notifications(organization_id);
CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

CREATE INDEX idx_activity_logs_organization_id ON public.activity_logs(organization_id);
CREATE INDEX idx_activity_logs_entity_type_id ON public.activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_actor_id ON public.activity_logs(actor_id);

CREATE INDEX idx_asset_status_history_organization_id ON public.asset_status_history(organization_id);
CREATE INDEX idx_asset_status_history_asset_id ON public.asset_status_history(asset_id);

CREATE INDEX idx_saved_ai_queries_organization_id ON public.saved_ai_queries(organization_id);
CREATE INDEX idx_saved_ai_queries_user_id ON public.saved_ai_queries(user_id);

CREATE INDEX idx_chatbot_conversations_organization_id ON public.chatbot_conversations(organization_id);
CREATE INDEX idx_chatbot_conversations_user_id ON public.chatbot_conversations(user_id);
CREATE INDEX idx_chatbot_messages_conversation_id ON public.chatbot_messages(conversation_id);

-- =======================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_ai_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_messages ENABLE ROW LEVEL SECURITY;

-- Organizations RLS
CREATE POLICY "Organizations are viewable by organization members"
ON public.organizations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.organization_id = public.organizations.id
        AND p.id = auth.uid()
    )
);

-- Profiles RLS
CREATE POLICY "Profiles are viewable by organization members"
ON public.profiles FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Profiles are insertable by admins only"
ON public.profiles FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Profiles are updatable by admins"
ON public.profiles FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- Departments RLS
CREATE POLICY "Departments are viewable by organization members"
ON public.departments FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Departments are manageable by admins or asset managers"
ON public.departments FOR ALL
USING (is_asset_manager())
WITH CHECK (is_asset_manager());

-- Asset Categories RLS
CREATE POLICY "Asset categories are viewable by organization members"
ON public.asset_categories FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Asset categories are manageable by admins or asset managers"
ON public.asset_categories FOR ALL
USING (is_asset_manager())
WITH CHECK (is_asset_manager());

-- Locations RLS
CREATE POLICY "Locations are viewable by organization members"
ON public.locations FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Locations are manageable by admins or asset managers"
ON public.locations FOR ALL
USING (is_asset_manager())
WITH CHECK (is_asset_manager());

-- Desks RLS
CREATE POLICY "Desks are viewable by organization members"
ON public.desks FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Desks are manageable by admins or asset managers"
ON public.desks FOR ALL
USING (is_asset_manager())
WITH CHECK (is_asset_manager());

-- Assets RLS
CREATE POLICY "Assets are viewable by organization members"
ON public.assets FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Assets are manageable by admins or asset managers"
ON public.assets FOR ALL
USING (is_asset_manager())
WITH CHECK (is_asset_manager());

-- Asset Allocations RLS
CREATE POLICY "Asset allocations are viewable by organization members"
ON public.asset_allocations FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Asset allocations are manageable by admins or asset managers"
ON public.asset_allocations FOR ALL
USING (is_asset_manager())
WITH CHECK (is_asset_manager());

-- Transfer Requests RLS
CREATE POLICY "Transfer requests are viewable by organization members"
ON public.transfer_requests FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Transfer requests are insertable by all employees"
ON public.transfer_requests FOR INSERT
WITH CHECK (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Transfer requests are manageable by admins or asset managers"
ON public.transfer_requests FOR UPDATE
USING (is_asset_manager())
WITH CHECK (is_asset_manager());

-- Resource Bookings RLS
CREATE POLICY "Resource bookings are viewable by organization members"
ON public.resource_bookings FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Resource bookings are insertable by all employees"
ON public.resource_bookings FOR INSERT
WITH CHECK (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Resource bookings are manageable by admins or asset managers"
ON public.resource_bookings FOR UPDATE
USING (is_asset_manager() OR booked_by = auth.uid())
WITH CHECK (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

-- Maintenance Requests RLS
CREATE POLICY "Maintenance requests are viewable by organization members"
ON public.maintenance_requests FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Maintenance requests are insertable by all employees"
ON public.maintenance_requests FOR INSERT
WITH CHECK (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Maintenance requests are updatable by admins or technicians"
ON public.maintenance_requests FOR UPDATE
USING (
    is_asset_manager()
    OR (current_user_role() = 'technician' AND assigned_technician_id = auth.uid())
)
WITH CHECK (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

-- Audit Cycles RLS
CREATE POLICY "Audit cycles are viewable by organization members"
ON public.audit_cycles FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Audit cycles are manageable by admins or asset managers"
ON public.audit_cycles FOR ALL
USING (is_asset_manager())
WITH CHECK (is_asset_manager());

-- Audit Assignments RLS
CREATE POLICY "Audit assignments are viewable by organization members"
ON public.audit_assignments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.audit_cycles ac
        WHERE ac.id = public.audit_assignments.audit_cycle_id
        AND ac.organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid())
    )
);

CREATE POLICY "Audit assignments are manageable by admins or asset managers"
ON public.audit_assignments FOR ALL
USING (is_asset_manager())
WITH CHECK (is_asset_manager());

-- Audit Items RLS
CREATE POLICY "Audit items are viewable by organization members"
ON public.audit_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.audit_cycles ac
        WHERE ac.id = public.audit_items.audit_cycle_id
        AND ac.organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid())
    )
);

CREATE POLICY "Audit items are updatable by assigned auditors"
ON public.audit_items FOR UPDATE
USING (
    current_user_role() = 'auditor'
    AND EXISTS (
        SELECT 1 FROM public.audit_assignments aa
        WHERE aa.audit_cycle_id = public.audit_items.audit_cycle_id
        AND aa.auditor_id = auth.uid()
    )
)
WITH CHECK (
    current_user_role() = 'auditor'
    AND EXISTS (
        SELECT 1 FROM public.audit_assignments aa
        WHERE aa.audit_cycle_id = public.audit_items.audit_cycle_id
        AND aa.auditor_id = auth.uid()
    )
);

-- Notifications RLS
CREATE POLICY "Notifications are viewable by recipient only"
ON public.notifications FOR SELECT
USING (recipient_id = auth.uid());

CREATE POLICY "Notifications are insertable by service"
ON public.notifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Notifications are updatable by recipient"
ON public.notifications FOR UPDATE
USING (recipient_id = auth.uid())
WITH CHECK (recipient_id = auth.uid());

-- Activity Logs RLS
CREATE POLICY "Activity logs are viewable by organization members"
ON public.activity_logs FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

-- Asset Status History RLS
CREATE POLICY "Asset status history is viewable by organization members"
ON public.asset_status_history FOR SELECT
USING (organization_id = (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()));

-- Saved AI Queries RLS
CREATE POLICY "Saved AI queries are viewable and manageable by owner only"
ON public.saved_ai_queries FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Chatbot Conversations RLS
CREATE POLICY "Chatbot conversations are viewable and manageable by owner only"
ON public.chatbot_conversations FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Chatbot Messages RLS
CREATE POLICY "Chatbot messages are viewable by conversation owner"
ON public.chatbot_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.chatbot_conversations cc
        WHERE cc.id = public.chatbot_messages.conversation_id
        AND cc.user_id = auth.uid()
    )
);

CREATE POLICY "Chatbot messages are insertable by conversation owner"
ON public.chatbot_messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.chatbot_conversations cc
        WHERE cc.id = public.chatbot_messages.conversation_id
        AND cc.user_id = auth.uid()
    )
);

-- =======================================
-- 7. DASHBOARD KPI FUNCTION
-- =======================================

CREATE OR REPLACE FUNCTION get_dashboard_kpis(org_id UUID)
RETURNS TABLE (
    total_assets INT,
    available_assets INT,
    allocated_assets INT,
    under_maintenance_assets INT,
    active_allocations INT,
    overdue_allocations INT,
    pending_maintenance_requests INT,
    upcoming_bookings INT,
    total_asset_value NUMERIC
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT
        COUNT(*) FILTER (WHERE id IS NOT NULL)::INT AS total_assets,
        COUNT(*) FILTER (WHERE status = 'available')::INT AS available_assets,
        COUNT(*) FILTER (WHERE status = 'allocated')::INT AS allocated_assets,
        COUNT(*) FILTER (WHERE status = 'under_maintenance')::INT AS under_maintenance_assets,
        (SELECT COUNT(*) FROM public.asset_allocations WHERE organization_id = org_id AND status = 'active')::INT AS active_allocations,
        (SELECT COUNT(*) FROM public.asset_allocations WHERE organization_id = org_id AND status = 'overdue')::INT AS overdue_allocations,
        (SELECT COUNT(*) FROM public.maintenance_requests WHERE organization_id = org_id AND status IN ('pending', 'approved'))::INT AS pending_maintenance_requests,
        (SELECT COUNT(*) FROM public.resource_bookings WHERE organization_id = org_id AND status = 'upcoming')::INT AS upcoming_bookings,
        SUM(acquisition_cost) AS total_asset_value
    FROM public.assets
    WHERE organization_id = org_id;
$$;

-- =======================================
-- 8. COMPLETED SCHEMA SETUP
-- =======================================
