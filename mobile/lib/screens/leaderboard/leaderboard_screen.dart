import 'dart:convert';
import 'package:flutter/material.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints.dart';
import '../../core/theme/app_theme.dart';
import '../../models/leaderboard_model.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  List<LeaderboardEntry> _entries = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchLeaderboard();
  }

  Future<void> _fetchLeaderboard() async {
    setState(() => _isLoading = true);
    try {
      final res = await ApiClient.get(Endpoints.leaderboard);
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List) {
          _entries = data.map((e) => LeaderboardEntry.fromJson(e as Map<String, dynamic>)).toList();
        }
      }
    } catch (_) {}
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    final top3 = _entries.take(3).toList();
    final rest = _entries.skip(3).toList();

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      appBar: AppBar(
        backgroundColor: AppTheme.bgDark,
        elevation: 0,
        title: const Text('Global Leaderboard', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
      ),
      body: RefreshIndicator(
        onRefresh: _fetchLeaderboard,
        color: AppTheme.primaryOrange,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryOrange))
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  const Center(
                    child: Column(
                      children: [
                        Text('🏆 Hall of Fame', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
                        SizedBox(height: 4),
                        Text('Compete with creators worldwide and earn your spot at the top', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Top 3 Podium
                  if (top3.isNotEmpty) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        // #2
                        if (top3.length > 1) _buildPodiumPlace(top3[1], rank: 2, height: 130, color: Colors.grey.shade400),
                        // #1
                        _buildPodiumPlace(top3[0], rank: 1, height: 160, color: Colors.amber),
                        // #3
                        if (top3.length > 2) _buildPodiumPlace(top3[2], rank: 3, height: 110, color: Colors.brown.shade400),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Rest of Leaderboard
                  if (rest.isNotEmpty) ...[
                    const Text('Top Ranking Artists', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(height: 10),
                    ...rest.asMap().entries.map((entry) {
                      final rank = entry.key + 4;
                      final artist = entry.value;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: AppTheme.cardDark,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppTheme.borderDark),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 28,
                              height: 28,
                              decoration: BoxDecoration(
                                color: AppTheme.bgDark,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Center(
                                child: Text('$rank', style: const TextStyle(color: AppTheme.textMuted, fontWeight: FontWeight.bold, fontSize: 11)),
                              ),
                            ),
                            const SizedBox(width: 12),
                            CircleAvatar(
                              radius: 16,
                              backgroundColor: AppTheme.primaryOrange.withOpacity(0.2),
                              backgroundImage: artist.avatarUrl != null ? NetworkImage(artist.avatarUrl!) : null,
                              child: artist.avatarUrl == null
                                  ? Text(artist.name.isNotEmpty ? artist.name[0] : 'A', style: const TextStyle(color: AppTheme.primaryOrange, fontSize: 12))
                                  : null,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(artist.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                                  Text('${artist.streak} Day Streak 🔥', style: const TextStyle(color: AppTheme.textMuted, fontSize: 10)),
                                ],
                              ),
                            ),
                            Text('${artist.points} XP', style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.w900, fontSize: 13)),
                          ],
                        ),
                      );
                    }),
                  ],
                ],
              ),
      ),
    );
  }

  Widget _buildPodiumPlace(LeaderboardEntry entry, {required int rank, required double height, required Color color}) {
    return Container(
      width: 96,
      margin: const EdgeInsets.symmetric(horizontal: 4),
      child: Column(
        children: [
          CircleAvatar(
            radius: rank == 1 ? 26 : 22,
            backgroundColor: color,
            child: CircleAvatar(
              radius: (rank == 1 ? 26 : 22) - 2,
              backgroundImage: entry.avatarUrl != null ? NetworkImage(entry.avatarUrl!) : null,
              child: entry.avatarUrl == null
                  ? Text(entry.name.isNotEmpty ? entry.name[0] : 'A', style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold))
                  : null,
            ),
          ),
          const SizedBox(height: 6),
          Text(entry.name, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
          Text('${entry.points} XP', style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w900)),
          const SizedBox(height: 8),
          Container(
            height: height,
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [color.withOpacity(0.4), color.withOpacity(0.1)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              border: Border.all(color: color.withOpacity(0.5)),
            ),
            child: Center(
              child: Text('$rank', style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.w900)),
            ),
          ),
        ],
      ),
    );
  }
}
