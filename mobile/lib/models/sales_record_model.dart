class SalesRecord {
  final String id;
  final num amount;
  final String productName;
  final String date;

  SalesRecord({
    required this.id,
    required this.amount,
    required this.productName,
    required this.date,
  });

  factory SalesRecord.fromJson(Map<String, dynamic> json) {
    return SalesRecord(
      id: json['id']?.toString() ?? '',
      amount: json['amount'] is num ? json['amount'] : (num.tryParse(json['amount']?.toString() ?? '0') ?? 0),
      productName: json['productName']?.toString() ?? 'Art Piece',
      date: json['date']?.toString() ?? DateTime.now().toIso8601String().split('T')[0],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'amount': amount,
      'productName': productName,
      'date': date,
    };
  }
}
