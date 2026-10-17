import 'dart:convert';
import 'package:flutter/material.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints.dart';
import '../core/storage/token_storage.dart';
import '../models/user_model.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = true;
  String? _errorMessage;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    checkAuth();
  }

  Future<void> checkAuth() async {
    _isLoading = true;
    notifyListeners();

    final token = await TokenStorage.getToken();
    if (token != null && token.isNotEmpty) {
      try {
        final response = await ApiClient.get(Endpoints.me);
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          final userMap = data['user'] ?? data;
          _user = User.fromJson(userMap);
          await TokenStorage.saveUser(jsonEncode(_user!.toJson()));
        } else {
          // Token expired or invalid
          await TokenStorage.clear();
          _user = null;
        }
      } catch (e) {
        // Fallback to local stored user if offline
        final cachedUser = await TokenStorage.getUser();
        if (cachedUser != null) {
          try {
            _user = User.fromJson(jsonDecode(cachedUser));
          } catch (_) {
            _user = null;
          }
        }
      }
    } else {
      _user = null;
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.post(
        Endpoints.login,
        body: {'email': email.trim(), 'password': password},
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['token'] != null) {
        final token = data['token'];
        await TokenStorage.saveToken(token);

        final userMap = data['user'] ?? data;
        _user = User.fromJson(userMap);
        await TokenStorage.saveUser(jsonEncode(_user!.toJson()));

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = data['message'] ?? 'Invalid email or password';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Connection error: Could not reach authentication server';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String password,
    String? phone,
    String? city,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.post(
        Endpoints.register,
        body: {
          'name': name.trim(),
          'email': email.trim(),
          'password': password,
          if (phone != null && phone.isNotEmpty) 'phone': phone.trim(),
          if (city != null && city.isNotEmpty) 'city': city.trim(),
        },
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        if (data['token'] != null) {
          await TokenStorage.saveToken(data['token']);
          final userMap = data['user'] ?? data;
          _user = User.fromJson(userMap);
          await TokenStorage.saveUser(jsonEncode(_user!.toJson()));
        }
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = data['message'] ?? 'Registration failed';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Connection error: Please check your internet connection';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateProfile({
    required String name,
    String? city,
    String? phone,
    String? bio,
    String? avatarUrl,
    String? password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final body = <String, dynamic>{
        'name': name.trim(),
        if (city != null) 'city': city.trim(),
        if (phone != null) 'phone': phone.trim(),
        if (bio != null) 'bio': bio.trim(),
        if (avatarUrl != null) 'avatarUrl': avatarUrl,
        if (password != null && password.trim().length >= 6) 'password': password.trim(),
      };

      final response = await ApiClient.put(Endpoints.profile, body: body);
      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['user'] != null) {
        _user = User.fromJson(data['user']);
        await TokenStorage.saveUser(jsonEncode(_user!.toJson()));
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = data['message'] ?? 'Failed to update profile';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Connection error: Could not update profile';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<Map<String, dynamic>> requestPasswordReset(String email) async {
    try {
      final response = await ApiClient.post(
        Endpoints.forgotPassword,
        body: {'email': email.trim()},
      );
      final data = jsonDecode(response.body);
      return {
        'success': response.statusCode == 200,
        'message': data['message'] ?? (response.statusCode == 200 ? 'Reset code sent' : 'Failed to send reset code'),
        'previewOtp': data['previewOtp'],
      };
    } catch (e) {
      return {'success': false, 'message': 'Network error'};
    }
  }

  Future<Map<String, dynamic>> verifyResetPassword({
    required String email,
    required String otp,
    required String newPassword,
  }) async {
    try {
      final response = await ApiClient.post(
        Endpoints.resetPassword,
        body: {
          'email': email.trim(),
          'otp': otp.trim(),
          'newPassword': newPassword,
        },
      );
      final data = jsonDecode(response.body);
      return {
        'success': response.statusCode == 200,
        'message': data['message'] ?? (response.statusCode == 200 ? 'Password reset successfully' : 'Reset failed'),
      };
    } catch (e) {
      return {'success': false, 'message': 'Network error'};
    }
  }

  void updateUserLocally(User updated) {
    _user = updated;
    TokenStorage.saveUser(jsonEncode(updated.toJson()));
    notifyListeners();
  }

  Future<void> logout() async {
    await TokenStorage.clear();
    _user = null;
    notifyListeners();
  }
}
