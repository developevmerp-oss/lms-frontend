import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/level_helper.dart';
import '../../providers/auth_provider.dart';
import '../../providers/stats_provider.dart';
import '../dashboard/dashboard_screen.dart';
import '../community/community_screen.dart';
import '../courses/courses_screen.dart';
import '../classes/classes_screen.dart';
import '../webinar/webinar_screen.dart';
import '../northstar/northstar_screen.dart';
import '../rewards/rewards_screen.dart';
import '../leaderboard/leaderboard_screen.dart';
import '../certificates/certificates_screen.dart';
import '../tasks/tasks_screen.dart';
import '../portfolio/portfolio_screen.dart';
import '../affiliate/affiliate_screen.dart';
import '../notifications/notifications_screen.dart';
import '../profile/profile_screen.dart';
import '../common/access_lock_dialog.dart';
import '../common/tier_purchase_dialog.dart';

class MainNavigationScreen extends StatefulWidget {
  final int initialIndex;
  const MainNavigationScreen({super.key, this.initialIndex = 0});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  late int _selectedIndex;

  @override
  void initState() {
    super.initState();
    // Default initialIndex = 0 is Feed screen (matching web login redirect to /student/feed)
    _selectedIndex = widget.initialIndex;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<StatsProvider>().fetchStudentDashboard();
    });
  }

  void _onBottomNavTapped(int index) {
    final auth = context.read<AuthProvider>();
    final stats = context.read<StatsProvider>().stats;
    final effectiveLevel = auth.user?.membershipLevel ?? stats?.membershipLevel ?? 'GENERAL';
    final points = stats?.points ?? auth.user?.points ?? 0;
    final studentLevelCode = LevelHelper.getLevelCode(effectiveLevel);

    // Index 1 is Dashboard: Requires Level 0 (Fast Track)+
    if (index == 1) {
      if (!LevelHelper.isL0Accessible(effectiveLevel)) {
        AccessLockDialog.show(
          context,
          featureName: 'Dashboard',
          requiredLevel: 'Level 0 (Fast Track)',
          requiredPoints: 0,
          currentLevel: studentLevelCode == 'GENERAL' ? 'General Member' : studentLevelCode,
          currentPoints: points,
          description: 'Student dashboard, stats, daily routine checklist, sales chart, and rewards unlock with Level 0 (Fast Track).',
          onUpgrade: () => TierPurchaseDialog.show(context, preselectedTier: 'L0'),
        );
        return;
      }
    }
    // Index 3 is Live Classes: Requires Level 1 (Silver)+ & 500 XP
    else if (index == 3) {
      if (!LevelHelper.isEventsAccessible(effectiveLevel)) {
        AccessLockDialog.show(
          context,
          featureName: 'Live Classes',
          requiredLevel: 'L1 (Silver)',
          requiredPoints: 500,
          currentLevel: studentLevelCode == 'GENERAL' ? 'General Member' : studentLevelCode,
          currentPoints: points,
          description: 'Live interactive coaching calls, weekly mentor Q&A, and attendance XP unlock at Level 1 (Silver Membership).',
          onUpgrade: () => TierPurchaseDialog.show(context, preselectedTier: 'L1'),
        );
        return;
      }
    }

    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final statsProvider = context.watch<StatsProvider>();
    final stats = statsProvider.stats;

    final user = auth.user;
    final effectiveLevel = user?.membershipLevel ?? stats?.membershipLevel ?? 'GENERAL';
    final studentLevelCode = LevelHelper.getLevelCode(effectiveLevel);
    final points = stats?.points ?? user?.points ?? 0;
    final unreadNotifsCount = stats?.notifications.where((n) {
      if (n is Map) return n['isRead'] != true && n['read'] != true;
      return false;
    }).length ?? 0;

    // Bottom Navigation Screens Order:
    // 0: Feed (Default landing after login, matching web /student/feed)
    // 1: Dashboard (Gated L0+)
    // 2: Courses (Accessible to all)
    // 3: Classes (Gated L1+)
    // 4: Profile (Accessible to all)
    final List<Widget> screens = [
      const CommunityScreen(),
      const DashboardScreen(),
      const CoursesScreen(),
      const ClassesScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      appBar: AppBar(
        backgroundColor: AppTheme.bgDark,
        elevation: 0,
        titleSpacing: 16,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.primaryOrange.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.palette_rounded, color: AppTheme.primaryOrange, size: 20),
            ),
            const SizedBox(width: 10),
            const Text(
              'RAVISHING ART',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w900,
                fontSize: 16,
                letterSpacing: 1.1,
              ),
            ),
          ],
        ),
        actions: [
          // XP & Level pill (Navigates to Profile)
          GestureDetector(
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen()));
            },
            child: Container(
              margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.cardDark,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: Row(
                children: [
                  const Icon(Icons.emoji_events_rounded, color: Colors.amber, size: 14),
                  const SizedBox(width: 4),
                  Text(
                    '$points XP',
                    style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(width: 4),
                  const Text('·', style: TextStyle(color: Colors.white38)),
                  const SizedBox(width: 4),
                  Text(
                    studentLevelCode == 'GENERAL' ? 'General' : studentLevelCode,
                    style: const TextStyle(color: AppTheme.primaryOrange, fontSize: 11, fontWeight: FontWeight.w900),
                  ),
                ],
              ),
            ),
          ),

          // Notification Bell with Unread Badge
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_none_rounded, color: Colors.white70),
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen()));
                },
              ),
              if (unreadNotifsCount > 0)
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: AppTheme.primaryOrange,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                    child: Text(
                      '$unreadNotifsCount',
                      style: const TextStyle(color: Colors.black, fontSize: 9, fontWeight: FontWeight.w900),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),

          // Drawer toggle button for All Portal Modules
          Builder(
            builder: (ctx) => IconButton(
              icon: const Icon(Icons.menu_rounded, color: Colors.white),
              onPressed: () => Scaffold.of(ctx).openEndDrawer(),
            ),
          ),
        ],
      ),

      // Side Drawer with Every Student Portal Module & Exact Lock States
      endDrawer: Drawer(
        backgroundColor: AppTheme.bgDark,
        child: SafeArea(
          child: Column(
            children: [
              // Drawer User Header
              Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  border: Border(bottom: BorderSide(color: AppTheme.borderDark)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: AppTheme.primaryOrange,
                      backgroundImage: (user?.avatarUrl != null && user!.avatarUrl!.isNotEmpty)
                          ? NetworkImage(user.avatarUrl!)
                          : null,
                      child: (user?.avatarUrl == null || user!.avatarUrl!.isEmpty)
                          ? Text(
                              (user?.name.isNotEmpty == true ? user!.name[0] : 'S').toUpperCase(),
                              style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
                            )
                          : null,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user?.name ?? 'Art Student',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            user?.email ?? '',
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryOrange.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              studentLevelCode == 'GENERAL' ? 'General Member' : '$studentLevelCode Tier',
                              style: const TextStyle(color: AppTheme.primaryOrange, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Nav Items List with exact gating rules matching web StudentNav.tsx
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  children: [
                    _buildDrawerItem(
                      icon: Icons.auto_awesome_rounded,
                      title: 'Feed (Community)',
                      isAccessible: true,
                      onTap: () {
                        Navigator.pop(context);
                        _onBottomNavTapped(0);
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.dashboard_rounded,
                      title: 'Dashboard',
                      isAccessible: LevelHelper.isL0Accessible(effectiveLevel),
                      requiredLevel: 'Level 0 (Fast Track)',
                      onTap: () {
                        Navigator.pop(context);
                        _onBottomNavTapped(1);
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.menu_book_rounded,
                      title: 'Courses',
                      isAccessible: true,
                      onTap: () {
                        Navigator.pop(context);
                        _onBottomNavTapped(2);
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.video_camera_front_rounded,
                      title: 'Live Classes',
                      isAccessible: LevelHelper.isEventsAccessible(effectiveLevel),
                      requiredLevel: 'L1 (Silver)',
                      onTap: () {
                        Navigator.pop(context);
                        _onBottomNavTapped(3);
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.play_lesson_rounded,
                      title: 'Webinar Hub',
                      isAccessible: LevelHelper.isL0Accessible(effectiveLevel),
                      requiredLevel: 'Level 0 (Fast Track)',
                      onTap: () {
                        Navigator.pop(context);
                        if (!LevelHelper.isL0Accessible(effectiveLevel)) {
                          AccessLockDialog.show(
                            context,
                            featureName: 'Webinar',
                            requiredLevel: 'Level 0 (Fast Track)',
                            requiredPoints: 0,
                            currentLevel: studentLevelCode == 'GENERAL' ? 'General Member' : studentLevelCode,
                            currentPoints: points,
                            description: 'Live Webinar registration details, Zoom link, VIP WhatsApp group, and preparation workshop video unlock with Level 0 (Fast Track).',
                            onUpgrade: () => TierPurchaseDialog.show(context, preselectedTier: 'L0'),
                          );
                        } else {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => const WebinarScreen()));
                        }
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.track_changes_rounded,
                      title: 'Northstar Revenue Tracker',
                      isAccessible: LevelHelper.isNorthstarAccessible(effectiveLevel),
                      requiredLevel: 'L3 (Diamond)',
                      onTap: () {
                        Navigator.pop(context);
                        if (!LevelHelper.isNorthstarAccessible(effectiveLevel)) {
                          AccessLockDialog.show(
                            context,
                            featureName: 'Northstar',
                            requiredLevel: 'L3 (Diamond)',
                            requiredPoints: 10000,
                            currentLevel: studentLevelCode == 'GENERAL' ? 'General Member' : studentLevelCode,
                            currentPoints: points,
                            description: 'Northstar revenue tracking, sales goal projections, and 90-day business KPI scorecards unlock at Level 3 (Diamond Membership).',
                            onUpgrade: () => TierPurchaseDialog.show(context, preselectedTier: 'L3'),
                          );
                        } else {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => const NorthstarScreen()));
                        }
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.card_giftcard_rounded,
                      title: 'Merch store (Rewards)',
                      isAccessible: LevelHelper.isL0Accessible(effectiveLevel),
                      requiredLevel: 'Level 0 (Fast Track)',
                      onTap: () {
                        Navigator.pop(context);
                        if (!LevelHelper.isL0Accessible(effectiveLevel)) {
                          AccessLockDialog.show(
                            context,
                            featureName: 'Merch store',
                            requiredLevel: 'Level 0 (Fast Track)',
                            requiredPoints: 0,
                            currentLevel: studentLevelCode == 'GENERAL' ? 'General Member' : studentLevelCode,
                            currentPoints: points,
                            description: 'Exclusive resin art kits, pigments, molds, silicone tools, and official merchandise unlock with Level 0 (Fast Track).',
                            onUpgrade: () => TierPurchaseDialog.show(context, preselectedTier: 'L0'),
                          );
                        } else {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => const RewardsScreen()));
                        }
                      },
                    ),
                    const Divider(color: AppTheme.borderDark, height: 16),
                    _buildDrawerItem(
                      icon: Icons.leaderboard_rounded,
                      title: 'Global Leaderboard',
                      isAccessible: true,
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const LeaderboardScreen()));
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.assignment_turned_in_rounded,
                      title: 'Daily Tasks & Missions',
                      isAccessible: true,
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const TasksScreen()));
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.collections_rounded,
                      title: 'My Artwork Portfolio',
                      isAccessible: true,
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const PortfolioScreen()));
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.workspace_premium_rounded,
                      title: 'Certificates Vault',
                      isAccessible: true,
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const CertificatesScreen()));
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.share_rounded,
                      title: 'Affiliate Partner Program',
                      isAccessible: true,
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const AffiliateScreen()));
                      },
                    ),
                  ],
                ),
              ),

              // Logout at bottom
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  border: Border(top: BorderSide(color: AppTheme.borderDark)),
                ),
                child: SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      auth.logout();
                    },
                    icon: const Icon(Icons.logout_rounded, color: Colors.redAccent, size: 18),
                    label: const Text('Sign Out', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.redAccent.withOpacity(0.3)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),

      body: IndexedStack(
        index: _selectedIndex,
        children: screens,
      ),

      // Bottom Navigation: Feed is item 0, Dashboard is item 1, Courses item 2, Classes item 3, Profile item 4
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppTheme.cardDark,
          border: Border(top: BorderSide(color: AppTheme.borderDark)),
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: _onBottomNavTapped,
          backgroundColor: Colors.transparent,
          selectedItemColor: AppTheme.primaryOrange,
          unselectedItemColor: AppTheme.textMuted,
          type: BottomNavigationBarType.fixed,
          selectedFontSize: 11,
          unselectedFontSize: 11,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.auto_awesome_rounded),
              label: 'Feed',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_rounded),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.menu_book_rounded),
              label: 'Courses',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.video_camera_front_rounded),
              label: 'Classes',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_rounded),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerItem({
    required IconData icon,
    required String title,
    required bool isAccessible,
    String? requiredLevel,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: isAccessible ? Colors.white70 : AppTheme.textMuted, size: 20),
      title: Text(
        title,
        style: TextStyle(
          color: isAccessible ? Colors.white : AppTheme.textMuted,
          fontSize: 13,
          fontWeight: isAccessible ? FontWeight.w600 : FontWeight.normal,
        ),
      ),
      trailing: !isAccessible
          ? Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.amber.withOpacity(0.15),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Icon(Icons.lock_rounded, color: Colors.amber, size: 12),
            )
          : const Icon(Icons.chevron_right_rounded, color: Colors.white24, size: 18),
      onTap: onTap,
    );
  }
}
