class CertificateModel {
  final String id;
  final String title;
  final String studentName;
  final String level;
  final String issueDate;
  final String verificationUrl;
  final String credentialId;

  CertificateModel({
    required this.id,
    required this.title,
    required this.studentName,
    required this.level,
    required this.issueDate,
    required this.verificationUrl,
    required this.credentialId,
  });

  factory CertificateModel.fromJson(Map<String, dynamic> json) {
    final credId = json['credentialId'] ?? json['id']?.toString() ?? 'CERT-2026';
    return CertificateModel(
      id: json['id']?.toString() ?? '',
      title: json['title'] ?? 'Resin Art Mastery Certificate',
      studentName: json['studentName'] ?? 'Student',
      level: json['level'] ?? 'L1 - Silver',
      issueDate: json['issueDate'] ?? json['createdAt'] ?? 'October 2026',
      verificationUrl: 'https://ravishingarthub.com/verify/$credId',
      credentialId: credId,
    );
  }
}
