# Supabase Database Setup Guide

This guide will help you set up your Supabase database for Auto-Invoice application.

## Steps to Create Database Tables

1. Log in to your Supabase dashboard: https://app.supabase.com

2. Select your project (e.g., "Auto-invoice")

3. Navigate to the "SQL Editor" section from the left sidebar

4. Create New Query and copy the SQL from the `database_setup.sql` file in this project

5. Execute the SQL script to create all necessary tables

## Table Structure

The database consists of the following tables:

- **organizations**: Stores company information
- **users**: Manages user accounts with different roles (admin, staff, client)
- **user_permissions**: Controls what actions each user can perform
- **clients**: Customer information
- **invoices**: Invoice records with line items stored as JSON

## Default Data

The setup script adds:
- A default organization
- An admin user (admin@example.com)
- Full permissions for the admin

## Authentication Setup

For Supabase Auth to work with our application:

1. Go to Authentication → Settings in your Supabase dashboard
2. Set the Site URL to your local development URL (e.g., http://localhost:3000)
3. Under "Redirect URLs" add:
   - http://localhost:3000
   - http://localhost:3000/login
   - http://localhost:3000/register
   - http://localhost:3000/forgot-password

4. Enable Email provider under "Authentication → Providers"

## Setting Admin Password

After running the setup script:

1. Go to Authentication → Users in Supabase
2. Find the admin@example.com user 
3. Use "Reset password" to set the admin password

## Troubleshooting

If you see "No tables created yet" in Supabase:
1. Make sure you've run the SQL script in the SQL Editor
2. Check for any error messages during execution
3. Refresh the Table Editor page

If you're having connection issues:
1. Check your Supabase URL and anon key in src/lib/supabase.ts
2. Ensure your Supabase project is active
3. Try running the application with `npm run dev`

## Testing the Connection

The application should now connect to your Supabase instance. If you're still experiencing issues:

1. Check browser console for specific error messages
2. Verify your network connection
3. Make sure Supabase service is running (check status on Supabase dashboard) 