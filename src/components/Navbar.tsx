import React from 'react';
import {
  Coffee,
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Code,
  RotateCcw,
  LogOut,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  currentScreen: 'dashboard' | 'kasir' | 'barang_masuk' | 'barang_keluar' | 'resep_menu' | 'laporan' | 'informasi';
  onNavigate: (screen: any) => void;
  onLogout: () => void;
  deviceMode: 'auto' | 'mobile' | 'tablet';
  setDeviceMode: (mode: 'auto' | 'mobile' | 'tablet') => void;
  onOpenAndroidModal: () => void;
  onResetDatabase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onLogout,
  deviceMode,
  setDeviceMode,
  onOpenAndroidModal,
  onResetDatabase
}) => {
  const screenTitles: Record<string, string> = {
    dashboard: 'Dashboard Utama',
    kasir: 'Kasir Penjualan',
    barang_masuk: 'Barang Masuk & Stok',
    barang_keluar: 'Barang Keluar & Log',
    resep_menu: 'Resep Menu Minuman',
    laporan: 'Laporan Penjualan',
    informasi: 'Informasi Penjualan'
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#E6D7C3] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Left: Brand & Back Navigation */}
        <div className="flex items-center gap-3">
          {currentScreen !== 'dashboard' ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2.5 rounded-2xl bg-[#FAF5EE] hover:bg-[#F2E5D5] text-[#6F4E37] border border-[#D9C3AD] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">Menu Utama</span>
            </button>
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#4A2E1B] text-white flex items-center justify-center shadow-md">
              <Coffee className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base md:text-lg text-[#3D2817] tracking-tight">
                Coffee Senja Rasa
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 hidden md:inline-block">
                OFFLINE
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#8B6E58] hidden sm:block">
              {screenTitles[currentScreen] || 'Aplikasi Kasir'}
            </p>
          </div>
        </div>

        {/* Right: Controls & Profile */}
        <div className="flex items-center gap-2">
          {/* Device simulation toggle */}
          <div className="bg-[#FAF5EE] border border-[#D9C3AD] rounded-2xl p-1 hidden lg:flex items-center gap-1">
            <button
              onClick={() => setDeviceMode('auto')}
              className={`p-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                deviceMode === 'auto'
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'text-[#8B6E58] hover:text-[#3D2817]'
              }`}
              title="Mode Responsif Layar Penuh"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Auto</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                deviceMode === 'tablet'
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'text-[#8B6E58] hover:text-[#3D2817]'
              }`}
              title="Simulasi Tablet (Layar Lebar & Split POS)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'text-[#8B6E58] hover:text-[#3D2817]'
              }`}
              title="Simulasi HP (Layar Tegak)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>HP</span>
            </button>
          </div>

          {/* Android Kotlin Source Button */}
          <button
            onClick={onOpenAndroidModal}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-[#FAF5EE] hover:bg-[#EBDCCB] text-[#6F4E37] border border-[#D9C3AD] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Lihat Kode Android Kotlin & Seed SQL"
          >
            <Code className="w-4 h-4 text-[#8B5A2B]" />
            <span className="hidden sm:inline">Android Kotlin</span>
          </button>

          {/* Reset DB Button */}
          <button
            onClick={onResetDatabase}
            className="p-2 rounded-2xl hover:bg-amber-100 text-[#8B5A2B] transition-colors cursor-pointer"
            title="Reset Database ke Data Awal (Seed 39 Barang + 155 Resep)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-[#FAF5EE] border border-[#D9C3AD] text-xs font-bold text-[#6F4E37]">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Admin</span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-2xl hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
