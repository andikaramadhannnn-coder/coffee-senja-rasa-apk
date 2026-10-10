import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  X,
  Check
} from 'lucide-react';
import { ResepMenu, BarangMasuk } from '../types/database';
import { db } from '../services/db';

interface ResepMenuScreenProps {
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ResepMenuScreen: React.FC<ResepMenuScreenProps> = ({ showToast }) => {
  const [resepList, setResepList] = useState<ResepMenu[]>(() => db.getResepMenu());
  const [barangList] = useState<BarangMasuk[]>(() => db.getBarangMasuk());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMenu, setFilterMenu] = useState<string>('Semua');

  // Modal Form State (Tambah / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResepMenu | null>(null);
  const [formMenu, setFormMenu] = useState('');
  const [formBahan, setFormBahan] = useState('');
  const [formJumlahPakai, setFormJumlahPakai] = useState('');
  const [formSatuan, setFormSatuan] = useState('gram');

  // Modal Konfirmasi Hapus
  const [deleteItem, setDeleteItem] = useState<ResepMenu | null>(null);

  const reloadData = () => {
    setResepList(db.getResepMenu());
  };

  // Distinct list of menu names in recipe table
  const distinctMenus = Array.from(new Set(resepList.map((r) => r.menu))).sort();

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormMenu(distinctMenus[0] || 'Americano Regular');
    setFormBahan(barangList[0]?.nama_barang || 'Biji Kopi Espresso Blend');
    setFormJumlahPakai('10');
    setFormSatuan(barangList[0]?.satuan_asli || 'gram');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ResepMenu) => {
    setEditingItem(item);
    setFormMenu(item.menu);
    setFormBahan(item.bahan);
    setFormJumlahPakai(item.jumlah_pakai.toString());
    setFormSatuan(item.satuan);
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(formJumlahPakai);
    if (isNaN(qty) || qty <= 0) {
      showToast('Jumlah pakai harus lebih dari 0!', 'error');
      return;
    }

    if (!formMenu.trim() || !formBahan.trim()) {
      showToast('Menu dan bahan tidak boleh kosong!', 'error');
      return;
    }

    if (editingItem) {
      db.updateResepMenu({
        ...editingItem,
        menu: formMenu.trim(),
        bahan: formBahan.trim(),
        jumlah_pakai: qty,
        satuan: formSatuan.trim()
      });
      showToast(`Resep "${formMenu}" berhasil diperbarui!`, 'success');
    } else {
      db.addResepMenu({
        menu: formMenu.trim(),
        bahan: formBahan.trim(),
        jumlah_pakai: qty,
        satuan: formSatuan.trim()
      });
      showToast(`Bahan baru untuk "${formMenu}" berhasil ditambahkan!`, 'success');
    }

    reloadData();
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    db.deleteResepMenu(deleteItem.id);
    reloadData();
    showToast(`Bahan "${deleteItem.bahan}" untuk resep "${deleteItem.menu}" dihapus`, 'info');
    setDeleteItem(null);
  };

  const filteredList = resepList.filter((item) => {
    const matchFilterMenu = filterMenu === 'Semua' || item.menu === filterMenu;
    const matchSearch =
      item.menu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bahan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilterMenu && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#3D2817] flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[#6F4E37]" />
            <span>Resep Menu Minuman</span>
          </h2>
          <p className="text-xs md:text-sm text-[#8B6E58] font-medium">
            Daftar komposisi bahan per menu yang otomatis memotong stok saat pesanan dibayar.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#6F4E37] hover:bg-[#5A3E2B] active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Komposisi Resep</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 md:p-5 border border-[#E6D7C3] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B6E58]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari menu atau bahan..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-[#8B6E58] shrink-0">Filter Menu:</span>
          <select
            value={filterMenu}
            onChange={(e) => setFilterMenu(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-xs font-bold text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer max-w-[220px]"
          >
            <option value="Semua">Semua Menu ({resepList.length} Bahan)</option>
            {distinctMenus.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <span className="text-xs px-3 py-1.5 rounded-xl bg-[#F5EBDD] font-bold text-[#6F4E37] shrink-0">
            {filteredList.length} Baris
          </span>
        </div>
      </div>

      {/* Table Resep */}
      <div className="bg-white rounded-3xl border border-[#E6D7C3] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF5EE] text-[#6F4E37] border-b border-[#E6D7C3] text-xs font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Menu Minuman</th>
                <th className="py-3.5 px-4">Bahan Baku</th>
                <th className="py-3.5 px-4 text-center">Jumlah Pakai</th>
                <th className="py-3.5 px-4 text-center">Satuan</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2E5D5]">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#8B6E58]">
                    Tidak ada data resep yang sesuai kriteria pencarian
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FFFBF7] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#3D2817]">
                      {item.menu}
                    </td>
                    <td className="py-3 px-4 text-[#523724] font-medium">
                      {item.bahan}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#6F4E37]">
                      {item.jumlah_pakai}
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-[#8B6E58]">
                      {item.satuan}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-xl text-[#6F4E37] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                          title="Edit Resep"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteItem(item)}
                          className="p-1.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Resep"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#E2CFBD]">
            <div className="p-4 px-6 bg-[#6F4E37] text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-200" />
                <span>{editingItem ? 'Edit Resep' : 'Tambah Resep Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6F4E37] mb-1">
                  Nama Menu
                </label>
                <input
                  type="text"
                  value={formMenu}
                  onChange={(e) => setFormMenu(e.target.value)}
                  placeholder="Contoh: Americano Regular"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6F4E37] mb-1">
                  Nama Bahan Baku (Harus cocok dengan Barang Masuk)
                </label>
                <select
                  value={formBahan}
                  onChange={(e) => {
                    setFormBahan(e.target.value);
                    const b = barangList.find((item) => item.nama_barang === e.target.value);
                    if (b) setFormSatuan(b.satuan_asli);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                >
                  {barangList.map((b) => (
                    <option key={b.id} value={b.nama_barang}>
                      {b.nama_barang} ({b.satuan_asli})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6F4E37] mb-1">
                    Jumlah Pakai
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    value={formJumlahPakai}
                    onChange={(e) => setFormJumlahPakai(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6F4E37] mb-1">
                    Satuan Pakai
                  </label>
                  <input
                    type="text"
                    value={formSatuan}
                    onChange={(e) => setFormSatuan(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D9C3AD] text-[#6F4E37] font-bold text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3E2B] text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  Simpan Resep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 border border-[#E2CFBD]">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#3D2817]">Hapus Bahan Resep?</h3>
              <p className="text-xs text-[#8B6E58] mt-1">
                Hapus bahan <strong className="text-[#3D2817]">"{deleteItem.bahan}"</strong> dari menu <strong className="text-[#3D2817]">"{deleteItem.menu}"</strong>?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteItem(null)}
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
