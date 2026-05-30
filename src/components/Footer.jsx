import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/20 p-2 rounded-xl">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">QR Attendance</span>
            </div>
            <p className="text-base text-foreground/70 leading-relaxed max-w-sm">
              A warm, inviting, and modern attendance tracking system using QR code technology for educational institutions.
            </p>
          </div>

          <div>
            <span className="font-bold text-lg mb-6 block">Quick Links</span>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-base text-foreground/70 hover:text-accent-foreground hover:translate-x-1 inline-block transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/role-selection" className="text-base text-foreground/70 hover:text-accent-foreground hover:translate-x-1 inline-block transition-all">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-base text-foreground/70 hover:text-accent-foreground hover:translate-x-1 inline-block transition-all">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-lg mb-6 block">Contact</span>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-base text-foreground/70">
                <div className="bg-secondary/30 p-2 rounded-lg">
                  <Mail className="w-4 h-4 text-secondary-foreground" />
                </div>
                <span>smartqrattendance55@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-base text-foreground/70">
                <div className="bg-muted/30 p-2 rounded-lg">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <span>+91 9876543210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/60 font-medium">
            © 2026 QR Attendance System. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-sm text-foreground/60 hover:text-primary-foreground transition-colors font-medium">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-foreground/60 hover:text-primary-foreground transition-colors font-medium">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;