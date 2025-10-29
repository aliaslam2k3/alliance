'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { signIn, signUp } from '../../lib/auth';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
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
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { userData } = await signUp(email, password, firstName, lastName, phone, 'customer');
      
      // Store user info in session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('userRole', userData.role);
        sessionStorage.setItem('username', userData.firstName);
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userId', userData.email);
      }
      
      router.push('/customer-dashboard');
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-inter bg-white text-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-brand-black">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80"
            alt="Login"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 hero-bg"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="reveal">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              {isLogin ? 'Login' : 'Register'}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {isLogin ? 'Access your account' : 'Create your account'}
            </p>
          </div>
        </div>
      </section>

      {/* Login/Register Form Section */}
      <section className="section-padding bg-brand-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            {/* Toggle Buttons */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                    isLogin 
                      ? 'bg-brand-yellow text-black' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-brand-yellow text-black' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {isLogin ? (
              /* Login Form */
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-playfair font-bold text-center mb-8">Welcome Back</h2>
                {error && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input 
                      type="password" 
                      id="password" 
                      name="password" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input 
                        id="remember-me" 
                        name="remember-me" 
                        type="checkbox" 
                        className="h-4 w-4 text-brand-yellow focus:ring-brand-navy border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    
                    <div className="text-sm">
                      <a href="#" className="text-brand-navy hover:text-brand-yellow font-medium">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary text-black px-8 py-4 rounded-full font-semibold text-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setIsLogin(false)}
                      className="text-brand-navy hover:text-brand-yellow font-medium"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* Register Form */
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-playfair font-bold text-center mb-8">Create Account</h2>
                {error && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
                <form className="space-y-6" onSubmit={handleSignUp}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input 
                      type="password" 
                      id="password" 
                      name="password" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      placeholder="Create a password"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input 
                      type="password" 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      id="terms" 
                      name="terms" 
                      type="checkbox" 
                      required
                      className="h-4 w-4 text-brand-yellow focus:ring-brand-navy border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-brand-navy hover:text-brand-yellow font-medium">
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary text-black px-8 py-4 rounded-full font-semibold text-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button 
                      onClick={() => setIsLogin(true)}
                      className="text-brand-navy hover:text-brand-yellow font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Why Create an Account?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join our community and enjoy exclusive benefits
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center reveal">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-project-diagram text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Track Projects</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your project progress in real-time and stay updated with the latest developments.
              </p>
            </div>
            
            <div className="text-center reveal">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-file-invoice text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Access Documents</h3>
              <p className="text-gray-600 leading-relaxed">
                Download project documents, invoices, and reports from your personalized dashboard.
              </p>
            </div>
            
            <div className="text-center reveal">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-headset text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Priority Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Get priority customer support and direct access to our project managers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
