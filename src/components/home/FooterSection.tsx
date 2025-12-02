import { Link } from 'react-router-dom';

export function FooterSection() {
  return (
    <footer className="py-16 px-6" style={{ background: '#1B1B1B' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-primary">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div>
                <span className="text-lg font-bold" style={{ color: '#2F6FED' }}>Diplo</span>
                <span className="text-lg font-bold" style={{ color: '#35C2A0' }}>Mate</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-xs mb-4">
              Your one-stop platform for diploma engineering study materials, projects, and academic resources.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/browse" className="text-gray-400 hover:text-white text-sm transition-colors">Browse Notes</Link></li>
              <li><Link to="/microprojects" className="text-gray-400 hover:text-white text-sm transition-colors">Microprojects</Link></li>
              <li><Link to="/capstone-projects" className="text-gray-400 hover:text-white text-sm transition-colors">Capstone Projects</Link></li>
              <li><Link to="/custom-build" className="text-gray-400 hover:text-white text-sm transition-colors">Custom Build</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/faqs" className="text-gray-400 hover:text-white text-sm transition-colors">FAQs</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="text-gray-400 hover:text-white text-sm transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 DiploMate. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Made with ❤️ for diploma students
          </p>
        </div>
      </div>
    </footer>
  );
}
