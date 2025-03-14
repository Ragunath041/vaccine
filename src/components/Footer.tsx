
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Syringe, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <center>
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-vaccine-blue">
            <Syringe className="h-5 w-5" />
            <span>VacciCare</span>
          </Link>
          <p className="text-gray-600 text-sm">
            Empowering parents to manage their children's vaccination journey with ease and confidence.
          </p>
          {/* <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-vaccine-blue transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-vaccine-blue transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-vaccine-blue transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div> */}
        </div>
        </center>
        {/* <div>
          <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="text-gray-600 hover:text-vaccine-blue transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-600 hover:text-vaccine-blue transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/vaccination-guide" className="text-gray-600 hover:text-vaccine-blue transition-colors">
                Vaccination Guide
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-gray-600 hover:text-vaccine-blue transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-600 hover:text-vaccine-blue transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div> */}
        
        {/* <div>
          <h3 className="font-medium text-gray-900 mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/appointments" className="text-gray-600 hover:text-vaccine-blue transition-colors">
                Book Appointment
              </Link>
            </li>
            <li>
              <Link to="/vaccination-records" className="text-gray-600 hover:text-vaccine-blue transition-colors">
                Vaccination Records
              </Link>
            </li>
            <li>
              <Link to="/vaccination-centers" className="text-gray-600 hover:text-vaccine-blue transition-colors">
                Find Vaccination Centers
              </Link>
            </li>
            <li>
              <Link to="/chatbot" className="text-gray-600 hover:text-vaccine-blue transition-colors">
                Ask VacciBot
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-vaccine-blue flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">
                123 Healthcare Street, Medical City, 10001
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-vaccine-blue flex-shrink-0" />
              <span className="text-gray-600">+1 (800) VACCINE</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-vaccine-blue flex-shrink-0" />
              <span className="text-gray-600">support@vaccicare.com</span>
            </li>
          </ul>
        </div> */}
      </div>
      
      <div className="bg-gray-100 py-4 text-center text-sm text-gray-500">
        <div className="container">
          <p>© {new Date().getFullYear()} VacciCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
