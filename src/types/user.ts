export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CLIENT = 'client'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole | string;
  status?: UserStatus | string;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  organizationId?: string;
  department?: string;
  title?: string;
  supervisorId?: string;
}

export interface AdminPermissions {
  canManageUsers?: boolean;
  canManageRoles?: boolean;
  canViewReports?: boolean;
  canManageBilling?: boolean;
  canManageSettings?: boolean;
  fullAccess?: boolean;
}

export interface StaffPermissions {
  canCreateInvoices?: boolean;
  canEditInvoices?: boolean;
  canDeleteInvoices?: boolean;
  canSendInvoices?: boolean;
  canManageClients?: boolean;
  canViewReports?: boolean;
}

export interface AdminUser extends User {
  role: UserRole.ADMIN;
  permissions?: AdminPermissions;
}

export interface StaffUser extends User {
  role: UserRole.STAFF;
  permissions?: StaffPermissions;
}

export interface ClientUser extends User {
  role: UserRole.CLIENT;
}

export const createBasicUser = (
  id: string, 
  email: string, 
  role: string = UserRole.CLIENT.toString()
): User => {
  return {
    id,
    email,
    role,
    firstName: '',
    lastName: '',
    status: UserStatus.PENDING.toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: null
  };
};

export interface UserInvitation {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'client';
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  expiresAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'client';
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  createdAt: string;
  lastActive?: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  taxIdentifier?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string; // Admin user who owns this organization
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  invoicePrefix: string;
  defaultPaymentTerms: number;
  defaultTaxRate: number;
  currency: string;
  dateFormat: string;
  fiscalYearStart: string; // MM-DD format
  billingAddress?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode?: string;
    swiftCode?: string;
  };
} 