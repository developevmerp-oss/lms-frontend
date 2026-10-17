import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/level_helper.dart';
import '../../models/live_class_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/class_provider.dart';
import '../../providers/stats_provider.dart';
import '../common/tier_purchase_dialog.dart';

class ClassesScreen extends StatefulWidget {
  const ClassesScreen({super.key});

  @override
  State<ClassesScreen> createState() => _ClassesScreenState();
}

class _ClassesScreenState extends State<ClassesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ClassProvider>().fetchClasses();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _handleJoinClass(BuildContext context, LiveClass liveClass) async {
    final classProvider = context.read<ClassProvider>();
    final statsProvider = context.read<StatsProvider>();

    final meetingUrl = await classProvider.joinClass(liveClass.id, fallbackUrl: liveClass.meetingUrl);
    await statsProvider.fetchStudentDashboard(silent: true);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✅ Attendance Recorded! +50 XP Awarded to your profile.'),
          backgroundColor: Colors.green,
        ),
      );
    }

    final urlToOpen = (meetingUrl != null && meetingUrl.isNotEmpty) ? meetingUrl : (liveClass.meetingUrl ?? 'https://zoom.us');
    final uri = Uri.parse(urlToOpen);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final stats = context.watch<StatsProvider>().stats;
    final classProvider = context.watch<ClassProvider>();

    final user = auth.user;
    final effectiveLevel = user?.membershipLevel ?? stats?.membershipLevel ?? 'GENERAL';
    final isAccessible = LevelHelper.isEventsAccessible(effectiveLevel);

    if (!isAccessible) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(28.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: Colors.amber.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.amber.withOpacity(0.3)),
                ),
                child: const Icon(Icons.lock_rounded, color: Colors.amber, size: 36),
              ),
              const SizedBox(height: 20),
              const Text(
                'Live Coaching Calls Locked',
                style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 10),
              const Text(
                'Weekly live Q&A coaching calls with Vrajangna Patel and attendance XP unlock at Level 1 (Silver Membership).',
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 13, height: 1.5),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () => TierPurchaseDialog.show(context, preselectedTier: 'L1'),
                icon: const Icon(Icons.flash_on_rounded, size: 18),
                label: const Text('Upgrade to Silver (L1)'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryOrange,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                  textStyle: const TextStyle(fontWeight: FontWeight.w900),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ],
          ),
        ),
      );
    }

    final upcoming = classProvider.upcomingClasses;
    final past = classProvider.pastClasses;

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      body: Column(
        children: [
          // Tabs
          Container(
            color: AppTheme.cardDark,
            child: TabBar(
              controller: _tabController,
              indicatorColor: AppTheme.primaryOrange,
              labelColor: AppTheme.primaryOrange,
              unselectedLabelColor: AppTheme.textMuted,
              labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              tabs: [
                Tab(text: 'Upcoming (${upcoming.length})'),
                Tab(text: 'Replays & Past (${past.length})'),
              ],
            ),
          ),

          // Content
          Expanded(
            child: classProvider.isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryOrange))
                : TabBarView(
                    controller: _tabController,
                    children: [
                      _buildClassList(context, upcoming, isUpcoming: true),
                      _buildClassList(context, past, isUpcoming: false),
                    ],
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildClassList(BuildContext context, List<LiveClass> classes, {required bool isUpcoming}) {
    if (classes.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Text(
            isUpcoming ? 'No upcoming live masterclasses scheduled.' : 'No past session replays available yet.',
            style: const TextStyle(color: AppTheme.textMuted),
          ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: classes.length,
      itemBuilder: (ctx, idx) {
        final item = classes[idx];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
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
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: item.status == 'live' ? Colors.red.withOpacity(0.15) : AppTheme.primaryOrange.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: item.status == 'live' ? Colors.red.withOpacity(0.4) : AppTheme.primaryOrange.withOpacity(0.3),
                      ),
                    ),
                    child: Text(
                      item.status == 'live' ? '🔴 LIVE NOW' : '🎥 ${item.targetLevel} Masterclass',
                      style: TextStyle(
                        color: item.status == 'live' ? Colors.redAccent : AppTheme.primaryOrange,
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
                  if (item.isAttended)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.check, size: 12, color: Colors.greenAccent),
                          SizedBox(width: 4),
                          Text('Attended (+50 XP)', style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 10),

              Text(
                item.title,
                style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              Text(
                item.description,
                style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4),
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  const Icon(Icons.access_time_rounded, color: AppTheme.textMuted, size: 14),
                  const SizedBox(width: 6),
                  Text(
                    '${item.scheduledAt.split('T')[0]} · ${item.durationMinutes} mins',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              if (isUpcoming)
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: ElevatedButton.icon(
                    onPressed: () => _handleJoinClass(context, item),
                    icon: const Icon(Icons.video_call_rounded, size: 18),
                    label: Text(item.isAttended ? 'Re-Join Live Meeting' : 'Join Live Class (+50 XP)'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryOrange,
                      foregroundColor: Colors.black,
                      textStyle: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                )
              else if (item.recordingUrl != null && item.recordingUrl!.isNotEmpty)
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      final uri = Uri.parse(item.recordingUrl!);
                      if (await canLaunchUrl(uri)) {
                        await launchUrl(uri, mode: LaunchMode.externalApplication);
                      }
                    },
                    icon: const Icon(Icons.play_circle_outline_rounded, size: 18),
                    label: const Text('Watch Session Recording'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: AppTheme.borderDark),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}
