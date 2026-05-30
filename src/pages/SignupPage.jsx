import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';


const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    college_id: ''
  });

  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value
    });
  };

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!passwordRegex.test(formData.password)) {
  toast.error(
    'Password must contain uppercase, lowercase, number, special character and be at least 8 characters long'
  );
  return;
}

    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }

    if (formData.role === "student" && !formData.college_id?.trim()) {
      toast.error("College ID is required for students");
      return;
    }

    setLoading(true);

    try {
      await signup(formData.email, formData.password,formData.confirmPassword, formData.name, formData.role, formData.role === "student" ? formData.college_id : null);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
  console.log(error);

  if (error?.response?.data?.password) {
    toast.error(error.response.data.password.message);
  }
  else if (error?.response?.message) {
    toast.error(error.response.message);
  }
  else {
    toast.error('Failed to create account');
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign up - QR Attendance</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 flex items-center justify-center py-20 
        bg-gradient-to-br from-secondary/30 via-background to-primary/30">

          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >

              {/* 🔥 GLASS CARD */}
              <div className="p-10 rounded-[2rem] shadow-xl border border-border/50 
              bg-background/60 backdrop-blur-xl">

                {/* Heading */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground">
                    Create Account
                  </h1>
                  <p className="text-foreground/60">
                    Start your journey 🚀
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Name */}
                  <div>
                    <Label className="text-foreground/80">Full Name</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="bg-background border-border focus:ring-primary"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label className="text-foreground/80">Email</Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you00@email.com"
                      className="bg-background border-border focus:ring-primary"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-foreground/80 ml-1">
                      Select Role
                    </Label>

                    <div className="grid grid-cols-3 gap-3">

                      {/* STUDENT */}
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRoleChange("student")}
                        className={`cursor-pointer rounded-xl p-4 text-center border transition-all ${formData.role === "student"
                            ? "bg-primary text-white border-primary shadow-lg"
                            : "bg-muted/40 hover:bg-muted border-border"
                          }`}
                      >
                        🎓
                        <p className="mt-1 font-semibold">Student</p>
                      </motion.div>

                      {/* TEACHER */}
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRoleChange("teacher")}
                        className={`cursor-pointer rounded-xl p-4 text-center border transition-all ${formData.role === "teacher"
                            ? "bg-primary text-white border-primary shadow-lg"
                            : "bg-muted/40 hover:bg-muted border-border"
                          }`}
                      >
                        👨‍🏫
                        <p className="mt-1 font-semibold">Teacher</p>
                      </motion.div>

                      {/* ADMIN */}
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRoleChange("admin")}
                        className={`cursor-pointer rounded-xl p-4 text-center border transition-all ${formData.role === "admin"
                            ? "bg-primary text-white border-primary shadow-lg"
                            : "bg-muted/40 hover:bg-muted border-border"
                          }`}
                      >
                        🛠️
                        <p className="mt-1 font-semibold">Admin</p>
                      </motion.div>

                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <AnimatePresence>
                      {formData.role === "student" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2"
                        >
                          <Label className="text-base font-semibold text-foreground/80 ml-1">
                            College ID
                          </Label>

                          <Input
                            placeholder="Enter your college ID"
                            value={formData.college_id}
                            onChange={(e) =>
                              setFormData({ ...formData, college_id: e.target.value })
                            }
                            className="bg-input border-border/60 focus:border-primary focus:ring-primary rounded-xl px-4 py-6 text-lg"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>


                  {/* Password */}
                  <div>
  <Label className="text-foreground/80">Password</Label>

  <Input
    name="password"
    type="password"
    value={formData.password}
    onChange={handleChange}
    required
    placeholder="Example: Yourname#123"
    className="bg-background border-border focus:ring-primary"
  />

  <div className="mt-2 text-xs space-y-1">
    <p className={formData.password.length >= 8 ? "text-green-500" : "text-muted-foreground"}>
      {formData.password.length >= 8 ? "✅" : "❌"} Minimum 8 characters
    </p>

    <p className={/[A-Z]/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}>
      {/[A-Z]/.test(formData.password) ? "✅" : "❌"} One uppercase letter
    </p>

    <p className={/[a-z]/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}>
      {/[a-z]/.test(formData.password) ? "✅" : "❌"} One lowercase letter
    </p>

    <p className={/\d/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}>
      {/\d/.test(formData.password) ? "✅" : "❌"} One number
    </p>

    <p className={/[@$!%*?&]/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}>
      {/[@$!%*?&]/.test(formData.password) ? "✅" : "❌"} One special character
    </p>
  </div>
</div>
                  {/* Confirm */}
                  <div>
                    <Label className="text-foreground/80">Confirm Password</Label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="bg-background border-border focus:ring-primary"
                    />
                  </div>

                  {/* 🔥 BEAUTIFUL BUTTON */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden bg-primary/80 backdrop-blur-md text-primary-foreground rounded-xl py-6 text-lg font-bold transition-all duration-300 border border-primary/30 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(102,252,241,0.5)]"
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </Button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-foreground/60">
                  Already have an account?{' '}
                  <span
                    onClick={() => navigate('/login')}
                    className="cursor-pointer font-semibold text-primary hover:underline"
                  >
                    Login
                  </span>
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

export default SignupPage;