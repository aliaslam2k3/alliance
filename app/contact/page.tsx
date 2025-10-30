'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="font-inter bg-white text-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <header className="relative h-[55vh] flex items-center justify-center bg-brand-black">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2070&q=80"
            alt="Contact cover"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-3xl px-4">
          <h1 className="text-5xl font-playfair font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-200">We are here to answer your questions and turn your vision into reality.</p>
        </div>
      </header>

      {/* Contact Form and Info Section */}
      <main className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-3xl font-playfair font-bold mb-6">Drop Us a Message</h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5">
                  <input 
                    type="text"
                    placeholder="Your Name *" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <input 
                    type="email" 
                    placeholder="Your Email *" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                  />
                  <input 
                    type="tel" 
                    placeholder="Your Phone *" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                  />
                </div>
                <textarea 
                  rows={5} 
                  placeholder="Your Message *" 
                  required 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                ></textarea>
                <button 
                  type="submit" 
                  className="btn-primary text-black px-6 py-3 rounded-full font-semibold"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* Map and Contact Info */}
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Our Office</h3>
                <div className="rounded-lg overflow-hidden shadow h-64">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2115.8354896914657!2d74.22816674383196!3d31.3776248742796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919000f5fc1200f%3A0xf5096620130e6fb!2sAlliance%20Engineers%20%26%20Contractors!5e0!3m2!1sen!2s!4v1758884055966!5m2!1sen!2s" 
                    width="100%" 
                    height="100%" 
                    style={{border: 0}} 
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-brand-yellow mr-3"></i>
                  <span>12Km Raiwind Road, Lahore</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-phone text-brand-yellow mr-3"></i>
                  <span>+92 42 35459444</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope text-brand-yellow mr-3"></i>
                  <span>alliance477@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
