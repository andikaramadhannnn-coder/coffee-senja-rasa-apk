export interface BarangMasuk {
  id: number;
  kode_barang: string;
  nama_barang: string;
  stok: number;
  kategori: 'Kopi' | 'Susu' | 'Syrup' | 'Sauce' | 'Powder' | 'Tea' | 'Pendukung' | 'Kemasan' | 'Operasional';
  tanggal_update: string; // yyyy-MM-dd
  satuan: 'Pack' | 'Liter' | 'Kaleng' | 'Botol' | 'Galon' | 'Kg' | 'Pcs' | 'Box';
  stok_asli: number;
  satuan_asli: string;
}

export interface BarangKeluar {
  id: number;
  nama_barang: string;
  jumlah: number;
  satuan: string;
  keterangan: string;
  tanggal: string; // yyyy-MM-dd HH:mm:ss
}

export interface ResepMenu {
  id: number;
  menu: string;
  bahan: string;
  jumlah_pakai: number;
  satuan: string;
}

export interface Transaksi {
  id: number;
  nama_menu: string;
  jumlah: number;
  harga: number;
  subtotal: number;
  tanggal: string; // yyyy-MM-dd HH:mm:ss
  kategori: 'Coffee' | 'Non Coffee';
  kasir: string;
  no_transaksi: string;
}

export type MenuName =
  | 'Americano'
  | 'Coffee Latte'
  | 'Cappuccino'
  | 'Hazelnut Latte'
  | 'Vanilla Latte'
  | 'Mocha Latte'
  | 'Matcha'
  | 'Matcha Latte'
  | 'Red Velvet'
  | 'Thai Tea';

export type Ukuran = 'Regular' | 'Large';

export type AddOn = 'Extra Shot' | 'Whipped Cream' | 'Cheese Foam' | 'Boba';

export interface CartItem {
  id: string; // temporary cart id
  menu: MenuName;
  ukuran: Ukuran;
  addOns: AddOn[];
  jumlah: number;
  hargaSatuan: number;
  subtotal: number;
}

export interface PaymentInfo {
  isMember: boolean;
  metode: 'Cash' | 'Qris' | 'Debit' | 'E-Wallet';
  subtotal: number;
  diskon: number;
  ppn: number;
  total: number;
  uangDiterima: number;
  kembalian: number;
  no_transaksi: string;
  tanggal: string;
  items: CartItem[];
}
