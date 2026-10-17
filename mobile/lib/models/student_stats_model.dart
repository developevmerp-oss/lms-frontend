class LevelTier {
  final String code;
  final String name;
  final String price;
  final String? originalPrice;
  final String description;
  final String icon;
  final String badgeColor;
  final int order;
  final bool? offerActive;
  final String? discountType;
  final num? discountValue;
  final String? offerTitle;
  final bool? installmentsEnabled;
  final int? totalInstallments;
  final List<dynamic>? installmentPlans;

  LevelTier({
    required this.code,
    required this.name,
    required this.price,
    this.originalPrice,
    this.description = '',
    this.icon = '⚡',
    this.badgeColor = 'amber',
    this.order = 0,
    this.offerActive,
    this.discountType,
    this.discountValue,
    this.offerTitle,
    this.installmentsEnabled,
    this.totalInstallments,
    this.installmentPlans,
  });

  factory LevelTier.fromJson(Map<String, dynamic> json) {
    return LevelTier(
      code: (json['code'] ?? json['levelCode'] ?? '').toString().toUpperCase(),
      name: json['name']?.toString() ?? '',
      price: json['price']?.toString() ?? '₹499',
      originalPrice: json['originalPrice']?.toString(),
      description: json['description']?.toString() ?? '',
      icon: json['icon']?.toString() ?? '⚡',
      badgeColor: json['badgeColor']?.toString() ?? 'amber',
      order: json['order'] is int ? json['order'] : (int.tryParse(json['order']?.toString() ?? '') ?? 0),
      offerActive: json['offerActive'] == true,
      discountType: json['discountType']?.toString(),
      discountValue: json['discountValue'] is num ? json['discountValue'] : num.tryParse(json['discountValue']?.toString() ?? ''),
      offerTitle: json['offerTitle']?.toString(),
      installmentsEnabled: json['installmentsEnabled'] == true,
      totalInstallments: json['totalInstallments'] is int ? json['totalInstallments'] : int.tryParse(json['totalInstallments']?.toString() ?? ''),
      installmentPlans: json['installmentPlans'] is List ? json['installmentPlans'] : null,
    );
  }
}

class WeekStatusItem {
  final String dayName;
  final String status; // 'completed' | 'missed' | 'today_pending' | 'future'
  final bool isToday;

  WeekStatusItem({
    required this.dayName,
    required this.status,
    required this.isToday,
  });

  factory WeekStatusItem.fromJson(Map<String, dynamic> json) {
    return WeekStatusItem(
      dayName: json['dayName']?.toString() ?? '',
      status: json['status']?.toString() ?? 'today_pending',
      isToday: json['isToday'] == true,
    );
  }
}

class StudentSkillSet {
  final int skillMastery;
  final int consistency;
  final int creativeExcellence;
  final int implementationGrowth;
  final int businessProgress;
  final int communityLeadership;

  StudentSkillSet({
    this.skillMastery = 70,
    this.consistency = 75,
    this.creativeExcellence = 80,
    this.implementationGrowth = 65,
    this.businessProgress = 60,
    this.communityLeadership = 85,
  });

  factory StudentSkillSet.fromJson(Map<String, dynamic> json) {
    return StudentSkillSet(
      skillMastery: (json['skillMastery'] ?? json['resinBasics'] ?? 70) as int,
      consistency: (json['consistency'] ?? json['mixing'] ?? 75) as int,
      creativeExcellence: (json['creativeExcellence'] ?? json['colourTheory'] ?? 80) as int,
      implementationGrowth: (json['implementationGrowth'] ?? json['finishing'] ?? 65) as int,
      businessProgress: (json['businessProgress'] ?? json['creativity'] ?? 60) as int,
      communityLeadership: (json['communityLeadership'] ?? json['professionalQuality'] ?? 85) as int,
    );
  }
}

class StudentBadge {
  final String name;
  final String icon;
  final String description;
  final int? pointsRequired;

  StudentBadge({
    required this.name,
    required this.icon,
    this.description = '',
    this.pointsRequired,
  });

  factory StudentBadge.fromJson(Map<String, dynamic> json) {
    return StudentBadge(
      name: json['name']?.toString() ?? 'Badge',
      icon: json['icon']?.toString() ?? '🏆',
      description: json['description']?.toString() ?? '',
      pointsRequired: json['pointsRequired'] is int ? json['pointsRequired'] : int.tryParse(json['pointsRequired']?.toString() ?? ''),
    );
  }
}

class StudentPortfolio {
  final String id;
  final String title;
  final String technique;
  final String imageUrl;
  final String? feedback;
  final String? mentorName;
  final String? createdAt;

