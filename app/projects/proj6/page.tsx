'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';

export default function Project6() {
  useEffect(() => {
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
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <div className="font-inter bg-white text-gray-800">
      <Navigation />
      
      <section className="relative h-[70vh] flex items-center justify-center bg-brand-black">
        <div className="absolute inset-0">
          <Image src="/images/proj6.png" alt="Govt. Boys School, Bagh AJK" fill className="object-cover" />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-6xl font-playfair font-bold mb-4">Govt. Boys School, Bagh AJK</h1>
          <p className="text-xl text-gray-200 mb-6">Commercial</p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Educational infrastructure project providing quality learning facilities for students.</p>
        </div>
      </section>

      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-playfair font-bold mb-6">Project Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  A comprehensive educational facility designed to provide quality learning environments for students in the AJK region.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">Key Features</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Modern classrooms</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Science laboratories</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Library facilities</span></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Technical Specifications</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Educational infrastructure</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Safety systems</span></li>
                      <li className="flex"><i className="fas fa-check text-brand-yellow mt-1 mr-3"></i><span>Modern utilities</span></li>
                    </ul>
                  </div>
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
                      <p className="text-gray-600">Bagh AJK</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-tag text-brand-yellow mr-3"></i>
                    <div>
                      <p className="font-semibold text-gray-800">Category</p>
                      <p className="text-gray-600">Commercial</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-calendar text-brand-yellow mr-3"></i>
                    <div>
                      <p className="font-semibold text-gray-800">Completion</p>
                      <p className="text-gray-600">2018</p>
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