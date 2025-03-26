import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useSimpleToast, SimpleToastContainer } from '../ui/SimpleToast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth/authContext';
import DatabaseError from '../DatabaseError';

// Validation schema for login form
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useSimpleToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const testDatabaseConnection = async () => {
    try {
      setLoading(true);
      setDatabaseError(null);
      
      // Try to get the session - a simple call to check connectivity
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Database connection is working
      setDatabaseError(null);
      toast('Database connection successful', 'success');
    } catch (error: any) {
      console.error('Database connection error:', error);
      setDatabaseError(error.message || 'Could not connect to the database');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      
      // Test database connection first
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw new Error(sessionError.message);
      } catch (error: any) {
        setDatabaseError(error.message || 'Could not connect to the database');
        return;
      }
      
      // Attempt login
      const { user, error } = await login(data.email, data.password);
      
      if (error) {
        toast(error, 'error');
        return;
      }
      
      if (user) {
        toast('Login successful! Welcome back!', 'success');
        
        // Redirect based on user type - this will be handled by the router
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if this is a database connection issue
      if (error.message?.toLowerCase().includes('network') || 
          error.message?.toLowerCase().includes('connection') ||
          error.message?.toLowerCase().includes('fetch')) {
        setDatabaseError(error.message);
      } else {
        toast(error.message || "An unexpected error occurred", 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // If there's a database error, show the error component
  if (databaseError) {
    return (
      <DatabaseError 
        error={databaseError}
        onRetry={testDatabaseConnection}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SimpleToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-white">Auto-Invoice</h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-white">
          Log in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">Don't have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </form>
          
          {/* Test database connection button - for debugging */}
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={testDatabaseConnection}
              disabled={loading}
              className="w-full text-xs"
            >
              Test Database Connection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 