import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints.dart';
import '../../core/theme/app_theme.dart';
import '../../models/reward_model.dart';
import '../../providers/stats_provider.dart';

class RewardsScreen extends StatefulWidget {
  const RewardsScreen({super.key});

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  List<Reward> _rewards = [];
  bool _isLoading = true;
  String? _redeemingId;

  final List<Reward> _defaultRewards = [
    Reward(
      id: '1',
      title: '30 min 1-on-1 Mentoring Call',
      description: 'Private 1-on-1 strategy & portfolio review session with Vrajangna Patel.',
      pointCost: 1500,
    ),
    Reward(
      id: '2',
      title: 'Custom Artistry Journal with Pen',
      description: 'Premium hardcover resin artist planner & goal tracking journal with signature metallic gel pen.',
      pointCost: 2000,
    ),
    Reward(
      id: '3',
      title: 'Ravishing Art Physical Merch Kit',
      description: 'Complete 9-Piece Merch Bundle: Badge/Fridge Magnet, Goal Card, Lanyard, Notebook & Wrist Band.',
      pointCost: 3000,
    ),
    Reward(
      id: '4',
      title: '15% Off Discount Voucher',
      description: 'Redeem 15% discount on any advanced masterclass course or live offline workshop ticket.',
      pointCost: 5000,
    ),
    Reward(
      id: '5',
      title: '50% OFF Live Ticket + Renaissance Certificate',
      description: '50% discount on live event ticket + physical printed Renaissance Master Certification awarded live on stage.',
      pointCost: 10000,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _fetchRewards();
  }

  Future<void> _fetchRewards() async {
    setState(() => _isLoading = true);
    try {
      final res = await ApiClient.get(Endpoints.rewards);
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List && data.isNotEmpty) {
          _rewards = data.map((r) => Reward.fromJson(r as Map<String, dynamic>)).toList();
        } else {
          _rewards = _defaultRewards;
        }
      } else {
        _rewards = _defaultRewards;
      }
    } catch (_) {
      _rewards = _defaultRewards;
    }
    setState(() => _isLoading = false);
  }

  Future<void> _handleRedeem(Reward reward, int currentPoints) async {
    if (currentPoints < reward.pointCost) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Not enough points! You need ${reward.pointCost} XP.'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() => _redeemingId = reward.id);
    try {
      final res = await ApiClient.post(Endpoints.rewardRedeem(reward.id));
      final data = jsonDecode(res.body);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(data['message'] ?? 'Reward redeemed successfully! Please check your email.'),
            backgroundColor: Colors.green,
          ),
        );
        context.read<StatsProvider>().fetchStudentDashboard(silent: true);
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not complete redemption.'), backgroundColor: Colors.redAccent),
        );
      }
    } finally {
      if (mounted) setState(() => _redeemingId = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    final statsProvider = context.watch<StatsProvider>();
    final currentPoints = statsProvider.stats?.points ?? 0;

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      appBar: AppBar(
        backgroundColor: AppTheme.bgDark,
        elevation: 0,
        title: const Text('Rewards & Merch Store', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
      ),
      body: RefreshIndicator(
        onRefresh: _fetchRewards,
        color: AppTheme.primaryOrange,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Balance card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.cardDark,
                    Colors.pink.withOpacity(0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: Colors.pink.withOpacity(0.3)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Your Available XP Balance', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                      const SizedBox(height: 4),
                      Text(
                        '$currentPoints XP',
                        style: const TextStyle(color: Colors.amber, fontSize: 24, fontWeight: FontWeight.w900),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.pink.withOpacity(0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.card_giftcard_rounded, color: Colors.pinkAccent, size: 28),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'Trade XP for Exclusive Physical & Mentorship Perks',
              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            if (_isLoading)
              const Center(child: CircularProgressIndicator(color: AppTheme.primaryOrange))
            else
              ..._rewards.map((reward) {
                final canAfford = currentPoints >= reward.pointCost;
                final isRedeeming = _redeemingId == reward.id;

                return Container(
                  margin: const EdgeInsets.only(bottom: 14),
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppTheme.cardDark,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.borderDark),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              reward.title,
                              style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.pink.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '${reward.pointCost} XP',
                              style: const TextStyle(color: Colors.pinkAccent, fontWeight: FontWeight.w900, fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        reward.description,
                        style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4),
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 42,
                        child: ElevatedButton(
                          onPressed: canAfford && !isRedeeming ? () => _handleRedeem(reward, currentPoints) : null,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryOrange,
                            foregroundColor: Colors.black,
                            disabledBackgroundColor: AppTheme.bgDark,
                            disabledForegroundColor: AppTheme.textMuted,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          child: isRedeeming
                              ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                              : Text(canAfford ? 'Redeem Perk' : 'Need ${reward.pointCost - currentPoints} More XP'),
                        ),
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
