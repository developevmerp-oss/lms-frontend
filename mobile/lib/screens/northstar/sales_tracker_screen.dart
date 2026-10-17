import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/stats_provider.dart';

class SalesTrackerScreen extends StatefulWidget {
  const SalesTrackerScreen({super.key});

  @override
  State<SalesTrackerScreen> createState() => _SalesTrackerScreenState();
}

class _SalesTrackerScreenState extends State<SalesTrackerScreen> {
  final _customerController = TextEditingController();
  final _productController = TextEditingController();
  final _amountController = TextEditingController();
  final _profitController = TextEditingController();

  void _showAddSaleDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF131B2E),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 24,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
        ),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Log New Art Sale', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.accentGreen.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Text('+500 XP Reward', style: TextStyle(color: AppTheme.accentGreen, fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              TextField(
                controller: _customerController,
                decoration: const InputDecoration(labelText: 'Customer Name', hintText: 'Priya Sharma'),
              ),
              const SizedBox(height: 12),

              TextField(
                controller: _productController,
                decoration: const InputDecoration(labelText: 'Art Product', hintText: '16-Inch Ocean Wave Clock'),
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _amountController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Selling Price (₹)', hintText: '3500'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      controller: _profitController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Net Profit (₹)', hintText: '2400'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              ElevatedButton(
                onPressed: () {
                  final cust = _customerController.text.trim();
                  final prod = _productController.text.trim();
                  final amt = double.tryParse(_amountController.text) ?? 2500.0;
                  final prof = double.tryParse(_profitController.text) ?? 1800.0;

                  if (cust.isNotEmpty && prod.isNotEmpty) {
                    Provider.of<StatsProvider>(context, listen: false).addSale(cust, prod, amt, prof);
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Sale recorded! +500 XP Business Champion bonus awarded!'),
                        backgroundColor: AppTheme.accentGreen,
                      ),
                    );
                  }
                },
                child: const Text('Save Sale & Claim +500 XP'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final stats = Provider.of<StatsProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('NorthStar Sales Tracker'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.accentGreen,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: const Text('Log Sale (+500 XP)', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        onPressed: _showAddSaleDialog,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Revenue & Profit Hero Cards
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF131B2E),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('TOTAL REVENUE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
                        const SizedBox(height: 6),
                        Text(
                          '₹${NumberFormat('#,##,###').format(stats.totalRevenue.toInt())}',
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF131B2E),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.accentGreen.withOpacity(0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('NET PROFIT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.accentGreen)),
                        const SizedBox(height: 6),
                        Text(
                          '₹${NumberFormat('#,##,###').format(stats.totalProfit.toInt())}',
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.accentGreen),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Sales Log Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Logged Customer Sales', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text('${stats.sales.length} Orders', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
              ],
            ),
            const SizedBox(height: 12),

            // Orders list
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: stats.sales.length,
              itemBuilder: (context, index) {
                final sale = stats.sales[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF131B2E),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF1E293B)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppTheme.accentGreen.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.check_circle_outline_rounded, color: AppTheme.accentGreen, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(sale.productName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            const SizedBox(height: 2),
                            Text('Buyer: ${sale.customerName} • ${DateFormat('MMM d').format(sale.saleDate)}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('₹${sale.saleAmount.toInt()}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          Text('Profit: ₹${sale.profit.toInt()}', style: const TextStyle(fontSize: 11, color: AppTheme.accentGreen, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
