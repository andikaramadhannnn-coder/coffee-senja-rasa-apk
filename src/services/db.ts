import { BarangMasuk, BarangKeluar, ResepMenu, Transaksi, CartItem, PaymentInfo, MenuName, Ukuran, AddOn } from '../types/database';
import { SEED_BARANG_MASUK, SEED_RESEP_MENU } from '../data/seedData';

const STORAGE_KEYS = {
  BARANG_MASUK: 'senja_db_barang_masuk',
  BARANG_KELUAR: 'senja_db_barang_keluar',
  RESEP_MENU: 'senja_db_resep_menu',
  TRANSAKSI: 'senja_db_transaksi',
  INITIALIZED: 'senja_db_initialized_v2'
};

export const MENU_PRICES: Record<MenuName, { Regular: number; Large: number; kategori: 'Coffee' | 'Non Coffee' }> = {
  'Americano': { Regular: 18000, Large: 25000, kategori: 'Coffee' },
  'Coffee Latte': { Regular: 22000, Large: 28000, kategori: 'Coffee' },
  'Cappuccino': { Regular: 22000, Large: 28000, kategori: 'Coffee' },
  'Hazelnut Latte': { Regular: 25000, Large: 32000, kategori: 'Coffee' },
  'Vanilla Latte': { Regular: 25000, Large: 32000, kategori: 'Coffee' },
  'Mocha Latte': { Regular: 27000, Large: 34000, kategori: 'Coffee' },
  'Matcha': { Regular: 18000, Large: 25000, kategori: 'Non Coffee' },
  'Matcha Latte': { Regular: 25000, Large: 32000, kategori: 'Non Coffee' },
  'Red Velvet': { Regular: 25000, Large: 32000, kategori: 'Non Coffee' },
  'Thai Tea': { Regular: 18000, Large: 25000, kategori: 'Non Coffee' }
};

export const ADDON_PRICES: Record<AddOn, number> = {
  'Extra Shot': 5000,
  'Whipped Cream': 5000,
  'Cheese Foam': 7000,
  'Boba': 5000
};