  StudentPortfolio({
    required this.id,
    required this.title,
    required this.technique,
    required this.imageUrl,
    this.feedback,
    this.mentorName,
    this.createdAt,
  });

  factory StudentPortfolio.fromJson(Map<String, dynamic> json) {
    return StudentPortfolio(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      technique: json['technique']?.toString() ?? '',
      imageUrl: json['imageUrl']?.toString() ?? '',
      feedback: json['feedback']?.toString(),
      mentorName: json['mentorName']?.toString(),
      createdAt: json['createdAt']?.toString(),
    );
  }
}

class StudentMilestone {
  final String id;
  final String name;
  final bool completed;
  final String? completedAt;
  final int order;

  StudentMilestone({
    required this.id,
    required this.name,
    required this.completed,
    this.completedAt,
    this.order = 0,
  });

  factory StudentMilestone.fromJson(Map<String, dynamic> json) {
    return StudentMilestone(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      completed: json['completed'] == true,
      completedAt: json['completedAt']?.toString(),
      order: json['order'] is int ? json['order'] : (int.tryParse(json['order']?.toString() ?? '') ?? 0),
    );
  }
}

class StudentStats {
  final int points;
  final int xpPoints;
  final int streak;
  final String membershipLevel;
  final String rank;
  final String? membershipExpiresAt;
  final bool isExpired;
  final int? daysRemaining;
  final LevelTier? currentTier;
  final List<LevelTier> levelTiers;
  final List<WeekStatusItem> weekStatus;
  final StudentSkillSet? skills;
  final List<StudentBadge> badges;
  final List<StudentPortfolio> portfolios;
  final List<StudentMilestone> milestones;
  final List<dynamic> salesRecords;
  final List<dynamic> courses;
  final List<dynamic> allCourses;
  final List<dynamic> notifications;
  final List<dynamic> communityWins;
  final String? nextGoal;

  StudentStats({
    this.points = 0,
    this.xpPoints = 0,
    this.streak = 0,
    this.membershipLevel = 'GENERAL',
    this.rank = 'General Member',
    this.membershipExpiresAt,
    this.isExpired = false,
    this.daysRemaining,
    this.currentTier,
    this.levelTiers = const [],
    this.weekStatus = const [],
    this.skills,
    this.badges = const [],
    this.portfolios = const [],
    this.milestones = const [],
    this.salesRecords = const [],
    this.courses = const [],
    this.allCourses = const [],
    this.notifications = const [],
    this.communityWins = const [],
    this.nextGoal,
  });

  factory StudentStats.fromJson(Map<String, dynamic> json) {
    return StudentStats(
      points: json['points'] is int ? json['points'] : (int.tryParse(json['points']?.toString() ?? '') ?? 0),
      xpPoints: json['xpPoints'] is int ? json['xpPoints'] : (int.tryParse(json['xpPoints']?.toString() ?? '') ?? 0),
      streak: json['streak'] is int ? json['streak'] : (int.tryParse(json['streak']?.toString() ?? '') ?? 0),
      membershipLevel: json['membershipLevel']?.toString() ?? 'GENERAL',
      rank: json['rank']?.toString() ?? 'General Member',
      membershipExpiresAt: json['membershipExpiresAt']?.toString(),
      isExpired: json['isExpired'] == true,
      daysRemaining: json['daysRemaining'] is int ? json['daysRemaining'] : int.tryParse(json['daysRemaining']?.toString() ?? ''),
      currentTier: json['currentTier'] is Map<String, dynamic> ? LevelTier.fromJson(json['currentTier']) : null,
      levelTiers: (json['levelTiers'] as List?)?.map((e) => LevelTier.fromJson(e as Map<String, dynamic>)).toList() ?? [],
      weekStatus: (json['weekStatus'] as List?)?.map((e) => WeekStatusItem.fromJson(e as Map<String, dynamic>)).toList() ?? [],
      skills: json['skills'] is Map<String, dynamic> ? StudentSkillSet.fromJson(json['skills']) : null,
      badges: (json['badges'] as List?)?.map((e) => StudentBadge.fromJson(e as Map<String, dynamic>)).toList() ?? [],
      portfolios: (json['portfolios'] as List?)?.map((e) => StudentPortfolio.fromJson(e as Map<String, dynamic>)).toList() ?? [],
      milestones: (json['milestones'] as List?)?.map((e) => StudentMilestone.fromJson(e as Map<String, dynamic>)).toList() ?? [],
      salesRecords: json['salesRecords'] as List? ?? [],
      courses: json['courses'] as List? ?? [],
      allCourses: json['allCourses'] as List? ?? [],
      notifications: json['notifications'] as List? ?? [],
      communityWins: json['communityWins'] as List? ?? [],
      nextGoal: json['nextGoal']?.toString(),
    );
  }
}
