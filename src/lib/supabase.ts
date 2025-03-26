import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://hkyekxgjeqkexuzyroee.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhreWVreGdqZXFrZXh1enlyb2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MzQxMDEsImV4cCI6MjA1ODMxMDEwMX0.s78qS3T7ehhbtCzbPNG5zs5hp2kLqoZnjMSWYoaCch8';

// Create Supabase client with additional options
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,     // Store session in localStorage
    detectSessionInUrl: true, // Check for access tokens in URL
    autoRefreshToken: true,   // Automatically refresh token before expiry
  },
  global: {
    headers: {
      'x-application-name': 'auto-invoice', // Identify your app in requests
    },
  },
  // Add more options as needed
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    error: error.message || 'An unexpected error occurred',
    status: error.status || 500
  };
};

// Type definitions for helper function returns
type UserProfileResult = {
  profile: Database['public']['Tables']['users']['Row'] | null;
  error: string | null;
};

type UserPermissionsResult = {
  permissions: Database['public']['Tables']['user_permissions']['Row'] | null;
  error: string | null;
};

type AuthUserResult = {
  user: any | null;
  error: string | null;
};

type SessionResult = {
  session: any | null;
  error: string | null;
};

// Utility to handle API request timeouts
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Auth helpers
export const getCurrentUser = async (): Promise<AuthUserResult> => {
  try {
    // Wrap request with timeout
    const { data: { user }, error } = await withTimeout(
      supabase.auth.getUser(),
      3000 // 3 second timeout
    );
    
    if (error) throw error;
    
    return { user, error: null };
  } catch (error: any) {
    console.error('Error getting current user:', error);
    return { user: null, error: error.message };
  }
};

export const getCurrentSession = async (): Promise<SessionResult> => {
  try {
    // Wrap request with timeout
    const { data, error } = await withTimeout(
      supabase.auth.getSession(),
      3000 // 3 second timeout
    );
    
    if (error) throw error;
    
    return { session: data.session, error: null };
  } catch (error: any) {
    console.error('Error getting current session:', error);
    return { session: null, error: error.message };
  }
};

// User data helpers
export const fetchUserProfile = async (userId: string): Promise<UserProfileResult> => {
  try {
    // Convert PostgrestBuilder to Promise using awaited .then()
    const { data, error } = await withTimeout(
      new Promise<any>((resolve) => {
        supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()
          .then(resolve);
      }),
      5000 // 5 second timeout
    );
    
    if (error) throw error;
    
    return { profile: data, error: null };
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return { profile: null, error: error.message };
  }
};

export const fetchUserPermissions = async (userId: string): Promise<UserPermissionsResult> => {
  try {
    // Convert PostgrestBuilder to Promise using awaited .then()
    const { data, error } = await withTimeout(
      new Promise<any>((resolve) => {
        supabase
          .from('user_permissions')
          .select('*')
          .eq('user_id', userId)
          .single()
          .then(resolve);
      }),
      5000 // 5 second timeout
    );
    
    if (error) throw error;
    
    return { permissions: data, error: null };
  } catch (error: any) {
    console.error('Error fetching user permissions:', error);
    return { permissions: null, error: error.message };
  }
};

// Organization helpers
export const fetchOrganization = async (orgId: string) => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();
      
    if (error) throw error;
    
    return { organization: data, error: null };
  } catch (error: any) {
    console.error('Error fetching organization:', error);
    return { organization: null, error: error.message };
  }
};

// Member management helpers
export const fetchOrganizationMembers = async (orgId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('organizationId', orgId);
      
    if (error) throw error;
    
    return { members: data, error: null };
  } catch (error: any) {
    console.error('Error fetching organization members:', error);
    return { members: [], error: error.message };
  }
}; 