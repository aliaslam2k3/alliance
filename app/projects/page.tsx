'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ClientMarquee from '../../components/ClientMarquee';

const projects = [
  {
    id: 1,
    title: "LACAS School Network, Johar Town Branch",
    category: "Commercial",
    image: "/images/proj1.png",
    description: "A state-of-the-art educational facility designed to provide modern learning environments for students.",
    link: "/projects/proj1"
  },
  {
    id: 2,
    title: "Shalimar Paper Mill Pvt Ltd, Lahore",
    category: "Industrial",
    image: "/images/proj2.png",
    description: "Large-scale industrial facility with advanced manufacturing capabilities and sustainable design.",
    link: "/projects/proj2"
  },
  {
    id: 3,
    title: "Government House Murree",
    category: "Residential",
    image: "/images/proj3.png",
    description: "Luxury residential complex with modern amenities and breathtaking mountain views.",
    link: "/projects/proj3"
  },
  {
    id: 4,
    title: "Nadia Textiles, Lahore",
    category: "Industrial",
    image: "/images/proj4.png",
    description: "Modern textile manufacturing facility with eco-friendly production processes.",
    link: "/projects/proj4"
  },
  {
    id: 5,
    title: "Shabbir Town, Lahore",
    category: "Commercial",
    image: "/images/proj5.png",
    description: "Mixed-use commercial development featuring retail, office, and residential spaces.",
    link: "/projects/proj5"
  },
  {
    id: 6,
    title: "Govt. Boys School, Bagh AJK",
    category: "Commercial",
    image: "/images/proj6.png",
    description: "Educational infrastructure project providing quality learning facilities for students.",
    link: "/projects/proj6"
  }
];

const categories = ["All", "Commercial", "Industrial", "Residential"];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeFilter));
    }
  }, [activeFilter]);

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
      <section className="relative h-96 flex items-center justify-center bg-brand-black">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2070&q=80"
            alt="Our Projects"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 hero-bg"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="reveal">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              Our Projects
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Showcasing our commitment to excellence and innovation
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Portfolio</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our diverse range of completed projects across different sectors
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12 reveal">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`filter-btn px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === category 
                    ? 'bg-brand-navy text-white' 
                    : 'bg-white text-gray-700 hover:bg-brand-navy hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card reveal">
                <Link href={project.link} className="relative overflow-hidden rounded-lg block">
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    width={400} 
                    height={256}
                    className="w-full h-64 object-cover"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                  <div className="project-overlay p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-brand-yellow font-medium mb-3">{project.category}</p>
                    <p className="text-sm opacity-90">{project.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClientMarquee />

      {/* CTA Section */}
      <section className="section-padding bg-brand-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="reveal">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-white">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Let us help you bring your vision to life with our expertise and commitment to excellence.
            </p>
            <Link href="/contact" className="btn-primary text-black px-8 py-4 rounded-full font-semibold text-lg inline-block">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
