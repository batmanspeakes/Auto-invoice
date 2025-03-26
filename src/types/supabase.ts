export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          firstName: string
          lastName: string
          role: 'admin' | 'staff' | 'client'
          status: 'active' | 'inactive' | 'pending'
          createdAt: string
          updatedAt: string
          avatar?: string
          company?: string
          contactPhone?: string
          departmentId?: string
          department?: string
          supervisorId?: string
        }
        Insert: {
          id: string
          email: string
          firstName: string
          lastName: string
          role: 'admin' | 'staff' | 'client'
          status?: 'active' | 'inactive' | 'pending'
          createdAt?: string
          updatedAt?: string
          avatar?: string
          company?: string
          contactPhone?: string
          departmentId?: string
          department?: string
          supervisorId?: string
        }
        Update: {
          id?: string
          email?: string
          firstName?: string
          lastName?: string
          role?: 'admin' | 'staff' | 'client'
          status?: 'active' | 'inactive' | 'pending'
          updatedAt?: string
          avatar?: string
          company?: string
          contactPhone?: string
          departmentId?: string
          department?: string
          supervisorId?: string
        }
      }
      user_permissions: {
        Row: {
          id: string
          user_id: string
          // Admin permissions
          canManageUsers?: boolean
          canManageRoles?: boolean
          canViewReports?: boolean
          canManageBilling?: boolean
          canManageSettings?: boolean
          fullAccess?: boolean
          // Staff permissions
          canCreateInvoices?: boolean
          canEditInvoices?: boolean
          canDeleteInvoices?: boolean
          canSendInvoices?: boolean
          canManageClients?: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          user_id: string
          // Admin permissions
          canManageUsers?: boolean
          canManageRoles?: boolean
          canViewReports?: boolean
          canManageBilling?: boolean
          canManageSettings?: boolean
          fullAccess?: boolean
          // Staff permissions
          canCreateInvoices?: boolean
          canEditInvoices?: boolean
          canDeleteInvoices?: boolean
          canSendInvoices?: boolean
          canManageClients?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          user_id?: string
          // Admin permissions
          canManageUsers?: boolean
          canManageRoles?: boolean
          canViewReports?: boolean
          canManageBilling?: boolean
          canManageSettings?: boolean
          fullAccess?: boolean
          // Staff permissions
          canCreateInvoices?: boolean
          canEditInvoices?: boolean
          canDeleteInvoices?: boolean
          canSendInvoices?: boolean
          canManageClients?: boolean
          updatedAt?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          logo?: string
          address?: string
          contactEmail?: string
          contactPhone?: string
          website?: string
          taxIdentifier?: string
          createdAt: string
          updatedAt: string
          ownerId: string
        }
        Insert: {
          id?: string
          name: string
          logo?: string
          address?: string
          contactEmail?: string
          contactPhone?: string
          website?: string
          taxIdentifier?: string
          createdAt?: string
          updatedAt?: string
          ownerId: string
        }
        Update: {
          name?: string
          logo?: string
          address?: string
          contactEmail?: string
          contactPhone?: string
          website?: string
          taxIdentifier?: string
          updatedAt?: string
          ownerId?: string
        }
      }
      invoices: {
        Row: {
          id: string
          number: string
          client_id: string
          organization_id: string
          amount: number
          tax_amount: number
          total_amount: number
          status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          issued_date: string
          due_date: string
          paid_date?: string
          notes?: string
          created_by: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          number: string
          client_id: string
          organization_id: string
          amount: number
          tax_amount: number
          total_amount: number
          status?: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          issued_date: string
          due_date: string
          paid_date?: string
          notes?: string
          created_by: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          number?: string
          client_id?: string
          organization_id?: string
          amount?: number
          tax_amount?: number
          total_amount?: number
          status?: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          issued_date?: string
          due_date?: string
          paid_date?: string
          notes?: string
          created_by?: string
          updatedAt?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
