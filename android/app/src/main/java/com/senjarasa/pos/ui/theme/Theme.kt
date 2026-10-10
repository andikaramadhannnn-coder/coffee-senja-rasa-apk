package com.senjarasa.pos.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val CoffeePrimary = Color(0xFF6F4E37)
val CoffeeOnPrimary = Color(0xFFFFFFFF)
val CoffeePrimaryContainer = Color(0xFFEDE0D4)
val CoffeeOnPrimaryContainer = Color(0xFF2B170B)

val CreamBackground = Color(0xFFF5EBDD)
val CreamSurface = Color(0xFFFFFBF7)
val CreamOnSurface = Color(0xFF3D2817)

val CoffeeSecondary = Color(0xFF8B5A2B)
val CoffeeTertiary = Color(0xFFC48B57)
val CoffeeError = Color(0xFFBA1A1A)

private val LightColorScheme = lightColorScheme(
    primary = CoffeePrimary,
    onPrimary = CoffeeOnPrimary,
    primaryContainer = CoffeePrimaryContainer,
    onPrimaryContainer = CoffeeOnPrimaryContainer,
    secondary = CoffeeSecondary,
    background = CreamBackground,
    surface = CreamSurface,
    onBackground = CreamOnSurface,
    onSurface = CreamOnSurface,
    error = CoffeeError
)

@Composable
fun CoffeeSenjaRasaTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography(),
        content = content
    )
}
