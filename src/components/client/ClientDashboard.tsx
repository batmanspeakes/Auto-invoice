import React, { useState, useEffect } from 'react';
import { 
  FileText, Clock, DollarSign, CheckCircle, 
  ArrowRight, Download, Calendar, AlertCircle,
  CreditCard, Receipt, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { useAuth } from '../../lib/auth/authContext';

// Mock data for client dashboard
const CLIENT_DATA = {
  unpaidInvoices: 3,
  totalPaid: 12750,
  upcomingPayments: 4200,
  accountStanding: 'Good',
  invoiceHistory: [
    { id: 'INV-2023-042', description: 'Website Development - Phase 1', amount: 3500, status: 'paid', dueDate: '2023-04-15', paidDate: '2023-04-10' },
    { id: 'INV-2023-051', description: 'SEO Optimization - Monthly', amount: 1200, status: 'paid', dueDate: '2023-05-05', paidDate: '2023-05-03' },
    { id: 'INV-2023-062', description: 'Content Creation - Blog Posts', amount: 800, status: 'pending', dueDate: '2023-06-10', paidDate: null },
    { id: 'INV-2023-073', description: 'Website Maintenance', amount: 500, status: 'pending', dueDate: '2023-06-25', paidDate: null },
    { id: 'INV-2023-081', description: 'Logo Redesign Project', amount: 2900, status: 'overdue', dueDate: '2023-05-30', paidDate: null },
  ],
  paymentMethods: [
    { id: 'pm-1', type: 'credit_card', last4: '4242', expiryDate: '04/25', default: true },
    { id: 'pm-2', type: 'bank_transfer', accountLast4: '6789', bankName: 'HDFC Bank', default: false }
  ]
};

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentProgress, setPaymentProgress] = useState(80); // Example payment completion percentage

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
        return 'text-green-500 bg-green-500/10';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'overdue':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-white">Client Dashboard</h1>
          <p className="text-gray-400">View your invoices and manage payments</p>
        </div>

        {/* Account Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-teal-900/50 to-blue-900/50 border-gray-700 overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    Welcome back, {user?.firstName || 'Client'}!
                  </h2>
                  <p className="text-gray-300 mb-4">
                    You have {CLIENT_DATA.unpaidInvoices} unpaid invoices totaling ₹{CLIENT_DATA.upcomingPayments.toLocaleString()}.
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Account Standing</span>
                      <span className="text-sm text-green-400">{CLIENT_DATA.accountStanding}</span>
                    </div>
                    <Progress value={paymentProgress} className="h-2 bg-gray-700" />
                  </div>
                </div>
                <div className="flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-2">
                  <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                    <Link to="/client/invoices">
                      View All Invoices
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-sm font-normal">Unpaid Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{CLIENT_DATA.unpaidInvoices}</div>
                  <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
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
                <CardTitle className="text-gray-400 text-sm font-normal">Total Paid (YTD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">₹{CLIENT_DATA.totalPaid.toLocaleString()}</div>
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <CheckCircle className="h-5 w-5" />
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
                <CardTitle className="text-gray-400 text-sm font-normal">Upcoming Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">₹{CLIENT_DATA.upcomingPayments.toLocaleString()}</div>
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="invoices" className="w-full">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger value="invoices" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Invoices
              </TabsTrigger>
              <TabsTrigger value="payment-methods" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Payment Methods
              </TabsTrigger>
            </TabsList>
            <TabsContent value="invoices" className="mt-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Invoice History</CardTitle>
                    <Button variant="link" asChild className="text-primary p-0 h-auto">
                      <Link to="/client/invoices" className="flex items-center">
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <CardDescription className="text-gray-400">Your recent invoices and payment history</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 text-gray-400 font-medium text-sm">Invoice</th>
                            <th className="text-left py-3 text-gray-400 font-medium text-sm">Description</th>
                            <th className="text-left py-3 text-gray-400 font-medium text-sm">Amount</th>
                            <th className="text-left py-3 text-gray-400 font-medium text-sm">Due Date</th>
                            <th className="text-left py-3 text-gray-400 font-medium text-sm">Status</th>
                            <th className="text-right py-3 text-gray-400 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CLIENT_DATA.invoiceHistory.map((invoice) => (
                            <tr key={invoice.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                              <td className="py-3 text-white font-medium">{invoice.id}</td>
                              <td className="py-3 text-gray-300">{invoice.description}</td>
                              <td className="py-3 text-white">₹{invoice.amount.toLocaleString()}</td>
                              <td className="py-3 text-gray-300">{formatDate(invoice.dueDate)}</td>
                              <td className="py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                  {getStatusIcon(invoice.status)}
                                  <span className="ml-1">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                                    <Link to={`/client/invoices/${invoice.id}`}>
                                      <ExternalLink className="h-4 w-4" />
                                      <span className="sr-only">View</span>
                                    </Link>
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">Download</span>
                                  </Button>
                                  {invoice.status !== 'paid' && (
                                    <Button size="sm" className="h-8 px-3 bg-primary hover:bg-primary/90">
                                      Pay Now
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payment-methods" className="mt-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Payment Methods</CardTitle>
                  <CardDescription className="text-gray-400">Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {CLIENT_DATA.paymentMethods.map((method) => (
                        <div key={method.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-700">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                {method.type === 'credit_card' ? (
                                  <CreditCard className="h-5 w-5 text-gray-300" />
                                ) : (
                                  <Receipt className="h-5 w-5 text-gray-300" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-white">
                                  {method.type === 'credit_card' 
                                    ? `Credit Card ending in ${method.last4}` 
                                    : `${method.bankName} (${method.accountLast4})`}
                                </p>
                                {method.type === 'credit_card' && (
                                  <p className="text-sm text-gray-400">Expires {method.expiryDate}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              {method.default && (
                                <Badge variant="outline" className="mr-2 border-green-500 text-green-500">
                                  Default
                                </Badge>
                              )}
                              <Button size="sm" variant="outline" className="border-gray-700 text-white hover:bg-gray-700">
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-gray-700 pt-4">
                  <Button className="bg-primary hover:bg-primary/90">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Upcoming Payment Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Payments</CardTitle>
              <CardDescription className="text-gray-400">
                Due in the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CLIENT_DATA.invoiceHistory
                  .filter(invoice => invoice.status !== 'paid')
                  .slice(0, 2)
                  .map((invoice) => {
                    const dueDate = new Date(invoice.dueDate);
                    const today = new Date();
                    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={invoice.id} className="p-4 rounded-lg border border-gray-700 bg-gray-700/20">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-white">{invoice.description}</h3>
                              <Badge 
                                variant="outline" 
                                className={`${
                                  invoice.status === 'overdue' 
                                    ? 'border-red-500 text-red-500' 
                                    : 'border-yellow-500 text-yellow-500'
                                }`}
                              >
                                {invoice.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              Invoice {invoice.id} • Due {formatDate(invoice.dueDate)}
                              {daysUntilDue <= 0 
                                ? <span className="text-red-400 ml-2">Overdue</span>
                                : <span className="text-yellow-400 ml-2">{daysUntilDue} days left</span>
                              }
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-lg font-medium text-white">₹{invoice.amount.toLocaleString()}</div>
                            <Button className="bg-primary hover:bg-primary/90">
                              Pay Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard; 