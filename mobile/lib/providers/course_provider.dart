import 'dart:convert';
import 'package:flutter/material.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints.dart';
import '../core/utils/level_helper.dart';
import '../models/course_model.dart';
import '../models/student_stats_model.dart';

class CourseProvider with ChangeNotifier {
  List<Course> _courses = [];
  Course? _selectedCourse;
  bool _isLoading = false;
  String? _errorMessage;

  List<Course> get courses => _courses;
  Course? get selectedCourse => _selectedCourse;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchCourses() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.get(Endpoints.courses);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List) {
          _courses = data.map((c) => Course.fromJson(c as Map<String, dynamic>)).toList();
        }
      } else {
        _errorMessage = 'Failed to load courses (${response.statusCode})';
      }
    } catch (e) {
      _errorMessage = 'Could not load courses. Check your connection.';
    }

    _isLoading = false;
    notifyListeners();
  }

  void selectCourse(Course course) {
    _selectedCourse = course;
    notifyListeners();
  }

  /// Mirror of isCourseUnlocked in web student/courses/page.tsx
  bool isCourseUnlocked(Course course, StudentStats? stats, String? userLevel) {
    if (stats == null) return false;

    // Direct enrollment check
    final isEnrolled = stats.courses.any((sc) {
      if (sc is Map) return sc['id']?.toString().toLowerCase() == course.id.toString().toLowerCase();
      return false;
    });
    if (isEnrolled) return true;

    // Standalone course (without level tier) requires direct purchase
    final lvl = course.levelCode;
    if (lvl == null || lvl.isEmpty || lvl.toUpperCase() == 'NONE') {
      return false;
    }

    // Check level membership & expiry
    if (stats.isExpired) return false;
    final effectiveLevel = stats.membershipLevel.isNotEmpty ? stats.membershipLevel : (userLevel ?? 'GENERAL');
    final studentLevelCode = LevelHelper.getLevelCode(effectiveLevel);
    if (studentLevelCode == 'GENERAL') return false;

    final studentRankNum = LevelHelper.getLevelOrder(studentLevelCode);
    final requiredNum = LevelHelper.getLevelOrder(lvl.toUpperCase());
    return studentRankNum >= requiredNum;
  }
}
