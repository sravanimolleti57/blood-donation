import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMail, FiPhone, FiMapPin, FiGlobe, FiShield } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                🩸
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Blood<span className="text-brand-500">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 italic">
              "Every Drop Can Save a Life"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connecting donors, hospitals, and communities when every second matters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-brand-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/register" className="hover:text-brand-400 transition-colors">Become a Donor</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Hospital Login</Link></li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support & Trust</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about#privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/about#terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/about#faq" className="hover:text-brand-400 transition-colors">Frequently Asked Questions</Link></li>
              <li className="flex items-center gap-2 text-emerald-400 text-xs">
                <FiShield className="w-4 h-4" />
                <span>24/7 Verified Platform Security</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Emergency Contact</h4>
            <div className="flex items-start gap-3 text-sm">
              <FiPhone className="w-4 h-4 text-brand-500 mt-1 shrink-0" />
              <span>+91 1800-123-BLOOD (25663)</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <FiMail className="w-4 h-4 text-brand-500 mt-1 shrink-0" />
              <span>emergency@bloodconnect.org</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <FiMapPin className="w-4 h-4 text-brand-500 mt-1 shrink-0" />
              <span>Central Healthcare Hub, City Center</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BloodConnect Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <FiHeart className="w-3.5 h-3.5 text-brand-500 fill-current" />
            <span>for healthcare & saving lives.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
