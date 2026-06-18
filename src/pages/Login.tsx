import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Tambahan loading state
  const { login } = useAuth();
  const navigate = useNavigate();

  // 1. Mengubah fungsi handler menjadi async
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields!');
      return;
    }

    setIsLoading(true); // Aktifkan loading saat menembak server cloud

    try {
      // 2. Menambahkan kata kunci await untuk menunggu respon dari Supabase
      const success = await login(email, password);
      
      if (success) {
        navigate('/create');
      } else {
        setError('Invalid email or password!');
      }
    } catch (err) {
      setError('Something went wrong. Please check your connection.');
    } finally {
      setIsLoading(false); // Matikan loading setelah proses selesai
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
                placeholder="your@email.com"
                disabled={isLoading} // Kunci input jika sedang loading
              />
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
                placeholder="••••••••"
                disabled={isLoading} // Kunci input jika sedang loading
              />
            </div>

            {error && (
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
            )}

            <motion.button
              type="submit"
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              disabled={isLoading} // Nonaktifkan tombol saat loading
              className={`w-full text-cream py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${
                isLoading ? 'bg-cherry-red/60 cursor-not-allowed' : 'bg-cherry-red'
              }`}>
              <LogIn className="w-5 h-5" />
              {isLoading ? 'Logging in...' : 'Login'}
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
    </div>
  );
}
