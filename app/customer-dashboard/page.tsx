'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useAuth } from '../../lib/AuthContext';
import { signOutUser } from '../../lib/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function CustomerDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [newQuote, setNewQuote] = useState({
    projectType: '',
    timeline: '',
    description: '',
    budget: ''
  });

  useEffect(() => {
    if (!loading && (!user || userData?.role !== 'customer')) {
      router.push('/login');
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (userData?.role === 'customer' && user) {
      fetchData();
    }
  }, [userData, user]);

  const fetchData = async () => {
    try {
      // Fetch user's projects
      const projectsQuery = query(
        collection(db, 'projects'), 
        where('userId', '==', user?.uid),
        orderBy('createdAt', 'desc')
      );
      const projectsSnapshot = await getDocs(projectsQuery);
      setProjects(projectsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));

      // Fetch user's quotes
      const quotesQuery = query(
        collection(db, 'quotes'), 
        where('userId', '==', user?.uid),
        orderBy('createdAt', 'desc')
      );
      const quotesSnapshot = await getDocs(quotesQuery);
      setQuotes(quotesSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'quotes'), {
        ...newQuote,
        userId: user?.uid,
        userEmail: userData?.email,
        userName: `${userData?.firstName} ${userData?.lastName}`,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      setNewQuote({
        projectType: '',
        timeline: '',
        description: '',
        budget: ''
      });
      
      fetchData();
      alert('Quote request submitted successfully!');
    } catch (error: any) {
      alert('Error submitting quote: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      router.push('/');
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

  return (
    <div className="font-inter bg-white text-gray-800">
      <Navigation />
      
      {/* Dashboard Header */}
      <section className="bg-brand-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-playfair font-bold mb-4">Customer Dashboard</h1>
              <p className="text-xl opacity-90">Welcome back, {userData?.firstName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Tabs */}
      <section className="py-8 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'projects', label: 'My Projects' },
              { id: 'quotes', label: 'Quote Requests' },
              { id: 'request-quote', label: 'Request Quote' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-yellow text-black'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-brand-navy mb-4">My Projects</h3>
                <p className="text-4xl font-bold text-brand-yellow">{projects.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-brand-navy mb-4">Quote Requests</h3>
                <p className="text-4xl font-bold text-brand-yellow">{quotes.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-brand-navy mb-4">Active Projects</h3>
                <p className="text-4xl font-bold text-brand-yellow">
                  {projects.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-brand-navy text-white">
                <h3 className="text-xl font-bold">My Projects</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.progress || '0'}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-brand-navy text-white">
                <h3 className="text-xl font-bold">My Quote Requests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timeline</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quotes.map((quote) => (
                      <tr key={quote.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {quote.projectType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quote.timeline}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            quote.status === 'approved' 
                              ? 'bg-green-100 text-green-800'
                              : quote.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {quote.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quote.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'request-quote' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-brand-navy mb-6">Request a Quote</h3>
                <form onSubmit={handleSubmitQuote} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                    <select
                      required
                      value={newQuote.projectType}
                      onChange={(e) => setNewQuote({...newQuote, projectType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    >
                      <option value="">Select Project Type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="renovation">Renovation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                    <select
                      required
                      value={newQuote.timeline}
                      onChange={(e) => setNewQuote({...newQuote, timeline: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    >
                      <option value="">Select Timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-3months">1-3 Months</option>
                      <option value="3-6months">3-6 Months</option>
                      <option value="6-12months">6-12 Months</option>
                      <option value="over-year">Over 1 Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                    <select
                      required
                      value={newQuote.budget}
                      onChange={(e) => setNewQuote({...newQuote, budget: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    >
                      <option value="">Select Budget Range</option>
                      <option value="under-50k">Under $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-500k">$100,000 - $500,000</option>
                      <option value="500k-1m">$500,000 - $1,000,000</option>
                      <option value="over-1m">Over $1,000,000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                    <textarea
                      required
                      rows={5}
                      value={newQuote.description}
                      onChange={(e) => setNewQuote({...newQuote, description: e.target.value})}
                      placeholder="Please describe your project in detail..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-primary text-black px-8 py-4 rounded-full font-semibold text-lg"
                  >
                    Submit Quote Request
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
