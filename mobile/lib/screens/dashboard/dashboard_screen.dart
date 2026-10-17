import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/level_helper.dart';
import '../../providers/auth_provider.dart';
import '../../providers/stats_provider.dart';
import '../common/tier_purchase_dialog.dart';
import '../courses/courses_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final statsProvider = context.watch<StatsProvider>();
    final stats = statsProvider.stats;

    final user = auth.user;
    final effectiveLevel = user?.membershipLevel ?? stats?.membershipLevel ?? 'GENERAL';
    final studentLevelCode = LevelHelper.getLevelCode(effectiveLevel);
    final isGeneral = LevelHelper.isGeneral(effectiveLevel);

    if (statsProvider.isLoading && stats == null) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.primaryOrange));
    }

    // Locked General Member Gate
    if (isGeneral) {
      return RefreshIndicator(
        onRefresh: () => statsProvider.fetchStudentDashboard(),
        color: AppTheme.primaryOrange,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 60),
          child: Center(
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
                  'Student Dashboard is Locked',
                  style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 10),
                const Text(
                  'Your student stats, 6-step daily routine habit checklist, sales tracker, and rewards store unlock with Level 0 (Fast Track).',
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 13, height: 1.5),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 28),
                ElevatedButton.icon(
                  onPressed: () => TierPurchaseDialog.show(context, preselectedTier: 'L0'),
                  icon: const Icon(Icons.flash_on_rounded, size: 18),
                  label: const Text('Unlock Fast Track (₹499)'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryOrange,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    textStyle: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final points = stats?.points ?? user?.points ?? 0;
    final streak = stats?.streak ?? 0;
    final weekStatus = stats?.weekStatus ?? [];
    final installmentPlans = statsProvider.installmentPlans;

    return RefreshIndicator(
      onRefresh: () => statsProvider.fetchStudentDashboard(),
      color: AppTheme.primaryOrange,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Installment Alert Banner (if user has active/overdue plans)
          if (installmentPlans.isNotEmpty) ...[
            ...installmentPlans.map((plan) {
              final isOverdue = plan.status == 'overdue';
              return Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isOverdue ? Colors.red.withOpacity(0.15) : Colors.amber.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isOverdue ? Colors.red.withOpacity(0.4) : Colors.amber.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Icon(
                      isOverdue ? Icons.error_outline_rounded : Icons.calendar_month_rounded,
                      color: isOverdue ? Colors.redAccent : Colors.amber,
                      size: 24,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isOverdue ? 'Overdue Installment Alert' : 'Active Installment Plan',
                            style: TextStyle(
                              color: isOverdue ? Colors.redAccent : Colors.amber,
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'Pay Installment #${plan.paidInstallments + 1} of ${plan.totalInstallments} · ₹${plan.installmentAmount}',
                            style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],

          // Welcome Header Card
          _buildWelcomeHeader(user?.name ?? 'Artist', studentLevelCode, points, streak, weekStatus),
          const SizedBox(height: 16),

          // Daily 6-Habit Checklist (+10 XP)
          _buildDailyRoutineCard(context, statsProvider),
          const SizedBox(height: 16),

          // Skill Mastery Radar / Scores
          if (stats?.skills != null) ...[
            _buildSkillMasteryCard(stats!.skills!),
            const SizedBox(height: 16),
          ],

          // Learning Progress & Enrolled Courses
          _buildLearningProgressCard(context, stats?.courses ?? []),
          const SizedBox(height: 16),

          // Business Milestones
          if (stats?.milestones.isNotEmpty == true) ...[
            _buildMilestonesCard(stats!.milestones),
            const SizedBox(height: 16),
          ],

          // Badges Earned Spotlight
          if (stats?.badges.isNotEmpty == true) ...[
            _buildBadgesCard(stats!.badges),
            const SizedBox(height: 16),
          ],
        ],
      ),
    );
  }

  Widget _buildWelcomeHeader(String name, String levelCode, int points, int streak, List<dynamic> weekStatus) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.cardDark,
            AppTheme.cardDark.withOpacity(0.85),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome back, $name 👋',
                      style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Continue your daily art journey & unlock new skills',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.primaryOrange.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppTheme.primaryOrange.withOpacity(0.3)),
                ),
                child: Text(
                  levelCode,
                  style: const TextStyle(color: AppTheme.primaryOrange, fontWeight: FontWeight.w900, fontSize: 12),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // Streak & 7-Day week status strip
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.orange.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.local_fire_department_rounded, color: Colors.orange, size: 20),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '$streak Day Streak 🔥',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  const Text('Consistency builds mastery', style: TextStyle(color: AppTheme.textMuted, fontSize: 10)),
                ],
              ),
              const Spacer(),
              Text(
                '$points XP Total',
                style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.w900, fontSize: 14),
              ),
            ],
          ),

          if (weekStatus.isNotEmpty) ...[
            const SizedBox(height: 14),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: weekStatus.map((item) {
                final day = item.dayName ?? '';
                final isDone = item.status == 'completed';
                final isToday = item.isToday == true;
                return Column(
                  children: [
                    Text(
                      day.isNotEmpty ? day.substring(0, 1) : '',
                      style: TextStyle(
                        color: isToday ? AppTheme.primaryOrange : AppTheme.textMuted,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        color: isDone
                            ? Colors.greenAccent
                            : isToday
                                ? AppTheme.primaryOrange.withOpacity(0.3)
                                : AppTheme.bgDark,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isToday ? AppTheme.primaryOrange : AppTheme.borderDark,
                        ),
                      ),
                      child: isDone
                          ? const Icon(Icons.check, size: 14, color: Colors.black)
                          : null,
                    ),
                  ],
                );
              }).toList(),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDailyRoutineCard(BuildContext context, StatsProvider provider) {
    final habitsConfig = [
      {'id': 'mindset', 'letter': 'A', 'title': 'Mindset Mastery', 'sub': 'Listen to "The Strangest Secret" audio', 'icon': Icons.headphones_rounded},
      {'id': 'goal_card', 'letter': 'B', 'title': 'Goal Card Intention', 'sub': 'Read goal card with deep emotion', 'icon': Icons.track_changes_rounded},
      {'id': 'affirmations', 'letter': 'C', 'title': 'Voice Affirmations', 'sub': 'Listen to affirmations in your own voice', 'icon': Icons.mic_rounded},
      {'id': 'write_goals', 'letter': 'D', 'title': 'Write 20 Goals Daily', 'sub': 'Write two pages of goals (10/page)', 'icon': Icons.edit_note_rounded},
      {'id': 'social_media', 'letter': 'E', 'title': 'Social Media Action', 'sub': 'Post a story, reel, or video of your art', 'icon': Icons.share_rounded},
      {'id': 'connect_within', 'letter': 'F', 'title': 'Connect Within', 'sub': 'Meditate 15-30 min for clarity', 'icon': Icons.self_improvement_rounded},
    ];

    final completed = provider.todayCompletedHabits;
    final allDone = completed.length >= 6;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: allDone ? Colors.green.withOpacity(0.4) : AppTheme.borderDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.checklist_rounded, color: AppTheme.primaryOrange, size: 20),
                  SizedBox(width: 8),
                  Text(
                    'Daily 6-Step Routine',
                    style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w900),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: allDone ? Colors.green.withOpacity(0.15) : AppTheme.bgDark,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  allDone ? '✓ +10 XP Recorded' : '${completed.length}/6 Completed',
                  style: TextStyle(
                    color: allDone ? Colors.greenAccent : AppTheme.textMuted,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          const Text(
            'Complete all 6 daily habits to build your discipline & earn +10 XP',
            style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
          ),
          const SizedBox(height: 14),

          // Habits List
          ...habitsConfig.map((h) {
            final id = h['id'] as String;
            final isChecked = completed.contains(id);
            return GestureDetector(
              onTap: () => provider.toggleHabit(id),
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: isChecked ? Colors.green.withOpacity(0.08) : AppTheme.bgDark,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isChecked ? Colors.green.withOpacity(0.3) : AppTheme.borderDark,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      isChecked ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                      color: isChecked ? Colors.greenAccent : AppTheme.textMuted,
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${h['letter']}. ${h['title']}',
                            style: TextStyle(
                              color: isChecked ? Colors.white : Colors.white70,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              decoration: isChecked ? TextDecoration.lineThrough : null,
                            ),
                          ),
                          Text(
                            h['sub'] as String,
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildSkillMasteryCard(dynamic skills) {
    final skillItems = [
      {'name': 'Skill Mastery', 'val': skills.skillMastery},
      {'name': 'Consistency', 'val': skills.consistency},
      {'name': 'Creative Excellence', 'val': skills.creativeExcellence},
      {'name': 'Implementation Growth', 'val': skills.implementationGrowth},
      {'name': 'Business Progress', 'val': skills.businessProgress},
      {'name': 'Community Leadership', 'val': skills.communityLeadership},
    ];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.radar_rounded, color: Colors.cyanAccent, size: 20),
              SizedBox(width: 8),
              Text(
                'Skill Mastery Matrix',
                style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w900),
              ),
            ],
          ),
          const SizedBox(height: 14),
          ...skillItems.map((s) {
            final val = (s['val'] as int).clamp(0, 100);
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(s['name'] as String, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                      Text('$val%', style: const TextStyle(color: Colors.cyanAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: val / 100,
                      backgroundColor: AppTheme.bgDark,
                      valueColor: const AlwaysStoppedAnimation(Colors.cyanAccent),
                      minHeight: 6,
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildLearningProgressCard(BuildContext context, List<dynamic> courses) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.menu_book_rounded, color: AppTheme.primaryOrange, size: 20),
                  SizedBox(width: 8),
                  Text(
                    'Enrolled Masterclasses',
                    style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w900),
                  ),
                ],
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const CoursesScreen()));
                },
                child: const Text('View All', style: TextStyle(color: AppTheme.primaryOrange, fontSize: 12)),
              ),
            ],
          ),
          if (courses.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Text(
                'No active course progress yet. Explore our course catalog to start learning!',
                style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
              ),
            )
          else
            ...courses.take(3).map((c) {
              final title = (c is Map ? c['title'] : c.title)?.toString() ?? 'Course';
              final progress = (c is Map ? c['UserCourse']?['progress'] : null) ?? 30;
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.bgDark,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.borderDark),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: (progress is num ? progress.toDouble() : 30.0) / 100,
                        backgroundColor: AppTheme.cardDark,
                        valueColor: const AlwaysStoppedAnimation(AppTheme.primaryOrange),
                        minHeight: 5,
                      ),
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  Widget _buildMilestonesCard(List<dynamic> milestones) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.flag_rounded, color: Colors.amber, size: 20),
              SizedBox(width: 8),
              Text(
                'Business Roadmap Milestones',
                style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w900),
              ),
            ],
          ),
          const SizedBox(height: 14),
          ...milestones.map((m) {
            final name = (m is Map ? m['name'] : m.name)?.toString() ?? 'Milestone';
            final isCompleted = (m is Map ? m['completed'] == true : m.completed == true);
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                children: [
                  Icon(
                    isCompleted ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                    color: isCompleted ? Colors.greenAccent : AppTheme.textMuted,
                    size: 18,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      name,
                      style: TextStyle(
                        color: isCompleted ? Colors.white : Colors.white60,
                        fontSize: 12,
                        decoration: isCompleted ? TextDecoration.lineThrough : null,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildBadgesCard(List<dynamic> badges) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.emoji_events_rounded, color: Colors.amber, size: 20),
              SizedBox(width: 8),
              Text(
                'Earned Badges',
                style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w900),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: badges.map((b) {
              final name = (b is Map ? b['name'] : b.name)?.toString() ?? 'Badge';
              final icon = (b is Map ? b['icon'] : b.icon)?.toString() ?? '🏆';
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: AppTheme.bgDark,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.borderDark),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(icon, style: const TextStyle(fontSize: 16)),
                    const SizedBox(width: 6),
                    Text(name, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                  ],
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
