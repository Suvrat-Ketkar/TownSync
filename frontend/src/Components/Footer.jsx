import React from "react";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#0FA4AF] to-[#0E7490] text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">TownSync</h2>
          <p className="text-sm leading-relaxed">
            A platform to report and track issues in your neighborhood. Help make your community a better place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-yellow-300 transition">Report an Issue</a></li>
            <li><a href="#" className="hover:text-yellow-300 transition">Track Issues</a></li>
            <li><a href="#" className="hover:text-yellow-300 transition">FAQs</a></li>
            <li><a href="#" className="hover:text-yellow-300 transition">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact & Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-yellow-300" />
              <p>123 City Street, Metro City</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-yellow-300" />
              <p>+1 234 567 890</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-yellow-300" />
              <p>support@civicfeedback.com</p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-yellow-300 transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-300 transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-300 transition">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} TownSync. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
