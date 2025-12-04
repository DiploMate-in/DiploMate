import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Twitter, Mail, Phone } from 'lucide-react';

export function FooterSection() {
  return (
    <footer className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="DiploMate Logo"
                className="w-10 h-10 rounded-xl object-contain"
              />
              <div>
                <span className="text-xl font-bold" style={{ color: '#2F6FED' }}>
                  Diplo
                </span>
                <span className="text-xl font-bold" style={{ color: '#35C2A0' }}>
                  Mate
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Your trusted study companion for diploma engineering students.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Twitter, href: '#' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:bg-blue-100"
                  style={{ background: '#E9F0FF', color: '#2F6FED' }}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Resources</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/browse?type=notes"
                  className="text-gray-600 hover:text-[#2F6FED] transition-colors"
                >
                  Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/projects/microprojects"
                  className="text-gray-600 hover:text-[#2F6FED] transition-colors"
                >
                  Microprojects
                </Link>
              </li>
              <li>
                <Link
                  to="/projects/capstone"
                  className="text-gray-600 hover:text-[#2F6FED] transition-colors"
                >
                  Capstone Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/projects/custom-build"
                  className="text-gray-600 hover:text-[#2F6FED] transition-colors"
                >
                  Custom Build
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Help & Support</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/support"
                  className="text-gray-600 hover:text-[#2F6FED] transition-colors"
                >
                  Support Center
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-600 hover:text-[#2F6FED] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/how-to-buy"
                  className="text-gray-600 hover:text-[#2F6FED] transition-colors"
                >
                  How to Buy/Download
                </Link>
              </li>
              <li>
                <Link
                  to="/payment-help"
                  className="text-gray-600 hover:text-[#2F6FED] transition-colors"
                >
                  Payment Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Legal & Contact</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-600 hover:text-[#2F6FED] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="text-gray-600 hover:text-[#2F6FED] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@diplomate.com"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#2F6FED] transition-colors"
                >
                  <Mail size={18} />
                  hello@diplomate.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#2F6FED] transition-colors"
                >
                  <Phone size={18} />
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2025 DiploMate. All rights reserved.</p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> for diploma students
          </p>
        </div>
      </div>
    </footer>
  );
}
