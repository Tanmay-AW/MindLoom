import React from 'react';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    // FIXED: Background now uses the correct brand-navy color.
    <footer className="bg-brand-navy text-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold mb-2">MindLoom</h3>
            <p className="text-background text-opacity-80">
              Building stronger minds, one day at a time.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-opacity-100 text-opacity-80 transition">Features</a></li>
              <li><a href="#about" className="hover:text-opacity-100 text-opacity-80 transition">About Us</a></li>
              <li><a href="#pricing" className="hover:text-opacity-100 text-opacity-80 transition">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="space-y-2">
              <li><a href="#blog" className="hover:text-opacity-100 text-opacity-80 transition">Blog</a></li>
              <li><a href="#newsletter" className="hover:text-opacity-100 text-opacity-80 transition">Newsletter</a></li>
              <li><a href="#events" className="hover:text-opacity-100 text-opacity-80 transition">Events</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#privacy" className="hover:text-opacity-100 text-opacity-80 transition">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-opacity-100 text-opacity-80 transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-background border-opacity-20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background text-opacity-70 text-sm mb-4 md:mb-0">
            © 2025 MindLoom. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-background text-opacity-70 hover:text-opacity-100 transition"><Twitter size={20} /></a>
            <a href="#" className="text-background text-opacity-70 hover:text-opacity-100 transition"><Linkedin size={20} /></a>
            <a href="#" className="text-background text-opacity-70 hover:text-opacity-100 transition"><Instagram size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
