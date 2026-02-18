import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, Eye, EyeOff, ArrowRight, Monitor } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(username, password);

      if (response.success) {
        navigate('/admin/dashboard');
      } else {
        setError(response.message);
        setIsLoading(false);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Side - Artistic Background (Full Screen Height) */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-[#0f1014] relative overflow-hidden items-center justify-center p-12">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[100px]"></div>
          <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <Monitor className="h-10 w-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Help Desk System</h2>
          <p className="text-gray-400 text-sm">SMK Bakti Nusantara 666</p>
        </div>
      </div>

      {/* Right Side - Login Form (Merged with Body) */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center p-8 md:p-16 relative">

        <div className="max-w-md w-full">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-gray-500 text-lg">Sign in to manage tickets and oversee system operations.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 text-center font-medium animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder-gray-400 text-base font-medium"
                placeholder="Username / Email"
                required
              />
            </div>

            <div className="space-y-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder-gray-400 text-base font-medium"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer" />
                <span className="text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-4 rounded-2xl text-base transition-all shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
            >
              {isLoading ? 'Processing...' : 'Login'}
            </button>
          </form>



        </div>

        {/* Mobile Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-bl-[100px] -z-10 md:hidden"></div>
      </div>
    </div>
  );
};

export default Login;
