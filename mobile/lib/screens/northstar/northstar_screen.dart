import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/level_helper.dart';
import '../../models/sales_record_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/stats_provider.dart';
import '../common/tier_purchase_dialog.dart';

class NorthstarScreen extends StatefulWidget {
  const NorthstarScreen({super.key});

  @override
  State<NorthstarScreen> createState() => _NorthstarScreenState();
}

class _NorthstarScreenState extends State<NorthstarScreen> {
  final _amountController = TextEditingController();
  final _productNameController = TextEditingController();

  @override
  void dispose() {
    _amountController.dispose();
    _productNameController.dispose();
    super.dispose();
  }

  void _showAddSaleDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.cardDark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Log Client Sale (+100 XP)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(labelText: 'Amount (₹)', hintText: 'e.g. 5000'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _productNameController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(labelText: 'Artwork / Product Name', hintText: 'e.g. 18" Ocean Wall Clock'),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel', style: TextStyle(color: AppTheme.textMuted))),
          ElevatedButton(
            onPressed: () async {
              final amt = num.tryParse(_amountController.text.trim());
              final name = _productNameController.text.trim();
              if (amt == null || name.isEmpty) return;

              Navigator.pop(ctx);
              final today = DateTime.now().toIso8601String().split('T')[0];
              final success = await context.read<StatsProvider>().addSale(
                amount: amt,
                productName: name,
                date: today,
              );

              _amountController.clear();
              _productNameController.clear();

              if (success && mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('🎉 Sale logged! +100 XP awarded to your profile!'), backgroundColor: Colors.green),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryOrange,
              foregroundColor: Colors.black,
            ),
            child: const Text('Save Sale'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final statsProvider = context.watch<StatsProvider>();
    final stats = statsProvider.stats;

    final user = auth.user;
    final effectiveLevel = user?.membershipLevel ?? stats?.membershipLevel ?? 'GENERAL';
    final isAccessible = LevelHelper.isNorthstarAccessible(effectiveLevel);

    if (!isAccessible) {
      return Scaffold(
        backgroundColor: AppTheme.bgDark,
        appBar: AppBar(
          backgroundColor: AppTheme.bgDark,
          title: const Text('Northstar Tracking', style: TextStyle(color: Colors.white, fontSize: 16)),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(28.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: Colors.cyan.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.cyan.withOpacity(0.3)),
                  ),
                  child: const Icon(Icons.track_changes_rounded, color: Colors.cyanAccent, size: 36),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Northstar System Locked',
                  style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 10),
                const Text(
                  'Northstar revenue tracking, sales goal projections, and 90-day business KPI scorecards unlock at Level 3 (Diamond Membership).',
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 13, height: 1.5),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: () => TierPurchaseDialog.show(context, preselectedTier: 'L3'),
                  icon: const Icon(Icons.diamond_rounded, size: 18),
                  label: const Text('Upgrade to Diamond (L3)'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.cyanAccent,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    textStyle: const TextStyle(fontWeight: FontWeight.w900),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final rawSales = stats?.salesRecords ?? [];
    num totalRevenue = 0;
    for (var r in rawSales) {
      if (r is Map) {
        totalRevenue += (r['amount'] is num ? r['amount'] : (num.tryParse(r['amount']?.toString() ?? '0') ?? 0));
      }
    }
    const targetGoal = 300000;
    final progress = (totalRevenue / targetGoal).clamp(0.0, 1.0);

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      appBar: AppBar(
        backgroundColor: AppTheme.bgDark,
        elevation: 0,
        title: const Text('Northstar Revenue Tracker', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_rounded, color: AppTheme.primaryOrange),
            onPressed: () => _showAddSaleDialog(context),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => statsProvider.fetchStudentDashboard(),
        color: AppTheme.primaryOrange,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Revenue & Goal Card
            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.cardDark,
                    Colors.cyan.withOpacity(0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.cyan.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Total Logged Client Revenue', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                  const SizedBox(height: 6),
                  Text(
                    '₹${totalRevenue.toStringAsFixed(0)}',
                    style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Roadmap Target: ₹3,00,000 / month', style: TextStyle(color: Colors.cyanAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                      Text('${(progress * 100).toInt()}%', style: const TextStyle(color: Colors.white70, fontSize: 11)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: progress,
                      backgroundColor: AppTheme.bgDark,
                      valueColor: const AlwaysStoppedAnimation(Colors.cyanAccent),
                      minHeight: 8,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Sales Log Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Client Sales Log', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                TextButton.icon(
                  onPressed: () => _showAddSaleDialog(context),
                  icon: const Icon(Icons.add, size: 16, color: AppTheme.primaryOrange),
                  label: const Text('Add Sale (+100 XP)', style: TextStyle(color: AppTheme.primaryOrange, fontSize: 12)),
                ),
              ],
            ),
            const SizedBox(height: 8),

            if (rawSales.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 40),
                child: Center(
                  child: Text('No client sales logged yet. Tap "Add Sale" to record your art revenue!', style: TextStyle(color: AppTheme.textMuted)),
                ),
              )
            else
              ...rawSales.map((s) {
                final id = s is Map ? s['id']?.toString() : '';
                final name = s is Map ? s['productName']?.toString() ?? 'Piece' : 'Piece';
                final amt = s is Map ? s['amount']?.toString() ?? '0' : '0';
                final date = s is Map ? s['date']?.toString() ?? '' : '';

                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppTheme.cardDark,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.borderDark),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.currency_rupee_rounded, color: Colors.greenAccent, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                            Text(date, style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                          ],
                        ),
                      ),
                      Text(
                        '₹$amt',
                        style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.w900, fontSize: 16),
                      ),
                      if (id != null && id.isNotEmpty)
                        IconButton(
                          icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 18),
                          onPressed: () async {
                            final confirm = await showDialog<bool>(
                              context: context,
                              builder: (c) => AlertDialog(
                                backgroundColor: AppTheme.cardDark,
                                title: const Text('Delete Sale?', style: TextStyle(color: Colors.white)),
                                content: const Text('Are you sure you want to delete this sales entry?', style: TextStyle(color: AppTheme.textSecondary)),
                                actions: [
                                  TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Cancel')),
                                  TextButton(onPressed: () => Navigator.pop(c, true), child: const Text('Delete', style: TextStyle(color: Colors.redAccent))),
                                ],
                              ),
                            );
                            if (confirm == true) {
                              await statsProvider.deleteSale(id);
                            }
                          },
                        ),
                    ],
                  ),
                );
              }),
          ],
        ),
      ),
    );
  }
}
