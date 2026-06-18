import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields!');
      return;
    }
    const success = login(email, password);
    if (success) {
      navigate('/create');
    } else {
      setError('Invalid email or password!');
    }
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cream via-baby-blue/20 to-dusty-pink/20 flex items-center justify-center p-6">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="w-full max-w-md">
        
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-2xl border-4 border-dark-brown">
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="brand-text text-4xl text-dark-brown mb-2 flex items-center justify-center gap-2">
                <Camera className="w-8 h-8" />
                LensaLoka
                <Sparkles className="w-6 h-6 text-butter-yellow" />
              </h1>
            </Link>
            <p className="text-medium-brown text-lg">Welcome back! 📸</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-dark-brown font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-medium-brown focus:border-cherry-red focus:outline-none bg-cream/50"
                placeholder="your@email.com" />
              
            </div>

            <div>
              <label className="block text-dark-brown font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-medium-brown focus:border-cherry-red focus:outline-none bg-cream/50"
                placeholder="••••••••" />
              
            </div>

            {error &&
            <motion.div
              initial={{
                opacity: 0,
                y: -10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="bg-cherry-red/20 border-2 border-cherry-red text-cherry-red px-4 py-3 rounded-xl text-center font-semibold">
              
                {error}
              </motion.div>
            }

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
              className="w-full bg-cherry-red text-cream py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2">
              
              <LogIn className="w-5 h-5" />
              Login
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-medium-brown">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-cherry-red font-bold hover:underline">
                
                Register here!
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>);

}