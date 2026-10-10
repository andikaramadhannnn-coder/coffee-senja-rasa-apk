import React, { useState } from 'react';
import { Coffee, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, showToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === '123') {
      setErrorMessage('');
      showToast('Login berhasil! Selamat datang Admin Senja.', 'success');
      onLoginSuccess();
    } else {
      setErrorMessage('ID atau Password Salah!');
      showToast('ID atau Password Salah!', 'error');
    }
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5EBDD] bg-[radial-gradient(#E8D5C4_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-[#E2CFBD] p-8 md:p-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#4A2E1B] text-white shadow-lg mb-4 ring-4 ring-[#E8D5C4]">
            <Coffee className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#3D2817] tracking-tight">
            Coffee Senja Rasa
          </h1>
          <p className="text-xs md:text-sm text-[#8B6E58] mt-1 font-medium">
            Temani Senja Dalam Setiap Rasa
          </p>
          <div className="mt-3 inline-block px-3 py-1 bg-[#F5EBDD] text-[#6F4E37] text-xs font-semibold rounded-full border border-[#D9C3AD]">
            Kasir & Manajemen Stok Offline
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6F4E37] mb-2">
              ID Pengguna
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6E58]" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan ID admin"
                className="w-full pl-12 pr-4 py-3.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-2xl text-base text-[#3D2817] placeholder:text-[#A89485] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6F4E37] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6E58]" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan password"
                className="w-full pl-12 pr-4 py-3.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-2xl text-base text-[#3D2817] placeholder:text-[#A89485] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-[#6F4E37] hover:bg-[#5A3E2B] active:scale-[0.98] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Helper Fast Fill for demonstration */}
        <div className="mt-8 pt-6 border-t border-[#E8D5C4]/60 text-center">
          <p className="text-xs text-[#8B6E58] mb-2 font-medium">
            Akun Bawaan: <span className="font-bold text-[#6F4E37]">admin</span> / password: <span className="font-bold text-[#6F4E37]">123</span>
          </p>
          <button
            type="button"
            onClick={handleQuickFill}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F4E37] hover:text-[#4A2E1B] bg-[#F5EBDD] hover:bg-[#EBDCCB] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Isi Otomatis (Admin 123)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
