import 'dart:convert';
import 'package:flutter/material.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints.dart';
import '../models/community_win_model.dart';

class CommunityProvider with ChangeNotifier {
  List<CommunityWin> _wins = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<CommunityWin> get wins => _wins;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchWins() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.get(Endpoints.communityWins);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List) {
          _wins = data.map((w) => CommunityWin.fromJson(w as Map<String, dynamic>)).toList();
        } else if (data is Map && data['data'] is List) {
          _wins = (data['data'] as List).map((w) => CommunityWin.fromJson(w as Map<String, dynamic>)).toList();
        }
      } else {
        _errorMessage = 'Failed to load community wins (${response.statusCode})';
      }
    } catch (e) {
      _errorMessage = 'Could not load community feed. Check your connection.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> postWin({
    required String title,
    required String achievement,
    String? salesAmount,
    String? technique,
    String? imageUrl,
  }) async {
    try {
      final response = await ApiClient.post(
        Endpoints.communityWins,
        body: {
          'title': title,
          'achievement': achievement,
          if (salesAmount != null && salesAmount.isNotEmpty) 'salesAmount': salesAmount,
          if (technique != null && technique.isNotEmpty) 'technique': technique,
          if (imageUrl != null && imageUrl.isNotEmpty) 'imageUrl': imageUrl,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        await fetchWins();
        return true;
      }
    } catch (_) {}
    return false;
  }

  Future<void> likeWin(String winId) async {
    try {
      final response = await ApiClient.post('${Endpoints.communityWins}/$winId/like');
      if (response.statusCode == 200) {
        await fetchWins();
      }
    } catch (_) {}
  }

  Future<bool> commentWin(String winId, String text) async {
    try {
      final response = await ApiClient.post(
        '${Endpoints.communityWins}/$winId/comment',
        body: {'text': text},
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        await fetchWins();
        return true;
      }
    } catch (_) {}
    return false;
  }
}
