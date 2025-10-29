'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo-removebg-preview.png" 
                alt="Alliance Engineers" 
                width={80} 
                height={80}
                className="h-20 w-auto"
                loading="eager"
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-brand-yellow transition-colors font-medium">Home</Link>
            <Link href="/about" className="text-white hover:text-brand-yellow transition-colors font-medium">About</Link>
            <Link href="/projects" className="text-white hover:text-brand-yellow transition-colors font-medium">Projects</Link>
            <Link href="/contact" className="text-white hover:text-brand-yellow transition-colors font-medium">Contact</Link>
          </div>
          
          {/* Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="btn-primary text-white px-4 py-2 rounded-full font-medium text-sm">Login</Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`mobile-menu fixed inset-y-0 left-0 w-64 bg-white shadow-lg md:hidden ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <Image 
              src="/images/logo-removebg-preview.png" 
              alt="Alliance Engineers" 
              width={56} 
              height={56}
              className="h-14 w-auto"
              style={{ width: 'auto', height: 'auto' }}
            />
            <button 
              className="text-gray-600" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <nav className="space-y-4">
            <Link href="/" className="block text-gray-800 hover:text-brand-yellow transition-colors font-medium">Home</Link>
            <Link href="/about" className="block text-gray-800 hover:text-brand-yellow transition-colors font-medium">About</Link>
            <Link href="/projects" className="block text-gray-800 hover:text-brand-yellow transition-colors font-medium">Projects</Link>
            <Link href="/contact" className="block text-gray-800 hover:text-brand-yellow transition-colors font-medium">Contact</Link>
            <Link href="/login" className="block text-gray-800 hover:text-brand-yellow transition-colors font-medium">Login</Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}
