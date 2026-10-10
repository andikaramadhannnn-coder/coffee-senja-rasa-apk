package com.senjarasa.pos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.senjarasa.pos.data.repository.CartItemModel
import com.senjarasa.pos.ui.theme.*
import com.senjarasa.pos.ui.viewmodel.PosViewModel

// 1. LOGIN SCREEN
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit
) {
    var userId by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(CreamBackground),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .wrapContentHeight(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(8.dp)
        ) {
            Column(
                modifier = Modifier.padding(28.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    imageVector = Icons.Default.Coffee,
                    contentDescription = null,
                    tint = CoffeePrimary,
                    modifier = Modifier.size(64.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Coffee Senja Rasa",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = CreamOnSurface
                )
                Text(
                    text = "Temani Senja Dalam Setiap Rasa",
                    fontSize = 12.sp,
                    color = Color(0xFF8B6E58)
                )

                if (errorMessage.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = errorMessage,
                        color = MaterialTheme.colorScheme.error,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))
                OutlinedTextField(
                    value = userId,
                    onValueChange = { userId = it; errorMessage = "" },
                    label = { Text("ID Pengguna") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it; errorMessage = "" },
                    label = { Text("Password") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(24.dp))
                Button(
                    onClick = {
                        if (userId == "admin" && password == "123") {
                            onLoginSuccess()
                        } else {
                            errorMessage = "ID atau Password Salah!"
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = CoffeePrimary)
                ) {
                    Text("Masuk", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

// 2. DASHBOARD SCREEN
@Composable
fun DashboardScreen(
    onNavigate: (String) -> Unit,
    onLogout: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CreamBackground)
            .padding(16.dp)
    ) {
        // App Header
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = CoffeePrimary)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Coffee Senja Rasa",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "Temani Senja Dalam Setiap Rasa • Offline POS",
                    fontSize = 13.sp,
                    color = Color.White.copy(alpha = 0.8f)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Tombol Menu Besar
        val menus = listOf(
            Triple("Kasir", "kasir", Icons.Default.ShoppingCart),
            Triple("Barang Masuk", "barang_masuk", Icons.Default.AddBox),
            Triple("Barang Keluar", "barang_keluar", Icons.Default.IndeterminateCheckBox),
            Triple("Resep Menu", "resep_menu", Icons.Default.MenuBook),
            Triple("Laporan Penjualan", "laporan", Icons.Default.Assessment),
            Triple("Informasi Penjualan", "informasi", Icons.Default.Info),
            Triple("Keluar", "keluar", Icons.Default.ExitToApp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(menus) { (title, route, icon) ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(68.dp)
                        .clickable {
                            if (route == "keluar") onLogout() else onNavigate(route)
                        },
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 20.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = icon,
                            contentDescription = null,
                            tint = if (route == "keluar") Color.Red else CoffeePrimary,
                            modifier = Modifier.size(32.dp)
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(
                            text = title,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (route == "keluar") Color.Red else CreamOnSurface
                        )
                    }
                }
            }
        }
    }
}
