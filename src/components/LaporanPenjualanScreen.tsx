import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Download,
  Share2,
  FileSpreadsheet,
  RotateCcw,
  Coffee,
  Search
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaksi } from '../types/database';
import { db, formatRupiah } from '../services/db';

interface LaporanPenjualanScreenProps {
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const LaporanPenjualanScreen: React.FC<LaporanPenjualanScreenProps> = ({ showToast }) => {
  const [dari, setDari] = useState<string>('');
  const [sampai, setSampai] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const transactions = db.getTransaksi(dari || undefined, sampai || undefined);

  // Search filter
  const filteredList = transactions.filter((t) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.nama_menu.toLowerCase().includes(term) ||
      t.no_transaksi.toLowerCase().includes(term) ||
      t.kasir.toLowerCase().includes(term)
    );
  });

  const totalPenjualan = filteredList.reduce((acc, cur) => acc + cur.subtotal, 0);
  const totalCup = filteredList.reduce((acc, cur) => acc + cur.jumlah, 0);

  const handleResetFilter = () => {
    setDari('');
    setSampai('');
    setSearchTerm('');
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredList.length === 0) {
      showToast('Tidak ada data transaksi untuk diekspor!', 'error');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'No Transaksi,Tanggal,Menu,Jumlah,Harga Satuan,Subtotal,Kategori,Kasir\r\n';

    filteredList.forEach((t) => {
      const row = [
        `"${t.no_transaksi}"`,
        `"${t.tanggal}"`,
        `"${t.nama_menu}"`,
        t.jumlah,
        t.harga,
        t.subtotal,
        `"${t.kategori}"`,
        `"${t.kasir}"`
      ].join(',');
      csvContent += row + '\r\n';
    });

    // Total row
    csvContent += `,,,Total Cup: ${totalCup},,Total Omzet: ${totalPenjualan},,\r\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const filename = `Laporan_Penjualan_Senja_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Laporan CSV berhasil diunduh!', 'success');
  };

  // Export PDF with jsPDF and autoTable
  const handleExportPDF = async () => {
    if (filteredList.length === 0) {
      showToast('Tidak ada data transaksi untuk diekspor!', 'error');
      return;
    }

    try {
      const doc = new jsPDF();

      // Header Brand
      doc.setFontSize(16);
      doc.setTextColor(111, 78, 55); // #6F4E37
      doc.text('COFFEE SENJA RASA', 14, 18);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Temani Senja Dalam Setiap Rasa — Laporan Penjualan', 14, 24);

      // Periode
      const periodeText = dari || sampai
        ? `Periode: ${dari || 'Awal'} s/d ${sampai || 'Hari ini'}`
        : 'Periode: Semua Riwayat Transaksi';
      doc.text(periodeText, 14, 30);
      doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 35);

      // Table data
      const tableRows = filteredList.map((t) => [
        t.tanggal,
        t.no_transaksi,
        t.nama_menu,
        t.jumlah.toString(),
        formatRupiah(t.harga),
        formatRupiah(t.subtotal),
        t.kasir
      ]);

      // Summary row
      tableRows.push([
        'TOTAL',
        '',
        '',
        `${totalCup} Cup`,
        '',
        formatRupiah(totalPenjualan),
        ''
      ]);

      autoTable(doc, {
        head: [['Tanggal', 'No Transaksi', 'Menu Minuman', 'Qty', 'Harga', 'Subtotal', 'Kasir']],
        body: tableRows,
        startY: 40,
        headStyles: {
          fillColor: [111, 78, 55],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 8,
          cellPadding: 2.5
        },
        columnStyles: {
          3: { halign: 'center' },
          4: { halign: 'right' },
          5: { halign: 'right', fontStyle: 'bold' }
        }
      });

      const pdfBlob = doc.output('blob');
      const filename = `Laporan_Penjualan_Senja_${new Date().toISOString().slice(0, 10)}.pdf`;

      // Try Web Share API if supported with file
      if (
        navigator.canShare &&
        navigator.canShare({
          files: [new File([pdfBlob], filename, { type: 'application/pdf' })]
        })
      ) {
        try {
          const file = new File([pdfBlob], filename, { type: 'application/pdf' });
          await navigator.share({
            files: [file],
            title: 'Laporan Penjualan Coffee Senja Rasa',
            text: `Laporan Penjualan Coffee Senja Rasa (${periodeText})`
          });
          showToast('Laporan PDF berhasil dibagikan!', 'success');
          return;
        } catch (e) {
          // fall through to save
        }
      }

      // Download PDF
      doc.save(filename);
      showToast('Laporan PDF berhasil diunduh!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal membuat file PDF', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#3D2817] flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-[#6F4E37]" />
            <span>Laporan Penjualan</span>
          </h2>
          <p className="text-xs md:text-sm text-[#8B6E58] font-medium">
            Rekap transaksi kasir, filter rentang tanggal, cetak PDF & CSV.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-white border border-[#D9C3AD] hover:bg-[#FAF5EE] text-[#6F4E37] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-[#6F4E37] hover:bg-[#5A3E2B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-200" />
            <span>Export PDF & Bagikan</span>
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6D7C3] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
          {/* Dari Tanggal */}
          <div>
            <label className="block text-xs font-bold text-[#6F4E37] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Dari Tanggal</span>
            </label>
            <input
              type="date"
              value={dari}
              onChange={(e) => setDari(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-xs font-bold text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
            />
          </div>

          {/* Sampai Tanggal */}
          <div>
            <label className="block text-xs font-bold text-[#6F4E37] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Sampai Tanggal</span>
            </label>
            <input
              type="date"
              value={sampai}
              onChange={(e) => setSampai(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-xs font-bold text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
            />
          </div>

          {/* Cari Menu / No Trx */}
          <div>
            <label className="block text-xs font-bold text-[#6F4E37] mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>Cari Menu / No TRX</span>
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Contoh: Americano, TRX..."
              className="w-full px-3.5 py-2.5 bg-[#FAF5EE] border border-[#D9C3AD] rounded-xl text-xs text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
            />
          </div>

          {/* Reset Action */}
          <div>
            <button
              onClick={handleResetFilter}
              className="w-full py-2.5 px-4 rounded-xl border border-[#D9C3AD] bg-[#FAF5EE] hover:bg-[#EBDCCB] text-[#6F4E37] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#E6D7C3] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#8B6E58] font-bold uppercase">
              Total Omzet Penjualan
            </span>
            <h3 className="text-xl md:text-2xl font-black text-[#6F4E37] mt-0.5">
              {formatRupiah(totalPenjualan)}
            </h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#FAF5EE] text-[#6F4E37] text-xs font-bold">
            {filteredList.length} Baris Transaksi
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E6D7C3] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#8B6E58] font-bold uppercase">
              Total Minuman Terjual
            </span>
            <h3 className="text-xl md:text-2xl font-black text-[#3D2817] mt-0.5">
              {totalCup} Cup
            </h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#F5EBDD] text-[#6F4E37] text-xs font-bold">
            Admin Aktif
          </div>
        </div>
      </div>

      {/* Table Transaksi */}
      <div className="bg-white rounded-3xl border border-[#E6D7C3] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF5EE] text-[#6F4E37] border-b border-[#E6D7C3] text-xs font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Tanggal & Waktu</th>
                <th className="py-3.5 px-4">No Transaksi</th>
                <th className="py-3.5 px-4">Menu</th>
                <th className="py-3.5 px-4 text-center">Qty</th>
                <th className="py-3.5 px-4 text-right">Harga</th>
                <th className="py-3.5 px-4 text-right">Subtotal</th>
                <th className="py-3.5 px-4 text-center">Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2E5D5]">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8B6E58]">
                    Tidak ada transaksi pada rentang filter ini.
                  </td>
                </tr>
              ) : (
                filteredList.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FFFBF7] transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-[#8B6E58] whitespace-nowrap">
                      {t.tanggal}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs font-bold text-[#6F4E37]">
                      {t.no_transaksi}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#3D2817]">
                      {t.nama_menu}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {t.jumlah}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-[#8B6E58]">
                      {formatRupiah(t.harga)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#3D2817]">
                      {formatRupiah(t.subtotal)}
                    </td>
                    <td className="py-3 px-4 text-center text-xs font-semibold text-[#8B6E58]">
                      {t.kasir}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredList.length > 0 && (
              <tfoot className="bg-[#FAF5EE] border-t-2 border-[#E6D7C3] font-bold text-[#3D2817]">
                <tr>
                  <td colSpan={3} className="py-3.5 px-4 uppercase text-xs">
                    TOTAL KESELURUHAN
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-black text-sm">
                    {totalCup}
                  </td>
                  <td className="py-3.5 px-4"></td>
                  <td className="py-3.5 px-4 text-right font-black text-[#6F4E37] text-base">
                    {formatRupiah(totalPenjualan)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
