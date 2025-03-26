import React, { useState, useEffect } from 'react';
import { 
  FileText, Users, DollarSign, Clock, 
  ArrowUpRight, CheckCircle, AlertCircle, 
  XCircle, ArrowRight, Plus, Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { useAuth } from '../../lib/auth/authContext';
import { StaffUser } from '../../types/user';

// Mock data for staff dashboard
const METRICS = {
  totalInvoices: 42,
  pendingPayments: 7,
  overdueInvoices: 2,
  totalClients: 15
};

// Recent invoices - would come from API in real app
const RECENT_INVOICES = [
  { id: 'INV-2023-001', client: 'Acme Corp', amount: 2500, status: 'paid', date: '2023-05-15' },
  { id: 'INV-2023-002', client: 'TechStart Inc', amount: 3700, status: 'pending', date: '2023-05-18' },
  { id: 'INV-2023-003', client: 'Global Media', amount: 1200, status: 'overdue', date: '2023-05-10' },
];

// Recent clients - would come from API in real app
const RECENT_CLIENTS = [
  { id: '1', name: 'Carol Williams', company: 'Carol Enterprises', status: 'active', lastInvoice: '2023-05-15', avatarUrl: '' },
  { id: '2', name: 'David Brown', company: 'Brown Industries', status: 'inactive', lastInvoice: '2023-05-01', avatarUrl: '' },
  { id: '3', name: 'Frank Miller', company: 'FM Solutions', status: 'active', lastInvoice: '2023-05-20', avatarUrl: '' },
];

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const staffUser = user as StaffUser;
  const [isLoading, setIsLoading] = useState(true);
  const [taskCompletion, setTaskCompletion] = useState(65); // Example task completion percentage

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper function to determine status color
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'paid':
      case 'active':
        return 'text-green-500 bg-green-500/10';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'overdue':
      case 'inactive':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'paid':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
      case 'inactive':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Staff Dashboard</h1>
            <p className="text-gray-400">Manage invoices and client relationships</p>
          </div>
          <div className="flex space-x-3">
            {staffUser?.permissions?.canCreateInvoices && (
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/staff/invoices/create" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Invoice
                </Link>
              </Button>
            )}
            {staffUser?.permissions?.canManageClients && (
              <Button asChild variant="outline" className="border-gray-700 hover:bg-gray-800">
                <Link to="/staff/clients" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  View Clients
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-gray-700 overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    Welcome back, {user?.firstName || 'Staff Member'}!
                  </h2>
                  <p className="text-gray-300 mb-4">
                    You have {METRICS.pendingPayments} pending and {METRICS.overdueInvoices} overdue invoices that need attention.
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Monthly Tasks Progress</span>
                      <span className="text-sm text-gray-300">{taskCompletion}%</span>
                    </div>
                    <Progress value={taskCompletion} className="h-2 bg-gray-700" />
                  </div>
                </div>
                <div className="flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-2">
                  {staffUser?.permissions?.canCreateInvoices && (
                    <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Quick Draft
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    View Tasks
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-sm font-normal">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{METRICS.totalInvoices}</div>
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-sm font-normal">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{METRICS.pendingPayments}</div>
                  <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-sm font-normal">Overdue Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{METRICS.overdueInvoices}</div>
                  <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-sm font-normal">Active Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{METRICS.totalClients}</div>
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Invoices */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Recent Invoices</CardTitle>
                  <Button variant="link" asChild className="text-primary p-0 h-auto">
                    <Link to="/staff/invoices" className="flex items-center">
                      View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <CardDescription className="text-gray-400">Latest invoices and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {RECENT_INVOICES.map((invoice) => (
                      <div 
                        key={invoice.id}
                        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-300" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{invoice.client}</p>
                            <p className="text-sm text-gray-400">{invoice.id} • {new Date(invoice.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium text-white">₹{invoice.amount.toLocaleString()}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                              {getStatusIcon(invoice.status)}
                              <span className="ml-1">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                            </span>
                          </div>
                          {staffUser?.permissions?.canEditInvoices && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8">
                                  <Filter className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                                <DropdownMenuItem
                                  className="flex items-center cursor-pointer hover:bg-gray-700"
                                  asChild
                                >
                                  <Link to={`/staff/invoices/${invoice.id}/edit`}>
                                    Edit Invoice
                                  </Link>
                                </DropdownMenuItem>
                                {staffUser?.permissions?.canSendInvoices && (
                                  <DropdownMenuItem
                                    className="flex items-center cursor-pointer hover:bg-gray-700"
                                    onClick={() => {
                                      // Send invoice logic would go here
                                    }}
                                  >
                                    Send to Client
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-gray-700" />
                                <DropdownMenuItem
                                  className="flex items-center cursor-pointer hover:bg-gray-700"
                                  asChild
                                >
                                  <Link to={`/staff/invoices/${invoice.id}`}>
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Clients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Recent Clients</CardTitle>
                  {staffUser?.permissions?.canManageClients && (
                    <Button variant="link" asChild className="text-primary p-0 h-auto">
                      <Link to="/staff/clients" className="flex items-center">
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
                <CardDescription className="text-gray-400">Latest client information</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {RECENT_CLIENTS.map((client) => (
                      <div 
                        key={client.id}
                        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={client.avatarUrl} />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {getInitials(client.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{client.name}</p>
                            <p className="text-sm text-gray-400">{client.company}</p>
                          </div>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                            {getStatusIcon(client.status)}
                            <span className="ml-1">{client.status.charAt(0).toUpperCase() + client.status.slice(1)}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-700 pt-4">
                {staffUser?.permissions?.canCreateInvoices && (
                  <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-700 w-full justify-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Invoice for Client
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Permissions Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Your Permissions</CardTitle>
              <CardDescription className="text-gray-400">
                Your account has the following access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                  staffUser?.permissions?.canCreateInvoices 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-gray-700/30 text-gray-400'
                }`}>
                  {staffUser?.permissions?.canCreateInvoices 
                    ? <CheckCircle className="h-4 w-4" /> 
                    : <XCircle className="h-4 w-4" />}
                  <span>Create Invoices</span>
                </div>
                <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                  staffUser?.permissions?.canEditInvoices 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-gray-700/30 text-gray-400'
                }`}>
                  {staffUser?.permissions?.canEditInvoices 
                    ? <CheckCircle className="h-4 w-4" /> 
                    : <XCircle className="h-4 w-4" />}
                  <span>Edit Invoices</span>
                </div>
                <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                  staffUser?.permissions?.canSendInvoices 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-gray-700/30 text-gray-400'
                }`}>
                  {staffUser?.permissions?.canSendInvoices 
                    ? <CheckCircle className="h-4 w-4" /> 
                    : <XCircle className="h-4 w-4" />}
                  <span>Send Invoices</span>
                </div>
                <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                  staffUser?.permissions?.canManageClients 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-gray-700/30 text-gray-400'
                }`}>
                  {staffUser?.permissions?.canManageClients 
                    ? <CheckCircle className="h-4 w-4" /> 
                    : <XCircle className="h-4 w-4" />}
                  <span>Manage Clients</span>
                </div>
                <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                  staffUser?.permissions?.canViewReports 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-gray-700/30 text-gray-400'
                }`}>
                  {staffUser?.permissions?.canViewReports 
                    ? <CheckCircle className="h-4 w-4" /> 
                    : <XCircle className="h-4 w-4" />}
                  <span>View Reports</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard; 