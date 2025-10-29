'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function Contact() {
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
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80"
            alt="Contact Us"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 hero-bg"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="reveal">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              Contact Us
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Get in touch with our expert team
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section-padding bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Get In Touch</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Ready to start your next construction project? Contact us today for a consultation.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center reveal card-hover">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-map-marker-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Visit Us</h3>
              <p className="text-gray-600 leading-relaxed">
                12Km Raiwind Road<br />
                Lahore, Pakistan
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center reveal card-hover">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-phone text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Call Us</h3>
              <p className="text-gray-600 leading-relaxed">
                +92 42 35459444<br />
                Mon - Fri: 9:00 AM - 6:00 PM
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center reveal card-hover">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-envelope text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Email Us</h3>
              <p className="text-gray-600 leading-relaxed">
                alliance477@gmail.com<br />
                We'll respond within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="reveal">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">Send Us a Message</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Have a project in mind? Fill out the form below and our team will get back to you with a detailed proposal.
              </p>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input type="text" id="firstName" name="firstName" required 
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"/>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input type="text" id="lastName" name="lastName" required 
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"/>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input type="email" id="email" name="email" required 
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"/>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" id="phone" name="phone" required 
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"/>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                  <select id="projectType" name="projectType" required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent">
                    <option value="">Select Project Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="renovation">Renovation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">Project Timeline</label>
                  <select id="timeline" name="timeline" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent">
                    <option value="">Select Timeline</option>
                    <option value="asap">ASAP</option>
                    <option value="1-3months">1-3 Months</option>
                    <option value="3-6months">3-6 Months</option>
                    <option value="6-12months">6-12 Months</option>
                    <option value="over-year">Over 1 Year</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                  <textarea id="description" name="description" rows={5} required 
                            placeholder="Please describe your project in detail..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"></textarea>
                </div>
                
                <button type="submit" className="btn-primary text-black px-8 py-4 rounded-full font-semibold text-lg w-full">
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="reveal">
              <div className="bg-brand-blue rounded-lg p-8 h-full">
                <h3 className="text-2xl font-bold mb-6 text-white">Why Choose Us?</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">30+ Years Experience</h4>
                      <p className="text-gray-200">Decades of expertise in construction and engineering</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Quality Assurance</h4>
                      <p className="text-gray-200">Rigorous quality control processes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Timely Delivery</h4>
                      <p className="text-gray-200">Projects completed on schedule</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Client Satisfaction</h4>
                      <p className="text-gray-200">100% client satisfaction rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-brand-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4 text-white">Find Us</h2>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto">
              Visit our office or explore our project locations across Pakistan
            </p>
          </div>

          <div className="reveal">
            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/d/embed?mid=1y6G8QLeeLet2tAtk4jzSE-rUQ4fV3MQ&ehbc=2E312F"
                width="100%" 
                height="100%" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
