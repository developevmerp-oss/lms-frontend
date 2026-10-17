import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/level_helper.dart';
import '../../models/student_stats_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/stats_provider.dart';
import '../common/tier_purchase_dialog.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  void _openEditProfileModal(BuildContext context) {
    final auth = context.read<AuthProvider>();
    final user = auth.user;

    final nameController = TextEditingController(text: user?.name);
    final phoneController = TextEditingController(text: user?.phone);
    final cityController = TextEditingController(text: user?.city);
    final bioController = TextEditingController(text: user?.bio);
    final avatarController = TextEditingController(text: user?.avatarUrl);
    final passwordController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: AppTheme.cardDark,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Edit Profile', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                    IconButton(onPressed: () => Navigator.pop(ctx), icon: const Icon(Icons.close, color: Colors.white70)),
                  ],
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: nameController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Full Name'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: phoneController,
                  keyboardType: TextInputType.phone,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Phone Number'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: cityController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'City / Location'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: avatarController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Avatar Image URL'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: bioController,
                  maxLines: 2,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Bio / Artist Statement'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: passwordController,
                  obscureText: true,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'New Password (Optional, min 6 chars)'),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () async {
                      if (nameController.text.trim().isEmpty) return;
                      Navigator.pop(ctx);
                      final success = await auth.updateProfile(
                        name: nameController.text.trim(),
                        phone: phoneController.text.trim(),
                        city: cityController.text.trim(),
                        avatarUrl: avatarController.text.trim(),
                        bio: bioController.text.trim(),
                        password: passwordController.text.trim().isNotEmpty ? passwordController.text.trim() : null,
                      );
                      if (success && mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Profile updated successfully!'), backgroundColor: Colors.green),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryOrange,
                      foregroundColor: Colors.black,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Save Changes', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final statsProvider = context.watch<StatsProvider>();
    final user = auth.user;
    final stats = statsProvider.stats;

    final effectiveLevel = user?.membershipLevel ?? stats?.membershipLevel ?? 'GENERAL';
    final studentLevelCode = LevelHelper.getLevelCode(effectiveLevel);
    final points = stats?.points ?? user?.points ?? 0;
    final studentRankNum = LevelHelper.getLevelOrder(studentLevelCode);

    final curriculumTiers = [
      {'code': 'L0', 'name': 'Fast Start', 'range': '0 - 499 XP', 'desc': 'Resin fundamentals, safety & first 5 art pieces', 'icon': '⚡'},
      {'code': 'L1', 'name': 'Silver Member', 'range': '500 - 4,999 XP', 'desc': 'Core art techniques, custom orders & first client sale', 'icon': '🥈'},
      {'code': 'L2', 'name': 'Gold Member', 'range': '5,000 - 9,999 XP', 'desc': 'Consistent ₹25K-₹50K monthly revenue & luxury wall clocks', 'icon': '🏆'},
      {'code': 'L3', 'name': 'Diamond Club', 'range': '10,000 - 49,999 XP', 'desc': 'Scale beyond ₹50K/month & bulk corporate art contracts', 'icon': '💎'},
      {'code': 'L3+', 'name': 'Masters Club', 'range': '50,000+ XP', 'desc': 'Offline city workshops & signature resin empire brand', 'icon': '👑'},
    ];

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Profile Card
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              color: AppTheme.cardDark,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppTheme.borderDark),
            ),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 36,
                  backgroundColor: AppTheme.primaryOrange,
                  backgroundImage: user?.avatarUrl != null && user!.avatarUrl!.isNotEmpty ? NetworkImage(user.avatarUrl!) : null,
                  child: user?.avatarUrl == null || user!.avatarUrl!.isEmpty
                      ? Text((user?.name.isNotEmpty == true ? user!.name[0] : 'A').toUpperCase(), style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.black))
                      : null,
                ),
                const SizedBox(height: 12),
                Text(user?.name ?? 'Art Student', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                Text(user?.email ?? '', style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                const SizedBox(height: 8),

                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryOrange.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppTheme.primaryOrange.withOpacity(0.4)),
                  ),
                  child: Text(
                    studentLevelCode == 'GENERAL' ? 'General Member' : '$studentLevelCode Tier Member',
                    style: const TextStyle(color: AppTheme.primaryOrange, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 14),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _buildStatPill('Points', '$points XP', Icons.emoji_events_rounded, Colors.amber),
                    const SizedBox(width: 14),
                    _buildStatPill('Streak', '${stats?.streak ?? 0} Days', Icons.local_fire_department_rounded, Colors.orange),
                  ],
                ),
                const SizedBox(height: 18),

                SizedBox(
                  width: double.infinity,
                  height: 42,
                  child: OutlinedButton.icon(
                    onPressed: () => _openEditProfileModal(context),
                    icon: const Icon(Icons.edit_rounded, size: 16),
                    label: const Text('Edit Profile Details'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: AppTheme.borderDark),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // 5-Tier Level Progression Ladder
          const Text('Curriculum Tier Progression', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),

          ...curriculumTiers.asMap().entries.map((entry) {
            final idx = entry.key;
            final t = entry.value;
            final code = t['code']!;
            final order = LevelHelper.getLevelOrder(code);

            final isCurrent = studentRankNum == order;
            final isCompleted = studentRankNum > order;
            final isLocked = studentRankNum < order;

            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isCurrent ? AppTheme.primaryOrange.withOpacity(0.1) : AppTheme.cardDark,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(
                  color: isCurrent ? AppTheme.primaryOrange : AppTheme.borderDark,
                ),
              ),
              child: Row(
                children: [
                  Text(t['icon']!, style: const TextStyle(fontSize: 24)),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(t['name']!, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                            const SizedBox(width: 6),
                            if (isCurrent)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(color: AppTheme.primaryOrange, borderRadius: BorderRadius.circular(6)),
                                child: const Text('CURRENT', style: TextStyle(color: Colors.black, fontSize: 9, fontWeight: FontWeight.bold)),
                              ),
                          ],
                        ),
                        Text(t['desc']!, style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                      ],
                    ),
                  ),
                  Icon(
                    isCompleted
                        ? Icons.check_circle_rounded
                        : isCurrent
                            ? Icons.radio_button_checked_rounded
                            : Icons.lock_rounded,
                    color: isCompleted
                        ? Colors.greenAccent
                        : isCurrent
                            ? AppTheme.primaryOrange
                            : Colors.white24,
                    size: 20,
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildStatPill(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: AppTheme.bgDark,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 16),
          const SizedBox(width: 6),
          Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
        ],
      ),
    );
  }
}
