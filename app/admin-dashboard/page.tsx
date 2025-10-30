'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/AuthContext';
import { signOutUser } from '../../lib/auth';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  setDoc
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  getAuth
} from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import Footer from '../../components/Footer';

export default function AdminDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    role: 'customer'
  });

  useEffect(() => {
    if (!loading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (userData?.role === 'admin') {
      fetchUsers();
    }
  }, [userData]);

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const usersSnapshot = await getDocs(usersQuery);
      setUsers(usersSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generate password if not provided
      let password = newUser.password;
      if (!password) {
        password = Math.random().toString(36).slice(-10);
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        newUser.email, 
        password
      );
      
      await updateProfile(userCredential.user, {
        displayName: `${newUser.firstName} ${newUser.lastName}`
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        company: newUser.company,
        role: newUser.role,
        createdAt: serverTimestamp(),
        createdBy: user?.uid
      });

      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        password: '',
        role: 'customer'
      });
      
      setShowModal(false);
      fetchUsers();
      alert(`User created successfully.\nEmail: ${newUser.email}\nPassword: ${password}`);
    } catch (error: any) {
      let msg = 'Failed to create user.';
      if (error.code === 'auth/email-already-in-use') msg = 'Email already in use.';
      if (error.code === 'auth/invalid-email') msg = 'Invalid email address.';
      if (error.code === 'auth/weak-password') msg = 'Password is too weak.';
      alert(msg);
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

  if (!user || userData?.role !== 'admin') {
    return null;
  }

  const displayName = userData?.firstName && userData?.lastName 
    ? `${userData.firstName} ${userData.lastName}` 
    : userData?.firstName || 'Admin';

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
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2070&q=80" 
            alt="Dashboard background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Admin Dashboard</h1>
            <p className="text-xl text-gray-200">Manage your construction projects and customers</p>
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
                <i className="fas fa-user-shield text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-brand-navy">Welcome, {displayName}!</h2>
                <p className="text-gray-600">You have successfully logged into the Alliance Engineers admin panel.</p>
              </div>
            </div>
            <div className="bg-brand-cream rounded-lg p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">System Overview</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow mb-2">25</div>
                  <p className="text-gray-600">Active Projects</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow mb-2">{users.filter(u => u.role === 'customer').length}</div>
                  <p className="text-gray-600">Total Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow mb-2">98%</div>
                  <p className="text-gray-600">Success Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div 
              className="bg-white rounded-lg shadow-lg p-6 text-center card-hover cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-pen text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Register User</h3>
              <p className="text-gray-600">Create a new account (admin or customer)</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center card-hover">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-project-diagram text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Manage Projects</h3>
              <p className="text-gray-600">View and manage all construction projects</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center card-hover">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-bar text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">View Reports</h3>
              <p className="text-gray-600">Access detailed project and financial reports</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-brand-navy">All Users</h3>
              <div className="text-sm text-gray-600">{users.length} user{users.length === 1 ? '' : 's'}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Name</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Email</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Role</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Phone</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Company</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 py-3">
                          {`${user.firstName || ''} ${user.lastName || ''}`.trim() || '—'}
                        </td>
                        <td className="px-4 py-3">{user.email || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {user.role || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">{user.phone || '—'}</td>
                        <td className="px-4 py-3">{user.company || '—'}</td>
                        <td className="px-4 py-3">
                          {user.createdAt?.toDate?.()?.toLocaleDateString() || '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-3 text-gray-500" colSpan={6}>No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-brand-navy mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user-plus text-green-600"></i>
                </div>
                <div>
                  <p className="font-medium">New customer registered: John Smith</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-project-diagram text-blue-600"></i>
                </div>
                <div>
                  <p className="font-medium">Project "LACAS School Network" completed</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-file-invoice text-yellow-600"></i>
                </div>
                <div>
                  <p className="font-medium">New quote request received</p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Register User Modal */}
      {showModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <div className="bg-brand-navy text-white p-6 rounded-t-2xl">
              <span className="close text-white" onClick={() => setShowModal(false)}>&times;</span>
              <h2 className="text-2xl font-bold">Register New User</h2>
              <p className="text-gray-200">Create an Admin or Customer account</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateUser}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="regFirstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input 
                      type="text" 
                      id="regFirstName" 
                      required 
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="regLastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      id="regLastName" 
                      required 
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      id="regEmail" 
                      required 
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input 
                      type="text" 
                      id="regPassword" 
                      placeholder="Leave blank to auto-generate"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="regRole" className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                    <select 
                      id="regRole" 
                      required 
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="regPhone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      id="regPhone" 
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="regCompany" className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input 
                    type="text" 
                    id="regCompany" 
                    value={newUser.company}
                    onChange={(e) => setNewUser({...newUser, company: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    Create User
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
