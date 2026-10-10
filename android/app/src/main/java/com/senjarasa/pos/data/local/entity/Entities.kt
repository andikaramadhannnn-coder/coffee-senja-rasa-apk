package com.senjarasa.pos.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "barang_masuk")
data class BarangMasuk(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val kode_barang: String,
    val nama_barang: String,
    val stok: Int,
    val kategori: String, // Kopi, Susu, Syrup, Sauce, Powder, Tea, Pendukung, Kemasan, Operasional
    val tanggal_update: String, // yyyy-MM-dd
    val satuan: String, // Pack, Liter, Kaleng, Botol, Galon, Kg, Pcs, Box
    val stok_asli: Double,
    val satuan_asli: String
)

@Entity(tableName = "barang_keluar")
data class BarangKeluar(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val nama_barang: String,
    val jumlah: Double,
    val satuan: String,
    val keterangan: String,
    val tanggal: String // yyyy-MM-dd HH:mm:ss
)

@Entity(tableName = "resep_menu")
data class ResepMenu(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val menu: String,
    val bahan: String,
    val jumlah_pakai: Double,
    val satuan: String
)

@Entity(tableName = "transaksi")
data class Transaksi(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val nama_menu: String,
    val jumlah: Int,
    val harga: Double,
    val subtotal: Double,
    val tanggal: String, // yyyy-MM-dd HH:mm:ss
    val kategori: String, // Coffee, Non Coffee
    val kasir: String = "Admin",
    val no_transaksi: String
)
