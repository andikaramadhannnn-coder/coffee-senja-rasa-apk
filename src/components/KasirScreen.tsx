import React, { useState } from 'react';
import {
  Coffee,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Sparkles,
  ShoppingBag,
  Check,
  RotateCcw
} from 'lucide-react';
import {
  CartItem,
  MenuName,
  Ukuran,
  AddOn
} from '../types/database';
import {
  MENU_PRICES,
  ADDON_PRICES,
  formatRupiah
} from '../services/db';

interface KasirScreenProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onProceedToPayment: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  isTabletView: boolean;
}

const MENU_LIST: { name: MenuName; desc: string; kategori: 'Coffee' | 'Non Coffee' }[] = [
  { name: 'Americano', desc: 'Espresso murni dipadukan air segar', kategori: 'Coffee' },
  { name: 'Coffee Latte', desc: 'Espresso lembut berpadu susu fresh steamed', kategori: 'Coffee' },
  { name: 'Cappuccino', desc: 'Espresso dengan foam susu tebal & taburan kakao', kategori: 'Coffee' },
  { name: 'Hazelnut Latte', desc: 'Latte aromatik dengan syrup hazelnut manis gurih', kategori: 'Coffee' },
  { name: 'Vanilla Latte', desc: 'Perpaduan klasik espresso susu dengan aroma vanilla', kategori: 'Coffee' },
  { name: 'Mocha Latte', desc: 'Kombinasi espresso, susu creamy & saus cokelat dark', kategori: 'Coffee' },
  { name: 'Matcha', desc: 'Teh hijau murni Jepang yang segar & menyegarkan', kategori: 'Non Coffee' },
  { name: 'Matcha Latte', desc: 'Bubuk matcha murni dengan susu segar lembut', kategori: 'Non Coffee' },
  { name: 'Red Velvet', desc: 'Minuman manis gurih red velvet dengan susu kental', kategori: 'Non Coffee' },
  { name: 'Thai Tea', desc: 'Seduhan teh rempah khas Thailand berpadu susu kental', kategori: 'Non Coffee' }
];

const ADDONS: { name: AddOn; price: number }[] = [
  { name: 'Extra Shot', price: 5000 },
  { name: 'Whipped Cream', price: 5000 },
  { name: 'Cheese Foam', price: 7000 },
  { name: 'Boba', price: 5000 }
];

