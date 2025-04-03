import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, Mail, Lock, ParkingMeter as Parking } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FormType = 'login' | 'register' | 'forgot';

interface User {
  email: string;
  password: string;
}

const Login = () => {
  const [formType, setFormType] = useState<FormType>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Simulate a simple user storage
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formType === 'login') {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);
      
      if (user || (email === 'admin@parking.com' && password === 'admin123')) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } else if (formType === 'register') {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: User) => u.email === email)) {
        alert('Email already registered');
        return;
      }
      
      users.push({ email, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful! Please login.');
      setFormType('login');
      setPassword('');
      setEmail('');
    } else if (formType === 'forgot') {
      alert('Password reset link sent to your email!');
      setFormType('login');
    }
  };

  const formVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Animated parking lines background
  const ParkingLines = () => (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-24 w-4 bg-primary/10"
          style={{
            left: `${i * 15}%`,
            top: '-20%',
            transform: 'rotate(45deg)',
          }}
          animate={{
            y: ['0%', '120%'],
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark to-background-darker flex items-center justify-center p-4 overflow-hidden relative">
      <ParkingLines />
      
      <div className="w-full max-w-md relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={formType}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-lg border border-primary/20"
          >
            <motion.div 
              className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Parking className="w-5 h-5 text-white" />
            </motion.div>

            <div className="flex flex-col items-center mb-8">
              <motion.h1 
                className="text-3xl font-bold text-white mb-2"
                animate={{ 
                  textShadow: ['0 0 8px #00D4FF', '0 0 16px #00D4FF', '0 0 8px #00D4FF'],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {formType === 'login' && 'Welcome Back'}
                {formType === 'register' && 'Join Us'}
                {formType === 'forgot' && 'Reset Access'}
              </motion.h1>
              <p className="text-white/70 text-center">
                {formType === 'login' && 'Access your parking dashboard'}
                {formType === 'register' && 'Create your parking management account'}
                {formType === 'forgot' && 'Recover your account access'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
                    placeholder="your@email.com"
                    required
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-primary/50" />
                </div>
              </motion.div>

              {formType !== 'forgot' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="password" className="block text-sm font-medium text-white">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-primary/50" />
                  </div>
                </motion.div>
              )}

              {formType === 'register' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-primary/50" />
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-white px-4 py-3 rounded-lg shadow-neon hover:shadow-neon-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-2 group"
              >
                <span className="text-lg">
                  {formType === 'login' && 'Sign In'}
                  {formType === 'register' && 'Create Account'}
                  {formType === 'forgot' && 'Reset Password'}
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-4">
              {formType === 'login' && (
                <>
                  <button
                    onClick={() => setFormType('register')}
                    className="text-white/70 hover:text-white transition-colors hover:underline"
                  >
                    Don't have an account? Register
                  </button>
                  <button
                    onClick={() => setFormType('forgot')}
                    className="text-white/70 hover:text-white transition-colors hover:underline"
                  >
                    Forgot your password?
                  </button>
                </>
              )}
              {(formType === 'register' || formType === 'forgot') && (
                <button
                  onClick={() => setFormType('login')}
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-2 hover:underline"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Login
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;