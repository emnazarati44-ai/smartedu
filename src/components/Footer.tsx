import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SmartEdu</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students, professors, and administrators with a modern learning platform built for academic excellence.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', view: 'home' },
                { label: 'Course Catalog', view: 'courses' },
                { label: 'Discussions', view: 'discussions' },
                { label: 'Dashboard', view: 'dashboard' },
              ].map((link) => (
                <li key={link.view}>
                  <button
                    onClick={() => onNavigate(link.view)}
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {['Help Center', 'Student Handbook', 'Academic Calendar', 'Library Access', 'Career Services', 'IT Support'].map((item) => (
                <li key={item}>
                  <button className="text-sm text-gray-400 hover:text-white transition">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">123 University Ave, Academic City, AC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">support@smartedu.university</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SmartEdu. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <button key={item} className="text-sm text-gray-500 hover:text-gray-300 transition">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