export const KasirScreen: React.FC<KasirScreenProps> = ({
  cart,
  setCart,
  onProceedToPayment,
  showToast,
  isTabletView
}) => {
  // Current selection state
  const [selectedMenu, setSelectedMenu] = useState<MenuName>('Americano');
  const [selectedUkuran, setSelectedUkuran] = useState<Ukuran>('Regular');
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [kategoriFilter, setKategoriFilter] = useState<'Semua' | 'Coffee' | 'Non Coffee'>('Semua');

  // Calculate unit price for current selection
  const basePrice = MENU_PRICES[selectedMenu][selectedUkuran];
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + ADDON_PRICES[item], 0);
  const unitPrice = basePrice + addOnsTotal;
  const currentSubtotal = unitPrice * quantity;

  // Total cart
  const cartTotal = cart.reduce((acc, cur) => acc + cur.subtotal, 0);

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOn) ? prev.filter((a) => a !== addOn) : [...prev, addOn]
    );
  };

  const handleAddToCart = () => {
    if (quantity <= 0) {
      showToast('Jumlah pesanan minimal 1 cup!', 'error');
      return;
    }

    const newItem: CartItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      menu: selectedMenu,
      ukuran: selectedUkuran,
      addOns: [...selectedAddOns],
      jumlah: quantity,
      hargaSatuan: unitPrice,
      subtotal: currentSubtotal
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`Ditambahkan: ${selectedMenu} ${selectedUkuran} (${quantity}x)`, 'success');

    // Reset selection to default for quick next entry
    setQuantity(1);
    setSelectedAddOns([]);
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    showToast('Item berhasil dihapus dari keranjang', 'info');
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    showToast('Keranjang pesanan telah dikosongkan', 'info');
  };

  const filteredMenus = MENU_LIST.filter(
    (m) => kategoriFilter === 'Semua' || m.kategori === kategoriFilter
  );

  return (
    <div
      className={`grid gap-6 ${
        isTabletView ? 'grid-cols-12' : 'grid-cols-1'
      }`}
    >
      {/* LEFT COLUMN: Menu Selection, Size, Addons, & Qty */}
      <div className={isTabletView ? 'col-span-7 lg:col-span-8 space-y-6' : 'space-y-6'}>
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['Semua', 'Coffee', 'Non Coffee'] as const).map((kat) => (
            <button
              key={kat}
              onClick={() => setKategoriFilter(kat)}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shrink-0 cursor-pointer ${
                kategoriFilter === kat
                  ? 'bg-[#6F4E37] text-white shadow-md'
                  : 'bg-white text-[#6F4E37] border border-[#E2CFBD] hover:bg-[#F5EBDD]'
              }`}
            >
              {kat === 'Semua' ? 'Semua Menu' : kat}
            </button>
          ))}
        </div>

        {/* Menu Grid (Touch friendly cards) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#3D2817] flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#6F4E37]" />
              <span>1. Pilih Menu Minuman</span>
            </h3>
            <span className="text-xs text-[#8B6E58] font-medium">
              Ketuk untuk memilih
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
            {filteredMenus.map((item) => {
              const isSelected = selectedMenu === item.name;
              const priceReg = MENU_PRICES[item.name].Regular;
              const priceLrg = MENU_PRICES[item.name].Large;
              return (
                <button
                  key={item.name}
                  onClick={() => setSelectedMenu(item.name)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF2E8] border-[#6F4E37] shadow-md ring-2 ring-[#6F4E37]'
                      : 'bg-white border-[#E6D7C3] hover:border-[#8B5A2B] hover:bg-[#FFFBF7]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#6F4E37] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mb-1.5 ${
                        item.kategori === 'Coffee'
                          ? 'bg-[#EBDDCF] text-[#4A2E1B]'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.kategori}
                    </span>
                    <h4 className="font-bold text-sm text-[#3D2817] line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#8B6E58] line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#EBDDCF]/60 flex items-center justify-between text-xs">
                    <span className="text-[#8B6E58] text-[10px]">Mulai</span>
                    <span className="font-bold text-[#6F4E37]">
                      {formatRupiah(priceReg)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Customization Section: Ukuran, Add On, & Jumlah */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#E6D7C3] shadow-sm space-y-6">
          {/* Selected Preview Heading */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#EBDDCF]">
            <div>
              <span className="text-xs font-bold text-[#8B6E58] uppercase">Menu Terpilih:</span>
              <h3 className="text-xl font-extrabold text-[#3D2817]">{selectedMenu}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#8B6E58]">Harga Satuan Item:</span>
              <p className="text-lg font-bold text-[#6F4E37]">{formatRupiah(unitPrice)}</p>
            </div>
          </div>

          {/* 2. Pilih Ukuran (Regular / Large) */}
          <div>
            <label className="block text-sm font-bold text-[#3D2817] mb-2.5">
              2. Pilih Ukuran Cup
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Regular', 'Large'] as const).map((size) => {
                const isSelected = selectedUkuran === size;
                const price = MENU_PRICES[selectedMenu][size];
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedUkuran(size)}
                    className={`py-3.5 px-4 rounded-2xl border font-bold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-md'
                        : 'bg-[#FAF5EE] text-[#3D2817] border-[#D9C3AD] hover:bg-[#F2E5D5]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{size}</span>
                      <span className="text-xs opacity-75">
                        {size === 'Regular' ? '(12oz)' : '(16oz)'}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold">
                      {formatRupiah(price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Add On (Checkbox) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-[#3D2817]">
                3. Tambahan (Add On)
              </label>
              <span className="text-xs text-[#8B6E58]">Bisa pilih lebih dari satu</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ADDONS.map((addon) => {
                const isChecked = selectedAddOns.includes(addon.name);
                return (
                  <button
                    key={addon.name}
                    type="button"
                    onClick={() => toggleAddOn(addon.name)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[74px] ${
                      isChecked
                        ? 'bg-[#FAF2E8] border-[#6F4E37] ring-2 ring-[#6F4E37]'
                        : 'bg-[#FAF5EE] border-[#D9C3AD] hover:bg-[#F2E5D5]'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <span className="text-xs font-bold text-[#3D2817]">
                        {addon.name}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-[#6F4E37] border-[#6F4E37] text-white'
                            : 'border-[#A89485] bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#6F4E37] mt-1">
                      +{formatRupiah(addon.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Jumlah & Tombol Tambah ke Pesanan */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Stepper Jumlah */}
            <div className="flex items-center justify-between sm:justify-start gap-3 bg-[#FAF5EE] border border-[#D9C3AD] rounded-2xl p-2 px-3">
              <span className="text-xs font-bold text-[#6F4E37] uppercase mr-2">Jumlah</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#D9C3AD] text-[#6F4E37] hover:bg-[#EBDCCB] active:scale-95 flex items-center justify-center font-bold shadow-sm cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center font-extrabold text-lg text-[#3D2817] bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-xl bg-[#6F4E37] text-white hover:bg-[#5A3E2B] active:scale-95 flex items-center justify-center font-bold shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tombol Tambah ke Pesanan Besar */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-4 px-6 rounded-2xl bg-[#6F4E37] hover:bg-[#5A3E2B] active:scale-[0.98] text-white font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-amber-200" />
              <span>Tambah ke Pesanan • {formatRupiah(currentSubtotal)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Cart Summary & Pay (Sticky on Tablet) */}
      <div className={isTabletView ? 'col-span-5 lg:col-span-4' : 'space-y-4'}>
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#E6D7C3] shadow-md sticky top-24 flex flex-col justify-between max-h-[calc(100vh-120px)]">
          {/* Header Keranjang */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#EBDDCF]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#6F4E37]" />
                <h3 className="font-extrabold text-lg text-[#3D2817]">Keranjang Pesanan</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F5EBDD] text-[#6F4E37]">
                  {cart.length} Item
                </span>
                {cart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    title="Kosongkan Keranjang"
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* List Item Keranjang */}
            <div className="divide-y divide-[#F2E5D5] overflow-y-auto max-h-[340px] pr-1 mt-2">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-[#8B6E58]">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-[#C4AC97] mb-2" />
                  <p className="font-semibold text-sm">Keranjang masih kosong</p>
                  <p className="text-xs mt-1">Pilih menu di samping lalu tekan Tambah</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-start justify-between gap-3 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#3D2817]">
                          {item.menu}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.2 rounded-md bg-[#FAF5EE] text-[#6F4E37] border border-[#E6D7C3]">
                          {item.ukuran}
                        </span>
                      </div>

                      {item.addOns.length > 0 && (
                        <div className="text-[11px] text-[#8B6E58] mt-0.5">
                          + {item.addOns.join(', ')}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-1 text-xs text-[#8B6E58]">
                        <span>{item.jumlah}x @ {formatRupiah(item.hargaSatuan)}</span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="font-extrabold text-sm text-[#3D2817]">
                        {formatRupiah(item.subtotal)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors mt-1"
                        title="Hapus Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Total & Bayar */}
          <div className="pt-4 border-t border-[#EBDDCF] mt-4 space-y-4">
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold text-[#8B6E58]">TOTAL PESANAN</span>
              <span className="text-2xl font-black text-[#6F4E37]">
                {formatRupiah(cartTotal)}
              </span>
            </div>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={onProceedToPayment}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer ${
                cart.length > 0
                  ? 'bg-gradient-to-r from-[#6F4E37] to-[#4A2E1B] hover:from-[#5A3E2B] hover:to-[#3E2723] text-white active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <CreditCard className="w-5 h-5 text-amber-300" />
              <span>BAYAR SEKARANG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
