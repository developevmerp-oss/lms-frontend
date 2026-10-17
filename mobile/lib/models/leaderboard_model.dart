class LeaderboardUserModel {
  final int rank;
  final String id;
  final String name;
  final String? avatarUrl;
  final int xpPoints;
  final int streak;
  final String tier;

  LeaderboardUserModel({
    required this.rank,
    required this.id,
    required this.name,
    this.avatarUrl,
    required this.xpPoints,
    this.streak = 0,
    this.tier = 'Silver Artisan',
  });

  factory LeaderboardUserModel.fromJson(Map<String, dynamic> json, int defaultRank) {
    return LeaderboardUserModel(
      rank: json['rank'] ?? defaultRank,
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? 'Artist',
      avatarUrl: json['avatarUrl'],
      xpPoints: (json['xpPoints'] is num) ? (json['xpPoints'] as num).toInt() : (json['points'] ?? 0),
      streak: (json['streak'] is num) ? (json['streak'] as num).toInt() : 0,
      tier: json['tier'] ?? json['membershipLevel'] ?? 'Silver Artisan',
    );
  }
}