export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount);
  return 'Rp ' + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function getNowFormatted(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

export function getTodayFormatted(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function hitungKonversiStok(
  satuan: BarangMasuk['satuan'],
  stokBeli: number
): { stok_asli: number; satuan_asli: string } {
  if (satuan === 'Pack' || satuan === 'Kg') {
    return { stok_asli: stokBeli * 1000, satuan_asli: 'gram' };
  } else if (satuan === 'Liter' || satuan === 'Botol') {
    return { stok_asli: stokBeli * 1000, satuan_asli: 'ml' };
  } else if (satuan === 'Galon') {
    return { stok_asli: stokBeli * 19000, satuan_asli: 'ml' };
  } else {
    return { stok_asli: stokBeli, satuan_asli: satuan };
  }
}

class DatabaseService {
  constructor() {
    this.initDatabase();
  }

  public initDatabase(forceReset = false) {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit || forceReset) {
      const barangMasukInit: BarangMasuk[] = SEED_BARANG_MASUK.map((b, idx) => ({
        id: idx + 1,
        ...b
      }));

      const resepMenuInit: ResepMenu[] = SEED_RESEP_MENU.map((r, idx) => ({
        id: idx + 1,
        ...r
      }));

      localStorage.setItem(STORAGE_KEYS.BARANG_MASUK, JSON.stringify(barangMasukInit));
      localStorage.setItem(STORAGE_KEYS.RESEP_MENU, JSON.stringify(resepMenuInit));
      if (forceReset || !localStorage.getItem(STORAGE_KEYS.BARANG_KELUAR)) {
        localStorage.setItem(STORAGE_KEYS.BARANG_KELUAR, JSON.stringify([]));
      }
      if (forceReset || !localStorage.getItem(STORAGE_KEYS.TRANSAKSI)) {
        // Sample seed transaction for realistic preview
        const sampleTrx: Transaksi[] = [
          {
            id: 1,
            nama_menu: 'Americano Regular',
            jumlah: 2,
            harga: 18000,
            subtotal: 36000,
            tanggal: '2026-10-08 09:30:15',
            kategori: 'Coffee',
            kasir: 'Admin',
            no_transaksi: 'TRX1728379815001'
          },
          {
            id: 2,
            nama_menu: 'Matcha Latte Large',
            jumlah: 1,
            harga: 32000,
            subtotal: 32000,
            tanggal: '2026-10-08 10:15:40',
            kategori: 'Non Coffee',
            kasir: 'Admin',
            no_transaksi: 'TRX1728382540002'
          },
          {
            id: 3,
            nama_menu: 'Coffee Latte Large',
            jumlah: 2,
            harga: 28000,
            subtotal: 56000,
            tanggal: '2026-10-08 14:20:00',
            kategori: 'Coffee',
            kasir: 'Admin',
            no_transaksi: 'TRX1728397200003'
          }
        ];
        localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(sampleTrx));
      }
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  // Barang Masuk
  public getBarangMasuk(): BarangMasuk[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BARANG_MASUK);
    return raw ? JSON.parse(raw) : [];
  }

  public addBarangMasuk(item: Omit<BarangMasuk, 'id'>): BarangMasuk {
    const list = this.getBarangMasuk();
    const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newItem: BarangMasuk = { ...item, id: newId };
    list.push(newItem);
    localStorage.setItem(STORAGE_KEYS.BARANG_MASUK, JSON.stringify(list));
    return newItem;
  }

  public updateBarangMasuk(item: BarangMasuk): void {
    const list = this.getBarangMasuk();
    const idx = list.findIndex(i => i.id === item.id);
    if (idx !== -1) {
      list[idx] = item;
      localStorage.setItem(STORAGE_KEYS.BARANG_MASUK, JSON.stringify(list));
    }
  }

  public tambahStokBarang(id: number, tambahStokBeli: number, tambahStokAsliManual?: number): BarangMasuk {
    const list = this.getBarangMasuk();
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Barang tidak ditemukan');

    const target = list[idx];
    const konversi = hitungKonversiStok(target.satuan, tambahStokBeli);
    const pertambahanStokAsli = tambahStokAsliManual !== undefined ? tambahStokAsliManual : konversi.stok_asli;

    target.stok += tambahStokBeli;
    target.stok_asli += pertambahanStokAsli;
    target.tanggal_update = getTodayFormatted();

    list[idx] = target;
    localStorage.setItem(STORAGE_KEYS.BARANG_MASUK, JSON.stringify(list));
    return target;
  }

  public deleteBarangMasuk(id: number): void {
    const list = this.getBarangMasuk().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.BARANG_MASUK, JSON.stringify(list));
  }

  // Barang Keluar
  public getBarangKeluar(): BarangKeluar[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BARANG_KELUAR);
    return raw ? JSON.parse(raw) : [];
  }

  public addBarangKeluarManual(item: Omit<BarangKeluar, 'id' | 'tanggal'>): BarangKeluar {
    const listBarangMasuk = this.getBarangMasuk();
    const targetIdx = listBarangMasuk.findIndex(b => b.nama_barang === item.nama_barang);
    if (targetIdx !== -1) {
      // Kurangi stok asli
      listBarangMasuk[targetIdx].stok_asli = Math.max(0, listBarangMasuk[targetIdx].stok_asli - item.jumlah);
      localStorage.setItem(STORAGE_KEYS.BARANG_MASUK, JSON.stringify(listBarangMasuk));
    }

    const list = this.getBarangKeluar();
    const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newItem: BarangKeluar = {
      ...item,
      id: newId,
      tanggal: getNowFormatted()
    };
    list.unshift(newItem); // newest first
    localStorage.setItem(STORAGE_KEYS.BARANG_KELUAR, JSON.stringify(list));
    return newItem;
  }

  // Resep Menu
  public getResepMenu(filterMenu?: string): ResepMenu[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RESEP_MENU);
    const list: ResepMenu[] = raw ? JSON.parse(raw) : [];
    if (!filterMenu || filterMenu === 'Semua') return list;
    return list.filter(r => r.menu.toLowerCase().includes(filterMenu.toLowerCase()));
  }

  public addResepMenu(item: Omit<ResepMenu, 'id'>): ResepMenu {
    const list = this.getResepMenu();
    const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newItem: ResepMenu = { ...item, id: newId };
    list.push(newItem);
    localStorage.setItem(STORAGE_KEYS.RESEP_MENU, JSON.stringify(list));
    return newItem;
  }

  public updateResepMenu(item: ResepMenu): void {
    const list = this.getResepMenu();
    const idx = list.findIndex(i => i.id === item.id);
    if (idx !== -1) {
      list[idx] = item;
      localStorage.setItem(STORAGE_KEYS.RESEP_MENU, JSON.stringify(list));
    }
  }

  public deleteResepMenu(id: number): void {
    const list = this.getResepMenu().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESEP_MENU, JSON.stringify(list));
  }

  // Transaksi
  public getTransaksi(dari?: string, sampai?: string): Transaksi[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSAKSI);
    let list: Transaksi[] = raw ? JSON.parse(raw) : [];

    if (dari) {
      list = list.filter(t => t.tanggal.slice(0, 10) >= dari);
    }
    if (sampai) {
      list = list.filter(t => t.tanggal.slice(0, 10) <= sampai);
    }
    return list.sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }

  /**
   * Pemetaan menu kasir ke nama di resep:
   * "Coffee Latte" -> "Cafe Latte"
   * "Matcha" -> "Matcha Water"
   * "Red Velvet" -> "Red Velvet Latte"
   * Menu lain sama persis
   */
  public mapMenuToResepName(menu: MenuName, ukuran: Ukuran): string {
    let base = menu as string;
    if (menu === 'Coffee Latte') base = 'Cafe Latte';
    if (menu === 'Matcha') base = 'Matcha Water';
    if (menu === 'Red Velvet') base = 'Red Velvet Latte';
    return `${base} ${ukuran}`;
  }

  public getKategoriTransaksi(namaMenu: string): 'Coffee' | 'Non Coffee' {
    const coffeeKeywords = [
      'Americano',
      'Coffee Latte',
      'Cafe Latte',
      'Cappuccino',
      'Hazelnut Latte',
      'Vanilla Latte',
      'Mocha Latte'
    ];
    for (const kw of coffeeKeywords) {
      if (namaMenu.includes(kw)) return 'Coffee';
    }
    return 'Non Coffee';
  }

  /**
   * Eksekusi Pembayaran dalam Satu Transaksi Database (Atomic ACID)
   * Rollback jika terjadi kesalahan.
   */
  public prosesPembayaran(
    cartItems: CartItem[],
    payment: {
      isMember: boolean;
      metode: 'Cash' | 'Qris' | 'Debit' | 'E-Wallet';
      subtotal: number;
      diskon: number;
      ppn: number;
      total: number;
      uangDiterima: number;
      kembalian: number;
    }
  ): PaymentInfo {
    if (cartItems.length === 0) {
      throw new Error('Keranjang belanja kosong');
    }

    // Backup state for rollback
    const backupBarangMasuk = localStorage.getItem(STORAGE_KEYS.BARANG_MASUK);
    const backupBarangKeluar = localStorage.getItem(STORAGE_KEYS.BARANG_KELUAR);
    const backupTransaksi = localStorage.getItem(STORAGE_KEYS.TRANSAKSI);

    try {
      const nowStr = getNowFormatted();
      const noTransaksi = `TRX${Date.now()}`;

      const listBarangMasuk: BarangMasuk[] = JSON.parse(backupBarangMasuk || '[]');
      const listBarangKeluar: BarangKeluar[] = JSON.parse(backupBarangKeluar || '[]');
      const listTransaksi: Transaksi[] = JSON.parse(backupTransaksi || '[]');
      const listResep: ResepMenu[] = this.getResepMenu();

      let nextKeluarId = listBarangKeluar.length > 0 ? Math.max(...listBarangKeluar.map(k => k.id)) + 1 : 1;
      let nextTrxId = listTransaksi.length > 0 ? Math.max(...listTransaksi.map(t => t.id)) + 1 : 1;

      // 1. Simpan Transaksi & Kurangi Stok per Item Keranjang
      for (const item of cartItems) {
        const fullMenuName = `${item.menu} ${item.ukuran}`;
        const kategori = this.getKategoriTransaksi(fullMenuName);

        // Tambah baris transaksi
        const newTrx: Transaksi = {
          id: nextTrxId++,
          nama_menu: fullMenuName,
          jumlah: item.jumlah,
          harga: item.hargaSatuan,
          subtotal: item.subtotal,
          tanggal: nowStr,
          kategori: kategori,
          kasir: 'Admin',
          no_transaksi: noTransaksi
        };
        listTransaksi.unshift(newTrx);

        // Cari resep untuk menu + ukuran
        const targetResepName = this.mapMenuToResepName(item.menu, item.ukuran);
        const resepList = listResep.filter(r => r.menu === targetResepName);

        for (const resep of resepList) {
          const totalKurang = resep.jumlah_pakai * item.jumlah;
          // Kurangi barang_masuk.stok_asli
          const targetBrg = listBarangMasuk.find(b => b.nama_barang === resep.bahan);
          if (targetBrg) {
            targetBrg.stok_asli = Math.max(0, targetBrg.stok_asli - totalKurang);
          }

          // Catat ke barang_keluar
          listBarangKeluar.unshift({
            id: nextKeluarId++,
            nama_barang: resep.bahan,
            jumlah: totalKurang,
            satuan: resep.satuan,
            keterangan: fullMenuName,
            tanggal: nowStr
          });
        }

        // 2. Add-on: Kurangi stok sesuai baris resep_menu dengan menu = nama add-on
        for (const addOn of item.addOns) {
          const resepAddonList = listResep.filter(r => r.menu === addOn);
          for (const rAddon of resepAddonList) {
            const totalKurangAddon = rAddon.jumlah_pakai * item.jumlah;
            const targetBrg = listBarangMasuk.find(b => b.nama_barang === rAddon.bahan);
            if (targetBrg) {
              targetBrg.stok_asli = Math.max(0, targetBrg.stok_asli - totalKurangAddon);
            }

            listBarangKeluar.unshift({
              id: nextKeluarId++,
              nama_barang: rAddon.bahan,
              jumlah: totalKurangAddon,
              satuan: rAddon.satuan,
              keterangan: `${fullMenuName} + ${addOn}`,
              tanggal: nowStr
            });
          }
        }
      }

      // Commit transaction by saving all updated tables
      localStorage.setItem(STORAGE_KEYS.BARANG_MASUK, JSON.stringify(listBarangMasuk));
      localStorage.setItem(STORAGE_KEYS.BARANG_KELUAR, JSON.stringify(listBarangKeluar));
      localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(listTransaksi));

      return {
        ...payment,
        no_transaksi: noTransaksi,
        tanggal: nowStr,
        items: [...cartItems]
      };
    } catch (err) {
      // Rollback to previous state
      if (backupBarangMasuk) localStorage.setItem(STORAGE_KEYS.BARANG_MASUK, backupBarangMasuk);
      if (backupBarangKeluar) localStorage.setItem(STORAGE_KEYS.BARANG_KELUAR, backupBarangKeluar);
      if (backupTransaksi) localStorage.setItem(STORAGE_KEYS.TRANSAKSI, backupTransaksi);
      console.error('Transaction rollback occurred:', err);
      throw new Error(`Transaksi Gagal: ${(err as Error).message}. Semua data telah dikembalikan.`);
    }
  }

  // Ringkasan untuk Informasi Penjualan (Dashboard Summary)
  public getInformasiPenjualan() {
    const listTrx = this.getTransaksi();
    const listBrg = this.getBarangMasuk();

    const totalPenjualan = listTrx.reduce((acc, cur) => acc + cur.subtotal, 0);

    // Total transaksi unik berdasarkan no_transaksi
    const uniqueTrxSet = new Set(listTrx.map(t => t.no_transaksi));
    const totalTransaksi = uniqueTrxSet.size;

    // Menu terlaris
    const menuCounter: Record<string, number> = {};
    for (const trx of listTrx) {
      menuCounter[trx.nama_menu] = (menuCounter[trx.nama_menu] || 0) + trx.jumlah;
    }

    let menuTerlaris = '-';
    let maxQty = 0;
    for (const [menu, qty] of Object.entries(menuCounter)) {
      if (qty > maxQty) {
        maxQty = qty;
        menuTerlaris = `${menu} (${qty} cup)`;
      }
    }

    // Stok menipis: stok < 5
    const menipisList = listBrg.filter(b => b.stok < 5);
    const stokMenipis = menipisList.length > 0
      ? menipisList.map(b => `${b.nama_barang} (${b.stok} ${b.satuan})`).join(', ')
      : 'Stok Aman';

    const jumlahJenisBarang = listBrg.length;

    return {
      totalPenjualan,
      totalTransaksi,
      menuTerlaris,
      stokMenipis,
      menipisCount: menipisList.length,
      menipisItems: menipisList,
      jumlahJenisBarang
    };
  }
}

export const db = new DatabaseService();
