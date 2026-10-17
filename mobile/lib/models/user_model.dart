class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? avatarUrl;
  final String? phone;
  final String? city;
  final String? bio;
  final String rank;
  final String membershipLevel;
  final int points;
  final int xpPoints;
  final String? lastLoginAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.avatarUrl,
    this.phone,
    this.city,
    this.bio,
    this.rank = 'General Member',
    this.membershipLevel = 'GENERAL',
    this.points = 0,
    this.xpPoints = 0,
    this.lastLoginAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      role: json['role']?.toString() ?? 'student',
      avatarUrl: json['avatarUrl']?.toString(),
      phone: json['phone']?.toString(),
      city: json['city']?.toString(),
      bio: json['bio']?.toString(),
      rank: json['rank']?.toString() ?? 'General Member',
      membershipLevel: (json['membershipLevel'] ?? json['level'] ?? 'GENERAL').toString().toUpperCase(),
      points: json['points'] is int ? json['points'] : (int.tryParse(json['points']?.toString() ?? '') ?? 0),
      xpPoints: json['xpPoints'] is int ? json['xpPoints'] : (int.tryParse(json['xpPoints']?.toString() ?? '') ?? 0),
      lastLoginAt: json['lastLoginAt']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'avatarUrl': avatarUrl,
      'phone': phone,
      'city': city,
      'bio': bio,
      'rank': rank,
      'membershipLevel': membershipLevel,
      'points': points,
      'xpPoints': xpPoints,
      'lastLoginAt': lastLoginAt,
    };
  }

  User copyWith({
    String? name,
    String? email,
    String? avatarUrl,
    String? phone,
    String? city,
    String? bio,
    String? rank,
    String? membershipLevel,
    int? points,
    int? xpPoints,
  }) {
    return User(
      id: id,
      name: name ?? this.name,
      email: email ?? this.email,
      role: role,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      phone: phone ?? this.phone,
      city: city ?? this.city,
      bio: bio ?? this.bio,
      rank: rank ?? this.rank,
      membershipLevel: membershipLevel ?? this.membershipLevel,
      points: points ?? this.points,
      xpPoints: xpPoints ?? this.xpPoints,
      lastLoginAt: lastLoginAt,
    );
  }
}
