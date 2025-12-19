'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HeroCarousel from '../components/HeroCarousel';
import ClientMarquee from '../components/ClientMarquee';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export default function Home() {
  const { user, userData } = useAuth();
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

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (userData && userData.firstName && userData.lastName) {
      setQuoteForm(prev => ({
        ...prev,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || ''
      }));
    }
  }, [userData]);

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
        source: 'homepage'
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
      if (hasAnimated) return;
      
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current).toString();
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toString();
            hasAnimated = true;
          }
        };

        updateCounter();
      });
    };

    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('#about');
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    }, { threshold: 0.5 });

    if (statsSection) {
      statsObserver.observe(statsSection);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
        const target = href ? document.querySelector(href) : null;
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
      if (statsSection) {
        statsObserver.unobserve(statsSection);
      }
    };
  }, []);

  return (
    <div className="font-inter bg-white text-gray-800">
      <Navigation />
      
      <HeroCarousel />

      {/* Services Section */}
      <section className="section-padding bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center reveal card-hover">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-leaf text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Sustainable System</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in building for the future. By integrating eco-friendly materials and modern engineering practices, we ensure our projects are not only durable but also environmentally responsible.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center reveal card-hover">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-handshake text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Trusted Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Our work is built on integrity, transparency, and professionalism. From planning to completion, we prioritize client satisfaction by delivering reliable solutions and honoring our commitments.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center reveal card-hover">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-tools text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Technology-Driven Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                With the latest tools, techniques, and construction technologies, we bring efficiency, precision, and modern design to every project, keeping our clients ahead in a rapidly changing world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Message Section */}
      <section className="section-padding bg-brand-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <Image 
                src="/images/ceo.jpeg" 
                alt="CEO" 
                width={600} 
                height={400}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            
            <div className="reveal">
              <h4 className="text-lg font-semibold text-brand-navy mb-4 tracking-widest">MESSAGE FROM CEO</h4>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
                Building Dreams, Creating Legacies
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At Alliance Engineers & Contractors, we don't just construct buildings, we create foundations of trust, value, and long-lasting partnerships. For more than 20 years, our unwavering commitment to integrity, quality, and innovation has driven us to deliver projects that uplift communities across Pakistan.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                With a team of skilled professionals, cutting-edge tools, and a culture rooted in safety and creativity, we transform visions into reality. Every project we undertake reflects our promise of excellence and our dedication to ensuring the complete satisfaction of our clients.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Together, we are not only building structures. We are shaping a better tomorrow.
              </p>
              <div className="flex items-center">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Rana Muhammad Naeem</h4>
                  <p className="text-brand-navy font-medium">Chief Executive Officer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientMarquee />

      {/* About Section */}
      <section id="about" className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <Image 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80" 
                alt="Construction Team" 
                width={600} 
                height={400}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            
            <div className="reveal">
              <h4 className="text-lg font-semibold text-brand-navy mb-4 tracking-widest">SINCE 1993</h4>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
                Our goal then and now is to provide quality on time projects.
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Our commitment has always been clear: delivering excellence without compromise. We strive to provide quality projects, completed on time, with precision, integrity, and innovation at the core of everything we build.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="stats-counter mb-2" data-target="20">0</div>
                  <p className="text-gray-600 font-medium">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="stats-counter mb-2" data-target="150">0</div>
                  <p className="text-gray-600 font-medium">Projects Completed</p>
                </div>
                <div className="text-center">
                  <div className="stats-counter mb-2" data-target="50">0</div>
                  <p className="text-gray-600 font-medium">Expert Team</p>
                </div>
                <div className="text-center">
                  <div className="stats-counter mb-2" data-target="24">0</div>
                  <p className="text-gray-600 font-medium">Support Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section-padding bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Latest Project</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Each project we deliver reflects our commitment to quality, innovation, and timely execution. From large-scale infrastructure to specialized developments, our work showcases the trust our clients place in us and the value we bring to every collaboration.
            </p>
          </div>
          
          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="project-card reveal">
              <Link href="/projects/proj1" className="relative overflow-hidden rounded-lg block">
                <Image 
                  src="/images/proj1.png" 
                  alt="Project 1" 
                  width={400} 
                  height={256}
                  className="w-full h-64 object-cover"
                />
                <div className="project-overlay p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">LACAS School Network,Johar Town Branch</h3>
                  <p className="text-brand-yellow font-medium">Commercial</p>
                </div>
              </Link>
            </div>
            
            <div className="project-card reveal">
              <Link href="/projects/proj2" className="relative overflow-hidden rounded-lg block">
                <Image 
                  src="/images/proj2.png" 
                  alt="Project 2" 
                  width={400} 
                  height={256}
                  className="w-full h-64 object-cover"
                />
                <div className="project-overlay p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Shalimar Paper Mill Pvt Ltd.Lahore</h3>
                  <p className="text-brand-yellow font-medium">Industrial</p>
                </div>
              </Link>
            </div>
            
            <div className="project-card reveal">
              <Link href="/projects/proj3" className="relative overflow-hidden rounded-lg block">
                <Image 
                  src="/images/proj3.png" 
                  alt="Project 3" 
                  width={400} 
                  height={256}
                  className="w-full h-64 object-cover"
                />
                <div className="project-overlay p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Government House Murree</h3>
                  <p className="text-brand-yellow font-medium">Residential</p>
                </div>
              </Link>
            </div>
            
            <div className="project-card reveal">
              <Link href="/projects/proj4" className="relative overflow-hidden rounded-lg block">
                <Image 
                  src="/images/proj4.png" 
                  alt="Project 4" 
                  width={400} 
                  height={256}
                  className="w-full h-64 object-cover"
                />
                <div className="project-overlay p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Nadia Textiles,Lahore</h3>
                  <p className="text-brand-yellow font-medium">Industrial</p>
                </div>
              </Link>
            </div>
            
            <div className="project-card reveal">
              <Link href="/projects/proj5" className="relative overflow-hidden rounded-lg block">
                <Image 
                  src="/images/proj5.png" 
                  alt="Project 5" 
                  width={400} 
                  height={256}
                  className="w-full h-64 object-cover"
                />
                <div className="project-overlay p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Shabbir Town,Lahore</h3>
                  <p className="text-brand-yellow font-medium">Commercial</p>
                </div>
              </Link>
            </div>
            
            <div className="project-card reveal">
              <Link href="/projects/proj6" className="relative overflow-hidden rounded-lg block">
                <Image 
                  src="/images/proj6.png" 
                  alt="Project 6" 
                  width={400} 
                  height={256}
                  className="w-full h-64 object-cover"
                />
                <div className="project-overlay p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Govt.Boys School,Bagh AJK</h3>
                  <p className="text-brand-yellow font-medium">Commercial</p>
                </div>
              </Link>
            </div>
          </div>
          
          {/* View All Projects Button */}
          <div className="text-center mt-12 reveal">
            <Link href="/projects" className="btn-primary text-black px-6 py-3 rounded-full font-semibold inline-block">
              VIEW ALL PROJECTS
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="testimonial-card p-8 rounded-lg reveal">
              <div className="flex items-center mb-6">
                <Image 
                  src="/images/testimonial1.jpg" 
                  alt="Ahmad Raza" 
                  width={64} 
                  height={64}
                  className="w-16 h-16 rounded-full mr-4 object-cover object-top"
                />
                <div>
                  <h4 className="text-xl font-bold">Ahmad Raza</h4>
                  <p className="text-brand-navy font-medium">Project Manager,PHA</p>
                </div>
              </div>
              <p className="text-gray-600 text-lg italic leading-relaxed">
                "Working with Alliance Engineers & Contractors was a seamless experience. Their team delivered our project on time, with exceptional quality and attention to detail. We look forward to collaborating with them again."
              </p>
            </div>
            
            <div className="testimonial-card p-8 rounded-lg reveal">
              <div className="flex items-center mb-6">
        <Image
                  src="/images/testimonial2.jpg" 
                  alt="Sara Malik" 
                  width={64} 
                  height={64}
                  className="w-16 h-16 rounded-full mr-4 object-cover object-center"
                />
                <div>
                  <h4 className="text-xl font-bold">Sara Malik</h4>
                  <p className="text-brand-navy font-medium">Director,Capital Development Ventures</p>
                </div>
              </div>
              <p className="text-gray-600 text-lg italic leading-relaxed">
                "Alliance Engineers & Contractors exceeded our expectations. Their professionalism, transparency, and innovative approach gave us complete confidence throughout the process. The final result speaks for itself."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="section-padding bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Get Your Quote</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Ready to start your next construction project? Get a personalized quote from our expert team.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto reveal">
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitMessage.includes('successfully') 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                {submitMessage}
              </div>
            )}
            <form className="bg-white rounded-lg p-8 shadow-lg" onSubmit={handleQuoteSubmit}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    required 
                    value={quoteForm.firstName}
                    onChange={(e) => setQuoteForm({...quoteForm, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    required 
                    value={quoteForm.lastName}
                    onChange={(e) => setQuoteForm({...quoteForm, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                <select 
                  id="projectType" 
                  name="projectType" 
                  required 
                  value={quoteForm.projectType}
                  onChange={(e) => setQuoteForm({...quoteForm, projectType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                >
                  <option value="">Select Project Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="renovation">Renovation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">Project Timeline</label>
                <select 
                  id="timeline" 
                  name="timeline" 
                  value={quoteForm.timeline}
                  onChange={(e) => setQuoteForm({...quoteForm, timeline: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                >
                  <option value="">Select Timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="1-3months">1-3 Months</option>
                  <option value="3-6months">3-6 Months</option>
                  <option value="6-12months">6-12 Months</option>
                  <option value="over-year">Over 1 Year</option>
                </select>
              </div>
              
              <div className="mb-8">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows={5} 
                  required 
                  placeholder="Please describe your project in detail..."
                  value={quoteForm.description}
                  onChange={(e) => setQuoteForm({...quoteForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                />
              </div>
              
              <div className="text-center">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary text-black px-8 py-4 rounded-full font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Get My Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-brand-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Delivering Excellence Across Pakistan</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Excellence that leaves its mark, across every corner of Pakistan.
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
