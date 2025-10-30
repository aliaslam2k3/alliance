'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { signIn } from '../../lib/auth';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const { userData } = await signIn(email, password);
      
      // Store user info in session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('userRole', userData.role);
        sessionStorage.setItem('username', userData.firstName || userData.email);
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userId', userData.email);
      }
      
      // Redirect based on role
      if (userData.role === 'admin') {
        router.push('/admin-dashboard');
      } else if (userData.role === 'customer') {
        router.push('/customer-dashboard');
      } else {
        setError('Invalid user role. Please contact administrator.');
      }
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-inter bg-white text-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <header className="relative h-[55vh] flex items-center justify-center bg-brand-black">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2070&q=80"
            alt="Login cover"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-3xl px-4">
          <h1 className="text-5xl font-playfair font-bold mb-4">Welcome Back</h1>
          <p className="text-lg text-gray-200">Sign in to continue to your account</p>
        </div>
      </header>

      {/* Login Form Section */}
      <main className="py-16 bg-brand-cream">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-[#f6f6f6] rounded-2xl shadow-xl p-12">
            <h2 className="text-center mb-8 text-brand-black text-3xl font-semibold">Welcome Back</h2>
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username" className="block mb-2 font-medium text-[#222]">Username/Email</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username"
                  required 
                  placeholder="Enter your username or email"
                  className="w-full px-4 py-4 border-2 border-[#e3e3e3] rounded-lg text-base transition-all focus:outline-none focus:border-[#e6c200] focus:shadow-[0_0_0_3px_rgba(230,194,0,0.25)]"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="block mb-2 font-medium text-[#222]">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  required 
                  placeholder="Enter your password"
                  className="w-full px-4 py-4 border-2 border-[#e3e3e3] rounded-lg text-base transition-all focus:outline-none focus:border-[#e6c200] focus:shadow-[0_0_0_3px_rgba(230,194,0,0.25)]"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
