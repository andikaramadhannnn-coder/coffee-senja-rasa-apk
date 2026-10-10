import React, { useState } from 'react';
import {
  PackagePlus,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Boxes,
  Calendar,
  X,
  Check,
  Edit2
} from 'lucide-react';
import { BarangMasuk } from '../types/database';
import {
  db,
  hitungKonversiStok,
  getTodayFormatted
} from '../services/db';

interface BarangMasukScreenProps {
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const KATEGORI_OPTIONS: BarangMasuk['kategori'][] = [
  'Kopi',
  'Susu',
  'Syrup',
  'Sauce',
  'Powder',
  'Tea',
  'Pendukung',
  'Kemasan',
  'Operasional'
];

const SATUAN_OPTIONS: BarangMasuk['satuan'][] = [
  'Pack',
  'Liter',
  'Kaleng',
  'Botol',
  'Galon',
  'Kg',
  'Pcs',
  'Box'
];

export const BarangMasukScreen: React.FC<BarangMasukScreenProps> = ({ showToast }) => {
  const [items, setItems] = useState<BarangMasuk[]>(() => db.getBarangMasuk());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('Semua');

  // Modal Tambah Barang
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [kodeBarang, setKodeBarang] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [kategori, setKategori] = useState<BarangMasuk['kategori']>('Kopi');
  const [satuan, setSatuan] = useState<BarangMasuk['satuan']>('Pack');
  const [stokInput, setStokInput] = useState<string>('1');

  // Modal Tambah Stok untuk barang eksisting
  const [tambahStokModalItem, setTambahStokModalItem] = useState<BarangMasuk | null>(null);
  const [tambahStokQty, setTambahStokQty] = useState<string>('1');
  const [tambahStokAsliManual, setTambahStokAsliManual] = useState<string>('');
  const [isManualStokAsli, setIsManualStokAsli] = useState(false);

  // Modal Hapus Konfirmasi
  const [deleteModalItem, setDeleteModalItem] = useState<BarangMasuk | null>(null);

  const reloadData = () => {
    setItems(db.getBarangMasuk());
  };

  // Preview konversi pada modal tambah
  const stokNumber = Math.max(0, parseInt(stokInput, 10) || 0);
  const previewKonversi = hitungKonversiStok(satuan, stokNumber);

  const handleOpenAddModal = () => {
    const nextNum = items.length + 1;
    setKodeBarang(`BRG${String(nextNum).padStart(3, '0')}`);
    setNamaBarang('');
    setKategori('Kopi');
    setSatuan('Pack');
    setStokInput('1');
    setIsAddModalOpen(true);
  };

  const handleSaveAddBarang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeBarang.trim() || !namaBarang.trim()) {
      showToast('Kode dan nama barang tidak boleh kosong!', 'error');
      return;
    }

    if (stokNumber <= 0) {
      showToast('Stok harus lebih dari 0!', 'error');
      return;
    }

    const konversi = hitungKonversiStok(satuan, stokNumber);

    db.addBarangMasuk({
      kode_barang: kodeBarang.trim(),
      nama_barang: namaBarang.trim(),
      kategori,
      satuan,
      stok: stokNumber,
      stok_asli: konversi.stok_asli,
      satuan_asli: konversi.satuan_asli,
      tanggal_update: getTodayFormatted()
    });

