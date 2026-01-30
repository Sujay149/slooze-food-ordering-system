import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const { access_token, user } = response.data;

      setToken(access_token);
      setUser(user);

      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating food icons */}
        <div className="absolute top-1/4 left-1/4 text-6xl opacity-10 animate-float">🍕</div>
        <div className="absolute top-3/4 right-1/4 text-6xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>🍔</div>
        <div className="absolute bottom-1/3 left-1/3 text-6xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🍜</div>
        <div className="absolute top-1/2 right-1/3 text-6xl opacity-10 animate-float" style={{ animationDelay: '2.5s' }}>🌮</div>
      </div>

      <div className="relative bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 animate-slide-up">
        {/* Logo/Icon */}
        <div className="text-center mb-6">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-orange-500 to-rose-600 p-4 rounded-2xl shadow-lg">
              <span className="text-4xl">🍔</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-1">
            Welcome to <span className="bg-gradient-to-r from-orange-500 to-rose-600 bg-clip-text text-transparent">Slooze</span>
          </h1>
          <p className="text-gray-600 text-sm font-medium">Sign in to order delicious food</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-lg animate-shake">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-800 font-bold mb-1.5 text-sm">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-xl">📧</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 transition shadow-sm hover:border-gray-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-bold mb-1.5 text-sm">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-xl">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 transition shadow-sm hover:border-gray-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white py-3 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-5"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <span className="ml-2">→</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Login Options */}
        <div className="mt-6 pt-5 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-800 mb-3 text-center flex items-center justify-center gap-2">
            <span className="text-base">⚡</span>
            Quick Test Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickLogin('admin@food.com', 'admin123')}
              className="px-3 py-2.5 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl text-xs font-bold text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-xl mb-0.5">👑</div>
              <div>Admin</div>
            </button>
            <button
              onClick={() => quickLogin('manager.india@food.com', 'manager123')}
              className="px-3 py-2.5 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl text-xs font-bold text-blue-700 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-xl mb-0.5">🇮🇳</div>
              <div>Manager IN</div>
            </button>
            <button
              onClick={() => quickLogin('manager.america@food.com', 'manager123')}
              className="px-3 py-2.5 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl text-xs font-bold text-blue-700 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-xl mb-0.5">🇺🇸</div>
              <div>Manager US</div>
            </button>
            <button
              onClick={() => quickLogin('member.india@food.com', 'member123')}
              className="px-3 py-2.5 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl text-xs font-bold text-green-700 hover:from-green-100 hover:to-green-200 hover:border-green-300 transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-xl mb-0.5">🇮🇳</div>
              <div>Member IN</div>
            </button>
          </div>
          
          {/* America Member - highlighted */}
          <button
            onClick={() => quickLogin('member.america@food.com', 'member123')}
            className="w-full mt-2 px-3 py-2.5 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl text-xs font-bold text-green-700 hover:from-green-100 hover:to-green-200 hover:border-green-300 transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
          >
            <div className="text-xl mb-0.5">🇺🇸</div>
            <div>Member US</div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 font-medium">
            🔐 Demo App • Use quick login or password: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">admin123 / manager123 / member123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
