'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useAuth } from '../../lib/AuthContext';
import { signOutUser } from '../../lib/auth';
import { getCustomerProjects, getUserQuotes } from '../../lib/projects';
import { Project, Quote } from '../../lib/types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function CustomerDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    projectType: '',
    timeline: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    if (!loading && (!user || userData?.role !== 'customer')) {
      router.push('/login');
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (user && userData?.role === 'customer') {
      fetchProjects();
      fetchQuotes();
      // Pre-fill quote form with user data
      if (userData.firstName && userData.lastName) {
        setQuoteForm(prev => ({
          ...prev,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || ''
        }));
      }
    }
  }, [user, userData]);

  const fetchProjects = async () => {
    if (!user?.uid) return;
    
    try {
      setLoadingProjects(true);
      const customerProjects = await getCustomerProjects(user.uid);
      setProjects(customerProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchQuotes = async () => {
    if (!user?.uid) return;

    try {
      setLoadingQuotes(true);
      const userQuotes = await getUserQuotes(user.uid);
      setQuotes(userQuotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await addDoc(collection(db, 'quotes'), {
        ...quoteForm,
        userId: user?.uid || null,
        createdAt: serverTimestamp(),
        status: 'pending',
        source: 'customer-dashboard'
      });

      setQuoteForm({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || '',
        phone: '',
        projectType: '',
        timeline: '',
        description: ''
      });
      
      setSubmitMessage('Quote request submitted successfully! We will contact you soon.');
      setTimeout(() => {
        setShowQuoteModal(false);
        setSubmitMessage('');
      }, 2000);
    } catch (error) {
      setSubmitMessage('Error submitting quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <div className="text-3xl font-bold text-brand-yellow mb-2">
                    {projects.filter(p => p.status === 'in-progress' || p.status === 'planning').length}
                  </div>
                  <p className="text-gray-600">Active Projects</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow mb-2">
                    {projects.filter(p => p.status === 'completed').length}
                  </div>
                  <p className="text-gray-600">Completed Projects</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow mb-2">{projects.length}</div>
                  <p className="text-gray-600">Total Projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div 
              className="bg-white rounded-lg shadow-lg p-6 text-center card-hover cursor-pointer"
              onClick={() => setShowQuoteModal(true)}
            >
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-file-invoice text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Request Quote</h3>
              <p className="text-gray-600">Get a personalized quote for your project</p>
            </div>

            <div 
              className="bg-white rounded-lg shadow-lg p-6 text-center card-hover cursor-pointer"
              onClick={() => {
                const el = document.getElementById('customer-active-projects');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-project-diagram text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">My Projects</h3>
              <p className="text-gray-600">View and track your construction projects</p>
            </div>

            <div 
              className="bg-white rounded-lg shadow-lg p-6 text-center card-hover cursor-pointer"
              onClick={() => router.push('/contact')}
            >
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-phone text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Contact Support</h3>
              <p className="text-gray-600">Get help from our expert team</p>
            </div>
          </div>

          {/* Active Projects */}
          {loadingProjects ? (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-yellow mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your projects...</p>
              </div>
            </div>
          ) : (
            <>
              <div id="customer-active-projects" className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold text-brand-navy mb-6">Active Projects</h3>
                {projects.filter(p => p.status === 'in-progress' || p.status === 'planning').length > 0 ? (
                  <div className="space-y-6">
                    {projects
                      .filter(p => p.status === 'in-progress' || p.status === 'planning')
                      .map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <Link href={`/projects/${project.id}`}>
                                <h4 className="text-xl font-semibold text-brand-navy hover:text-brand-yellow transition-colors">
                                  {project.title}
                                </h4>
                              </Link>
                              {project.location && <p className="text-gray-600">{project.location}</p>}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              project.status === 'in-progress' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.status === 'in-progress' ? 'In Progress' : 'Planning'}
                            </span>
                          </div>
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-brand-yellow h-2 rounded-full transition-all duration-300" 
                                style={{width: `${project.progress}%`}}
                              ></div>
                            </div>
                          </div>
                          {project.currentPhase && (
                            <div className="mb-2">
                              <p className="text-sm font-semibold text-gray-700">Current Phase:</p>
                              <p className="text-gray-600">{project.currentPhase}</p>
                            </div>
                          )}
                          {project.nextPhase && (
                            <div className="mb-2">
                              <p className="text-sm font-semibold text-gray-700">Next Phase:</p>
                              <p className="text-gray-600">{project.nextPhase}</p>
                            </div>
                          )}
                          {project.estimatedCompletion && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-600">
                                <i className="fas fa-calendar mr-2"></i>
                                Estimated Completion: {project.estimatedCompletion.toDate?.()?.toLocaleDateString() || '—'}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">You don't have any active projects yet.</p>
                )}
              </div>

              {/* Completed Projects */}
              {projects.filter(p => p.status === 'completed').length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <h3 className="text-2xl font-bold text-brand-navy mb-6">Completed Projects</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects
                      .filter(p => p.status === 'completed')
                      .map((project) => (
                        <Link 
                          key={project.id} 
                          href={`/projects/${project.id}`}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-semibold text-brand-navy">{project.title}</h4>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                              Completed
                            </span>
                          </div>
                          {project.location && <p className="text-gray-600 text-sm mb-2">{project.location}</p>}
                          {project.completionDate && (
                            <p className="text-sm text-gray-500">
                              Completed: {project.completionDate.toDate?.()?.toLocaleDateString() || '—'}
                            </p>
                          )}
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* My Quotes */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-brand-navy mb-6">My Quotes</h3>
            {loadingQuotes ? (
              <div className="text-center py-8 text-gray-600">Loading your quotes...</div>
            ) : quotes.length === 0 ? (
              <div className="text-center py-8 text-gray-600">You have not submitted any quotes yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-gray-700 font-semibold">Project Type</th>
                      <th className="px-4 py-3 text-gray-700 font-semibold">Timeline</th>
                      <th className="px-4 py-3 text-gray-700 font-semibold">Status</th>
                      <th className="px-4 py-3 text-gray-700 font-semibold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quotes.map((quote) => (
                      <tr key={quote.id}>
                        <td className="px-4 py-3">{quote.projectType || '—'}</td>
                        <td className="px-4 py-3">{quote.timeline || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            quote.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            quote.status === 'approved' ? 'bg-green-100 text-green-700' :
                            quote.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {quote.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {quote.createdAt?.toDate?.()?.toLocaleDateString() || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="bg-brand-navy text-white px-4 py-4 md:px-6 md:py-5 rounded-t-2xl flex items-center justify-between" style={{ backgroundColor: '#313851', color: 'white' }}>
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'white' }}>Request a Quote</h2>
              <button
                type="button"
                onClick={() => {
                  setShowQuoteModal(false);
                  setSubmitMessage('');
                }}
                className="text-white hover:text-brand-yellow text-2xl leading-none font-bold"
                style={{ color: 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', minWidth: '30px' }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {submitMessage && (
                <div className={`mb-4 p-4 rounded-lg ${
                  submitMessage.includes('successfully')
                    ? 'bg-green-100 border border-green-400 text-green-700' 
                    : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                  {submitMessage}
                </div>
              )}
              <form onSubmit={handleQuoteSubmit}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.firstName}
                      onChange={(e) => setQuoteForm({...quoteForm, firstName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.lastName}
                      onChange={(e) => setQuoteForm({...quoteForm, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                  <select
                    required
                    value={quoteForm.projectType}
                    onChange={(e) => setQuoteForm({...quoteForm, projectType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                  >
                    <option value="">Select Project Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="renovation">Renovation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                  <select
                    value={quoteForm.timeline}
                    onChange={(e) => setQuoteForm({...quoteForm, timeline: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                  >
                    <option value="">Select Timeline</option>
                    <option value="asap">ASAP</option>
                    <option value="1-3months">1-3 Months</option>
                    <option value="3-6months">3-6 Months</option>
                    <option value="6-12months">6-12 Months</option>
                    <option value="over-year">Over 1 Year</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={quoteForm.description}
                    onChange={(e) => setQuoteForm({...quoteForm, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    placeholder="Please describe your project in detail..."
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuoteModal(false);
                      setSubmitMessage('');
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quote'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
