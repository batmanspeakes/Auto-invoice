import React, { useState, useEffect } from 'react';
import { 
  FileText, Users, DollarSign, Clock, BarChart, 
  ArrowUpRight, CheckCircle, AlertCircle, 
  ArrowRight, Plus, Activity, Calendar, Cog
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useAuth } from '../../lib/auth/authContext';

// Mock data for admin dashboard
const METRICS = {
  totalRevenue: 128750,
  pendingPayments: 14200,
  activeClients: 38,
  totalUsers: 54,
  growthRate: 12.5
};

// Mock data for invoice metrics
const INVOICE_METRICS = [
  { month: 'Jan', count: 42 },
  { month: 'Feb', count: 38 },
  { month: 'Mar', count: 45 },
  { month: 'Apr', count: 53 },
  { month: 'May', count: 48 },
  { month: 'Jun', count: 62 }
];

// Recent activity
const RECENT_ACTIVITY = [
  { 
    id: 'a1', 
    type: 'invoice_created', 
    user: 'John Doe', 
    details: 'Created invoice #INV-2023-089 for Acme Corp', 
    timestamp: '2023-06-12T10:23:45', 
    userAvatar: '' 
  },
  { 
    id: 'a2', 
    type: 'payment_received', 
    user: 'System', 
    details: 'Payment of ₹3,750 received for invoice #INV-2023-076', 
    timestamp: '2023-06-12T09:15:22', 
    userAvatar: '' 
  },
  { 
    id: 'a3', 
    type: 'user_created', 
    user: 'Admin', 
    details: 'Added new staff member "Emily Parker"', 
    timestamp: '2023-06-11T16:45:10', 
    userAvatar: '' 
  },
  { 
    id: 'a4', 
    type: 'client_updated', 
    user: 'Jane Smith', 
    details: 'Updated client details for "TechStart Inc."', 
    timestamp: '2023-06-11T14:30:55', 
    userAvatar: '' 
  },
  { 
    id: 'a5', 
    type: 'invoice_sent', 
    user: 'Michael Brown', 
    details: 'Sent invoice #INV-2023-088 to client via email', 
    timestamp: '2023-06-11T11:05:33', 
    userAvatar: '' 
  }
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper function to get activity icon
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'invoice_created':
      case 'invoice_sent':
        return <FileText className="h-4 w-4" />;
      case 'payment_received':
        return <DollarSign className="h-4 w-4" />;
      case 'user_created':
        return <Users className="h-4 w-4" />;
      case 'client_updated':
        return <Cog className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // Get activity color based on type
  const getActivityColor = (type: string) => {
    switch(type) {
      case 'invoice_created':
        return 'text-blue-500 bg-blue-500/10';
      case 'invoice_sent':
        return 'text-purple-500 bg-purple-500/10';
      case 'payment_received':
        return 'text-green-500 bg-green-500/10';
      case 'user_created':
        return 'text-orange-500 bg-orange-500/10';
      case 'client_updated':
        return 'text-teal-500 bg-teal-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) {
      return `${diffSec} sec ago`;
    } else if (diffMin < 60) {
      return `${diffMin} min ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hours ago`;
    } else if (diffDay === 1) {
      return `Yesterday`;
    } else {
      return `${diffDay} days ago`;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Overview of your business metrics and activity</p>
          </div>
          <div className="flex space-x-3">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/admin/users/new" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Add User
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-700 hover:bg-gray-800">
              <Link to="/admin/settings" className="flex items-center">
                <Cog className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1"
          >
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-sm font-normal">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">₹{METRICS.totalRevenue.toLocaleString()}</div>
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <span className="flex items-center text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {METRICS.growthRate}%
                  </span>
                  <span className="text-gray-400 ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1"
          >
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-sm font-normal">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">₹{METRICS.pendingPayments.toLocaleString()}</div>
                  <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-yellow-500">12 invoices pending</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1"
          >
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-sm font-normal">Active Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">{METRICS.activeClients}</div>
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <span className="flex items-center text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    5%
                  </span>
                  <span className="text-gray-400 ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1"
          >
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-sm font-normal">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">{METRICS.totalUsers}</div>
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <div className="flex gap-1">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/50">
                      38 Clients
                    </Badge>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/50">
                      16 Staff
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-1"
          >
            <Card className="bg-gray-800 border-gray-700 text-white h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-sm font-normal">Invoices Trend</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center">
                <div className="flex justify-between items-end h-24 mt-2">
                  {INVOICE_METRICS.map((month, index) => (
                    <div key={month.month} className="flex flex-col items-center">
                      <div 
                        className="w-6 bg-primary/80 rounded-t-sm" 
                        style={{ 
                          height: `${(month.count / Math.max(...INVOICE_METRICS.map(m => m.count))) * 80}px`,
                          opacity: index === INVOICE_METRICS.length - 1 ? 1 : 0.7
                        }}
                      />
                      <div className="text-xs text-gray-400 mt-1">{month.month}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-300">
                    <span className="text-primary font-medium">+{METRICS.growthRate}%</span> growth
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <Tabs 
                    value={period} 
                    onValueChange={setPeriod}
                    className="h-8"
                  >
                    <TabsList className="bg-gray-700/50 p-0.5">
                      <TabsTrigger 
                        value="daily"
                        className="h-7 px-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Today
                      </TabsTrigger>
                      <TabsTrigger 
                        value="weekly"
                        className="h-7 px-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        This Week
                      </TabsTrigger>
                      <TabsTrigger 
                        value="monthly"
                        className="h-7 px-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        This Month
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <CardDescription className="text-gray-400">System and user activities</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {RECENT_ACTIVITY.map((activity) => (
                      <div 
                        key={activity.id}
                        className="flex space-x-4 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                      >
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium text-white">{activity.details}</p>
                            <span className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Avatar className="h-5 w-5 mr-1">
                              <AvatarImage src={activity.userAvatar} />
                              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                {getInitials(activity.user)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-400">{activity.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-700 pt-4">
                <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-700 w-full">
                  View All Activity Logs
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Quick Actions and Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">Tasks that need attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Create New Invoice
                  </Button>
                  <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 w-full justify-start" asChild>
                    <Link to="/admin/users">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 w-full justify-start">
                    <BarChart className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                  <Button variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 w-full justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Review Pending Invoices
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Upcoming</CardTitle>
                  <CardDescription className="text-gray-400">Scheduled events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer">
                      <div className="bg-primary/20 text-primary rounded-md p-2">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">Monthly Report</h4>
                        <p className="text-gray-400 text-xs">June 30, 2023 • Automated</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer">
                      <div className="bg-blue-500/20 text-blue-500 rounded-md p-2">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">Staff Meeting</h4>
                        <p className="text-gray-400 text-xs">June 15, 2023 • 10:00 AM</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer">
                      <div className="bg-yellow-500/20 text-yellow-500 rounded-md p-2">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">Quarterly Tax Filing</h4>
                        <p className="text-gray-400 text-xs">July 15, 2023 • Deadline</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-700 pt-4">
                  <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-700 w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 