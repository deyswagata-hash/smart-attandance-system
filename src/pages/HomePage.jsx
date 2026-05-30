import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { QrCode, Users, BarChart3, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location]);
  const features = [{
    icon: QrCode,
    title: 'QR code scanning',
    description: 'Students scan unique QR codes to mark attendance instantly',
    color: 'bg-secondary',
    textColor: 'text-secondary-foreground'
  }, {
    icon: Clock,
    title: 'Real-time tracking',
    description: 'Monitor attendance as it happens with live updates',
    color: 'bg-muted',
    textColor: 'text-muted-foreground'
  }, {
    icon: BarChart3,
    title: 'Detailed reports',
    description: 'Generate comprehensive attendance reports and analytics',
    color: 'bg-accent',
    textColor: 'text-accent-foreground'
  }, {
    icon: Shield,
    title: 'Secure access',
    description: 'Role-based permissions ensure data privacy and security',
    color: 'bg-primary',
    textColor: 'text-primary-foreground'
  }];
  return <>
    <Helmet>
      <title>QR Attendance System</title>
      <meta name="description" content="Streamline attendance tracking with our warm, pastel-themed QR code technology." />
    </Helmet>

    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/40 via-background to-secondary/40">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.8,
                ease: "easeOut"
              }}>
                <div className="inline-block px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm text-primary-foreground font-semibold text-sm mb-6 border border-white/40 shadow-sm">
                  ✨ The friendly way to track attendance
                </div>
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  Say hello to <br />

                  <span className="inline-block mt-2 text-3xl md:text-4xl lg:text-5xl 
  text-transparent bg-clip-text 
  bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400">
                    effortless tracking
                  </span>
                </h1>
                <p className="text-xl text-foreground/80 leading-relaxed mb-10 max-w-lg font-medium">
                  A warm, inviting attendance system designed for modern classrooms. Quick, accurate, and paperless.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={() => navigate('/role-selection')} className="text-lg px-8 py-6 rounded-2xl bg-muted/60 backdrop-blur-md border border-border hover:bg-muted transition-all text-foreground">
                    Get started
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate('/signup')} className="text-lg px-8 py-6 rounded-2xl bg-muted/60 backdrop-blur-md border border-border hover:bg-muted transition-all text-foreground">
                    Create account
                  </Button>
                </div>
              </motion.div>

              <motion.div initial={{
                opacity: 0,
                scale: 0.9
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut"
              }} className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary/30 to-primary/30 rounded-[3rem] transform rotate-3 scale-105 -z-10 blur-xl"></div>
                <img src="https://horizons-cdn.hostinger.com/2dee8947-7351-48ee-bc5e-f384ba164547/lamding1-TKhvM.jpeg" alt="Students using QR code attendance system in modern classroom" className="rounded-[2.5rem] shadow-2xl w-full border-8 border-white/60" />
              </motion.div>
            </div>
          </div>
        </section>

        <section id="about" className="py-32 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6
            }} className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Why choose us?</h2>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
                Save time, reduce errors, and gain insights with our beautifully simple solution.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => <motion.div key={index} initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.5,
                delay: index * 0.1
              }} className={`${feature.color} p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/40`}>
                <div className="w-14 h-14 rounded-2xl bg-white/40 flex items-center justify-center mb-6 backdrop-blur-sm">
                  <feature.icon className={`w-7 h-7 ${feature.textColor}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${feature.textColor}`}>{feature.title}</h3>
                <p className={`${feature.textColor} opacity-90 leading-relaxed font-medium text-lg`}>{feature.description}</p>
              </motion.div>)}
            </div>
          </div>
        </section>

        <section id="help" className="py-32 bg-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6
            }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Common questions</h2>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
                Everything you need to know about getting started.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[{
                q: 'How do students mark attendance?',
                a: 'Students simply scan the QR code displayed by their teacher using their mobile device camera. The system automatically records their attendance.'
              }, {
                q: 'Can teachers generate reports?',
                a: 'Yes, teachers can generate detailed attendance reports for their classes, including daily summaries and individual student records.'
              }, {
                q: 'Is the system secure?',
                a: 'Absolutely. We use role-based access control to ensure that students can only view their own records, while teachers and admins have appropriate access levels.'
              }].map((faq, index) => <motion.div key={index} initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.5,
                delay: index * 0.1
              }} className="card hover:scale-[1.02] transition-all duration-300">
                <h3 className="text-xl font-bold mb-3 flex items-start gap-3 text-foreground">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-foreground/70 leading-relaxed pl-9 font-medium text-lg">{faq.a}</p>
              </motion.div>)}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  </>;
};
export default HomePage;