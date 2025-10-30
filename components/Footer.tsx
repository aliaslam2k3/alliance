import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <div className="mb-6">
              <img 
                src="/images/logo-removebg-preview.png" 
                alt="Alliance Engineers" 
                className="h-12 w-auto mb-4"
              />
            </div>
            <h3 className="text-xl font-bold mb-6">About Us</h3>
            <p className="text-gray-400 mb-4 leading-relaxed text-sm">
              Alliance Engineers & Contractors has been delivering trusted, high-quality, and cost-effective construction solutions across Pakistan for over 20 years. Guided by integrity, innovation, and professionalism, we build lasting partnerships and projects that strengthen communities.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/" className="block text-gray-400 hover:text-brand-blue transition-colors text-sm">Home</Link>
              <Link href="/about" className="block text-gray-400 hover:text-brand-blue transition-colors text-sm">About Us</Link>
              <Link href="/projects" className="block text-gray-400 hover:text-brand-blue transition-colors text-sm">Projects</Link>
              <Link href="/contact" className="block text-gray-400 hover:text-brand-blue transition-colors text-sm">Contact</Link>
            </div>
          </div>
          
          {/* Latest Works */}
          <div>
            <h3 className="text-xl font-bold mb-6">Latest Works</h3>
            <div className="grid grid-cols-2 gap-4">
              <img src="/images/proj1.png" alt="Project 1" className="w-full h-20 object-cover rounded" />
              <img src="/images/proj2.png" alt="Project 2" className="w-full h-20 object-cover rounded" />
              <img src="/images/proj3.png" alt="Project 3" className="w-full h-20 object-cover rounded" />
              <img src="/images/proj4.png" alt="Project 4" className="w-full h-20 object-cover rounded" />
              <img src="/images/proj5.png" alt="Project 5" className="w-full h-20 object-cover rounded" />
              <img src="/images/proj6.png" alt="Project 6" className="w-full h-20 object-cover rounded" />
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <i className="fas fa-map-marker-alt text-brand-yellow mr-3 mt-1"></i>
                <span className="text-gray-400 text-sm">12Km Raiwind Road, Lahore</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-brand-yellow mr-3"></i>
                <span className="text-gray-400 text-sm">+92 42 35459444</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope text-brand-yellow mr-3"></i>
                <span className="text-gray-400 text-sm">alliance477@gmail.com</span>
              </div>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center hover:bg-white transition-colors text-brand-black">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center hover:bg-white transition-colors text-brand-black">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center hover:bg-white transition-colors text-brand-black">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center hover:bg-white transition-colors text-brand-black">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © Copyright 2024, Built by Alliance Engineers and Contractors
          </p>
        </div>
      </div>
    </footer>
  );
}
