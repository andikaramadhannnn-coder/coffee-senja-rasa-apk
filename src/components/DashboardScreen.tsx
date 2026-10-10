import React from 'react';
import {
  ShoppingCart,
  PackagePlus,
  PackageMinus,
  BookOpen,
  FileText,
  TrendingUp,
  LogOut,
  Coffee,
  AlertTriangle,
  Boxes,
  BadgeDollarSign,
  Code
} from 'lucide-react';
import { db, formatRupiah } from '../services/db';

interface DashboardScreenProps {
  onNavigate: (screen: 'kasir' | 'barang_masuk' | 'barang_keluar' | 'resep_menu' | 'laporan' | 'informasi') => void;
  onLogout: () => void;
  onOpenAndroidCode: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onLogout,
  onOpenAndroidCode
}) => {
  const info = db.getInformasiPenjualan();

  const menuItems = [
    {
      id: 'kasir' as const,
      title: 'Kasir',
      subtitle: 'Input pesanan & transaksi penjualan',
      icon: ShoppingCart,
      color: 'from-[#6F4E37] to-[#4A2E1B]',
      badge: 'Utama'
    },
    {
      id: 'barang_masuk' as const,
      title: 'Barang Masuk',
      subtitle: 'Kelola stok bahan baku & kemasan',
      icon: PackagePlus,
      color: 'from-[#8B5A2B] to-[#603813]',
      badge: `${info.jumlahJenisBarang} Item`
    },
    {
      id: 'barang_keluar' as const,
      title: 'Barang Keluar',
      subtitle: 'Pencatatan pemakaian manual & riwayat',
      icon: PackageMinus,
      color: 'from-[#9C6644] to-[#7F4F24]',
      badge: 'Riwayat'
    },
    {
      id: 'resep_menu' as const,
      title: 'Resep Menu',
      subtitle: 'Takaran komposisi bahan menu minuman',
      icon: BookOpen,
      color: 'from-[#7F5539] to-[#582F0E]',
      badge: '155 Bahan'
    },
    {
      id: 'laporan' as const,
      title: 'Laporan Penjualan',
      subtitle: 'Riwayat transaksi, export PDF & CSV',
      icon: FileText,
      color: 'from-[#6F4E37] to-[#3E2723]',
      badge: 'Export'
    },
    {
      id: 'informasi' as const,
      title: 'Informasi Penjualan',
      subtitle: 'Ringkasan omzet, tren & stok menipis',
      icon: TrendingUp,
      color: 'from-[#B07D62] to-[#8D5B4C]',
      badge: 'Statistik'
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Hero Coffee Senja Banner */}
      <div className="bg-gradient-to-r from-[#6F4E37] via-[#5A3E2B] to-[#3E2723] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Coffee className="w-80 h-80 transform rotate-12 translate-x-12" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Mode Kasir Offline Aktif
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Coffee Senja Rasa
          </h1>
          <p className="text-white/80 text-sm md:text-base mt-2 font-medium">
            Temani Senja Dalam Setiap Rasa. Aplikasi kasir & manajemen persediaan coffee shop cepat, offline, dan akurat.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onNavigate('kasir')}
              className="px-6 py-3 bg-[#F5EBDD] hover:bg-white text-[#4A2E1B] font-bold rounded-2xl shadow-md transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer text-sm md:text-base"
            >
              <ShoppingCart className="w-5 h-5 text-[#6F4E37]" />
              <span>Buka Mesin Kasir</span>
            </button>
            <button
              onClick={onOpenAndroidCode}
              className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-2xl border border-white/25 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
              <Code className="w-4 h-4 text-amber-300" />
              <span>Lihat Source Android Kotlin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E6D7C3] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBDD] flex items-center justify-center text-[#6F4E37] shrink-0">
            <BadgeDollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8B6E58] uppercase">Total Penjualan</p>
            <h3 className="text-lg md:text-xl font-bold text-[#3D2817]">
              {formatRupiah(info.totalPenjualan)}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6D7C3] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBDD] flex items-center justify-center text-[#6F4E37] shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8B6E58] uppercase">Total Jenis Barang</p>
            <h3 className="text-lg md:text-xl font-bold text-[#3D2817]">
              {info.jumlahJenisBarang} Item Terdaftar
            </h3>
          </div>
        </div>

        <div
          onClick={() => onNavigate('informasi')}
          className={`rounded-2xl p-5 border shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:shadow-md ${
            info.menipisCount > 0
              ? 'bg-red-50/80 border-red-200'
              : 'bg-emerald-50/80 border-emerald-200'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              info.menipisCount > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p
              className={`text-xs font-bold uppercase ${
                info.menipisCount > 0 ? 'text-red-700' : 'text-emerald-700'
              }`}
            >
              Status Stok
            </p>
            <h3
              className={`text-sm md:text-base font-bold truncate max-w-[200px] ${
                info.menipisCount > 0 ? 'text-red-900' : 'text-emerald-900'
              }`}
            >
              {info.menipisCount > 0 ? `${info.menipisCount} Bahan Menipis (< 5)` : 'Semua Stok Aman'}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Tombol Menu Besar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#3D2817]">
            Menu Utama
          </h2>
          <span className="text-xs text-[#8B6E58] font-semibold">
            Pilih menu navigasi di bawah
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group text-left p-6 rounded-3xl bg-white border border-[#E6D7C3] hover:border-[#6F4E37] shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[170px] active:scale-[0.98] cursor-pointer"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between w-full mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F5EBDD] text-[#6F4E37] border border-[#E2CFBD]">
                    {item.badge}
                  </span>
                </div>

                {/* Bottom Row */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#3D2817] group-hover:text-[#6F4E37] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#8B6E58] mt-1 font-medium line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tombol Keluar Besar */}
      <div className="pt-4">
        <button
          onClick={onLogout}
          className="w-full py-4 px-6 rounded-2xl bg-[#EFE3D3] hover:bg-[#E3D1BE] border border-[#D9C3AD] text-[#6F4E37] hover:text-[#4A2E1B] font-bold text-base md:text-lg transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow cursor-pointer active:scale-[0.99]"
        >
          <LogOut className="w-5 h-5 text-[#8B5A2B]" />
          <span>Keluar dari Aplikasi</span>
        </button>
      </div>
    </div>
  );
};
