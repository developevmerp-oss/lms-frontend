import 'package:flutter/material.dart';

class AppTheme {
  // Brand Color Palette matching LMS Web Portal
  static const Color primary = Color(0xFFF97316);       // Vibrant Orange
  static const Color primaryOrange = Color(0xFFF97316);
  static const Color primaryDark = Color(0xFFEA580C);
  static const Color secondary = Color(0xFF0284C7);     // Electric Sky Blue
  static const Color accentGreen = Color(0xFF10B981);   // Emerald Success
  static const Color accentAmber = Color(0xFFF59E0B);   // Gold / XP Points
  static const Color accentPurple = Color(0xFF8B5CF6);  // Level Milestone
  
  // Dark luxury theme backgrounds
  static const Color bgDark = Color(0xFF020617);        // Slate 950 (matching web bg-slate-950)
  static const Color surfaceDark = Color(0xFF0F172A);   // Slate 900 (matching web bg-slate-900)
  static const Color cardDark = Color(0xFF0F172A);      // Slate 900
  static const Color borderDark = Color(0xFF1E293B);    // Slate 800 (matching web border-slate-800)
  static const Color textLight = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFFCBD5E1); // Slate 300
  static const Color textMuted = Color(0xFF64748B);     // Slate 500

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bgDark,
      primaryColor: primaryOrange,
      colorScheme: const ColorScheme.dark(
        primary: primaryOrange,
        secondary: secondary,
        surface: surfaceDark,
        onSurface: textLight,
        background: bgDark,
        onBackground: textLight,
      ),
      fontFamily: 'Roboto',
      appBarTheme: const AppBarTheme(
        backgroundColor: bgDark,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: textLight,
          fontSize: 18,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.5,
        ),
        iconTheme: IconThemeData(color: textLight),
      ),
      cardTheme: CardTheme(
        color: surfaceDark,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: borderDark, width: 1.2),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryOrange,
          foregroundColor: Colors.black,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w900,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: bgDark,
        hintStyle: const TextStyle(color: textMuted, fontSize: 13),
        labelStyle: const TextStyle(color: textMuted, fontSize: 13),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: borderDark),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: borderDark),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: primaryOrange, width: 1.5),
        ),
      ),
    );
  }
}
