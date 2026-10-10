// Seed data generator for Coffee Senja Rasa
// Exactly 39 items for barang_masuk
// Exactly 155 items for resep_menu

export interface BarangMasukSeed {
  kode_barang: string;
  nama_barang: string;
  stok: number;
  kategori: 'Kopi' | 'Susu' | 'Syrup' | 'Sauce' | 'Powder' | 'Tea' | 'Pendukung' | 'Kemasan' | 'Operasional';
  satuan: 'Pack' | 'Liter' | 'Kaleng' | 'Botol' | 'Galon' | 'Kg' | 'Pcs' | 'Box';
  stok_asli: number;
  satuan_asli: string;
  tanggal_update: string;
}

export interface ResepMenuSeed {
  menu: string;
  bahan: string;
  jumlah_pakai: number;
  satuan: string;
}

export const SEED_BARANG_MASUK: BarangMasukSeed[] = [
  // Kopi (3)
  { kode_barang: 'BRG001', nama_barang: 'Biji Kopi Espresso Blend', stok: 10, kategori: 'Kopi', satuan: 'Pack', stok_asli: 10000, satuan_asli: 'gram', tanggal_update: '2026-10-01' },
  { kode_barang: 'BRG002', nama_barang: 'Biji Kopi Arabica Single Origin', stok: 8, kategori: 'Kopi', satuan: 'Pack', stok_asli: 8000, satuan_asli: 'gram', tanggal_update: '2026-10-01' },
  { kode_barang: 'BRG003', nama_barang: 'Biji Kopi Robusta Fine', stok: 12, kategori: 'Kopi', satuan: 'Pack', stok_asli: 12000, satuan_asli: 'gram', tanggal_update: '2026-10-01' },

  // Susu (6)
  { kode_barang: 'BRG004', nama_barang: 'Fresh Milk UHT', stok: 25, kategori: 'Susu', satuan: 'Liter', stok_asli: 25000, satuan_asli: 'ml', tanggal_update: '2026-10-02' },
  { kode_barang: 'BRG005', nama_barang: 'Susu Evaporasi', stok: 20, kategori: 'Susu', satuan: 'Kaleng', stok_asli: 20, satuan_asli: 'Kaleng', tanggal_update: '2026-10-02' },
  { kode_barang: 'BRG006', nama_barang: 'Susu Kental Manis', stok: 24, kategori: 'Susu', satuan: 'Kaleng', stok_asli: 24, satuan_asli: 'Kaleng', tanggal_update: '2026-10-02' },
  { kode_barang: 'BRG007', nama_barang: 'Whipping Cream Cair', stok: 8, kategori: 'Susu', satuan: 'Liter', stok_asli: 8000, satuan_asli: 'ml', tanggal_update: '2026-10-02' },
  { kode_barang: 'BRG008', nama_barang: 'Susu Oat Milk Barista', stok: 10, kategori: 'Susu', satuan: 'Liter', stok_asli: 10000, satuan_asli: 'ml', tanggal_update: '2026-10-02' },
  { kode_barang: 'BRG009', nama_barang: 'Susu Kedelai Soya', stok: 6, kategori: 'Susu', satuan: 'Liter', stok_asli: 6000, satuan_asli: 'ml', tanggal_update: '2026-10-02' },

  // Syrup (6)
  { kode_barang: 'BRG010', nama_barang: 'Hazelnut Syrup', stok: 6, kategori: 'Syrup', satuan: 'Botol', stok_asli: 6000, satuan_asli: 'ml', tanggal_update: '2026-10-03' },
  { kode_barang: 'BRG011', nama_barang: 'Vanilla Syrup', stok: 6, kategori: 'Syrup', satuan: 'Botol', stok_asli: 6000, satuan_asli: 'ml', tanggal_update: '2026-10-03' },
  { kode_barang: 'BRG012', nama_barang: 'Caramel Syrup', stok: 5, kategori: 'Syrup', satuan: 'Botol', stok_asli: 5000, satuan_asli: 'ml', tanggal_update: '2026-10-03' },
  { kode_barang: 'BRG013', nama_barang: 'Simple Syrup Gula', stok: 15, kategori: 'Syrup', satuan: 'Botol', stok_asli: 15000, satuan_asli: 'ml', tanggal_update: '2026-10-03' },
  { kode_barang: 'BRG014', nama_barang: 'Brown Sugar Liquid', stok: 8, kategori: 'Syrup', satuan: 'Botol', stok_asli: 8000, satuan_asli: 'ml', tanggal_update: '2026-10-03' },
  { kode_barang: 'BRG015', nama_barang: 'Pandan Syrup', stok: 4, kategori: 'Syrup', satuan: 'Botol', stok_asli: 4000, satuan_asli: 'ml', tanggal_update: '2026-10-03' }, // stok < 5

  // Sauce (2)
  { kode_barang: 'BRG016', nama_barang: 'Chocolate Sauce', stok: 8, kategori: 'Sauce', satuan: 'Botol', stok_asli: 8000, satuan_asli: 'ml', tanggal_update: '2026-10-03' },
  { kode_barang: 'BRG017', nama_barang: 'Salted Caramel Sauce', stok: 3, kategori: 'Sauce', satuan: 'Botol', stok_asli: 3000, satuan_asli: 'ml', tanggal_update: '2026-10-03' }, // stok < 5

  // Powder (6)
  { kode_barang: 'BRG018', nama_barang: 'Matcha Powder Pure', stok: 6, kategori: 'Powder', satuan: 'Pack', stok_asli: 6000, satuan_asli: 'gram', tanggal_update: '2026-10-04' },
  { kode_barang: 'BRG019', nama_barang: 'Red Velvet Powder', stok: 5, kategori: 'Powder', satuan: 'Pack', stok_asli: 5000, satuan_asli: 'gram', tanggal_update: '2026-10-04' },
  { kode_barang: 'BRG020', nama_barang: 'Cheese Foam Powder', stok: 4, kategori: 'Powder', satuan: 'Pack', stok_asli: 4000, satuan_asli: 'gram', tanggal_update: '2026-10-04' }, // stok < 5
  { kode_barang: 'BRG021', nama_barang: 'Dark Cocoa Powder', stok: 5, kategori: 'Powder', satuan: 'Pack', stok_asli: 5000, satuan_asli: 'gram', tanggal_update: '2026-10-04' },
  { kode_barang: 'BRG022', nama_barang: 'Taro Powder', stok: 4, kategori: 'Powder', satuan: 'Pack', stok_asli: 4000, satuan_asli: 'gram', tanggal_update: '2026-10-04' }, // stok < 5
  { kode_barang: 'BRG023', nama_barang: 'Creamer Powder Nabati', stok: 8, kategori: 'Powder', satuan: 'Pack', stok_asli: 8000, satuan_asli: 'gram', tanggal_update: '2026-10-04' },

  // Tea (3)
  { kode_barang: 'BRG024', nama_barang: 'Thai Tea Mix Bubuk', stok: 7, kategori: 'Tea', satuan: 'Pack', stok_asli: 7000, satuan_asli: 'gram', tanggal_update: '2026-10-04' },
  { kode_barang: 'BRG025', nama_barang: 'Earl Grey Tea Daun', stok: 5, kategori: 'Tea', satuan: 'Pack', stok_asli: 5000, satuan_asli: 'gram', tanggal_update: '2026-10-04' },
  { kode_barang: 'BRG026', nama_barang: 'Green Tea Jasmine', stok: 5, kategori: 'Tea', satuan: 'Pack', stok_asli: 5000, satuan_asli: 'gram', tanggal_update: '2026-10-04' },

  // Pendukung (5)
  { kode_barang: 'BRG027', nama_barang: 'Air Mineral Galon', stok: 10, kategori: 'Pendukung', satuan: 'Galon', stok_asli: 190000, satuan_asli: 'ml', tanggal_update: '2026-10-05' },
  { kode_barang: 'BRG028', nama_barang: 'Es Batu Kristal Tube', stok: 50, kategori: 'Pendukung', satuan: 'Kg', stok_asli: 50000, satuan_asli: 'gram', tanggal_update: '2026-10-05' },
  { kode_barang: 'BRG029', nama_barang: 'Boba Tapioca Pearl', stok: 6, kategori: 'Pendukung', satuan: 'Pack', stok_asli: 6000, satuan_asli: 'gram', tanggal_update: '2026-10-05' },
  { kode_barang: 'BRG030', nama_barang: 'Gula Pasir Kristal', stok: 15, kategori: 'Pendukung', satuan: 'Kg', stok_asli: 15000, satuan_asli: 'gram', tanggal_update: '2026-10-05' },
  { kode_barang: 'BRG031', nama_barang: 'Grass Jelly Cincau', stok: 5, kategori: 'Pendukung', satuan: 'Pack', stok_asli: 5000, satuan_asli: 'gram', tanggal_update: '2026-10-05' },

  // Kemasan (5)
  { kode_barang: 'BRG032', nama_barang: 'Cup Regular 12oz', stok: 500, kategori: 'Kemasan', satuan: 'Pcs', stok_asli: 500, satuan_asli: 'Pcs', tanggal_update: '2026-10-05' },
  { kode_barang: 'BRG033', nama_barang: 'Cup Large 16oz', stok: 450, kategori: 'Kemasan', satuan: 'Pcs', stok_asli: 450, satuan_asli: 'Pcs', tanggal_update: '2026-10-05' },
  { kode_barang: 'BRG034', nama_barang: 'Tutup Cup Datar Lid', stok: 600, kategori: 'Kemasan', satuan: 'Pcs', stok_asli: 600, satuan_asli: 'Pcs', tanggal_update: '2026-10-05' },
  { kode_barang: 'BRG035', nama_barang: 'Sedotan Boba Hitam Higienis', stok: 10, kategori: 'Kemasan', satuan: 'Pack', stok_asli: 10000, satuan_asli: 'gram', tanggal_update: '2026-10-05' },
  { kode_barang: 'BRG036', nama_barang: 'Cup Sleeve Paper Kraft', stok: 350, kategori: 'Kemasan', satuan: 'Pcs', stok_asli: 350, satuan_asli: 'Pcs', tanggal_update: '2026-10-05' },

  // Operasional (3)
  { kode_barang: 'BRG037', nama_barang: 'Tissue Meja Senja Rasa', stok: 20, kategori: 'Operasional', satuan: 'Pack', stok_asli: 20000, satuan_asli: 'gram', tanggal_update: '2026-10-06' },
  { kode_barang: 'BRG038', nama_barang: 'Plastik Takeaway Cup 1', stok: 15, kategori: 'Operasional', satuan: 'Pack', stok_asli: 15000, satuan_asli: 'gram', tanggal_update: '2026-10-06' },
  { kode_barang: 'BRG039', nama_barang: 'Kertas Thermal Struk 58mm', stok: 2, kategori: 'Operasional', satuan: 'Box', stok_asli: 2, satuan_asli: 'Box', tanggal_update: '2026-10-06' } // stok < 5
];

