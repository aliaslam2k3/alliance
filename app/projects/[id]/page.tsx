'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { getProjectById } from '../../../lib/projects';
import { Project } from '../../../lib/types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../lib/AuthContext';

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  useEffect(() => {
    // Scroll reveal animation
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
      reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
    };
  }, [project]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      if (typeof params.id === 'string') {
        const projectData = await getProjectById(params.id);
        if (projectData) {
          setProject(projectData);
          // Pre-fill quote form if user is logged in
          if (user) {
            // User data would come from AuthContext, but we'll handle it in the form
          }
        } else {
          setError('Project not found');
        }
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project. Please try again later.');
    } finally {
      setLoading(false);
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
        source: `project-${params.id}`
      });

      setQuoteForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        projectType: '',
        timeline: '',
        description: ''
      });
      
      setSubmitMessage('Quote request submitted successfully! We will contact you soon.');
    } catch (error) {
      setSubmitMessage('Error submitting quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="font-inter bg-white text-gray-800">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-yellow mx-auto mb-4"></div>
            <p className="text-lg">Loading project...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="font-inter bg-white text-gray-800">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The project you are looking for does not exist.'}</p>
            <Link href="/projects" className="btn-primary text-white px-6 py-3 rounded-lg font-semibold">
              Back to Projects
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-inter bg-white text-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-brand-black">
        <div className="absolute inset-0">
          <img
            src={project.image || "/images/proj1.png"}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-6xl font-playfair font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-gray-200 mb-6">{project.category}</p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{project.description}</p>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 reveal">
                <h2 className="text-3xl font-playfair font-bold mb-6">Project Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {project.description}
                </p>
                
                {project.keyFeatures && project.keyFeatures.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3">Key Features</h3>
                    <ul className="space-y-2 text-gray-700">
                      {project.keyFeatures.map((feature, index) => (
                        <li key={index} className="flex">
                          <i className="fas fa-check text-brand-yellow mt-1 mr-3"></i>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {project.technicalSpecs && project.technicalSpecs.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-3">Technical Specifications</h3>
                    <ul className="space-y-2 text-gray-700">
                      {project.technicalSpecs.map((spec, index) => (
                        <li key={index} className="flex">
                          <i className="fas fa-check text-brand-yellow mt-1 mr-3"></i>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 reveal">
                <h2 className="text-3xl font-playfair font-bold mb-6">Project Gallery</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {project.images && project.images.length > 0 ? (
                    project.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${project.title} - Image ${index + 1}`}
                        className="w-full rounded-lg shadow-lg"
                      />
                    ))
                  ) : (
                    <>
                      <img
                        src={project.image || "/images/proj1.png"}
                        alt={project.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                      <img
                        src={project.image || "/images/proj1.png"}
                        alt={project.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 reveal">
                <h3 className="text-2xl font-playfair font-bold mb-6">Project Details</h3>
                <div className="space-y-4">
                  {project.location && (
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt text-brand-yellow mr-3"></i>
                      <div>
                        <p className="font-semibold text-gray-800">Location</p>
                        <p className="text-gray-600">{project.location}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <i className="fas fa-tag text-brand-yellow mr-3"></i>
                    <div>
                      <p className="font-semibold text-gray-800">Category</p>
                      <p className="text-gray-600">{project.category}</p>
                    </div>
                  </div>
                  {project.completionDate && (
                    <div className="flex items-center">
                      <i className="fas fa-calendar text-brand-yellow mr-3"></i>
                      <div>
                        <p className="font-semibold text-gray-800">Completion</p>
                        <p className="text-gray-600">
                          {project.completionDate?.toDate?.()?.getFullYear() || '—'}
                        </p>
                      </div>
                    </div>
                  )}
                  {project.area && (
                    <div className="flex items-center">
                      <i className="fas fa-ruler text-brand-yellow mr-3"></i>
                      <div>
                        <p className="font-semibold text-gray-800">Area</p>
                        <p className="text-gray-600">{project.area}</p>
                      </div>
                    </div>
                  )}
                  {project.capacity && (
                    <div className="flex items-center">
                      <i className="fas fa-users text-brand-yellow mr-3"></i>
                      <div>
                        <p className="font-semibold text-gray-800">Capacity</p>
                        <p className="text-gray-600">{project.capacity}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <i className="fas fa-info-circle text-brand-yellow mr-3"></i>
                    <div>
                      <p className="font-semibold text-gray-800">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'completed' ? 'bg-green-100 text-green-700' :
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        project.status === 'planning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 reveal">
                <h3 className="text-2xl font-playfair font-bold mb-6">Get a Quote</h3>
                <p className="text-gray-600 mb-6">Interested in a similar project? Contact us for a detailed quote.</p>
                
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
                  <div className="mb-4">
                    <label htmlFor="quoteFirstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      id="quoteFirstName"
                      required
                      value={quoteForm.firstName}
                      onChange={(e) => setQuoteForm({...quoteForm, firstName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="quoteLastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      id="quoteLastName"
                      required
                      value={quoteForm.lastName}
                      onChange={(e) => setQuoteForm({...quoteForm, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="quoteEmail" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      id="quoteEmail"
                      required
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="quotePhone" className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      id="quotePhone"
                      required
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="quoteProjectType" className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                    <select
                      id="quoteProjectType"
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
                    <label htmlFor="quoteTimeline" className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                    <select
                      id="quoteTimeline"
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
                    <label htmlFor="quoteDescription" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      id="quoteDescription"
                      rows={4}
                      required
                      value={quoteForm.description}
                      onChange={(e) => setQuoteForm({...quoteForm, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary text-black px-6 py-3 rounded-full font-semibold text-lg w-full disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Quote'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

