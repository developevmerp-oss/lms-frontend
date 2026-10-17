import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints.dart';
import '../models/student_stats_model.dart';
import '../models/sales_record_model.dart';
import '../models/installment_model.dart';

class StatsProvider with ChangeNotifier {
  StudentStats? _stats;
  List<InstallmentPlan> _installmentPlans = [];
  List<LevelTier> _liveTiers = [];
  List<dynamic> _campaignOffers = [];
  bool _isLoading = false;
  String? _errorMessage;

  StudentStats? get stats => _stats;
  List<InstallmentPlan> get installmentPlans => _installmentPlans;
  List<LevelTier> get liveTiers => _liveTiers;
  List<dynamic> get campaignOffers => _campaignOffers;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Local daily routine habit keys (A-F)
  List<String> _todayCompletedHabits = [];
  List<String> get todayCompletedHabits => _todayCompletedHabits;

  String get _todayRoutineKey {
    final now = DateTime.now();
    final y = now.year.toString().padLeft(4, '0');
    final m = now.month.toString().padLeft(2, '0');
    final d = now.day.toString().padLeft(2, '0');
    return 'routine_${y}_${m}_$d';
  }

  Future<void> fetchStudentDashboard({bool silent = false}) async {
    if (!silent) {
      _isLoading = true;
      _errorMessage = null;
      notifyListeners();
    }

    await loadTodayHabitsFromStorage();

    try {
      final response = await ApiClient.get(Endpoints.studentDashboard);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _stats = StudentStats.fromJson(data);
      } else {
        _errorMessage = 'Failed to load dashboard data (${response.statusCode})';
      }
    } catch (e) {
      _errorMessage = 'Could not load student stats. Check your connection.';
    }

    // Also fetch installments and levels in parallel/sequence
    await fetchInstallments();
    await fetchLevelsAndOffers();

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchInstallments() async {
    try {
      final response = await ApiClient.get(Endpoints.myInstallments);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['plans'] is List) {
          _installmentPlans = (data['plans'] as List)
              .map((p) => InstallmentPlan.fromJson(p as Map<String, dynamic>))
              .toList();
          notifyListeners();
        }
      }
    } catch (_) {}
  }

  Future<void> fetchLevelsAndOffers() async {
    try {
      final resLevels = await ApiClient.get(Endpoints.levels);
      if (resLevels.statusCode == 200) {
        final data = jsonDecode(resLevels.body);
        if (data is List) {
          _liveTiers = data.map((t) => LevelTier.fromJson(t as Map<String, dynamic>)).toList();
        }
      }

      final resOffers = await ApiClient.get(Endpoints.offers);
      if (resOffers.statusCode == 200) {
        final data = jsonDecode(resOffers.body);
        if (data is List) {
          _campaignOffers = data;
        } else if (data is Map && data['offers'] is List) {
          _campaignOffers = data['offers'];
        }
      }
      notifyListeners();
    } catch (_) {}
  }

  // Daily Routine local management & backend sync (+10 XP)
  Future<void> loadTodayHabitsFromStorage() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_todayRoutineKey);
    _todayCompletedHabits = list ?? [];
    notifyListeners();
  }

  Future<void> toggleHabit(String habitId) async {
    final updated = List<String>.from(_todayCompletedHabits);
    if (updated.contains(habitId)) {
      updated.remove(habitId);
    } else {
      updated.add(habitId);
    }
    _todayCompletedHabits = updated;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_todayRoutineKey, updated);
    notifyListeners();

    // If all 6 habits completed (mindset, goal_card, affirmations, write_goals, social_media, connect_within), sync to backend
    if (updated.length >= 6) {
      await _syncRoutineWithBackend(updated);
    }
  }

  Future<String?> _syncRoutineWithBackend(List<String> habits) async {
    try {
      final now = DateTime.now();
      final dateStr = '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
      final response = await ApiClient.post(
        Endpoints.studentRoutine,
        body: {
          'completedHabits': habits,
          'date': dateStr,
        },
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // Silently refresh stats to show updated streak & points
        await fetchStudentDashboard(silent: true);
        return data['message'] ?? '+10 XP recorded!';
      }
    } catch (_) {}
    return null;
  }

  // Sales Records for Northstar (+100 XP on backend)
  Future<bool> addSale({
    required num amount,
    required String productName,
    required String date,
  }) async {
    try {
      final response = await ApiClient.post(
        Endpoints.studentSales,
        body: {
          'amount': amount,
          'productName': productName,
          'date': date,
        },
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        await fetchStudentDashboard(silent: true);
        return true;
      }
    } catch (_) {}
    return false;
  }

  Future<bool> deleteSale(String saleId) async {
    try {
      final response = await ApiClient.delete('${Endpoints.studentSales}/$saleId');
      if (response.statusCode == 200) {
        await fetchStudentDashboard(silent: true);
        return true;
      }
    } catch (_) {}
    return false;
  }

  // Portfolio artwork submission
  Future<bool> submitPortfolio({
    required String title,
    required String technique,
    required String imageUrl,
  }) async {
    try {
      final response = await ApiClient.post(
        Endpoints.portfolio,
        body: {
          'title': title,
          'technique': technique,
          'imageUrl': imageUrl,
        },
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        await fetchStudentDashboard(silent: true);
        return true;
      }
    } catch (_) {}
    return false;
  }
}
