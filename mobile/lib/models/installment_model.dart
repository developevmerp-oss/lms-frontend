class InstallmentPlan {
  final String id;
  final String status; // 'active' | 'overdue' | 'completed'
  final String tierCode;
  final String tierName;
  final String planName;
  final num installmentAmount;
  final int totalInstallments;
  final int paidInstallments;
  final String? nextDueDate;

  InstallmentPlan({
    required this.id,
    required this.status,
    required this.tierCode,
    required this.tierName,
    required this.planName,
    required this.installmentAmount,
    required this.totalInstallments,
    required this.paidInstallments,
    this.nextDueDate,
  });

  factory InstallmentPlan.fromJson(Map<String, dynamic> json) {
    return InstallmentPlan(
      id: json['id']?.toString() ?? '',
      status: json['status']?.toString() ?? 'active',
      tierCode: json['tierCode']?.toString() ?? 'L3',
      tierName: json['tierName']?.toString() ?? 'Diamond Club',
      planName: json['planName']?.toString() ?? 'Installment Plan',
      installmentAmount: json['installmentAmount'] is num ? json['installmentAmount'] : (num.tryParse(json['installmentAmount']?.toString() ?? '') ?? 0),
      totalInstallments: json['totalInstallments'] is int ? json['totalInstallments'] : (int.tryParse(json['totalInstallments']?.toString() ?? '') ?? 3),
      paidInstallments: json['paidInstallments'] is int ? json['paidInstallments'] : (int.tryParse(json['paidInstallments']?.toString() ?? '') ?? 1),
      nextDueDate: json['nextDueDate']?.toString(),
    );
  }
}
