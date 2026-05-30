import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { toast } from 'sonner';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import pb from '../lib/pocketbaseClient.js';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await pb.collection('contact_submissions').create({
        name: formData.name,
        email: formData.email,
        subject: 'Contact Form Submission',
        message: formData.message
      });

      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });

    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - QR Attendance</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">

          {/* HERO */}
          <section className="py-20 text-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="container mx-auto max-w-3xl"
            >
              <h1 className="text-5xl font-bold text-foreground mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-foreground/70">
                We’re here to help you ✨
              </p>
            </motion.div>
          </section>

          {/* CONTENT */}
          <section className="py-16">
            <div className="container mx-auto grid lg:grid-cols-2 gap-12">

              {/* FORM */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                  <div>
                    <Label>Name</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>

                  <div>
                    <Label>Message</Label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden rounded-xl py-4 text-lg font-semibold text-white 
  bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 
  hover:scale-105 transition-all duration-300 neon-glow"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </motion.div>

              {/* INFO */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >

                <div className="card flex items-center gap-4">
                  <Mail className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">
                      smartqrattendance55@gmail.com
                    </p>
                  </div>
                </div>

                <div className="card flex items-center gap-4">
                  <Phone className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold text-foreground">
                      +91 9876543210
                    </p>
                  </div>
                </div>

                <div className="card flex items-center gap-4">
                  <MapPin className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">
                      SaltLake-sector V,700091,West Bengal,India
                    </p>
                  </div>
                </div>

              </motion.div>

            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;