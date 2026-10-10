package com.senjarasa.pos.data.repository

import androidx.room.withTransaction
import com.senjarasa.pos.data.local.AppDatabase
import com.senjarasa.pos.data.local.entity.BarangKeluar
import com.senjarasa.pos.data.local.entity.BarangMasuk
import com.senjarasa.pos.data.local.entity.ResepMenu
import com.senjarasa.pos.data.local.entity.Transaksi
import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.*

data class CartItemModel(
    val menu: String,
    val ukuran: String,
    val addOns: List<String>,
    val jumlah: Int,
    val hargaSatuan: Double,
    val subtotal: Double
)

class PosRepository(private val database: AppDatabase) {

    val allBarangMasuk: Flow<List<BarangMasuk>> = database.barangMasukDao().getAll()
    val allBarangKeluar: Flow<List<BarangKeluar>> = database.barangKeluarDao().getAll()
    val allResepMenu: Flow<List<ResepMenu>> = database.resepMenuDao().getAll()
    val allTransaksi: Flow<List<Transaksi>> = database.transaksiDao().getAll()

    fun getTransaksiFiltered(dari: String, sampai: String): Flow<List<Transaksi>> {
        return database.transaksiDao().getFiltered(dari, sampai)
    }

    suspend fun insertBarangMasuk(item: BarangMasuk): Long {
        return database.barangMasukDao().insert(item)
    }

    suspend fun updateBarangMasuk(item: BarangMasuk) {
        database.barangMasukDao().update(item)
    }

    suspend fun deleteBarangMasuk(item: BarangMasuk) {
        database.barangMasukDao().delete(item)
    }

    suspend fun tambahStok(id: Long, tambahStok: Int, tambahStokAsli: Double) {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val tanggal = dateFormat.format(Date())
        database.barangMasukDao().tambahStok(id, tambahStok, tambahStokAsli, tanggal)
    }

    suspend fun insertBarangKeluarManual(item: BarangKeluar) {
        database.withTransaction {
            database.barangKeluarDao().insert(item)
            database.barangMasukDao().kurangiStokAsli(item.nama_barang, item.jumlah)
        }
    }

    suspend fun insertResepMenu(item: ResepMenu): Long {
        return database.resepMenuDao().insert(item)
    }

    suspend fun updateResepMenu(item: ResepMenu) {
        database.resepMenuDao().update(item)
    }

    suspend fun deleteResepMenu(item: ResepMenu) {
        database.resepMenuDao().delete(item)
    }

    private fun mapMenuToResepName(menu: String, ukuran: String): String {
        val base = when (menu) {
            "Coffee Latte" -> "Cafe Latte"
            "Matcha" -> "Matcha Water"
            "Red Velvet" -> "Red Velvet Latte"
            else -> menu
        }
        return "$base $ukuran"
    }

    private fun getKategori(menuDenganUkuran: String): String {
        val coffeeList = listOf(
            "Americano", "Coffee Latte", "Cafe Latte", "Cappuccino",
            "Hazelnut Latte", "Vanilla Latte", "Mocha Latte"
        )
        return if (coffeeList.any { menuDenganUkuran.contains(it) }) "Coffee" else "Non Coffee"
    }

    /**
     * Semua operasi pembayaran dalam satu transaksi database Room (ACID atomic + rollback otomatis)
     */
    suspend fun prosesPembayaranAtomic(
        items: List<CartItemModel>,
        kasir: String = "Admin"
    ): String {
        return database.withTransaction {
            val timestamp = System.currentTimeMillis()
            val noTransaksi = "TRX$timestamp"
            val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
            val tanggalStr = dateFormat.format(Date())

            for (item in items) {
                val namaMenuFull = "${item.menu} ${item.ukuran}"
                val kategori = getKategori(namaMenuFull)

                // 1. Simpan satu baris transaksi per item keranjang
                val trx = Transaksi(
                    nama_menu = namaMenuFull,
                    jumlah = item.jumlah,
                    harga = item.hargaSatuan,
                    subtotal = item.subtotal,
                    tanggal = tanggalStr,
                    kategori = kategori,
                    kasir = kasir,
                    no_transaksi = noTransaksi
                )
                database.transaksiDao().insert(trx)

                // 2. Kurangi stok: ambil baris resep_menu dengan menu = "<nama resep> <Ukuran>"
                val namaResep = mapMenuToResepName(item.menu, item.ukuran)
                val resepList = database.resepMenuDao().getByMenu(namaResep)

                for (resep in resepList) {
                    val totalKurang = resep.jumlah_pakai * item.jumlah
                    database.barangMasukDao().kurangiStokAsli(resep.bahan, totalKurang)
                    database.barangKeluarDao().insert(
                        BarangKeluar(
                            nama_barang = resep.bahan,
                            jumlah = totalKurang,
                            satuan = resep.satuan,
                            keterangan = namaMenuFull,
                            tanggal = tanggalStr
                        )
                    )
                }

                // 3. Add-on: untuk tiap add-on yang dipilih, kurangi stok sesuai baris resep_menu
                for (addOn in item.addOns) {
                    val addOnResepList = database.resepMenuDao().getByMenu(addOn)
                    for (aoResep in addOnResepList) {
                        val totalKurangAddon = aoResep.jumlah_pakai * item.jumlah
                        database.barangMasukDao().kurangiStokAsli(aoResep.bahan, totalKurangAddon)
                        database.barangKeluarDao().insert(
                            BarangKeluar(
                                nama_barang = aoResep.bahan,
                                jumlah = totalKurangAddon,
                                satuan = aoResep.satuan,
                                keterangan = "$namaMenuFull + $addOn",
                                tanggal = tanggalStr
                            )
                        )
                    }
                }
            }

            noTransaksi
        }
    }
}
