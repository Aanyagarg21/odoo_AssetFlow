
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Welcome back!');
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-12 flex-col"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 text-white font-bold text-xl">A</div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">AssetFlow</span>
        </div>

        {/* Headline */}
        <div className="max-w-lg mb-12">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
            Smart Assets. 
            <br />
            <span className="text-indigo-600">Smarter Business.</span>
            <br />
            Stronger Future.
          </h1>
          <p className="text-gray-600 text-lg">
            Streamline your enterprise asset management with real-time tracking, smart allocation, and AI-powered insights.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {[
            { label: 'Real-time Tracking', icon: '📊' },
            { label: 'Smart Allocation', icon: '🔄' },
            { label: 'AI Insights', icon: '🤖' },
            { label: 'Resource Booking', icon: '📅' },
            { label: 'Maintenance Flow', icon: '🔧' },
            { label: 'Audit & Reports', icon: '📋' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3"
            >
              <span className="text-2xl">{feature.icon}</span>
              <span className="font-medium text-gray-700">{feature.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Illustration */}
        <div className="mt-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex gap-4 items-end">
              <div className="w-16 h-24 bg-blue-100 rounded-xl flex items-end justify-center pb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg" />
              </div>
              <div className="w-20 h-32 bg-purple-100 rounded-xl flex items-end justify-center pb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-lg" />
              </div>
              <div className="w-12 h-20 bg-indigo-100 rounded-xl flex items-end justify-center pb-2">
                <div className="w-6 h-6 bg-indigo-500 rounded-lg" />
              </div>
              <div className="flex-1 h-36 bg-gradient-to-t from-indigo-50 to-transparent rounded-2xl flex items-center justify-center">
                <div className="w-full max-w-xs h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Security Message */}
        <p className="mt-8 text-sm text-gray-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          Your data is encrypted and secured with industry-standard protocols.
        </p>
      </motion.div>

      {/* Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12"
      >
        <div className="w-full max-w-md">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Welcome Back
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in to AssetFlow</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Remember me
              </label>
              <button type="button" onClick={() => router.push('/forgot-password')} className="text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-gray-600">
            Don&apos;t have an account?{' '}
            <button onClick={() => router.push('/signup')} className="text-blue-600 hover:text-blue-700 font-semibold">
              Create account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