// Helper to construct exact 155 recipe items
// Menus:
// 10 drinks x 2 sizes (Regular & Large) = 20 drink recipes
// 4 add-ons = 4 add-on recipes
// We create exact ingredients for each so that sum = 155 items!

const RECIPE_LIST: ResepMenuSeed[] = [
  // 1. Americano Regular (7 bahan)
  { menu: 'Americano Regular', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 18, satuan: 'gram' },
  { menu: 'Americano Regular', bahan: 'Air Mineral Galon', jumlah_pakai: 150, satuan: 'ml' },
  { menu: 'Americano Regular', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 100, satuan: 'gram' },
  { menu: 'Americano Regular', bahan: 'Cup Regular 12oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Americano Regular', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Americano Regular', bahan: 'Cup Sleeve Paper Kraft', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Americano Regular', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 2. Americano Large (7 bahan)
  { menu: 'Americano Large', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 24, satuan: 'gram' },
  { menu: 'Americano Large', bahan: 'Air Mineral Galon', jumlah_pakai: 220, satuan: 'ml' },
  { menu: 'Americano Large', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 150, satuan: 'gram' },
  { menu: 'Americano Large', bahan: 'Cup Large 16oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Americano Large', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Americano Large', bahan: 'Cup Sleeve Paper Kraft', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Americano Large', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 3. Cafe Latte Regular (7 bahan)
  { menu: 'Cafe Latte Regular', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 18, satuan: 'gram' },
  { menu: 'Cafe Latte Regular', bahan: 'Fresh Milk UHT', jumlah_pakai: 150, satuan: 'ml' },
  { menu: 'Cafe Latte Regular', bahan: 'Simple Syrup Gula', jumlah_pakai: 15, satuan: 'ml' },
  { menu: 'Cafe Latte Regular', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 100, satuan: 'gram' },
  { menu: 'Cafe Latte Regular', bahan: 'Cup Regular 12oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Cafe Latte Regular', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Cafe Latte Regular', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 4. Cafe Latte Large (7 bahan)
  { menu: 'Cafe Latte Large', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 24, satuan: 'gram' },
  { menu: 'Cafe Latte Large', bahan: 'Fresh Milk UHT', jumlah_pakai: 200, satuan: 'ml' },
  { menu: 'Cafe Latte Large', bahan: 'Simple Syrup Gula', jumlah_pakai: 20, satuan: 'ml' },
  { menu: 'Cafe Latte Large', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 140, satuan: 'gram' },
  { menu: 'Cafe Latte Large', bahan: 'Cup Large 16oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Cafe Latte Large', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Cafe Latte Large', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 5. Cappuccino Regular (7 bahan)
  { menu: 'Cappuccino Regular', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 20, satuan: 'gram' },
  { menu: 'Cappuccino Regular', bahan: 'Fresh Milk UHT', jumlah_pakai: 120, satuan: 'ml' },
  { menu: 'Cappuccino Regular', bahan: 'Dark Cocoa Powder', jumlah_pakai: 3, satuan: 'gram' },
  { menu: 'Cappuccino Regular', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 100, satuan: 'gram' },
  { menu: 'Cappuccino Regular', bahan: 'Cup Regular 12oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Cappuccino Regular', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Cappuccino Regular', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 6. Cappuccino Large (7 bahan)
  { menu: 'Cappuccino Large', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 24, satuan: 'gram' },
  { menu: 'Cappuccino Large', bahan: 'Fresh Milk UHT', jumlah_pakai: 170, satuan: 'ml' },
  { menu: 'Cappuccino Large', bahan: 'Dark Cocoa Powder', jumlah_pakai: 5, satuan: 'gram' },
  { menu: 'Cappuccino Large', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 140, satuan: 'gram' },
  { menu: 'Cappuccino Large', bahan: 'Cup Large 16oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Cappuccino Large', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Cappuccino Large', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 7. Hazelnut Latte Regular (8 bahan)
  { menu: 'Hazelnut Latte Regular', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 18, satuan: 'gram' },
  { menu: 'Hazelnut Latte Regular', bahan: 'Fresh Milk UHT', jumlah_pakai: 140, satuan: 'ml' },
  { menu: 'Hazelnut Latte Regular', bahan: 'Hazelnut Syrup', jumlah_pakai: 20, satuan: 'ml' },
  { menu: 'Hazelnut Latte Regular', bahan: 'Simple Syrup Gula', jumlah_pakai: 10, satuan: 'ml' },
  { menu: 'Hazelnut Latte Regular', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 100, satuan: 'gram' },
  { menu: 'Hazelnut Latte Regular', bahan: 'Cup Regular 12oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Hazelnut Latte Regular', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Hazelnut Latte Regular', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 8. Hazelnut Latte Large (8 bahan)
  { menu: 'Hazelnut Latte Large', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 24, satuan: 'gram' },
  { menu: 'Hazelnut Latte Large', bahan: 'Fresh Milk UHT', jumlah_pakai: 190, satuan: 'ml' },
  { menu: 'Hazelnut Latte Large', bahan: 'Hazelnut Syrup', jumlah_pakai: 30, satuan: 'ml' },
  { menu: 'Hazelnut Latte Large', bahan: 'Simple Syrup Gula', jumlah_pakai: 15, satuan: 'ml' },
  { menu: 'Hazelnut Latte Large', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 140, satuan: 'gram' },
  { menu: 'Hazelnut Latte Large', bahan: 'Cup Large 16oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Hazelnut Latte Large', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Hazelnut Latte Large', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 9. Vanilla Latte Regular (8 bahan)
  { menu: 'Vanilla Latte Regular', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 18, satuan: 'gram' },
  { menu: 'Vanilla Latte Regular', bahan: 'Fresh Milk UHT', jumlah_pakai: 140, satuan: 'ml' },
  { menu: 'Vanilla Latte Regular', bahan: 'Vanilla Syrup', jumlah_pakai: 20, satuan: 'ml' },
  { menu: 'Vanilla Latte Regular', bahan: 'Simple Syrup Gula', jumlah_pakai: 10, satuan: 'ml' },
  { menu: 'Vanilla Latte Regular', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 100, satuan: 'gram' },
  { menu: 'Vanilla Latte Regular', bahan: 'Cup Regular 12oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Vanilla Latte Regular', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Vanilla Latte Regular', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 10. Vanilla Latte Large (8 bahan)
  { menu: 'Vanilla Latte Large', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 24, satuan: 'gram' },
  { menu: 'Vanilla Latte Large', bahan: 'Fresh Milk UHT', jumlah_pakai: 190, satuan: 'ml' },
  { menu: 'Vanilla Latte Large', bahan: 'Vanilla Syrup', jumlah_pakai: 30, satuan: 'ml' },
  { menu: 'Vanilla Latte Large', bahan: 'Simple Syrup Gula', jumlah_pakai: 15, satuan: 'ml' },
  { menu: 'Vanilla Latte Large', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 140, satuan: 'gram' },
  { menu: 'Vanilla Latte Large', bahan: 'Cup Large 16oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Vanilla Latte Large', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Vanilla Latte Large', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 11. Mocha Latte Regular (8 bahan)
  { menu: 'Mocha Latte Regular', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 18, satuan: 'gram' },
  { menu: 'Mocha Latte Regular', bahan: 'Fresh Milk UHT', jumlah_pakai: 130, satuan: 'ml' },
  { menu: 'Mocha Latte Regular', bahan: 'Chocolate Sauce', jumlah_pakai: 25, satuan: 'ml' },
  { menu: 'Mocha Latte Regular', bahan: 'Dark Cocoa Powder', jumlah_pakai: 5, satuan: 'gram' },
  { menu: 'Mocha Latte Regular', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 100, satuan: 'gram' },
  { menu: 'Mocha Latte Regular', bahan: 'Cup Regular 12oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Mocha Latte Regular', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Mocha Latte Regular', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 12. Mocha Latte Large (8 bahan)
  { menu: 'Mocha Latte Large', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 24, satuan: 'gram' },
  { menu: 'Mocha Latte Large', bahan: 'Fresh Milk UHT', jumlah_pakai: 180, satuan: 'ml' },
  { menu: 'Mocha Latte Large', bahan: 'Chocolate Sauce', jumlah_pakai: 35, satuan: 'ml' },
  { menu: 'Mocha Latte Large', bahan: 'Dark Cocoa Powder', jumlah_pakai: 8, satuan: 'gram' },
  { menu: 'Mocha Latte Large', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 140, satuan: 'gram' },
  { menu: 'Mocha Latte Large', bahan: 'Cup Large 16oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Mocha Latte Large', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Mocha Latte Large', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 13. Matcha Water Regular (7 bahan)
  { menu: 'Matcha Water Regular', bahan: 'Matcha Powder Pure', jumlah_pakai: 15, satuan: 'gram' },
  { menu: 'Matcha Water Regular', bahan: 'Air Mineral Galon', jumlah_pakai: 160, satuan: 'ml' },
  { menu: 'Matcha Water Regular', bahan: 'Simple Syrup Gula', jumlah_pakai: 20, satuan: 'ml' },
  { menu: 'Matcha Water Regular', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 100, satuan: 'gram' },
  { menu: 'Matcha Water Regular', bahan: 'Cup Regular 12oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Matcha Water Regular', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Matcha Water Regular', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 14. Matcha Water Large (7 bahan)
  { menu: 'Matcha Water Large', bahan: 'Matcha Powder Pure', jumlah_pakai: 22, satuan: 'gram' },
  { menu: 'Matcha Water Large', bahan: 'Air Mineral Galon', jumlah_pakai: 220, satuan: 'ml' },
  { menu: 'Matcha Water Large', bahan: 'Simple Syrup Gula', jumlah_pakai: 30, satuan: 'ml' },
  { menu: 'Matcha Water Large', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 140, satuan: 'gram' },
  { menu: 'Matcha Water Large', bahan: 'Cup Large 16oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Matcha Water Large', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Matcha Water Large', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 15. Matcha Latte Regular (7 bahan)
  { menu: 'Matcha Latte Regular', bahan: 'Matcha Powder Pure', jumlah_pakai: 15, satuan: 'gram' },
  { menu: 'Matcha Latte Regular', bahan: 'Fresh Milk UHT', jumlah_pakai: 140, satuan: 'ml' },
  { menu: 'Matcha Latte Regular', bahan: 'Simple Syrup Gula', jumlah_pakai: 20, satuan: 'ml' },
  { menu: 'Matcha Latte Regular', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 100, satuan: 'gram' },
  { menu: 'Matcha Latte Regular', bahan: 'Cup Regular 12oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Matcha Latte Regular', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Matcha Latte Regular', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 16. Matcha Latte Large (7 bahan)
  { menu: 'Matcha Latte Large', bahan: 'Matcha Powder Pure', jumlah_pakai: 22, satuan: 'gram' },
  { menu: 'Matcha Latte Large', bahan: 'Fresh Milk UHT', jumlah_pakai: 190, satuan: 'ml' },
  { menu: 'Matcha Latte Large', bahan: 'Simple Syrup Gula', jumlah_pakai: 30, satuan: 'ml' },
  { menu: 'Matcha Latte Large', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 140, satuan: 'gram' },
  { menu: 'Matcha Latte Large', bahan: 'Cup Large 16oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Matcha Latte Large', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Matcha Latte Large', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 17. Red Velvet Latte Regular (7 bahan)
  { menu: 'Red Velvet Latte Regular', bahan: 'Red Velvet Powder', jumlah_pakai: 20, satuan: 'gram' },
  { menu: 'Red Velvet Latte Regular', bahan: 'Fresh Milk UHT', jumlah_pakai: 140, satuan: 'ml' },
  { menu: 'Red Velvet Latte Regular', bahan: 'Simple Syrup Gula', jumlah_pakai: 15, satuan: 'ml' },
  { menu: 'Red Velvet Latte Regular', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 100, satuan: 'gram' },
  { menu: 'Red Velvet Latte Regular', bahan: 'Cup Regular 12oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Red Velvet Latte Regular', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Red Velvet Latte Regular', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 18. Red Velvet Latte Large (7 bahan)
  { menu: 'Red Velvet Latte Large', bahan: 'Red Velvet Powder', jumlah_pakai: 28, satuan: 'gram' },
  { menu: 'Red Velvet Latte Large', bahan: 'Fresh Milk UHT', jumlah_pakai: 190, satuan: 'ml' },
  { menu: 'Red Velvet Latte Large', bahan: 'Simple Syrup Gula', jumlah_pakai: 25, satuan: 'ml' },
  { menu: 'Red Velvet Latte Large', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 140, satuan: 'gram' },
  { menu: 'Red Velvet Latte Large', bahan: 'Cup Large 16oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Red Velvet Latte Large', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Red Velvet Latte Large', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 19. Thai Tea Regular (8 bahan)
  { menu: 'Thai Tea Regular', bahan: 'Thai Tea Mix Bubuk', jumlah_pakai: 15, satuan: 'gram' },
  { menu: 'Thai Tea Regular', bahan: 'Air Mineral Galon', jumlah_pakai: 120, satuan: 'ml' },
  { menu: 'Thai Tea Regular', bahan: 'Fresh Milk UHT', jumlah_pakai: 30, satuan: 'ml' },
  { menu: 'Thai Tea Regular', bahan: 'Simple Syrup Gula', jumlah_pakai: 15, satuan: 'ml' },
  { menu: 'Thai Tea Regular', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 100, satuan: 'gram' },
  { menu: 'Thai Tea Regular', bahan: 'Cup Regular 12oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Thai Tea Regular', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Thai Tea Regular', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // 20. Thai Tea Large (8 bahan)
  { menu: 'Thai Tea Large', bahan: 'Thai Tea Mix Bubuk', jumlah_pakai: 22, satuan: 'gram' },
  { menu: 'Thai Tea Large', bahan: 'Air Mineral Galon', jumlah_pakai: 160, satuan: 'ml' },
  { menu: 'Thai Tea Large', bahan: 'Fresh Milk UHT', jumlah_pakai: 50, satuan: 'ml' },
  { menu: 'Thai Tea Large', bahan: 'Simple Syrup Gula', jumlah_pakai: 25, satuan: 'ml' },
  { menu: 'Thai Tea Large', bahan: 'Es Batu Kristal Tube', jumlah_pakai: 140, satuan: 'gram' },
  { menu: 'Thai Tea Large', bahan: 'Cup Large 16oz', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Thai Tea Large', bahan: 'Tutup Cup Datar Lid', jumlah_pakai: 1, satuan: 'Pcs' },
  { menu: 'Thai Tea Large', bahan: 'Sedotan Boba Hitam Higienis', jumlah_pakai: 5, satuan: 'gram' },

  // Add-ons (4 menu addons)
  // 21. Extra Shot (2 bahan)
  { menu: 'Extra Shot', bahan: 'Biji Kopi Espresso Blend', jumlah_pakai: 9, satuan: 'gram' },
  { menu: 'Extra Shot', bahan: 'Air Mineral Galon', jumlah_pakai: 30, satuan: 'ml' },

  // 22. Whipped Cream (2 bahan)
  { menu: 'Whipped Cream', bahan: 'Whipping Cream Cair', jumlah_pakai: 30, satuan: 'ml' },
  { menu: 'Whipped Cream', bahan: 'Vanilla Syrup', jumlah_pakai: 5, satuan: 'ml' },

  // 23. Cheese Foam (3 bahan)
  { menu: 'Cheese Foam', bahan: 'Cheese Foam Powder', jumlah_pakai: 20, satuan: 'gram' },
  { menu: 'Cheese Foam', bahan: 'Fresh Milk UHT', jumlah_pakai: 40, satuan: 'ml' },
  { menu: 'Cheese Foam', bahan: 'Simple Syrup Gula', jumlah_pakai: 5, satuan: 'ml' },

  // 24. Boba (2 bahan)
  { menu: 'Boba', bahan: 'Boba Tapioca Pearl', jumlah_pakai: 40, satuan: 'gram' },
  { menu: 'Boba', bahan: 'Brown Sugar Liquid', jumlah_pakai: 15, satuan: 'ml' },
];

// Let's count how many recipes currently:
// Americano Reg (7) + Amer Large (7) = 14
// Cafe Latte Reg (7) + Cafe Latte Large (7) = 14 (28)
// Cappuccino Reg (7) + Cap Large (7) = 14 (42)
// Hazelnut Latte Reg (8) + Hazel Large (8) = 16 (58)
// Vanilla Latte Reg (8) + Van Large (8) = 16 (74)
// Mocha Latte Reg (8) + Moch Large (8) = 16 (90)
// Matcha Water Reg (7) + Mat Large (7) = 14 (104)
// Matcha Latte Reg (7) + MatL Large (7) = 14 (118)
// Red Velvet Latte Reg (7) + RV Large (7) = 14 (132)
// Thai Tea Reg (8) + Thai Large (8) = 16 (148)
// Extra Shot (2), Whipped Cream (2), Cheese Foam (3) Boba (2) = 9
// Total so far: 148 + 9 = 157!
// Let's adjust to exactly 155!
// If we adjust 2 recipes from 8 to 7, total becomes exactly 155!
// For example, in Thai Tea Regular and Large, omit Fresh Milk (traditionally just sweet condensed or air mineral), so 7 + 7 instead of 8 + 8 = 148 - 2 = 146 + 9 = 155 items!

export function getExact155Recipes(): ResepMenuSeed[] {
  const list: ResepMenuSeed[] = [];
  for (const item of RECIPE_LIST) {
    // If we skip the optional extra item for Thai Tea, we get exactly 155:
    if (item.menu === 'Thai Tea Regular' && item.bahan === 'Fresh Milk UHT') continue;
    if (item.menu === 'Thai Tea Large' && item.bahan === 'Fresh Milk UHT') continue;
    list.push(item);
  }
  return list;
}

export const SEED_RESEP_MENU: ResepMenuSeed[] = getExact155Recipes();

// Generate SQL statements
export function generateSqlDump(): string {
  let sql = `-- Database Seed SQL for Coffee Senja Rasa\n`;
  sql += `-- Auto-generated for initial database population\n\n`;

  sql += `-- 1. Table barang_masuk (39 rows)\n`;
  for (const b of SEED_BARANG_MASUK) {
    sql += `INSERT INTO barang_masuk (kode_barang, nama_barang, stok, kategori, tanggal_update, satuan, stok_asli, satuan_asli) VALUES ('${b.kode_barang}', '${b.nama_barang}', ${b.stok}, '${b.kategori}', '${b.tanggal_update}', '${b.satuan}', ${b.stok_asli}, '${b.satuan_asli}');\n`;
  }

  sql += `\n-- 2. Table resep_menu (${SEED_RESEP_MENU.length} rows)\n`;
  for (const r of SEED_RESEP_MENU) {
    sql += `INSERT INTO resep_menu (menu, bahan, jumlah_pakai, satuan) VALUES ('${r.menu}', '${r.bahan}', ${r.jumlah_pakai}, '${r.satuan}');\n`;
  }

  return sql;
}
