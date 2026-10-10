import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Flame,
  AlertTriangle,
  Boxes,
  CheckCircle,
  Coffee,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { db, formatRupiah } from '../services/db';

interface InformasiPenjualanScreenProps {
  onNavigateToKasir: () => void;
  onNavigateToBarangMasuk: () => void;
}

export const InformasiPenjualanScreen: React.FC<InformasiPenjualanScreenProps> = ({
  onNavigateToKasir,
  onNavigateToBarangMasuk
}) => {
  const info = db.getInformasiPenjualan();
  const allTransaksi = db.getTransaksi();

  // Coffee vs Non Coffee count
  const coffeeCount = allTransaksi.filter((t) => t.kategori === 'Coffee').length;
  const nonCoffeeCount = allTransaksi.filter((t) => t.kategori === 'Non Coffee').length;
  const totalCount = allTransaksi.length || 1;
  const coffeePercent = Math.round((coffeeCount / totalCount) * 100);
  const nonCoffeePercent = 100 - coffeePercent;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-[#3D2817] flex items-center gap-2.5">
          <TrendingUp className="w-7 h-7 text-[#6F4E37]" />
          <span>Informasi & Ringkasan Penjualan</span>
        </h2>
        <p className="text-xs md:text-sm text-[#8B6E58] font-medium">
          Pantau performa omzet, volume transaksi, menu terfavorit pelanggan, dan stok bahan kritis.
        </p>
      </div>

      {/* 5 KARTU RINGKASAN UTAMA PERSIS SESUAI SPESIFIKASI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Total Penjualan (Rp) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6D7C3] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8B6E58]">
              Total Penjualan
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#6F4E37] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-[#6F4E37]">
              {formatRupiah(info.totalPenjualan)}
            </h3>
            <p className="text-xs text-[#8B6E58] mt-1 font-medium">
              Akumulasi omzet kasir tercatat
            </p>
          </div>
        </div>

        {/* 2. Total Transaksi */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6D7C3] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8B6E58]">
              Total Transaksi
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] text-[#6F4E37] flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-[#3D2817]">
              {info.totalTransaksi} <span className="text-base font-semibold text-[#8B6E58]">Struk</span>
            </h3>
            <p className="text-xs text-[#8B6E58] mt-1 font-medium">
              Jumlah struk nota pembayaran unik
            </p>
          </div>
        </div>

        {/* 3. Menu Terlaris */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6D7C3] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8B6E58]">
              Menu Terlaris
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-[#3D2817] truncate">
              {info.menuTerlaris}
            </h3>
            <p className="text-xs text-[#8B6E58] mt-1 font-medium">
              Paling sering dipesan pelanggan
            </p>
          </div>
        </div>

        {/* 4. Stok Menipis (stok < 5 atau "Stok Aman") */}
        <div
          onClick={onNavigateToBarangMasuk}
          className={`rounded-3xl p-6 border shadow-sm flex flex-col justify-between cursor-pointer transition-all hover:shadow-md ${
            info.menipisCount > 0
              ? 'bg-red-50/90 border-red-200'
              : 'bg-emerald-50/90 border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span
              className={`text-xs font-extrabold uppercase tracking-wider ${
                info.menipisCount > 0 ? 'text-red-700' : 'text-emerald-700'
              }`}
            >
              Stok Menipis (&lt; 5)
            </span>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                info.menipisCount > 0 ? 'bg-red-200 text-red-700' : 'bg-emerald-200 text-emerald-800'
              }`}
            >
              {info.menipisCount > 0 ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
            </div>
          </div>
          <div>
            <h3
              className={`text-base md:text-lg font-black line-clamp-2 ${
                info.menipisCount > 0 ? 'text-red-900' : 'text-emerald-900'
              }`}
            >
              {info.stokMenipis}
            </h3>
            <p
              className={`text-xs mt-1 font-medium flex items-center gap-1 ${
                info.menipisCount > 0 ? 'text-red-700' : 'text-emerald-700'
              }`}
            >
              <span>{info.menipisCount > 0 ? 'Segera lakukan restock' : 'Semua bahan mencukupi'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>

        {/* 5. Jumlah Jenis Barang */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6D7C3] shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8B6E58]">
              Jumlah Jenis Barang
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] text-[#6F4E37] flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-[#3D2817]">
                {info.jumlahJenisBarang} <span className="text-base font-semibold text-[#8B6E58]">Item Terdaftar</span>
              </h3>
              <p className="text-xs text-[#8B6E58] mt-1 font-medium">
                Meliputi kategori Kopi, Susu, Syrup, Sauce, Powder, Tea, Pendukung, Kemasan & Operasional.
              </p>
            </div>
            <button
              onClick={onNavigateToBarangMasuk}
              className="mt-2 sm:mt-0 px-4 py-2 rounded-xl bg-[#FAF5EE] hover:bg-[#EBDCCB] text-[#6F4E37] font-bold text-xs border border-[#D9C3AD] transition-colors cursor-pointer"
            >
              Kelola Barang Masuk →
            </button>
          </div>
        </div>
      </div>

      {/* Breakdown Kategori Penjualan Visual */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E6D7C3] shadow-sm">
        <h3 className="font-extrabold text-lg text-[#3D2817] mb-2 flex items-center gap-2">
          <Coffee className="w-5 h-5 text-[#6F4E37]" />
          <span>Komparasi Penjualan: Coffee vs Non Coffee</span>
        </h3>
        <p className="text-xs md:text-sm text-[#8B6E58] mb-6">
          Proporsi pilihan minuman pelanggan berdasarkan kategori menu.
        </p>

        {/* Progress bar visual */}
        <div className="h-6 w-full rounded-2xl overflow-hidden bg-gray-100 flex p-1 border border-[#E6D7C3]">
          <div
            style={{ width: `${coffeePercent}%` }}
            className="h-full bg-[#6F4E37] rounded-xl transition-all duration-500"
          />
          <div
            style={{ width: `${nonCoffeePercent}%` }}
            className="h-full bg-[#C48B57] rounded-xl transition-all duration-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#E6D7C3]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-[#6F4E37]" />
              <span className="text-xs font-bold text-[#6F4E37]">Menu Coffee</span>
            </div>
            <p className="text-xl font-black text-[#3D2817]">
              {coffeePercent}%{' '}
              <span className="text-xs font-normal text-[#8B6E58]">
                ({coffeeCount} transaksi)
              </span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#E6D7C3]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-[#C48B57]" />
              <span className="text-xs font-bold text-[#8B6E58]">Menu Non Coffee</span>
            </div>
            <p className="text-xl font-black text-[#3D2817]">
              {nonCoffeePercent}%{' '}
              <span className="text-xs font-normal text-[#8B6E58]">
                ({nonCoffeeCount} transaksi)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
