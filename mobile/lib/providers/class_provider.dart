import 'dart:convert';
import 'package:flutter/material.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints.dart';
import '../models/live_class_model.dart';

class ClassProvider with ChangeNotifier {
  List<LiveClass> _classes = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<LiveClass> get classes => _classes;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  List<LiveClass> get upcomingClasses {
    final now = DateTime.now();
    return _classes.where((c) {
      if (c.status == 'live') return true;
      try {
        final date = DateTime.parse(c.scheduledAt);
        return date.isAfter(now);
      } catch (_) {
        return false;
      }
    }).toList();
  }

  List<LiveClass> get pastClasses {
    final now = DateTime.now();
    return _classes.where((c) {
      if (c.status == 'live') return false;
      try {
        final date = DateTime.parse(c.scheduledAt);
        return date.isBefore(now);
      } catch (_) {
        return true;
      }
    }).toList();
  }

  Future<void> fetchClasses() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.get(Endpoints.classes);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['data'] is List) {
          _classes = (data['data'] as List).map((c) => LiveClass.fromJson(c as Map<String, dynamic>)).toList();
        } else if (data is List) {
          _classes = data.map((c) => LiveClass.fromJson(c as Map<String, dynamic>)).toList();
        }
      } else {
        _errorMessage = 'Failed to load classes (${response.statusCode})';
      }
    } catch (e) {
      _errorMessage = 'Could not load classes. Check your connection.';
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Join class to record attendance (+50 XP) and retrieve meetingUrl
  Future<String?> joinClass(String classId, {String? fallbackUrl}) async {
    try {
      final response = await ApiClient.post(Endpoints.classJoin(classId));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        await fetchClasses(); // refresh attended state
        return data['meetingUrl']?.toString() ?? fallbackUrl;
      }
    } catch (_) {}
    return fallbackUrl;
  }
}
