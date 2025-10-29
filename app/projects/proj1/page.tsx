'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';

export default function Project1() {
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
      <section className="relative h-[70vh] flex items-center justify-center bg-brand-black">
        <div className="absolute inset-0">
          <Image
            src="/images/proj1.png"
            alt="LACAS School Network, Johar Town Branch"
            fill
            className="object-cover opacity-60"
          />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-6xl font-playfair font-bold mb-4">LACAS School Network, Johar Town Branch</h1>
          <p className="text-xl text-gray-200 mb-6">Commercial / Education</p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Purpose-built campus designed for modern learning with safe circulation, ample daylight, and energy‑efficient systems.</p>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-playfair font-bold mb-6">Project Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Alliance Engineers & Contractors delivered a new academic block for the LACAS School Network in Johar Town, Lahore. The design supports contemporary pedagogy with flexible classrooms, dedicated labs, and collaborative breakout areas, all organized around safe student movement and generous outdoor spaces.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  The facility integrates energy‑efficient lighting, optimized daylighting, and low‑maintenance materials to reduce lifecycle costs. Attention to acoustics, thermal comfort, and safety standards ensures a productive environment for students and staff.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">Key Features</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>20+ classrooms with flexible furniture</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Science & ICT labs with dedicated services</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Library and resource center</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Multi-purpose hall for assemblies</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Administrative offices and staff rooms</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Safe circulation and emergency exits</span></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Technical Specifications</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Energy-efficient LED lighting</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Optimized natural daylighting</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>HVAC with air quality control</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Fire safety and security systems</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Accessible design compliance</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Low-maintenance materials</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-playfair font-bold mb-6">Project Gallery</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Image 
                    src="/images/proj1.png" 
                    alt="LACAS School Exterior" 
                    width={400} 
                    height={300}
                    className="w-full rounded-lg shadow-lg"
                  />
                  <Image 
                    src="/images/proj1.png" 
                    alt="LACAS School Interior" 
                    width={400} 
                    height={300}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-playfair font-bold mb-6">Project Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-brand-yellow mr-3"></i>
                    <div>
                      <p className="font-semibold text-gray-800">Location</p>
                      <p className="text-gray-600">Johar Town, Lahore</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-tag text-brand-yellow mr-3"></i>
                    <div>
                      <p className="font-semibold text-gray-800">Category</p>
                      <p className="text-gray-600">Commercial / Education</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-calendar text-brand-yellow mr-3"></i>
                    <div>
                      <p className="font-semibold text-gray-800">Completion</p>
                      <p className="text-gray-600">2023</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-ruler text-brand-yellow mr-3"></i>
                    <div>
                      <p className="font-semibold text-gray-800">Area</p>
                      <p className="text-gray-600">15,000 sq ft</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-users text-brand-yellow mr-3"></i>
                    <div>
                      <p className="font-semibold text-gray-800">Capacity</p>
                      <p className="text-gray-600">500+ students</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-playfair font-bold mb-6">Get a Quote</h3>
                <p className="text-gray-600 mb-6">Interested in a similar project? Contact us for a detailed quote.</p>
                <Link href="/contact" className="btn-primary text-black px-6 py-3 rounded-full font-semibold text-lg inline-block w-full text-center">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}