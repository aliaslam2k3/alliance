'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function About() {
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
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2070&q=80"
            alt="About Us"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 hero-bg"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="reveal">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              About Alliance Engineers
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Building excellence since 1993
            </p>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <Image 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80" 
                alt="Our Team" 
                width={600} 
                height={400}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            
            <div className="reveal">
              <h4 className="text-lg font-semibold text-brand-navy mb-4 tracking-widest">OUR STORY</h4>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
                Three Decades of Excellence
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Founded in 1993, Alliance Engineers & Contractors has grown from a small construction company to one of Pakistan's most trusted engineering firms. Our journey began with a simple mission: to deliver quality construction projects on time, every time.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Over the years, we have successfully completed over 150 projects across Pakistan, ranging from residential complexes to large-scale industrial facilities. Our commitment to excellence, innovation, and client satisfaction has made us a preferred partner for both private and government organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center reveal card-hover">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-gem text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                We never compromise on quality. Every project is executed with the highest standards, using premium materials and proven construction techniques.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center reveal card-hover">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-clock text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Timeliness</h3>
              <p className="text-gray-600 leading-relaxed">
                We understand the importance of deadlines. Our project management expertise ensures timely delivery without compromising on quality.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center reveal card-hover">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Safety</h3>
              <p className="text-gray-600 leading-relaxed">
                Safety is our top priority. We maintain strict safety protocols and ensure all our workers and sites meet the highest safety standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Our Leadership</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Meet the visionaries behind our success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <Image 
                src="/images/ceo.jpeg" 
                alt="CEO" 
                width={400} 
                height={500}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            
            <div className="reveal">
              <h4 className="text-lg font-semibold text-brand-navy mb-4 tracking-widest">LEADERSHIP</h4>
              <h3 className="text-3xl font-playfair font-bold mb-4">Rana Muhammad Naeem</h3>
              <p className="text-brand-navy font-semibold text-lg mb-6">Chief Executive Officer</p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                With over 25 years of experience in the construction industry, Rana Muhammad Naeem has been instrumental in shaping Alliance Engineers & Contractors into the trusted company it is today. His vision of delivering quality projects on time has been the driving force behind our success.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Under his leadership, we have expanded our operations across Pakistan and built lasting relationships with clients from various sectors. His commitment to innovation and excellence continues to guide our company forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-brand-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Our Achievements</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Numbers that speak for our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center reveal">
              <div className="stats-counter mb-2" data-target="30">0</div>
              <p className="text-gray-600 font-medium">Years Experience</p>
            </div>
            <div className="text-center reveal">
              <div className="stats-counter mb-2" data-target="150">0</div>
              <p className="text-gray-600 font-medium">Projects Completed</p>
            </div>
            <div className="text-center reveal">
              <div className="stats-counter mb-2" data-target="50">0</div>
              <p className="text-gray-600 font-medium">Expert Team</p>
            </div>
            <div className="text-center reveal">
              <div className="stats-counter mb-2" data-target="100">0</div>
              <p className="text-gray-600 font-medium">Happy Clients</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
