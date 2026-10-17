class SubmissionModel {
  final String id;
  final String status; // 'pending', 'approved', 'revision'
  final String? feedbackNotes;
  final int? xpAwarded;
  final List<String> images;
  final DateTime? submittedAt;

  SubmissionModel({
    required this.id,
    required this.status,
    this.feedbackNotes,
    this.xpAwarded,
    this.images = const [],
    this.submittedAt,
  });

  factory SubmissionModel.fromJson(Map<String, dynamic> json) {
    var rawImgs = json['images'] as List? ?? json['submittedImages'] as List? ?? [];
    return SubmissionModel(
      id: json['id']?.toString() ?? '',
      status: json['status'] ?? 'pending',
      feedbackNotes: json['feedback'] ?? json['feedbackNotes'] ?? json['mentorNotes'],
      xpAwarded: json['xpAwarded'] ?? json['points'],
      images: rawImgs.map((e) => e.toString()).toList(),
      submittedAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
    );
  }
}

class AssignmentModel {
  final String id;
  final String title;
  final String description;
  final int xpReward;
  final String level;
  final SubmissionModel? mySubmission;

  AssignmentModel({
    required this.id,
    required this.title,
    required this.description,
    this.xpReward = 250,
    this.level = 'L1',
    this.mySubmission,
  });

  factory AssignmentModel.fromJson(Map<String, dynamic> json) {
    return AssignmentModel(
      id: json['id']?.toString() ?? '',
      title: json['title'] ?? 'Artwork Task',
      description: json['description'] ?? '',
      xpReward: (json['xpReward'] is num) ? (json['xpReward'] as num).toInt() : 250,
      level: json['level'] ?? 'L1',
      mySubmission: json['mySubmission'] != null || json['submission'] != null
          ? SubmissionModel.fromJson(json['mySubmission'] ?? json['submission'])
          : null,
    );
  }
}
