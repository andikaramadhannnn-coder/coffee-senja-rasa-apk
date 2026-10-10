/**
 * Coffee Senja Rasa - Kasir & Manajemen Stok Coffee Shop
 * Tema: Cokelat Kopi (#6F4E37) & Latar Krem (#F5EBDD)
 * Fitur: Offline SQLite/Room/IndexedDB, Kasir, Barang Masuk, Barang Keluar,
 * Resep Menu, Laporan Penjualan (Export PDF/CSV), Informasi Penjualan, & Kode Android Kotlin.
 */

import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { CartItem, PaymentInfo } from './types/database';
import { ToastContainer, ToastMessage } from './components/Toast';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { DashboardScreen } from './components/DashboardScreen';
import { KasirScreen } from './components/KasirScreen';
import { PembayaranModal } from './components/PembayaranModal';
import { StrukModal } from './components/StrukModal';
import { BarangMasukScreen } from './components/BarangMasukScreen';
import { BarangKeluarScreen } from './components/BarangKeluarScreen';
import { ResepMenuScreen } from './components/ResepMenuScreen';
import { LaporanPenjualanScreen } from './components/LaporanPenjualanScreen';
import { InformasiPenjualanScreen } from './components/InformasiPenjualanScreen';
import { AndroidProjectModal } from './components/AndroidProjectModal';

export type ScreenType =
  | 'dashboard'
  | 'kasir'
  | 'barang_masuk'
  | 'barang_keluar'
  | 'resep_menu'
  | 'laporan'
  | 'informasi';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('senja_is_auth') === 'true';
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<PaymentInfo | null>(null);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState<boolean>(false);
  const [deviceMode, setDeviceMode] = useState<'auto' | 'mobile' | 'tablet'>('auto');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast notifier
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('senja_is_auth', 'true');
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('senja_is_auth');
    setCart([]);
    showToast('Berhasil keluar dari akun.', 'info');
  };

  const handlePaymentSuccess = (info: PaymentInfo) => {
    setIsPaymentOpen(false);
    setCart([]); // Kosongkan keranjang setelah sukses bayar
    setReceiptData(info); // Tampilkan struk
  };

  const handleCloseReceipt = () => {
    setReceiptData(null);
    setCurrentScreen('kasir'); // Kembali ke kasir siap transaksi berikutnya
  };

  const handleResetDatabase = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mengatur ulang data ke benih awal (39 Barang Masuk & 155 Resep Menu)? Semua transaksi baru akan dibersihkan.'
      )
    ) {
      db.initDatabase(true);
      setCart([]);
      showToast('Database berhasil di-reset ke data awal seed_data_awal.sql!', 'success');
      // Trigger re-render by changing screen briefly or reloading
      window.location.reload();
    }
  };

  // If not logged in, show Login Screen
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen onLoginSuccess={handleLoginSuccess} showToast={showToast} />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  // Determine if layout should render as tablet split or mobile
  const isTabletView =
    deviceMode === 'tablet' || (deviceMode === 'auto' && window.innerWidth >= 768);

  return (
    <div className="min-h-screen bg-[#F5EBDD] text-[#3D2817] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onLogout={handleLogout}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        onResetDatabase={handleResetDatabase}
      />

      {/* Main App Content Container */}
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div
          className={`mx-auto transition-all duration-300 ${
            deviceMode === 'mobile'
              ? 'max-w-md bg-white/70 p-4 rounded-3xl border border-[#E6D7C3] shadow-lg min-h-[85vh]'
              : 'max-w-7xl'
          }`}
        >
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              onNavigate={setCurrentScreen}
              onLogout={handleLogout}
              onOpenAndroidCode={() => setIsAndroidModalOpen(true)}
            />
          )}

          {currentScreen === 'kasir' && (
            <KasirScreen
              cart={cart}
              setCart={setCart}
              onProceedToPayment={() => setIsPaymentOpen(true)}
              showToast={showToast}
              isTabletView={isTabletView}
            />
          )}

          {currentScreen === 'barang_masuk' && (
            <BarangMasukScreen showToast={showToast} />
          )}

          {currentScreen === 'barang_keluar' && (
            <BarangKeluarScreen showToast={showToast} />
          )}

          {currentScreen === 'resep_menu' && (
            <ResepMenuScreen showToast={showToast} />
          )}

          {currentScreen === 'laporan' && (
            <LaporanPenjualanScreen showToast={showToast} />
          )}

          {currentScreen === 'informasi' && (
            <InformasiPenjualanScreen
              onNavigateToKasir={() => setCurrentScreen('kasir')}
              onNavigateToBarangMasuk={() => setCurrentScreen('barang_masuk')}
            />
          )}
        </div>
      </main>

      {/* Modal Pembayaran */}
      {isPaymentOpen && (
        <PembayaranModal
          cart={cart}
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
          showToast={showToast}
        />
      )}

      {/* Modal Struk Thermal */}
      {receiptData && (
        <StrukModal
          paymentData={receiptData}
          onClose={handleCloseReceipt}
          showToast={showToast}
        />
      )}

      {/* Modal Source Code Android Kotlin */}
      <AndroidProjectModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        showToast={showToast}
      />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
