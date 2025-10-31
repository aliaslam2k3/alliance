'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2070&q=80",
    alt: "Construction Site 1"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2070&q=80",
    alt: "Construction Site 2"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80",
    alt: "Construction Site 3"
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const showSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-brand-black">
      <div className="absolute inset-0">
        {/* Carousel Container */}
        <div className="relative w-full h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 hero-bg"></div>
        
        {/* Carousel Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot w-3 h-3 rounded-full transition-opacity ${
                index === currentSlide ? 'bg-white opacity-100' : 'bg-white opacity-50 hover:opacity-100'
              }`}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="reveal">
          <h4 className="text-lg font-semibold text-brand-yellow mb-4 tracking-widest">SUPERIOR QUALITY</h4>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 leading-tight">
            FROM CONCEPT TO CREATION
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Turning ideas into lasting structures with precision, innovation, and trust
          </p>
          <Link href="/projects" className="btn-primary text-black px-8 py-4 rounded-full font-semibold text-lg inline-block">
            View Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
