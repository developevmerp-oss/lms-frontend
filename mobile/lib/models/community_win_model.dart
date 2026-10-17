class WinComment {
  final String author;
  final String text;

  WinComment({required this.author, required this.text});

  factory WinComment.fromJson(Map<String, dynamic> json) {
    return WinComment(
      author: json['author']?.toString() ?? 'Art Student',
      text: json['text']?.toString() ?? '',
    );
  }
}

class CommunityWin {
  final String id;
  final String studentName;
  final String? studentLevel;
  final String title;
  final String achievement;
  final String? amount;
  final String? image;
  final int likes;
  final List<WinComment> comments;
  final String? badge;
  final String timeAgo;
  final String? createdAt;

  CommunityWin({
    required this.id,
    required this.studentName,
    this.studentLevel,
    required this.title,
    required this.achievement,
    this.amount,
    this.image,
    this.likes = 0,
    this.comments = const [],
    this.badge,
    this.timeAgo = 'Recently',
    this.createdAt,
  });

  factory CommunityWin.fromJson(Map<String, dynamic> json) {
    List<WinComment> commentList = [];
    if (json['comments'] is List) {
      commentList = (json['comments'] as List)
          .map((c) => WinComment.fromJson(c as Map<String, dynamic>))
          .toList();
    }
    return CommunityWin(
      id: json['id']?.toString() ?? '',
      studentName: json['studentName']?.toString() ?? json['student']?['name']?.toString() ?? 'Artist',
      studentLevel: json['studentLevel']?.toString() ?? json['student']?['membershipLevel']?.toString(),
      title: json['title']?.toString() ?? json['achievement']?.toString() ?? 'Win',
      achievement: json['achievement']?.toString() ?? json['title']?.toString() ?? '',
      amount: json['amount']?.toString() ?? json['salesAmount']?.toString(),
      image: json['image']?.toString() ?? json['imageUrl']?.toString(),
      likes: json['likes'] is int ? json['likes'] : (int.tryParse(json['likes']?.toString() ?? '') ?? 0),
      comments: commentList,
      badge: json['badge']?.toString(),
      timeAgo: json['timeAgo']?.toString() ?? 'Recently',
      createdAt: json['createdAt']?.toString(),
    );
  }
}
