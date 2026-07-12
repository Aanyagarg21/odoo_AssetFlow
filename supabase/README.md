# AssetFlow - Supabase Setup

## Overview
This directory contains the database schema, migrations, and seed data for the AssetFlow asset management application.

---

## Prerequisites
1. A Supabase project created at [https://supabase.com](https://supabase.com)
2. Your Supabase `URL`, `ANON KEY`, and `SERVICE ROLE KEY` from the [Supabase Dashboard](https://supabase.com/dashboard) → Project → Settings → API.

---

## Step-by-Step Setup Guide

### 1. Apply Database Schema
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** → **New Query**
3. Copy and paste the entire contents of `migrations/001_initial_schema.sql` into the query
4. Click **Run** to execute the query

### 2. Insert Sample Seed Data (Optional)
1. In the Supabase SQL Editor, create a **New Query**
2. Copy and paste the entire contents of `seed.sql` into the query
3. Click **Run** to insert sample data into your database

---

## Directory Structure

```
supabase/
├── migrations/
│   └── 001_initial_schema.sql   # Core database schema (enums, tables, RLS, functions)
├── seed.sql                     # Sample data for testing
└── README.md                    # This file!
```

---

## What's Included in 001_initial_schema.sql

### Core Enums
- `user_role`: admin, asset_manager, department_head, employee, auditor, technician
- `asset_status`: available, allocated, reserved, under_maintenance, lost, retired, disposed
- And more (see file for complete list!)

### Tables
- **organizations**: Top-level organization/tenant data
- **profiles**: User profiles linked to Supabase Auth
- **departments**: Organizational departments
- **assets**: Core asset management table
- **asset_allocations**: Tracks asset assignments to employees/departments
- And many more supporting tables!

### Features
- ✅ Row Level Security (RLS) for multi-tenant security
- ✅ Helper functions for checking user roles
- ✅ Auto-updating `updated_at` timestamps
- ✅ Status history tracking for assets
- ✅ Indexes for performance optimization
- ✅ KPI calculation function for dashboards

---

## Important Notes
- **Environment Variables**: Make sure you add these to your `.env.local` file in the root directory:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  OPENAI_API_KEY=
  ```
- **RLS Policies**: The schema includes strict Row Level Security policies, ensure your JWT tokens include `organization_id` when necessary.
- **Foreign Keys**: Circular references (if any) are handled safely using `ON DELETE SET NULL`.

---

## Next Steps
After setting up the database:
1. Create user accounts in Supabase Auth
2. Insert corresponding profiles into `public.profiles`
3. Start using the AssetFlow app!