    reloadData();
    setIsAddModalOpen(false);
    showToast(`Barang baru "${namaBarang}" berhasil ditambahkan!`, 'success');
  };

  const handleSaveTambahStok = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tambahStokModalItem) return;

    const qty = parseInt(tambahStokQty, 10) || 0;
    if (qty <= 0) {
      showToast('Jumlah tambah stok harus lebih dari 0!', 'error');
      return;
    }

    let manualVal: number | undefined = undefined;
    if (isManualStokAsli && tambahStokAsliManual) {
      manualVal = parseFloat(tambahStokAsliManual) || undefined;
    }

    try {
      db.tambahStokBarang(tambahStokModalItem.id, qty, manualVal);
      reloadData();
      setTambahStokModalItem(null);
      showToast(`Stok "${tambahStokModalItem.nama_barang}" berhasil ditambah (+${qty} ${tambahStokModalItem.satuan})!`, 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteModalItem) return;
    db.deleteBarangMasuk(deleteModalItem.id);
    reloadData();
    showToast(`Barang "${deleteModalItem.nama_barang}" berhasil dihapus`, 'info');
    setDeleteModalItem(null);
  };

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode_barang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKategori = filterKategori === 'Semua' || item.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#3D2817] flex items-center gap-2.5">
            <PackagePlus className="w-7 h-7 text-[#6F4E37]" />
            <span>Manajemen Barang Masuk</span>
          </h2>
          <p className="text-xs md:text-sm text-[#8B6E58] font-medium">
            Kelola stok beli, sisa stok pemakaian, dan status ketersediaan bahan baku.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#6F4E37] hover:bg-[#5A3E2B] active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Barang Masuk</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 md:p-5 border border-[#E6D7C3] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B6E58]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau kode barang..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-[#8B6E58] shrink-0">Kategori:</span>
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-xs font-bold text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
          >
            <option value="Semua">Semua Kategori</option>
            {KATEGORI_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>

          <span className="text-xs px-3 py-1.5 rounded-xl bg-[#F5EBDD] font-bold text-[#6F4E37] shrink-0">
            {filteredItems.length} Barang
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-[#E6D7C3] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF5EE] text-[#6F4E37] border-b border-[#E6D7C3] text-xs font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Kode</th>
                <th className="py-3.5 px-4">Nama Barang</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-center">Stok Beli</th>
                <th className="py-3.5 px-4 text-right">Sisa Stok Asli</th>
                <th className="py-3.5 px-4">Tgl Update</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2E5D5]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8B6E58]">
                    Tidak ada data barang yang cocok dengan pencarian
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isMenipis = item.stok < 5;
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isMenipis
                          ? 'bg-red-50/70 hover:bg-red-50 text-red-900 font-semibold'
                          : 'hover:bg-[#FFFBF7]'
                      }`}
                    >
                      {/* Kode */}
                      <td className="py-3.5 px-4 font-mono font-bold text-xs">
                        {item.kode_barang}
                      </td>

                      {/* Nama */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#3D2817]">
                            {item.nama_barang}
                          </span>
                          {isMenipis && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase">
                              <AlertTriangle className="w-3 h-3" />
                              Menipis (&lt;5)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs px-2.5 py-1 rounded-md bg-[#FAF5EE] border border-[#E6D7C3] font-semibold text-[#6F4E37]">
                          {item.kategori}
                        </span>
                      </td>

                      {/* Stok Beli */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-black text-sm px-2.5 py-1 rounded-lg ${
                            isMenipis
                              ? 'bg-red-200 text-red-800'
                              : 'bg-[#F5EBDD] text-[#6F4E37]'
                          }`}
                        >
                          {item.stok} {item.satuan}
                        </span>
                      </td>

                      {/* Sisa Stok Asli */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#3D2817]">
                        {item.stok_asli.toLocaleString('id-ID')}{' '}
                        <span className="text-xs text-[#8B6E58] font-sans">
                          {item.satuan_asli}
                        </span>
                      </td>

                      {/* Tgl Update */}
                      <td className="py-3.5 px-4 text-xs text-[#8B6E58] whitespace-nowrap">
                        {item.tanggal_update}
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setTambahStokModalItem(item);
                              setTambahStokQty('1');
                              setIsManualStokAsli(false);
                              setTambahStokAsliManual('');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3E2B] text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                            title="Tambah Stok"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah</span>
                          </button>

                          <button
                            onClick={() => setDeleteModalItem(item)}
                            className="p-1.5 rounded-xl text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                            title="Hapus Barang"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Tambah Barang Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2CFBD] flex flex-col max-h-[90vh]">
            <div className="p-4 px-6 bg-[#6F4E37] text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-amber-200" />
                <span>Form Tambah Barang Masuk</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddBarang} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6F4E37] mb-1">
                    Kode Barang
                  </label>
                  <input
                    type="text"
                    value={kodeBarang}
                    onChange={(e) => setKodeBarang(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6F4E37] mb-1">
                    Kategori
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  >
                    {KATEGORI_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6F4E37] mb-1">
                  Nama Barang
                </label>
                <input
                  type="text"
                  value={namaBarang}
                  onChange={(e) => setNamaBarang(e.target.value)}
                  placeholder="Contoh: Biji Kopi Espresso Blend"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6F4E37] mb-1">
                    Satuan Beli
                  </label>
                  <select
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  >
                    {SATUAN_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6F4E37] mb-1">
                    Jumlah Stok Beli
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stokInput}
                    onChange={(e) => setStokInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>
              </div>

              {/* Box Preview Konversi Otomatis */}
              <div className="p-3.5 rounded-2xl bg-[#F5EBDD] border border-[#D9C3AD] text-xs space-y-1">
                <span className="font-bold text-[#6F4E37] uppercase block">
                  Konversi Otomatis ke Stok Pakai (stok_asli):
                </span>
                <p className="text-[#3D2817]">
                  {stokNumber} {satuan} ={' '}
                  <strong className="text-[#6F4E37] font-mono text-sm">
                    {previewKonversi.stok_asli.toLocaleString('id-ID')}{' '}
                    {previewKonversi.satuan_asli}
                  </strong>
                </p>
                <p className="text-[10px] text-[#8B6E58]">
                  (Pack/Kg × 1000g, Liter/Botol × 1000ml, Galon × 19.000ml, lainnya tetap)
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D9C3AD] text-[#6F4E37] font-bold text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3E2B] text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Tambah Stok Barang Eksisting */}
      {tambahStokModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#E2CFBD]">
            <div className="p-4 px-6 bg-[#6F4E37] text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-200" />
                <span>Tambah Stok: {tambahStokModalItem.nama_barang}</span>
              </h3>
              <button
                onClick={() => setTambahStokModalItem(null)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTambahStok} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6F4E37] mb-1">
                  Tambah Jumlah ({tambahStokModalItem.satuan})
                </label>
                <input
                  type="number"
                  min="1"
                  value={tambahStokQty}
                  onChange={(e) => setTambahStokQty(e.target.value)}
                  required
                  className="w-full px-3.5 py-3 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-lg font-extrabold text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>

              {/* Info konversi */}
              {(() => {
                const qtyVal = parseInt(tambahStokQty, 10) || 0;
                const autoKonv = hitungKonversiStok(tambahStokModalItem.satuan, qtyVal);
                return (
                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#D9C3AD] text-xs">
                    <span className="font-semibold text-[#3D2817]">
                      Konversi Stok Asli Otomatis:
                    </span>{' '}
                    <strong className="text-[#6F4E37] font-mono">
                      +{autoKonv.stok_asli.toLocaleString('id-ID')} {autoKonv.satuan_asli}
                    </strong>
                  </div>
                );
              })()}

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-[#3D2817] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isManualStokAsli}
                    onChange={(e) => setIsManualStokAsli(e.target.checked)}
                    className="rounded text-[#6F4E37]"
                  />
                  <span>Input konversi setara manual (opsional jika takaran khusus)</span>
                </label>

                {isManualStokAsli && (
                  <div className="mt-2">
                    <input
                      type="number"
                      step="any"
                      placeholder={`Jumlah setara (${tambahStokModalItem.satuan_asli})`}
                      value={tambahStokAsliManual}
                      onChange={(e) => setTambahStokAsliManual(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTambahStokModalItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#D9C3AD] text-[#6F4E37] font-bold text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3E2B] text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  Tambah Stok Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Konfirmasi Hapus */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 border border-[#E2CFBD]">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#3D2817]">Hapus Barang?</h3>
              <p className="text-xs text-[#8B6E58] mt-1">
                Apakah Anda yakin ingin menghapus barang{' '}
                <strong className="text-[#3D2817]">
                  "{deleteModalItem.nama_barang}"
                </strong>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteModalItem(null)}
                className="py-2.5 px-4 rounded-xl border border-[#D9C3AD] text-[#6F4E37] font-bold text-sm cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
