package com.senjarasa.pos.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.senjarasa.pos.data.local.entity.BarangKeluar
import com.senjarasa.pos.data.local.entity.BarangMasuk
import com.senjarasa.pos.data.local.entity.ResepMenu
import com.senjarasa.pos.data.local.entity.Transaksi
import com.senjarasa.pos.data.repository.CartItemModel
import com.senjarasa.pos.data.repository.PosRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class PosViewModel(private val repository: PosRepository) : ViewModel() {

    val barangMasukList: StateFlow<List<BarangMasuk>> = repository.allBarangMasuk
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val barangKeluarList: StateFlow<List<BarangKeluar>> = repository.allBarangKeluar
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val resepMenuList: StateFlow<List<ResepMenu>> = repository.allResepMenu
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val transaksiList: StateFlow<List<Transaksi>> = repository.allTransaksi
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _cartItems = MutableStateFlow<List<CartItemModel>>(emptyList())
    val cartItems: StateFlow<List<CartItemModel>> = _cartItems

    fun addToCart(item: CartItemModel) {
        _cartItems.value = _cartItems.value + item
    }

    fun removeFromCart(index: Int) {
        val current = _cartItems.value.toMutableList()
        if (index in current.indices) {
            current.removeAt(index)
            _cartItems.value = current
        }
    }

    fun clearCart() {
        _cartItems.value = emptyList()
    }

    fun bayarPesanan(
        onSuccess: (noTransaksi: String) -> Unit,
        onError: (message: String) -> Unit
    ) {
        val currentCart = _cartItems.value
        if (currentCart.isEmpty()) {
            onError("Keranjang belanja kosong!")
            return
        }

        viewModelScope.launch {
            try {
                val noTrx = repository.prosesPembayaranAtomic(currentCart, "Admin")
                clearCart()
                onSuccess(noTrx)
            } catch (e: Exception) {
                onError("Gagal bayar: ${e.message}")
            }
        }
    }

    fun tambahBarangMasuk(item: BarangMasuk) {
        viewModelScope.launch {
            repository.insertBarangMasuk(item)
        }
    }

    fun tambahStok(id: Long, stokBeli: Int, stokAsli: Double) {
        viewModelScope.launch {
            repository.tambahStok(id, stokBeli, stokAsli)
        }
    }

    fun hapusBarangMasuk(item: BarangMasuk) {
        viewModelScope.launch {
            repository.deleteBarangMasuk(item)
        }
    }

    fun catatBarangKeluar(item: BarangKeluar) {
        viewModelScope.launch {
            repository.insertBarangKeluarManual(item)
        }
    }

    fun simpanResep(item: ResepMenu) {
        viewModelScope.launch {
            repository.insertResepMenu(item)
        }
    }

    fun hapusResep(item: ResepMenu) {
        viewModelScope.launch {
            repository.deleteResepMenu(item)
        }
    }
}
