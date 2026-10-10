import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, PaymentInfo } from '../types/database';
import { db, formatRupiah } from '../services/db';

interface PembayaranModalProps {
  cart: CartItem[];
  onClose: () => void;
  onSuccess: (info: PaymentInfo) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

type MetodeBayar = 'Cash' | 'Qris' | 'Debit' | 'E-Wallet';

export const PembayaranModal: React.FC<PembayaranModalProps> = ({
  cart,
  onClose,
  onSuccess,
  showToast
}) => {
  const [isMember, setIsMember] = useState(false);
  const [metode, setMetode] = useState<MetodeBayar>('Cash');
  const [uangInput, setUangInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Kalkulasi Rumus Sesuai Spesifikasi:
  // subtotal = total keranjang
  const subtotal = cart.reduce((acc, cur) => acc + cur.subtotal, 0);

  // diskon = 5% * subtotal jika member, jika tidak 0
  const diskon = isMember ? 0.05 * subtotal : 0;

  // ppn = 11% * (subtotal - diskon)
  const ppn = 0.11 * (subtotal - diskon);

  // total = (subtotal - diskon + ppn) dibulatkan ke kelipatan Rp500 terdekat
  const unroundedTotal = subtotal - diskon + ppn;
  const total = Math.round(unroundedTotal / 500) * 500;

  // Nilai Uang & Kembalian
  const uangCash = parseInt(uangInput.replace(/\D/g, ''), 10) || 0;
  const uangDiterima = metode === 'Cash' ? uangCash : total;
  const kembalian = metode === 'Cash' ? Math.max(0, uangDiterima - total) : 0;

  const handleQuickCash = (amount: number) => {
    setUangInput(amount.toString());
    setErrorMessage('');
  };

  const handleBayarDanSimpan = () => {
    setErrorMessage('');

    // Validasi Uang jika Cash
    if (metode === 'Cash') {
      if (uangDiterima < total) {
        setErrorMessage('Uang kurang! Masukkan nominal minimal sebesar total tagihan.');
        showToast('Uang kurang!', 'error');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Eksekusi pembayaran dalam satu transaksi database Room/ACID
      const result = db.prosesPembayaran(cart, {
        isMember,
        metode,
        subtotal,
        diskon,
        ppn,
        total,
        uangDiterima,
        kembalian
      });

      // Confetti perayaan
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti optional
      }

      showToast('Pembayaran berhasil diproses dan disimpan!', 'success');
      onSuccess(result);
    } catch (err) {
      const msg = (err as Error).message || 'Terjadi kesalahan sistem';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-[#E2CFBD] flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="p-5 px-6 bg-[#6F4E37] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-amber-200" />
            <div>
              <h3 className="font-extrabold text-lg">Pembayaran Pesanan</h3>
              <p className="text-xs text-white/80">Selesaikan transaksi kasir</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Alert Error */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Checkbox Member (Diskon 5%) */}
          <div
            onClick={() => setIsMember(!isMember)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              isMember
                ? 'bg-amber-50/80 border-[#6F4E37] ring-1 ring-[#6F4E37]'
                : 'bg-[#FAF5EE] border-[#D9C3AD] hover:bg-[#F2E5D5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                  isMember
                    ? 'bg-[#6F4E37] border-[#6F4E37] text-white'
                    : 'border-[#A89485] bg-white'
                }`}
              >
                {isMember && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-bold text-sm text-[#3D2817] flex items-center gap-1.5">
                  Pelanggan Member
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-[#4A2E1B]">
                    Diskon 5%
                  </span>
                </span>
                <p className="text-xs text-[#8B6E58] mt-0.5">
                  Aktifkan jika pelanggan memiliki kartu / keanggotaan Senja
                </p>
              </div>
            </div>
          </div>

          {/* 2. Pilihan Metode Pembayaran */}
          <div>
            <label className="block text-sm font-bold text-[#3D2817] mb-2.5">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  { id: 'Cash', label: 'Cash (Tunai)', icon: Banknote },
                  { id: 'Qris', label: 'QRIS', icon: QrCode },
                  { id: 'Debit', label: 'Kartu Debit', icon: CreditCard },
                  { id: 'E-Wallet', label: 'E-Wallet', icon: Smartphone }
                ] as const
              ).map((m) => {
                const IconComponent = m.icon;
                const isSelected = metode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setMetode(m.id);
                      setErrorMessage('');
                    }}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-md'
                        : 'bg-[#FAF5EE] text-[#3D2817] border-[#D9C3AD] hover:bg-[#F2E5D5]'
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        isSelected ? 'text-amber-200' : 'text-[#6F4E37]'
                      }`}
                    />
                    <span className="text-xs font-bold">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rincian Kalkulasi Harga */}
          <div className="bg-[#FAF5EE] rounded-2xl p-4 border border-[#E6D7C3] space-y-2 text-sm">
            <div className="flex justify-between text-[#8B6E58]">
              <span>Subtotal Pesanan:</span>
              <span className="font-semibold text-[#3D2817]">{formatRupiah(subtotal)}</span>
            </div>
            {isMember && (
              <div className="flex justify-between text-emerald-700">
                <span>Diskon Member (5%):</span>
                <span className="font-semibold">-{formatRupiah(diskon)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#8B6E58]">
              <span>PPN (11%):</span>
              <span className="font-semibold text-[#3D2817]">{formatRupiah(ppn)}</span>
            </div>
            <div className="pt-2 border-t border-[#E0D0BE] flex justify-between items-baseline">
              <div>
                <span className="text-base font-bold text-[#3D2817]">TOTAL TAGIHAN</span>
                <span className="text-[11px] text-[#8B6E58] block">
                  (Dibulatkan ke kelipatan Rp 500 terdekat)
                </span>
              </div>
              <span className="text-2xl font-black text-[#6F4E37]">
                {formatRupiah(total)}
              </span>
            </div>
          </div>

          {/* Form Input Khusus Berdasarkan Metode */}
          {metode === 'Cash' ? (
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[#3D2817]">
                Nominal Uang Diterima (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-lg">
                  Rp
                </span>
                <input
                  type="number"
                  value={uangInput}
                  onChange={(e) => {
                    setUangInput(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="0"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#D9C3AD] rounded-2xl text-xl font-extrabold text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>

              {/* Tombol Cepat Uang Pas & Pecahan */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleQuickCash(total)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FAF5EE] hover:bg-[#EBDCCB] border border-[#D9C3AD] text-xs font-bold text-[#6F4E37] cursor-pointer"
                >
                  Uang Pas ({formatRupiah(total)})
                </button>
                {[50000, 100000, 200000].map((amt) => {
                  if (amt >= total) {
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleQuickCash(amt)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FAF5EE] hover:bg-[#EBDCCB] border border-[#D9C3AD] text-xs font-bold text-[#6F4E37] cursor-pointer"
                      >
                        {formatRupiah(amt)}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Tampilan Kembalian */}
              <div className="mt-3 p-3.5 rounded-2xl bg-[#F5EBDD] border border-[#D9C3AD] flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#6F4E37]">
                  Uang Kembalian:
                </span>
                <span
                  className={`text-lg font-black ${
                    uangDiterima >= total ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {uangDiterima >= total
                    ? formatRupiah(kembalian)
                    : 'Uang Kurang!'}
                </span>
              </div>
            </div>
          ) : metode === 'Qris' ? (
            /* QRIS Simulated Code */
            <div className="bg-[#FAF5EE] border border-[#D9C3AD] rounded-2xl p-4 text-center space-y-3">
              <span className="text-xs font-bold text-[#6F4E37] uppercase tracking-wider block">
                QRIS DINAMIS SENJA RASA
              </span>
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-gray-300 shadow-sm flex flex-col items-center justify-center relative">
                <QrCode className="w-28 h-28 text-[#2B170B]" />
                <span className="text-[9px] font-black uppercase text-[#6F4E37] absolute bottom-1">
                  NMID: ID102938475
                </span>
              </div>
              <p className="text-xs text-[#8B6E58]">
                Arahkan aplikasi GoPay, OVO, Dana, BCA, atau Livin ke QR di atas senilai{' '}
                <span className="font-bold text-[#6F4E37]">{formatRupiah(total)}</span>
              </p>
            </div>
          ) : (
            <div className="bg-[#FAF5EE] border border-[#D9C3AD] rounded-2xl p-4 text-center">
              <p className="text-xs text-[#8B6E58]">
                Pembayaran via <span className="font-bold text-[#6F4E37]">{metode}</span> sejumlah{' '}
                <span className="font-bold text-[#6F4E37]">{formatRupiah(total)}</span>. Silakan gesek / verifikasi pada terminal EDC.
              </p>
            </div>
          )}
        </div>

        {/* Footer Action Bayar & Simpan */}
        <div className="p-4 px-6 bg-white border-t border-[#EBDDCF] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 rounded-2xl border border-[#D9C3AD] hover:bg-[#FAF5EE] text-[#6F4E37] font-bold text-sm cursor-pointer transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleBayarDanSimpan}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#4A2E1B] hover:from-[#5A3E2B] hover:to-[#3E2723] active:scale-[0.98] text-white font-extrabold text-base md:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{isProcessing ? 'Memproses Transaksi...' : `Bayar & Simpan (${formatRupiah(total)})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
