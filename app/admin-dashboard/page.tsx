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
import {
  getAllProjects,
  getQuotes,
  createProject,
  updateProject,
  deleteProject,
  updateQuoteStatus,
  convertQuoteToProject
} from '../../lib/projects';
import { Project, Quote, ProjectFormData } from '../../lib/types';

export default function AdminDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [quoteFilterStatus, setQuoteFilterStatus] = useState<string>('all');
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    role: 'customer'
  });
  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: 'Commercial',
    location: '',
    area: '',
    status: 'planning',
    progress: 0,
    image: '',
    images: [],
    keyFeatures: [],
    technicalSpecs: [],
    capacity: '',
    isPortfolio: true,
    customerId: null,
    customerName: '',
    currentPhase: '',
    nextPhase: ''
  });
  const [featureInput, setFeatureInput] = useState('');
  const [specInput, setSpecInput] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (!loading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (userData?.role === 'admin') {
      fetchUsers();
      fetchProjects();
      fetchQuotes();
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

  const fetchProjects = async () => {
    try {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Error fetching projects');
    }
  };

  const fetchQuotes = async () => {
    try {
      const allQuotes = await getQuotes();
      setQuotes(allQuotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      alert('Error fetching quotes');
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      const projectData: Partial<Project> = {
        ...projectForm,
        keyFeatures: projectForm.keyFeatures?.filter(f => f.trim() !== ''),
        technicalSpecs: projectForm.technicalSpecs?.filter(s => s.trim() !== ''),
        images: projectForm.images?.filter(img => img.trim() !== ''),
        customerId: projectForm.isPortfolio ? null : (projectForm.customerId || null),
      };

      await createProject(projectData, user.uid);
      alert('Project created successfully!');
      setShowProjectModal(false);
      resetProjectForm();
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const projectData: Partial<Project> = {
        ...projectForm,
        keyFeatures: projectForm.keyFeatures?.filter(f => f.trim() !== ''),
        technicalSpecs: projectForm.technicalSpecs?.filter(s => s.trim() !== ''),
        images: projectForm.images?.filter(img => img.trim() !== ''),
        customerId: projectForm.isPortfolio ? null : (projectForm.customerId || null),
      };

      await updateProject(editingProject.id, projectData);
      alert('Project updated successfully!');
      setShowProjectModal(false);
      setEditingProject(null);
      resetProjectForm();
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project');
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete);
      alert('Project deleted successfully!');
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      location: project.location,
      area: project.area,
      completionDate: project.completionDate?.toDate?.()?.toISOString().split('T')[0] || '',
      status: project.status,
      progress: project.progress,
      image: project.image,
      images: project.images || [],
      keyFeatures: project.keyFeatures || [],
      technicalSpecs: project.technicalSpecs || [],
      capacity: project.capacity || '',
      isPortfolio: project.isPortfolio,
      customerId: project.customerId || null,
      customerName: project.customerName || '',
      currentPhase: project.currentPhase || '',
      nextPhase: project.nextPhase || '',
      estimatedCompletion: project.estimatedCompletion?.toDate?.()?.toISOString().split('T')[0] || ''
    });
    setShowProjectModal(true);
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      category: 'Commercial',
      location: '',
      area: '',
      status: 'planning',
      progress: 0,
      image: '',
      images: [],
      keyFeatures: [],
      technicalSpecs: [],
      capacity: '',
      isPortfolio: true,
      customerId: null,
      customerName: '',
      currentPhase: '',
      nextPhase: ''
    });
    setEditingProject(null);
    setFeatureInput('');
    setSpecInput('');
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setProjectForm({
        ...projectForm,
        keyFeatures: [...(projectForm.keyFeatures || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setProjectForm({
      ...projectForm,
      keyFeatures: projectForm.keyFeatures?.filter((_, i) => i !== index) || []
    });
  };

  const addSpec = () => {
    if (specInput.trim()) {
      setProjectForm({
        ...projectForm,
        technicalSpecs: [...(projectForm.technicalSpecs || []), specInput.trim()]
      });
      setSpecInput('');
    }
  };

  const removeSpec = (index: number) => {
    setProjectForm({
      ...projectForm,
      technicalSpecs: projectForm.technicalSpecs?.filter((_, i) => i !== index) || []
    });
  };

  const handleApproveQuote = async (quote: Quote) => {
    if (!user?.uid) return;

    try {
      // Create project from quote
      const projectData: Partial<Project> = {
        title: `${quote.firstName} ${quote.lastName} - ${quote.projectType}`,
        description: quote.description,
        category: quote.projectType,
        location: '',
        area: '',
        status: 'planning',
        progress: 0,
        image: '/images/proj1.png', // Default image
        isPortfolio: false,
        customerId: quote.userId || null,
        customerName: `${quote.firstName} ${quote.lastName}`,
        currentPhase: 'Project planning initiated',
        nextPhase: 'Awaiting approval and site visit'
      };

      await convertQuoteToProject(quote.id, projectData, user.uid);
      alert('Quote approved and project created!');
      setShowQuoteModal(false);
      setSelectedQuote(null);
      fetchQuotes();
      fetchProjects();
    } catch (error) {
      console.error('Error approving quote:', error);
      alert('Error approving quote');
    }
  };

  const handleRejectQuote = async (quoteId: string) => {
    try {
      await updateQuoteStatus(quoteId, 'rejected', adminNotes);
      alert('Quote rejected');
      setShowQuoteModal(false);
      setSelectedQuote(null);
      setAdminNotes('');
      fetchQuotes();
    } catch (error) {
      console.error('Error rejecting quote:', error);
      alert('Error rejecting quote');
    }
  };

  const filteredProjects = filterStatus === 'all' 
    ? projects 
    : projects.filter(p => p.status === filterStatus);

  const filteredQuotes = quoteFilterStatus === 'all'
    ? quotes
    : quotes.filter(q => q.status === quoteFilterStatus);

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
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow mb-2">{projects.filter(p => p.status === 'in-progress' || p.status === 'planning').length}</div>
                  <p className="text-gray-600">Active Projects</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow mb-2">{users.filter(u => u.role === 'customer').length}</div>
                  <p className="text-gray-600">Total Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow mb-2">{quotes.filter(q => q.status === 'pending').length}</div>
                  <p className="text-gray-600">Pending Quotes</p>
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
              onClick={() => setShowModal(true)}
            >
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-pen text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Register User</h3>
              <p className="text-gray-600">Create a new account (admin or customer)</p>
            </div>

            <div 
              className="bg-white rounded-lg shadow-lg p-6 text-center card-hover cursor-pointer"
              onClick={() => {
                resetProjectForm();
                setShowProjectModal(true);
              }}
            >
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-project-diagram text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Manage Projects</h3>
              <p className="text-gray-600">View and manage all construction projects</p>
            </div>

            <div 
              className="bg-white rounded-lg shadow-lg p-6 text-center card-hover cursor-pointer"
              onClick={() => {
                const el = document.getElementById('admin-reports-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
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

          {/* Projects Management */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-brand-navy">Projects Management</h3>
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                >
                  <option value="all">All Status</option>
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
                <button
                  onClick={() => {
                    resetProjectForm();
                    setShowProjectModal(true);
                  }}
                  className="btn-primary text-white px-4 py-2 rounded-lg font-semibold"
                >
                  <i className="fas fa-plus mr-2"></i>Add Project
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Title</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Category</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Status</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Progress</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Type</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <tr key={project.id}>
                        <td className="px-4 py-3 font-medium">{project.title}</td>
                        <td className="px-4 py-3">{project.category}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            project.status === 'completed' ? 'bg-green-100 text-green-700' :
                            project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            project.status === 'planning' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-brand-yellow h-2 rounded-full" 
                                style={{width: `${project.progress}%`}}
                              ></div>
                            </div>
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            project.isPortfolio ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {project.isPortfolio ? 'Portfolio' : 'Customer'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProject(project)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => {
                                setProjectToDelete(project.id);
                                setShowDeleteConfirm(true);
                              }}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-3 text-gray-500" colSpan={6}>No projects found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quote Requests Management */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-brand-navy">Quote Requests</h3>
              <select
                value={quoteFilterStatus}
                onChange={(e) => setQuoteFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="converted">Converted</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Name</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Email</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Project Type</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Timeline</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Status</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Date</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredQuotes.length > 0 ? (
                    filteredQuotes.map((quote) => (
                      <tr key={quote.id}>
                        <td className="px-4 py-3">{`${quote.firstName} ${quote.lastName}`}</td>
                        <td className="px-4 py-3">{quote.email}</td>
                        <td className="px-4 py-3">{quote.projectType}</td>
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
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              setSelectedQuote(quote);
                              setShowQuoteModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-3 text-gray-500" colSpan={7}>No quotes found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reports Section */}
          <div id="admin-reports-section" className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-brand-navy mb-6">Reports Overview</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-brand-navy mb-2">Projects Summary</h4>
                <p className="text-3xl font-bold text-brand-yellow mb-1">{projects.length}</p>
                <p className="text-gray-600 text-sm">Total projects (portfolio and customer)</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-brand-navy mb-2">Active Customers</h4>
                <p className="text-3xl font-bold text-brand-yellow mb-1">{users.filter(u => u.role === 'customer').length}</p>
                <p className="text-gray-600 text-sm">Registered customer accounts</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-brand-navy mb-2">Open Quotes</h4>
                <p className="text-3xl font-bold text-brand-yellow mb-1">{quotes.filter(q => q.status === 'pending').length}</p>
                <p className="text-gray-600 text-sm">Quotes awaiting review</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-brand-navy mb-3">Projects by Status</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>Planning: {projects.filter(p => p.status === 'planning').length}</li>
                  <li>In Progress: {projects.filter(p => p.status === 'in-progress').length}</li>
                  <li>Completed: {projects.filter(p => p.status === 'completed').length}</li>
                  <li>On Hold: {projects.filter(p => p.status === 'on-hold').length}</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-brand-navy mb-3">Quotes by Status</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>Pending: {quotes.filter(q => q.status === 'pending').length}</li>
                  <li>Approved: {quotes.filter(q => q.status === 'approved').length}</li>
                  <li>Rejected: {quotes.filter(q => q.status === 'rejected').length}</li>
                  <li>Converted: {quotes.filter(q => q.status === 'converted').length}</li>
                </ul>
              </div>
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

      {/* Project Modal */}
      {showProjectModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="bg-brand-navy text-white px-4 py-4 md:px-6 md:py-5 rounded-t-2xl flex items-center justify-between" style={{ backgroundColor: '#313851', color: 'white' }}>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowProjectModal(false);
                  resetProjectForm();
                }}
                className="text-white hover:text-brand-yellow text-2xl leading-none font-bold"
                style={{ color: 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', minWidth: '30px' }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Residential">Residential</option>
                      <option value="Renovation">Renovation</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={projectForm.location}
                      onChange={(e) => setProjectForm({...projectForm, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                    <input
                      type="text"
                      value={projectForm.area}
                      onChange={(e) => setProjectForm({...projectForm, area: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      required
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({...projectForm, status: e.target.value as any})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={projectForm.progress}
                      onChange={(e) => setProjectForm({...projectForm, progress: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                    <select
                      value={projectForm.isPortfolio ? 'portfolio' : 'customer'}
                      onChange={(e) => setProjectForm({...projectForm, isPortfolio: e.target.value === 'portfolio'})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    >
                      <option value="portfolio">Portfolio (Public)</option>
                      <option value="customer">Customer Project</option>
                    </select>
                  </div>
                </div>
                {!projectForm.isPortfolio && (
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
                      <select
                        value={projectForm.customerId || ''}
                        onChange={(e) => {
                          const selectedUser = users.find(u => u.id === e.target.value);
                          setProjectForm({
                            ...projectForm,
                            customerId: e.target.value || null,
                            customerName: selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                      >
                        <option value="">Select Customer</option>
                        {users.filter(u => u.role === 'customer').map(u => (
                          <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                      <input
                        type="text"
                        value={projectForm.customerName}
                        onChange={(e) => setProjectForm({...projectForm, customerName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                      />
                    </div>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Phase</label>
                    <input
                      type="text"
                      value={projectForm.currentPhase}
                      onChange={(e) => setProjectForm({...projectForm, currentPhase: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Phase</label>
                    <input
                      type="text"
                      value={projectForm.nextPhase}
                      onChange={(e) => setProjectForm({...projectForm, nextPhase: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Add feature and press Enter"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                    <button type="button" onClick={addFeature} className="btn-primary text-white px-4 py-2 rounded-lg">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {projectForm.keyFeatures?.map((feature, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technical Specifications</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={specInput}
                      onChange={(e) => setSpecInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                      placeholder="Add spec and press Enter"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                    <button type="button" onClick={addSpec} className="btn-primary text-white px-4 py-2 rounded-lg">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {projectForm.technicalSpecs?.map((spec, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProjectModal(false);
                      resetProjectForm();
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="bg-red-600 text-white px-4 py-4 md:px-6 md:py-5 rounded-t-2xl flex items-center justify-between" style={{ backgroundColor: '#dc2626', color: 'white' }}>
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'white' }}>Confirm Delete</h2>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setProjectToDelete(null);
                }}
                className="text-white hover:text-gray-200 text-2xl leading-none font-bold"
                style={{ color: 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', minWidth: '30px' }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setProjectToDelete(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Details Modal */}
      {showQuoteModal && selectedQuote && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="bg-brand-navy text-white px-4 py-4 md:px-6 md:py-5 rounded-t-2xl flex items-center justify-between" style={{ backgroundColor: '#313851', color: 'white' }}>
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'white' }}>Quote Details</h2>
              <button
                type="button"
                onClick={() => {
                  setShowQuoteModal(false);
                  setSelectedQuote(null);
                  setAdminNotes('');
                }}
                className="text-white hover:text-brand-yellow text-2xl leading-none font-bold"
                style={{ color: 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', minWidth: '30px' }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedQuote.firstName} {selectedQuote.lastName}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedQuote.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedQuote.phone}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                    <p className="text-gray-900">{selectedQuote.projectType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                    <p className="text-gray-900">{selectedQuote.timeline || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900">{selectedQuote.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                    selectedQuote.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    selectedQuote.status === 'approved' ? 'bg-green-100 text-green-700' :
                    selectedQuote.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedQuote.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                  <p className="text-gray-900">{selectedQuote.createdAt?.toDate?.()?.toLocaleString() || '—'}</p>
                </div>
              </div>
              {selectedQuote.status === 'pending' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                    <textarea
                      rows={3}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add internal notes..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => handleRejectQuote(selectedQuote.id)}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject Quote
                    </button>
                    <button
                      onClick={() => handleApproveQuote(selectedQuote)}
                      className="px-6 py-3 btn-primary text-white rounded-lg font-semibold"
                    >
                      Approve & Create Project
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Register User Modal */}
      {showModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <div className="bg-brand-navy text-white px-4 py-4 md:px-6 md:py-5 rounded-t-2xl flex items-center justify-between" style={{ backgroundColor: '#313851', color: 'white' }}>
              <div>
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'white' }}>Register New User</h2>
                <p className="text-gray-200 text-sm md:text-base">Create an Admin or Customer account</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-white hover:text-brand-yellow text-2xl leading-none font-bold"
                style={{ color: 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', minWidth: '30px' }}
                aria-label="Close"
              >
                &times;
              </button>
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
