import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Plus, MoreHorizontal, 
  Edit, Trash2, Mail, CheckCircle, XCircle, 
  AlertCircle, UserPlus, Download, RefreshCw,
  Eye, EyeOff, ShieldCheck, ShieldX, UserCog
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../layout/DashboardLayout';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from '../ui/use-toast';
import { UserRole } from '../../types/user';

// Mock data for users - would come from API in a real app
const USERS = [
  { 
    id: '1', 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    role: UserRole.ADMIN, 
    createdAt: '2023-01-15T14:30:00Z',
    lastActive: '2023-05-28T09:12:00Z',
    status: 'active',
    permissions: {
      canManageUsers: true,
      canManageBilling: true,
    },
    organizationId: 'org-1',
    avatarUrl: '',
  },
  { 
    id: '2', 
    name: 'Bob Smith', 
    email: 'bob@example.com', 
    role: UserRole.STAFF, 
    createdAt: '2023-02-10T11:20:00Z',
    lastActive: '2023-05-27T16:45:00Z',
    status: 'active',
    permissions: {
      canCreateInvoices: true,
      canViewInvoices: true,
      canEditInvoices: true,
      canSendInvoices: true,
      canManageClients: true,
      canViewReports: false,
    },
    organizationId: 'org-1',
    avatarUrl: '',
  },
  { 
    id: '3', 
    name: 'Carol Williams', 
    email: 'carol@example.com', 
    role: UserRole.CLIENT, 
    createdAt: '2023-03-22T09:15:00Z',
    lastActive: '2023-05-25T14:30:00Z',
    status: 'active',
    companyName: 'Carol Enterprises',
    organizationId: 'org-1',
    avatarUrl: '',
  },
  { 
    id: '4', 
    name: 'David Brown', 
    email: 'david@example.com', 
    role: UserRole.CLIENT, 
    createdAt: '2023-04-05T16:40:00Z',
    lastActive: '2023-05-20T11:20:00Z',
    status: 'inactive',
    companyName: 'Brown Industries',
    organizationId: 'org-1',
    avatarUrl: '',
  },
  { 
    id: '5', 
    name: 'Eva Martinez', 
    email: 'eva@example.com', 
    role: UserRole.STAFF, 
    createdAt: '2023-04-18T13:10:00Z',
    lastActive: '2023-05-28T10:15:00Z',
    status: 'active',
    permissions: {
      canCreateInvoices: true,
      canViewInvoices: true,
      canEditInvoices: false,
      canSendInvoices: true,
      canManageClients: false,
      canViewReports: true,
    },
    organizationId: 'org-1',
    avatarUrl: '',
  },
];

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would fetch this data from the API
        // For now, just using the mock data after a delay
        setTimeout(() => {
          setUsers(USERS);
          setFilteredUsers(USERS);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    
    // In a real app, this would be an API call
    const newUsers = users.filter(u => u.id !== userToDelete.id);
    setUsers(newUsers);
    
    toast({
      title: 'User deleted',
      description: `${userToDelete.name} has been deleted.`,
      variant: 'default',
    });
    
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    // In a real app, this would be an API call
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    
    setUsers(updatedUsers);
    
    toast({
      title: 'Status updated',
      description: `User status has been set to ${newStatus}.`,
      variant: 'default',
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;
    
    switch (action) {
      case 'delete':
        // Implement bulk delete logic
        break;
      case 'activate':
        // In a real app, this would be an API call
        const activatedUsers = users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user
        );
        setUsers(activatedUsers);
        
        toast({
          title: 'Users activated',
          description: `${selectedUsers.length} users have been activated.`,
          variant: 'default',
        });
        setSelectedUsers([]);
        break;
      case 'deactivate':
        // In a real app, this would be an API call
        const deactivatedUsers = users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'inactive' } : user
        );
        setUsers(deactivatedUsers);
        
        toast({
          title: 'Users deactivated',
          description: `${selectedUsers.length} users have been deactivated.`,
          variant: 'default',
        });
        setSelectedUsers([]);
        break;
      default:
        break;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleInviteUser = (data: any) => {
    // In a real app, this would be an API call to send invitation
    toast({
      title: 'Invitation sent',
      description: `An invitation has been sent to ${data.email}.`,
      variant: 'default',
    });
    setIsInviteDialogOpen(false);
  };

  // Helper function to get user role display
  const getRoleDisplay = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return (
          <Badge variant="outline" className="bg-purple-500/20 text-purple-500 border-purple-500/20">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case UserRole.STAFF:
        return (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/20">
            <UserCog className="w-3 h-3 mr-1" />
            Staff
          </Badge>
        );
      case UserRole.CLIENT:
        return (
          <Badge variant="outline" className="bg-orange-500/20 text-orange-500 border-orange-500/20">
            <Users className="w-3 h-3 mr-1" />
            Client
          </Badge>
        );
      default:
        return null;
    }
  };

  // Helper function to get status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-gray-400">Manage user accounts and permissions</p>
          </div>
          <div className="flex space-x-3">
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Send an invitation email to add a new user to your organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Email Address</label>
                    <Input
                      placeholder="email@example.com"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Role</label>
                    <Select defaultValue={UserRole.CLIENT}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white">
                        <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                        <SelectItem value={UserRole.STAFF}>Staff Member</SelectItem>
                        <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Custom Message (Optional)</label>
                    <textarea
                      placeholder="Add a personal message to the invitation email..."
                      className="w-full rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 p-2 h-20"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)} className="border-gray-600 text-white hover:bg-gray-700">
                    Cancel
                  </Button>
                  <Button onClick={() => handleInviteUser({ email: 'test@example.com' })}>
                    Send Invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Administrators</SelectItem>
                <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
                <SelectItem value={UserRole.CLIENT}>Clients</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => {
                // Export users logic
                toast({
                  title: 'Export started',
                  description: 'User data export has started. You will be notified when it\'s ready.',
                });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                  disabled={selectedUsers.length === 0}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                <DropdownMenuLabel>Bulk Actions ({selectedUsers.length})</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleBulkAction('activate')}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Activate Selected
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                  Deactivate Selected
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer text-red-500 hover:bg-red-900/20 focus:text-red-500 focus:bg-red-900/20"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-800/50">
                  <th className="py-3 px-4 text-left">
                    <Checkbox 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-gray-600"
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Active</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                        <p>Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-gray-600 mb-2" />
                        <p className="text-lg font-medium text-gray-300 mb-1">No users found</p>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700/30">
                      <td className="py-4 px-4">
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked: boolean) => handleSelectUser(user.id, checked)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-gray-600"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {getUserInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-white">{user.name}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getRoleDisplay(user.role)}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusDisplay(user.status)}
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {formatDate(user.lastActive)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                            <DropdownMenuItem
                              className="flex items-center cursor-pointer hover:bg-gray-700"
                              onClick={() => navigate(`/admin/users/${user.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center cursor-pointer hover:bg-gray-700"
                              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center cursor-pointer hover:bg-gray-700"
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                            >
                              {user.status === 'active' ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center cursor-pointer hover:bg-gray-700"
                              onClick={() => {
                                // Reset password logic
                                toast({
                                  title: 'Password reset email sent',
                                  description: `A password reset email has been sent to ${user.email}.`,
                                });
                              }}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                              className="flex items-center cursor-pointer text-red-500 hover:bg-red-900/20 focus:text-red-500 focus:bg-red-900/20"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Confirm Delete User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {userToDelete && (
            <div className="py-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userToDelete.avatarUrl} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {getUserInitials(userToDelete.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-white">{userToDelete.name}</div>
                  <div className="text-sm text-gray-400">{userToDelete.email}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-gray-600 text-white hover:bg-gray-700">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement; 