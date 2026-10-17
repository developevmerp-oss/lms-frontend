import 'dart:convert';
import 'package:flutter/material.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints.dart';
import '../models/assignment_model.dart';

class TaskProvider with ChangeNotifier {
  List<Assignment> _assignments = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<Assignment> get assignments => _assignments;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchAssignments() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.get(Endpoints.studentAssignments);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List) {
          _assignments = data.map((a) => Assignment.fromJson(a as Map<String, dynamic>)).toList();
        }
      } else {
        _errorMessage = 'Failed to load assignments (${response.statusCode})';
      }
    } catch (e) {
      _errorMessage = 'Could not load assignments. Check your connection.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> submitAssignment(String assignmentId, String fileUrl) async {
    try {
      final response = await ApiClient.post(
        Endpoints.submitAssignment(assignmentId),
        body: {'fileUrl': fileUrl.trim()},
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        await fetchAssignments();
        return true;
      }
    } catch (_) {}
    return false;
  }
}
