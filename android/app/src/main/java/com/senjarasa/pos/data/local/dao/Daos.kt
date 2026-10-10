package com.senjarasa.pos.data.local.dao

import androidx.room.*
import com.senjarasa.pos.data.local.entity.BarangMasuk
import com.senjarasa.pos.data.local.entity.BarangKeluar
import com.senjarasa.pos.data.local.entity.ResepMenu
import com.senjarasa.pos.data.local.entity.Transaksi
import kotlinx.coroutines.flow.Flow

@Dao
interface BarangMasukDao {
    @Query("SELECT * FROM barang_masuk ORDER BY id ASC")
    fun getAll(): Flow<List<BarangMasuk>>

    @Query("SELECT * FROM barang_masuk WHERE id = :id LIMIT 1")
    suspend fun getById(id: Long): BarangMasuk?

    @Query("SELECT * FROM barang_masuk WHERE nama_barang = :nama LIMIT 1")
    suspend fun getByNama(nama: String): BarangMasuk?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: BarangMasuk): Long

    @Update
    suspend fun update(item: BarangMasuk)

    @Delete
    suspend fun delete(item: BarangMasuk)

    @Query("UPDATE barang_masuk SET stok = stok + :tambahStok, stok_asli = stok_asli + :tambahStokAsli, tanggal_update = :tanggal WHERE id = :id")
    suspend fun tambahStok(id: Long, tambahStok: Int, tambahStokAsli: Double, tanggal: String)

    @Query("UPDATE barang_masuk SET stok_asli = MAX(0.0, stok_asli - :jumlah) WHERE nama_barang = :namaBarang")
    suspend fun kurangiStokAsli(namaBarang: String, jumlah: Double)
}

@Dao
interface BarangKeluarDao {
    @Query("SELECT * FROM barang_keluar ORDER BY id DESC")
    fun getAll(): Flow<List<BarangKeluar>>

    @Insert
    suspend fun insert(item: BarangKeluar): Long
}

@Dao
interface ResepMenuDao {
    @Query("SELECT * FROM resep_menu ORDER BY menu ASC, id ASC")
    fun getAll(): Flow<List<ResepMenu>>

    @Query("SELECT * FROM resep_menu WHERE menu = :menu")
    suspend fun getByMenu(menu: String): List<ResepMenu>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: ResepMenu): Long

    @Update
    suspend fun update(item: ResepMenu)

    @Delete
    suspend fun delete(item: ResepMenu)
}

@Dao
interface TransaksiDao {
    @Query("SELECT * FROM transaksi ORDER BY id DESC")
    fun getAll(): Flow<List<Transaksi>>

    @Query("SELECT * FROM transaksi WHERE tanggal >= :dari AND tanggal <= :sampai ORDER BY id DESC")
    fun getFiltered(dari: String, sampai: String): Flow<List<Transaksi>>

    @Insert
    suspend fun insert(item: Transaksi): Long

    @Insert
    suspend fun insertAll(items: List<Transaksi>)
}
