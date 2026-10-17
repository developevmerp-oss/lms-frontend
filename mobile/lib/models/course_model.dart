class Chapter {
  final String id;
  final String title;
  final String? videoUrl;
  final String? pdfUrl;
  final int order;

  Chapter({
    required this.id,
    required this.title,
    this.videoUrl,
    this.pdfUrl,
    this.order = 0,
  });

  factory Chapter.fromJson(Map<String, dynamic> json) {
    return Chapter(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      videoUrl: json['videoUrl']?.toString(),
      pdfUrl: json['pdfUrl']?.toString(),
      order: json['order'] is int ? json['order'] : (int.tryParse(json['order']?.toString() ?? '') ?? 0),
    );
  }
}

class Course {
  final String id;
  final String title;
  final String description;
  final String? image;
  final String? levelCode; // 'L0', 'L1', 'L2', 'L3', or 'NONE'/null for standalone
  final int order;
  final String? price;
  final bool offerActive;
  final String? discountType;
  final num? discountValue;
  final String? offerStartDate;
  final String? offerEndDate;
  final String? validityStartDate;
  final String? validityEndDate;
  final List<Chapter> chapters;

  Course({
    required this.id,
    required this.title,
    required this.description,
    this.image,
    this.levelCode,
    this.order = 0,
    this.price,
    this.offerActive = false,
    this.discountType,
    this.discountValue,
    this.offerStartDate,
    this.offerEndDate,
    this.validityStartDate,
    this.validityEndDate,
    this.chapters = const [],
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    var rawChapters = json['chapters'];
    List<Chapter> chapList = [];
    if (rawChapters is List) {
      chapList = rawChapters.map((c) => Chapter.fromJson(c as Map<String, dynamic>)).toList();
    }
    return Course(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      image: json['image']?.toString() ?? json['thumbnail']?.toString(),
      levelCode: json['levelCode']?.toString(),
      order: json['order'] is int ? json['order'] : (int.tryParse(json['order']?.toString() ?? '') ?? 0),
      price: json['price']?.toString(),
      offerActive: json['offerActive'] == true,
      discountType: json['discountType']?.toString(),
      discountValue: json['discountValue'] is num ? json['discountValue'] : num.tryParse(json['discountValue']?.toString() ?? ''),
      offerStartDate: json['offerStartDate']?.toString(),
      offerEndDate: json['offerEndDate']?.toString(),
      validityStartDate: json['validityStartDate']?.toString(),
      validityEndDate: json['validityEndDate']?.toString(),
      chapters: chapList,
    );
  }
}
