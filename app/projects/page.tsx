'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ClientMarquee from '../../components/ClientMarquee';
import { getPortfolioProjects } from '../../lib/projects';
import { Project } from '../../lib/types';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

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
    revealOnScroll(); // Check on load

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
    };
  }, [projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const portfolioProjects = await getPortfolioProjects();
      setProjects(portfolioProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-inter bg-white text-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[55vh] flex items-center justify-center bg-brand-black">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2070&q=80"
            alt="Projects cover"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-3xl px-4">
          <h1 className="text-5xl font-playfair font-bold mb-4">Our Projects</h1>
          <p className="text-lg text-gray-200">Explore our portfolio of successful construction projects</p>
        </div>
      </section>

      {/* Our Clients Marquee */}
      <ClientMarquee />

      {/* Featured Projects Section */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From residential homes to commercial complexes, we deliver excellence in every project we undertake.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-yellow mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchProjects}
                className="btn-primary text-white px-6 py-3 rounded-lg font-semibold"
              >
                Try Again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No projects available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 block reveal"
                >
                  <div className="relative overflow-hidden h-64 bg-gray-200 group">
                    <img 
                      src={project.image || "/images/proj1.png"} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">View Details</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-brand-yellow font-semibold mb-3">{project.category}</p>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
