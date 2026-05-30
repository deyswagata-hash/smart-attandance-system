import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { GraduationCap, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      role: 'teacher',
      title: 'Teacher',
      description: 'Generate QR codes, manage classes, and track student attendance',
      icon: GraduationCap,
      bgColor: 'bg-primary',
      textColor: 'text-primary-foreground',
      btnColor: 'bg-white/30 hover:bg-white/50 text-primary-foreground'
    },
    {
      role: 'student',
      title: 'Student',
      description: 'Scan QR codes to mark attendance and view your attendance history',
      icon: Users,
      bgColor: 'bg-muted',
      textColor: 'text-muted-foreground',
      btnColor: 'bg-white/40 hover:bg-white/60 text-muted-foreground'
    },
    {
      role: 'admin',
      title: 'Admin',
      description: 'Manage users, classes, and view system-wide attendance reports',
      icon: Shield,
      bgColor: 'bg-secondary',
      textColor: 'text-secondary-foreground',
      btnColor: 'bg-white/40 hover:bg-white/60 text-secondary-foreground'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Select your role - QR Attendance System</title>
        <meta name="description" content="Choose your role to access the QR attendance system" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-24 bg-gradient-to-b from-background to-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground" style={{ letterSpacing: '-0.02em' }}>
                Welcome! Who are you?
              </h1>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
                Choose your role to access your personalized dashboard.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {roles.map((item, index) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                  className={`${item.bgColor} rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-white/40 flex flex-col`}
                >
                  <div className={`w-20 h-20 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center mb-8`}>
                    <item.icon className={`w-10 h-10 ${item.textColor}`} />
                  </div>
                  <h2 className={`text-3xl font-bold mb-4 ${item.textColor}`}>{item.title}</h2>
                  <p className={`${item.textColor} opacity-90 leading-relaxed mb-10 flex-1 font-medium text-lg`}>
                    {item.description}
                  </p>
                  <Button
                    onClick={() => navigate(`/login?role=${item.role}`)}
                    className={`w-full text-lg py-6 rounded-2xl font-bold shadow-sm ${item.btnColor}`}
                  >
                    Login as {item.title}
                  </Button>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mt-16"
            >
              <p className="text-foreground/70 mb-4 font-medium text-lg">New here?</p>
              <Button variant="outline" onClick={() => navigate('/signup')} className="rounded-xl px-8 py-6 text-lg bg-white hover:bg-primary/10 border-border/50">
                Create an account
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RoleSelectionPage;