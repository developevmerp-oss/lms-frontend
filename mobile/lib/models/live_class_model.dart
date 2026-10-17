class LiveClass {
  final String id;
  final String title;
  final String description;
  final String scheduledAt;
  final int durationMinutes;
  final String? meetingUrl;
  final String? recordingUrl;
  final String targetLevel;
  final String status; // 'upcoming' | 'live' | 'completed'
  final String? instructor;
  final int totalAttendees;
  final bool isAttended;
  final String? joinedAt;

  LiveClass({
    required this.id,
    required this.title,
    required this.description,
    required this.scheduledAt,
    this.durationMinutes = 60,
    this.meetingUrl,
    this.recordingUrl,
    this.targetLevel = 'All',
    this.status = 'upcoming',
    this.instructor,
    this.totalAttendees = 0,
    this.isAttended = false,
    this.joinedAt,
  });

  factory LiveClass.fromJson(Map<String, dynamic> json) {
    return LiveClass(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      scheduledAt: json['scheduledAt']?.toString() ?? DateTime.now().toIso8601String(),
      durationMinutes: json['durationMinutes'] is int ? json['durationMinutes'] : (int.tryParse(json['durationMinutes']?.toString() ?? '') ?? 60),
      meetingUrl: json['meetingUrl']?.toString() ?? json['zoomJoinUrl']?.toString(),
      recordingUrl: json['recordingUrl']?.toString() ?? json['prepVideoUrl']?.toString(),
      targetLevel: json['targetLevel']?.toString() ?? 'All',
      status: json['status']?.toString() ?? 'upcoming',
      instructor: json['instructor']?.toString() ?? 'Vrajangna Patel',
      totalAttendees: json['totalAttendees'] is int ? json['totalAttendees'] : (int.tryParse(json['totalAttendees']?.toString() ?? '') ?? 0),
      isAttended: json['isAttended'] == true,
      joinedAt: json['joinedAt']?.toString(),
    );
  }
}
