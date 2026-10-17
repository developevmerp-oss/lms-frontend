class Reward {
  final String id;
  final String title;
  final String description;
  final int pointCost;
  final String? imageUrl;

  Reward({
    required this.id,
    required this.title,
    required this.description,
    required this.pointCost,
    this.imageUrl,
  });

  factory Reward.fromJson(Map<String, dynamic> json) {
    return Reward(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      pointCost: json['pointCost'] is int ? json['pointCost'] : (int.tryParse(json['pointCost']?.toString() ?? '') ?? 1000),
      imageUrl: json['imageUrl']?.toString(),
    );
  }
}
