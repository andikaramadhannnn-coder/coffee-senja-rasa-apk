import React, { useState } from 'react';
import {
  PackageMinus,
  Clock,
  Send,
  Search,
  Filter,
  History,
  AlertCircle
} from 'lucide-react';
import { BarangKeluar, BarangMasuk } from '../types/database';
import { db } from '../services/db';

interface BarangKeluarScreenProps {
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const BarangKeluarScreen: React.FC<BarangKeluarScreenProps> = ({ showToast }) => {
  const [barangMasukList] = useState<BarangMasuk[]>(() => db.getBarangMasuk());
  const [historyList, setHistoryList] = useState<BarangKeluar[]>(() => db.getBarangKeluar());

  // Form State
  const [selectedBarangName, setSelectedBarangName] = useState<string>(
    barangMasukList[0]?.nama_barang || ''
  );
  const [jumlah, setJumlah] = useState<string>('1');
  const [keterangan, setKeterangan] = useState<string>('Pemakaian Operasional / Waste');
  const [searchTerm, setSearchTerm] = useState('');

  // Otomatis terisi satuan_asli dari barang yang dipilih
  const currentBarang = barangMasukList.find((b) => b.nama_barang === selectedBarangName);
  const autoSatuanAsli = currentBarang?.satuan_asli || 'gram';

  const reloadHistory = () => {
    setHistoryList(db.getBarangKeluar());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(jumlah);
    if (isNaN(qty) || qty <= 0) {
      showToast('Jumlah barang keluar harus lebih dari 0!', 'error');
      return;
    }

    if (!selectedBarangName) {
      showToast('Pilih nama barang terlebih dahulu!', 'error');
      return;
    }

    if (!keterangan.trim()) {
      showToast('Keterangan tidak boleh kosong!', 'error');
      return;
    }

    db.addBarangKeluarManual({
      nama_barang: selectedBarangName,
      jumlah: qty,
      satuan: autoSatuanAsli,
      keterangan: keterangan.trim()
    });

    reloadHistory();
    setJumlah('1');
    showToast(`Barang keluar "${selectedBarangName}" (${qty} ${autoSatuanAsli}) berhasil dicatat!`, 'success');
  };

  const filteredHistory = historyList.filter((item) => {
    const matchSearch =
      item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tanggal.includes(searchTerm);
    return matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-[#3D2817] flex items-center gap-2.5">
          <PackageMinus className="w-7 h-7 text-[#6F4E37]" />
          <span>Pencatatan Barang Keluar</span>
        </h2>
        <p className="text-xs md:text-sm text-[#8B6E58] font-medium">
          Form manual pengeluaran bahan & log riwayat otomatis dari kasir / dapur.
        </p>
      </div>

      {/* Form Input Barang Keluar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E6D7C3] shadow-sm">
        <h3 className="text-base font-bold text-[#3D2817] mb-4 flex items-center gap-2">
          <span>Form Catat Barang Keluar Manual</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Pilih Barang dari barang_masuk */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#6F4E37] mb-1.5">
                Nama Barang / Bahan Baku
              </label>
              <select
                value={selectedBarangName}
                onChange={(e) => setSelectedBarangName(e.target.value)}
                required
                className="w-full px-3.5 py-3 bg-[#FAF5EE] border border-[#D9C3AD] rounded-2xl text-sm font-bold text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
              >
                {barangMasukList.map((b) => (
                  <option key={b.id} value={b.nama_barang}>
                    {b.nama_barang} (Sisa: {b.stok_asli.toLocaleString('id-ID')} {b.satuan_asli})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Jumlah & Satuan Asli Otomatis */}
            <div>
              <label className="block text-xs font-bold text-[#6F4E37] mb-1.5">
                Jumlah Keluar
              </label>
              <div className="flex rounded-2xl border border-[#D9C3AD] overflow-hidden bg-[#FAF5EE] focus-within:ring-2 focus-within:ring-[#6F4E37]">
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  required
                  placeholder="0"
                  className="w-full px-3.5 py-3 bg-transparent text-sm font-extrabold text-[#3D2817] focus:outline-none"
                />
                <span className="px-3.5 py-3 bg-[#EBDCCB] text-[#6F4E37] font-bold text-xs flex items-center shrink-0">
                  {autoSatuanAsli}
                </span>
              </div>
            </div>
          </div>

          {/* Keterangan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#6F4E37] mb-1.5">
                Keterangan Keperluan
              </label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Kalibrasi Grinder, Uji Rasa, Tumpah/Waste"
                required
                className="w-full px-3.5 py-3 bg-[#FAF5EE] border border-[#D9C3AD] rounded-2xl text-sm text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#6F4E37] hover:bg-[#5A3E2B] active:scale-[0.98] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Simpan Pengeluaran</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Riwayat Barang Keluar Terbaru */}
      <div className="bg-white rounded-3xl border border-[#E6D7C3] shadow-sm overflow-hidden">
        {/* Table Header & Search */}
        <div className="p-5 border-b border-[#E6D7C3] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#6F4E37]" />
            <h3 className="font-bold text-base text-[#3D2817]">
              Riwayat Barang Keluar Terbaru
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B6E58]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari riwayat..."
              className="w-full pl-10 pr-3 py-2 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-xs text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF5EE] text-[#6F4E37] border-b border-[#E6D7C3] text-xs font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Waktu (yyyy-MM-dd HH:mm:ss)</th>
                <th className="py-3.5 px-4">Nama Barang</th>
                <th className="py-3.5 px-4 text-center">Jumlah Pakai</th>
                <th className="py-3.5 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2E5D5]">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#8B6E58]">
                    Belum ada catatan barang keluar.
                  </td>
                </tr>
              ) : (
                filteredHistory.slice(0, 100).map((item) => (
                  <tr key={item.id} className="hover:bg-[#FFFBF7] transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-[#6F4E37] whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#3D2817]">
                      {item.nama_barang}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="font-mono font-bold px-2.5 py-1 rounded-lg bg-[#FAF5EE] border border-[#E2CFBD] text-[#6F4E37]">
                        {item.jumlah.toLocaleString('id-ID')} {item.satuan}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#8B6E58]">
                      {item.keterangan}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
