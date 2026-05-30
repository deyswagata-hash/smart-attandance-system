import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('[LoginPage] Form submitted with email:', formData.email);

    try {
      const user = await login(formData.email, formData.password);
      console.log('[LoginPage] Login successful, user object:', user);
      
      // Determine target role:
      // If the PocketBase schema was missing the role field, user.role might be undefined.
      // We safely fall back to the selected roleParam, or default to student.
      const effectiveRole = user.role || roleParam || 'student';
      console.log('[LoginPage] Effective role for routing:', effectiveRole);

      if (roleParam && user.role && user.role !== roleParam) {
        toast.error(`This account is not registered as a ${roleParam}`);
        setLoading(false);
        return;
      }

      toast.success('Welcome back!');
      
      // Perform routing based on the effective role
      console.log(`[LoginPage] Navigating to dashboard for role: ${effectiveRole}`);
      if (effectiveRole === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (effectiveRole === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error) {
      toast.error('Invalid email or password');
      console.error('[LoginPage] Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Login${roleParam ? ` as ${roleParam}` : ''} - QR Attendance System`}</title>
        <meta name="description" content="Login to access your QR attendance dashboard" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 flex items-center justify-center py-20 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-md mx-auto"
            >
              <div className="card p-10 rounded-[2.5rem]">
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-bold mb-3 text-foreground">
                    {roleParam ? `Login as ${roleParam}` : 'Welcome back'}
                  </h1>
                  <p className="text-lg text-foreground/60 font-medium">
                    We're so glad to see you again!
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-semibold text-foreground/80 ml-1">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background border-border focus:border-primary focus:ring-primary text-foreground rounded-xl px-4 py-6 text-lg"
                      placeholder="hello@example.com"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-base font-semibold text-foreground/80 ml-1">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="bg-background border-border focus:border-primary focus:ring-primary text-foreground rounded-xl px-4 py-6 text-lg"
                      placeholder="########"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full relative overflow-hidden bg-primary/80 backdrop-blur-md text-primary-foreground rounded-xl py-6 text-lg font-bold transition-all duration-300 border border-primary/30 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(102,252,241,0.5)]">
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-base text-muted-foreground font-medium">
                    Don't have an account?{' '}
                    <button
                      onClick={() => navigate('/signup')}
                      className="text-accent-foreground hover:text-accent font-bold transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LoginPage;