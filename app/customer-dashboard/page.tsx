'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useAuth } from '../../lib/AuthContext';
import { signOutUser } from '../../lib/auth';

export default function CustomerDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || userData?.role !== 'customer')) {
      router.push('/login');
    }
  }, [user, userData, loading, router]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-yellow mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || userData?.role !== 'customer') {
    return null;
  }

  const displayName = userData?.firstName && userData?.lastName 
    ? `${userData.firstName} ${userData.lastName}` 
    : userData?.firstName || 'Customer';

  return (
    <div className="font-inter bg-brand-cream">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-brand-navy" id="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img src="/images/logo-removebg-preview.png" alt="Alliance Engineers" className="h-16 w-auto" />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-brand-yellow transition-colors font-medium">Home</Link>
              <Link href="/about" className="text-white hover:text-brand-yellow transition-colors font-medium">About</Link>
              <Link href="/projects" className="text-white hover:text-brand-yellow transition-colors font-medium">Projects</Link>
              <Link href="/contact" className="text-white hover:text-brand-yellow transition-colors font-medium">Contact</Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-white font-medium">Welcome, {displayName}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="relative pt-32 pb-16 bg-brand-navy">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2070&q=80" 
            alt="Dashboard background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Customer Dashboard</h1>
            <p className="text-xl text-gray-200">Track your projects and manage your account</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Message */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 card-hover">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-user text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-brand-navy">Welcome, {displayName}!</h2>
                <p className="text-gray-600">You have successfully logged into your Alliance Engineers customer portal.</p>
              </div>
            </div>
            <div className="bg-brand-cream rounded-lg p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Your Account Overview</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow mb-2">2</div>
                  <p className="text-gray-600">Active Projects</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow mb-2">5</div>
                  <p className="text-gray-600">Completed Projects</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow mb-2">1</div>
                  <p className="text-gray-600">Pending Quotes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center card-hover">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-file-invoice text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Request Quote</h3>
              <p className="text-gray-600">Get a personalized quote for your project</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center card-hover">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-project-diagram text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">My Projects</h3>
              <p className="text-gray-600">View and track your construction projects</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center card-hover">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-phone text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Contact Support</h3>
              <p className="text-gray-600">Get help from our expert team</p>
            </div>
          </div>

          {/* Current Projects */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-brand-navy mb-6">Your Current Projects</h3>
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-brand-navy">Residential Villa Construction</h4>
                    <p className="text-gray-600">Lahore, Pakistan</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">In Progress</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-brand-yellow h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
                <p className="text-gray-600">Foundation work completed. Currently working on structural framework.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-brand-navy">Office Building Renovation</h4>
                    <p className="text-gray-600">Karachi, Pakistan</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Planning</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-brand-yellow h-2 rounded-full" style={{width: '15%'}}></div>
                  </div>
                </div>
                <p className="text-gray-600">Design phase completed. Awaiting permit approval to begin construction.</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-brand-navy mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-file-invoice text-blue-600"></i>
                </div>
                <div>
                  <p className="font-medium">Quote request submitted for office renovation</p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-check-circle text-green-600"></i>
                </div>
                <div>
                  <p className="font-medium">Payment received for villa construction</p>
                  <p className="text-sm text-gray-500">1 week ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-calendar text-yellow-600"></i>
                </div>
                <div>
                  <p className="font-medium">Site visit scheduled for next week</p>
                  <p className="text-sm text-gray-500">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
