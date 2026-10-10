import React, { useRef } from 'react';
import { Share2, Printer, Check, X, Coffee, Copy } from 'lucide-react';
import { PaymentInfo } from '../types/database';
import { formatRupiah } from '../services/db';

interface StrukModalProps {
  paymentData: PaymentInfo | null;
  onClose: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const StrukModal: React.FC<StrukModalProps> = ({
  paymentData,
  onClose,
  showToast
}) => {
  const strukRef = useRef<HTMLDivElement>(null);

  if (!paymentData) return null;

  const generateReceiptText = (): string => {
    let text = `=====================================\n`;
    text += `         COFFEE SENJA RASA\n`;
    text += `  Temani Senja Dalam Setiap Rasa\n`;
    text += `=====================================\n`;
    text += `No Trx : ${paymentData.no_transaksi}\n`;
    text += `Tgl    : ${paymentData.tanggal}\n`;
    text += `Kasir  : Admin\n`;
    text += `Metode : ${paymentData.metode}\n`;
    if (paymentData.isMember) text += `Member : YA (Diskon 5%)\n`;
    text += `-------------------------------------\n`;
    paymentData.items.forEach((item) => {
      text += `${item.menu} ${item.ukuran} x${item.jumlah}\n`;
      if (item.addOns.length > 0) {
        text += `  + ${item.addOns.join(', ')}\n`;
      }
      text += `  @${formatRupiah(item.hargaSatuan)} = ${formatRupiah(item.subtotal)}\n`;
    });
    text += `-------------------------------------\n`;
    text += `Subtotal  : ${formatRupiah(paymentData.subtotal)}\n`;
    if (paymentData.diskon > 0) {
      text += `Diskon 5% : -${formatRupiah(paymentData.diskon)}\n`;
    }
    text += `PPN 11%   : ${formatRupiah(paymentData.ppn)}\n`;
    text += `TOTAL     : ${formatRupiah(paymentData.total)}\n`;
    text += `BAYAR     : ${formatRupiah(paymentData.uangDiterima)}\n`;
    text += `KEMBALI   : ${formatRupiah(paymentData.kembalian)}\n`;
    text += `=====================================\n`;
    text += `     Terima kasih, sampai jumpa!\n`;
    text += `=====================================\n`;
    return text;
  };

  const handleShare = async () => {
    const receiptText = generateReceiptText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Struk Transaksi - Coffee Senja Rasa (${paymentData.no_transaksi})`,
          text: receiptText
        });
        showToast('Struk berhasil dibagikan!', 'success');
      } catch (err) {
        // User cancelled or unsupported
        navigator.clipboard.writeText(receiptText);
        showToast('Teks struk disalin ke papan klip!', 'info');
      }
    } else {
      navigator.clipboard.writeText(receiptText);
      showToast('Teks struk berhasil disalin ke clipboard!', 'success');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#E2CFBD] flex flex-col max-h-[90vh]">
        {/* Header Dialog */}
        <div className="p-4 px-6 bg-[#6F4E37] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-base">Struk Pembayaran</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Monospace Paper */}
        <div className="p-6 overflow-y-auto bg-[#FBF9F5] flex-1">
          <div
            ref={strukRef}
            className="bg-white p-6 rounded-2xl shadow-inner border border-[#E6DDD0] font-mono text-xs md:text-sm text-[#261E19] leading-relaxed select-text"
          >
            {/* Header Struk */}
            <div className="text-center pb-3 border-b border-dashed border-[#A89485] mb-3">
              <h2 className="font-bold text-sm md:text-base tracking-wider text-[#3D2817]">
                COFFEE SENJA RASA
              </h2>
              <p className="text-[11px] text-[#7A6250] mt-0.5">
                Temani Senja Dalam Setiap Rasa
              </p>
            </div>

            {/* Meta Transaksi */}
            <div className="space-y-1 pb-3 border-b border-dashed border-[#A89485] mb-3 text-[11px] md:text-xs">
              <div className="flex justify-between">
                <span>No Transaksi:</span>
                <span className="font-bold">{paymentData.no_transaksi}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{paymentData.tanggal}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>Admin</span>
              </div>
              <div className="flex justify-between">
                <span>Metode:</span>
                <span className="font-bold">{paymentData.metode}</span>
              </div>
              {paymentData.isMember && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Pelanggan:</span>
                  <span>Member (Diskon 5%)</span>
                </div>
              )}
            </div>

            {/* List Pesanan */}
            <div className="space-y-2 pb-3 border-b border-dashed border-[#A89485] mb-3">
              {paymentData.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span>
                      {item.menu} {item.ukuran}
                    </span>
                    <span>{formatRupiah(item.subtotal)}</span>
                  </div>
                  {item.addOns.length > 0 && (
                    <div className="text-[10px] text-[#7A6250]">
                      + {item.addOns.join(', ')}
                    </div>
                  )}
                  <div className="text-[10px] text-[#7A6250]">
                    {item.jumlah} x {formatRupiah(item.hargaSatuan)}
                  </div>
                </div>
              ))}
            </div>

            {/* Kalkulasi Ringkasan */}
            <div className="space-y-1 pb-3 border-b border-dashed border-[#A89485] mb-3 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatRupiah(paymentData.subtotal)}</span>
              </div>
              {paymentData.diskon > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon 5%:</span>
                  <span>-{formatRupiah(paymentData.diskon)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>PPN 11%:</span>
                <span>{formatRupiah(paymentData.ppn)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#3D2817] pt-1 border-t border-dotted border-[#A89485]">
                <span>TOTAL:</span>
                <span>{formatRupiah(paymentData.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>BAYAR:</span>
                <span>{formatRupiah(paymentData.uangDiterima)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>KEMBALI:</span>
                <span>{formatRupiah(paymentData.kembalian)}</span>
              </div>
            </div>

            {/* Footer Ucapan */}
            <div className="text-center pt-2">
              <p className="font-semibold text-xs text-[#523B2A]">
                Terima kasih, sampai jumpa!
              </p>
              <p className="text-[9px] text-[#A89485] mt-1">
                Simpan struk ini sebagai bukti pembayaran yang sah.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#EBDDCF] grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="py-3 px-4 rounded-xl border border-[#D9C3AD] hover:bg-[#FAF5EE] text-[#6F4E37] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3E2B] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Selesai</span>
          </button>
        </div>
      </div>
    </div>
  );
};
