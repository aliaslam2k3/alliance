'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ClientMarquee from '../../components/ClientMarquee';

const projects = [
  {
    id: 1,
    title: "LACAS School Network",
    category: "Commercial",
    image: "/images/proj1.png",
    description: "Johar Town Branch - A state-of-the-art educational facility featuring modern design and sustainable construction.",
    link: "/projects/proj1"
  },
  {
    id: 2,
    title: "Shalimar Paper Mill",
    category: "Industrial",
    image: "/images/proj2.png",
    description: "Lahore - Large-scale industrial facility designed for maximum efficiency and operational excellence.",
    link: "/projects/proj2"
  },
  {
    id: 3,
    title: "Government House",
    category: "Residential",
    image: "/images/proj3.png",
    description: "Murree - Prestigious residential complex featuring luxury finishes and premium amenities.",
    link: "/projects/proj3"
  },
  {
    id: 4,
    title: "Nadia Textiles",
    category: "Industrial",
    image: "/images/proj4.png",
    description: "Lahore - Modern textile manufacturing facility with advanced infrastructure and technology integration.",
    link: "/projects/proj4"
  },
  {
    id: 5,
    title: "Shabbir Town",
    category: "Commercial",
    image: "/images/proj5.png",
    description: "Lahore - Mixed-use commercial development featuring retail spaces and modern office facilities.",
    link: "/projects/proj5"
  },
  {
    id: 6,
    title: "Government Boys School",
    category: "Commercial",
    image: "/images/proj6.png",
    description: "Bagh AJK - Educational facility designed for optimal learning environment and student safety.",
    link: "/projects/proj6"
  }
];

export default function Projects() {
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
  }, []);

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                href={project.link}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 block"
              >
                <div className="relative overflow-hidden h-64 bg-gray-200 group">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="eager"
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
