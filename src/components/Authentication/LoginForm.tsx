
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowRight, Shield, Users, Star } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    const success = login(email, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const quickLogin = (userType: 'admin' | 'staff' | 'customer') => {
    const credentials = {
      admin: { email: 'admin@entnt.in', password: 'admin123' },
      staff: { email: 'staff@entnt.in', password: 'staff123' },
      customer: { email: 'customer@entnt.in', password: 'cust123' }
    };
    
    setEmail(credentials[userType].email);
    setPassword(credentials[userType].password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <img 
                src="/lovable-uploads/8764410a-7e4d-4c75-a436-d3c5f750d5a2.png" 
                alt="ENTNT Logo" 
                className="h-12 w-auto mr-4"
              />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  ENTNT
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">Equipment Rental Platform</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Secure & Reliable</h3>
                  <p className="text-gray-600 dark:text-gray-300">Your data is protected with enterprise-grade security</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
                <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Multi-Role Access</h3>
                  <p className="text-gray-600 dark:text-gray-300">Admin, Staff, and Customer portals tailored for each role</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Premium Experience</h3>
                  <p className="text-gray-600 dark:text-gray-300">Modern interface with advanced analytics and reporting</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Quick Login Demo Section */}
          <div className="mb-8 p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl">
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Quick Demo Access</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => quickLogin('admin')}
                className="p-3 text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('staff')}
                className="p-3 text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Staff
              </button>
              <button
                onClick={() => quickLogin('customer')}
                className="p-3 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Customer
              </button>
            </div>
          </div>

          {/* Main Login Form */}
          <div className="p-8 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Sign in to access your equipment rental dashboard
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200/50 dark:border-red-800/50 text-red-700 dark:text-red-300 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
