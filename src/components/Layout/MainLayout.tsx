
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Calendar, 
  Wrench, 
  FileText, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  User,
  Plus,
  Sun,
  Moon,
  Gift
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    toast({
      title: "Theme changed",
      description: `Switched to ${newTheme ? 'dark' : 'light'} mode`,
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-equipment':
        navigate('/equipment');
        toast({
          title: "Navigate to Equipment",
          description: "Use the 'Add Equipment' button to add new equipment",
        });
        break;
      case 'create-rental':
        navigate('/rentals');
        toast({
          title: "Navigate to Rentals",
          description: "Use the 'Create Rental' button to add new rental",
        });
        break;
      case 'schedule-maintenance':
        navigate('/maintenance');
        toast({
          title: "Navigate to Maintenance",
          description: "Use the 'Schedule Maintenance' button to add new maintenance",
        });
        break;
    }
  };

  const generateReferralCode = () => {
    const code = `ENTNT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    navigator.clipboard.writeText(code);
    toast({
      title: "Referral Code Generated!",
      description: `Code: ${code} (copied to clipboard). Share for 10% discount!`,
      duration: 5000,
    });
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['Admin', 'Staff', 'Customer'] },
    { name: 'Equipment', href: '/equipment', icon: Package, roles: ['Admin', 'Staff', 'Customer'] },
    { name: 'Rentals', href: '/rentals', icon: Calendar, roles: ['Admin', 'Staff', 'Customer'] },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench, roles: ['Admin', 'Staff'] },
    { name: 'Reports', href: '/reports', icon: FileText, roles: ['Admin'] },
  ].filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Navigation with glassmorphism effect */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo with ENTNT branding */}
              <Link to="/dashboard" className="flex-shrink-0 flex items-center hover:opacity-80 transition-all duration-300 hover:scale-105 group">
                <div className="h-10 w-10 mr-3 relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <img 
                    src="/lovable-uploads/8764410a-7e4d-4c75-a436-d3c5f750d5a2.png" 
                    alt="ENTNT Logo" 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  ENTNT
                </span>
              </Link>

              {/* Desktop Navigation with enhanced styling */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white hover:shadow-md'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 -z-10 group-hover:opacity-40 transition-opacity"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side with enhanced styling */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              {/* Notifications with enhanced badge */}
              <Link
                to="/notifications"
                className="relative p-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 hover:shadow-md group"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </Link>

              {/* Enhanced User dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">{user?.name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{user?.role}</div>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={toggleTheme} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50">
                    {isDarkMode ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light Theme</span>
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark Theme</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={generateReferralCode} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50">
                    <Gift className="mr-2 h-4 w-4" />
                    <span>Refer & Earn</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/50 dark:hover:to-pink-900/50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button with enhanced styling */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 shadow-md"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/20 shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex items-center px-3 py-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-medium text-gray-900 dark:text-white">{user?.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user?.role}</div>
                  </div>
                </div>
                
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white transition-all duration-300 rounded-lg"
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="h-5 w-5 mr-3" />
                      Light Theme
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-3" />
                      Dark Theme
                    </>
                  )}
                </button>
                
                <button
                  onClick={generateReferralCode}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white transition-all duration-300 rounded-lg"
                >
                  <Gift className="h-5 w-5 mr-3" />
                  Refer & Earn
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white transition-all duration-300 rounded-lg"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content with enhanced background */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="relative">
          {children}
          {/* Decorative elements */}
          <div className="fixed top-20 right-10 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl -z-10"></div>
          <div className="fixed bottom-20 left-10 w-24 h-24 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-xl -z-10"></div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
