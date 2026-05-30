import React from 'react';

import ThemeToggle from "./ThemeToggle.jsx";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { GraduationCap, LogOut } from 'lucide-react';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getDashboardLink = () => {
    // Determine the dashboard link based on the user's role
    const role = currentUser?.role;
    if (role === 'teacher') return '/teacher-dashboard';
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'student') return '/student-dashboard';
    // Fallback if role is undefined in DB
    return '/student-dashboard';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-2xl hover:opacity-80 transition-opacity">
            <div className="bg-white/20 p-2 rounded-xl">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <span>QR Attendance</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">

  <Link
    to="/"
    className="text-base font-medium text-primary-foreground/80 hover:text-primary-foreground hover:scale-105 transition-all"
  >
    Home
  </Link>

  <button
    onClick={() => scrollToSection('about')}
    className="text-base font-medium text-primary-foreground/80 hover:text-primary-foreground hover:scale-105 transition-all"
  >
    About Us
  </button>

  <Link
    to="/contact"
    className="text-base font-medium text-primary-foreground/80 hover:text-primary-foreground hover:scale-105 transition-all"
  >
    Contact
  </Link>

  <button
    onClick={() => scrollToSection('help')}
    className="text-base font-medium text-primary-foreground/80 hover:text-primary-foreground hover:scale-105 transition-all"
  >
    Help
  </button>

</nav>

          <div className="flex items-center gap-4">

            <ThemeToggle />

            {!isAuthenticated ? (
              <Button
                onClick={() => navigate('/role-selection')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl px-6"
              >
                Login
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate(getDashboardLink())}
                  className="bg-muted/60 text-foreground hover:bg-muted border border-border font-semibold rounded-xl backdrop-blur-md"
                >
                  Dashboard
                </Button>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground rounded-xl"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;