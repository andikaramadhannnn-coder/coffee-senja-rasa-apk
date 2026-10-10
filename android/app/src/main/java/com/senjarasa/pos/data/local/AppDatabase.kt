package com.senjarasa.pos.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.senjarasa.pos.data.local.dao.BarangKeluarDao
import com.senjarasa.pos.data.local.dao.BarangMasukDao
import com.senjarasa.pos.data.local.dao.ResepMenuDao
import com.senjarasa.pos.data.local.dao.TransaksiDao
import com.senjarasa.pos.data.local.entity.BarangKeluar
import com.senjarasa.pos.data.local.entity.BarangMasuk
import com.senjarasa.pos.data.local.entity.ResepMenu
import com.senjarasa.pos.data.local.entity.Transaksi
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.BufferedReader
import java.io.InputStreamReader

@Database(
    entities = [BarangMasuk::class, BarangKeluar::class, ResepMenu::class, Transaksi::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun barangMasukDao(): BarangMasukDao
    abstract fun barangKeluarDao(): BarangKeluarDao
    abstract fun resepMenuDao(): ResepMenuDao
    abstract fun transaksiDao(): TransaksiDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "senja_rasa_database"
                )
                .addCallback(DatabaseCallback(context, scope))
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val context: Context,
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                // Jalankan tiap baris INSERT dari seed_data_awal.sql saat pertama kali database dibuat
                scope.launch(Dispatchers.IO) {
                    try {
                        val inputStream = context.assets.open("seed_data_awal.sql")
                        val reader = BufferedReader(InputStreamReader(inputStream))
                        var line: String? = reader.readLine()
                        db.beginTransaction()
                        try {
                            while (line != null) {
                                val trimmed = line.trim()
                                if (trimmed.isNotEmpty() && !trimmed.startsWith("--")) {
                                    db.execSQL(trimmed)
                                }
                                line = reader.readLine()
                            }
                            db.setTransactionSuccessful()
                        } finally {
                            db.endTransaction()
                            reader.close()
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        }
    }
}
