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

    // Counter animation
    const counters = document.querySelectorAll('.stats-counter');
    let hasAnimated = false;

    const animateCounters = () => {
      counters.forEach(counter => {
        const elementTop = counter.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible && !hasAnimated) {
          const target = parseInt(counter.getAttribute('data-target') || '0');
          const duration = 2000; // 2 seconds
          const increment = target / (duration / 16); // 60fps
          let current = 0;

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.ceil(current).toString();
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toString();
            }
          };

          updateCounter();
        }
      });
      
      // Check if any counter is visible, if so mark as animated
      const firstCounter = counters[0];
      if (firstCounter) {
        const elementTop = firstCounter.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          hasAnimated = true;
        }
      }
    };

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Check on load

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
      window.removeEventListener('scroll', animateCounters);
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
              About Us
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              We build on time, on budget, and with uncompromising quality.
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
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Alliance Engineers & Contractors is a trusted name in civil engineering and construction, delivering excellence for more than two decades. With a strong presence across Pakistan—particularly in Punjab and the capital region—we specialize in providing high-quality, on-time, and cost-effective solutions for both public and private sector projects.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our foundation is built on integrity, professionalism, and innovation. We combine advanced construction techniques with strict safety and quality standards to ensure every project meets the highest benchmarks of performance and reliability.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Backed by a team of skilled professionals, we take pride in creating structures that not only fulfill immediate needs but also contribute to long-term community development and economic growth. At Alliance Engineers & Contractors, we aim to establish lasting partnerships and deliver results that inspire confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Value Section */}
      <section className="section-padding bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="reveal">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-8">
                What We Value
              </h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-brand-yellow text-2xl mr-4 mt-1"></i>
                  <span className="text-gray-700">Integrity and Trust</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-brand-yellow text-2xl mr-4 mt-1"></i>
                  <span className="text-gray-700">Quality and Safety</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-brand-yellow text-2xl mr-4 mt-1"></i>
                  <span className="text-gray-700">Innovation and Technology</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-brand-yellow text-2xl mr-4 mt-1"></i>
                  <span className="text-gray-700">Sustainability</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-brand-yellow text-2xl mr-4 mt-1"></i>
                  <span className="text-gray-700">Client-Centered Approach</span>
                </li>
              </ul>
            </div>

            <div className="reveal">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-8">
                Mission & Vision
              </h2>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-brand-navy mb-4">Mission</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To deliver innovative, reliable, and sustainable construction solutions that exceed client expectations.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-brand-navy mb-4">Vision</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To be Pakistan's most trusted engineering partner, building not just structures but lasting value and partnerships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Expertise Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
              Our Expertise
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              From infrastructure and industrial projects to commercial and residential developments, we combine skilled teams with modern technology to deliver excellence across every sector.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <Image 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80" 
                alt="Our Team" 
                width={600} 
                height={400}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            
            <div className="reveal">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-8">
                Why Choose Us
              </h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-brand-yellow text-2xl mr-4 mt-1"></i>
                  <span className="text-gray-700">20+ years of proven experience</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-brand-yellow text-2xl mr-4 mt-1"></i>
                  <span className="text-gray-700">Nationwide project delivery</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-brand-yellow text-2xl mr-4 mt-1"></i>
                  <span className="text-gray-700">Cutting-edge tools and techniques</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-brand-yellow text-2xl mr-4 mt-1"></i>
                  <span className="text-gray-700">Strong track record of timely and safe execution</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-brand-yellow text-2xl mr-4 mt-1"></i>
                  <span className="text-gray-700">Long-term commitment to communities and clients</span>
                </li>
              </ul>
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
              <div className="stats-counter mb-2" data-target="20">0</div>
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
