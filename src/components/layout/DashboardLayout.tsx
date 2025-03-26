import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, FileText, Settings, Bell, LogOut, 
  Menu, X, Home, CreditCard, BarChart3, 
  User, ChevronDown, LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../lib/auth/authContext';
import { UserRole } from '../../types/user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import companyLogo from '../../ASSETS/Company logo.jpg';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  hasSubMenu?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  isActive = false,
  hasSubMenu = false,
  onClick
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-gray-100 hover:bg-white/10'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
      {hasSubMenu && <ChevronDown className="h-4 w-4 ml-auto" />}
    </Link>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;
  };

  // Determine navigation items based on user role
  const getNavItems = () => {
    const items = [
      {
        to: '/dashboard',
        icon: Home,
        label: 'Dashboard',
      }
    ];

    // Admin-specific navigation
    if (user?.role === UserRole.ADMIN) {
      items.push(
        {
          to: '/admin/invoices',
          icon: FileText,
          label: 'Invoices',
        },
        {
          to: '/admin/users',
          icon: Users,
          label: 'Users',
        },
        {
          to: '/admin/settings',
          icon: Settings,
          label: 'Settings',
        }
      );
    }

    // Staff-specific navigation
    if (user?.role === UserRole.STAFF) {
      items.push(
        {
          to: '/staff/invoices',
          icon: FileText,
          label: 'Invoices',
        },
        {
          to: '/staff/clients',
          icon: Users,
          label: 'Clients',
        }
      );
    }

    // Client-specific navigation
    if (user?.role === UserRole.CLIENT) {
      items.push(
        {
          to: '/client/invoices',
          icon: FileText,
          label: 'My Invoices',
        },
        {
          to: '/client/payments',
          icon: CreditCard,
          label: 'Payments',
        }
      );
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <Link to="/dashboard" className="flex items-center">
            <img src={companyLogo} alt="Company Logo" className="h-8 w-auto mr-2" />
            <span className="text-xl font-bold">Auto Invoice</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.to)}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user?.profileImageUrl} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <img src={companyLogo} alt="Company Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold">Auto Invoice</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 md:hidden bg-gray-900/80"
          >
            <div className="absolute top-0 left-0 bottom-0 w-64 bg-gray-800 shadow-xl p-4">
              <div className="flex flex-col h-full">
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={user?.profileImageUrl} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-400">{user?.role}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <nav className="flex-1 space-y-1 overflow-y-auto">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                      isActive={isActive(item.to)}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </nav>
                
                <div className="pt-4 mt-4 border-t border-gray-700">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 h-16">
          <h1 className="text-xl font-bold">
            {location.pathname.startsWith('/admin') && 'Admin Dashboard'}
            {location.pathname.startsWith('/staff') && 'Staff Dashboard'}
            {location.pathname.startsWith('/client') && 'Client Portal'}
            {location.pathname === '/dashboard' && 'Dashboard'}
          </h1>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user?.firstName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 mt-14 md:mt-0 bg-gray-900">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 