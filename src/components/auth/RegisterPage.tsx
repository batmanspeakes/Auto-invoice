import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../lib/auth/authContext';
import { UserRole } from '../../types/user';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { toast } from '../ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import companyLogo from '../../ASSETS/Company logo.jpg';

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain uppercase, lowercase, and numbers'
    }),
  confirmPassword: z.string(),
  companyName: z.string().optional(),
  role: z.nativeEnum(UserRole),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof formSchema>;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<UserRole>(UserRole.CLIENT);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      role: UserRole.CLIENT,
    },
  });
  
  // Update form role value when tab changes
  const handleRoleChange = (value: string) => {
    setAccountType(value as UserRole);
    form.setValue('role', value as UserRole);
  };
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      // Prepare user data with role
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        companyName: data.companyName,
        isActive: true,
      };
      
      const result = await register(data.email, data.password, userData);
      
      if (result.success) {
        // Show success toast
        toast({
          title: 'Registration successful',
          description: 'Your account has been created.',
          variant: 'default',
        });
        
        // Redirect to login page
        navigate('/login');
      } else {
        // Show error message
        toast({
          title: 'Registration failed',
          description: result.error || 'Unable to create account',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Registration error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="flex flex-col items-center mb-6">
          <img src={companyLogo} alt="Company Logo" className="h-16 w-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
          <p className="text-white/70 mt-1 text-center">
            Get started with our invoice management platform
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl"
        >
          <Tabs 
            defaultValue={UserRole.CLIENT} 
            value={accountType}
            onValueChange={handleRoleChange} 
            className="mb-6"
          >
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value={UserRole.CLIENT}>Client</TabsTrigger>
              <TabsTrigger value={UserRole.ADMIN}>Business</TabsTrigger>
            </TabsList>
            
            <TabsContent value={UserRole.CLIENT}>
              <p className="text-sm text-white/70 mb-4">
                Register as a client to view and pay invoices from businesses you work with.
              </p>
            </TabsContent>
            
            <TabsContent value={UserRole.ADMIN}>
              <p className="text-sm text-white/70 mb-4">
                Register as a business to create and manage invoices for your clients.
              </p>
            </TabsContent>
          </Tabs>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        type="email"
                        autoComplete="email"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              
              {accountType === UserRole.ADMIN && (
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Company Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Company Ltd"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        autoComplete="new-password"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        autoComplete="new-password"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-white/70 text-sm">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-300 hover:text-blue-200 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage; 