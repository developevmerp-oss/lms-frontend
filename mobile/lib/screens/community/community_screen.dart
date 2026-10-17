import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/level_helper.dart';
import '../../models/community_win_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/community_provider.dart';
import '../../providers/stats_provider.dart';
import '../common/tier_purchase_dialog.dart';

class CommunityScreen extends StatefulWidget {
  const CommunityScreen({super.key});

  @override
  State<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends State<CommunityScreen> {
  final Map<String, TextEditingController> _commentControllers = {};

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CommunityProvider>().fetchWins();
    });
  }

  @override
  void dispose() {
    for (var c in _commentControllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  void _openCreateWinModal(BuildContext context, bool canPost) {
    if (!canPost) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('General and Level 0 members have view-only access. Upgrade to Level 1 or above to share wins.'),
          backgroundColor: Colors.amber,
        ),
      );
      TierPurchaseDialog.show(context, preselectedTier: 'L1');
      return;
    }

    final titleController = TextEditingController();
    final achievementController = TextEditingController();
    final amountController = TextEditingController();
    final techniqueController = TextEditingController();
    final imageController = TextEditingController();

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
                    const Text('Share Community Win', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900)),
                    IconButton(onPressed: () => Navigator.pop(ctx), icon: const Icon(Icons.close, color: Colors.white70)),
                  ],
                ),
                const Text('L1+ members earn +100 XP upon sharing a client sale or resin piece!', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                const SizedBox(height: 16),
                TextField(
                  controller: titleController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Title / Milestone (e.g. First Clock Sale!)', hintText: 'Enter title'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: amountController,
                  keyboardType: TextInputType.number,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Sales Amount (Optional)', hintText: 'e.g. 3500'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: techniqueController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Technique Used', hintText: 'e.g. Geode Art, Ocean Waves'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: imageController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Image / Artwork URL', hintText: 'https://...'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: achievementController,
                  maxLines: 2,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Notes / Journey Description', hintText: 'Describe how you created this piece'),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton.icon(
                    onPressed: () async {
                      if (titleController.text.trim().isEmpty) return;
                      Navigator.pop(ctx);
                      final success = await context.read<CommunityProvider>().postWin(
                        title: titleController.text.trim(),
                        achievement: achievementController.text.trim().isNotEmpty ? achievementController.text.trim() : titleController.text.trim(),
                        salesAmount: amountController.text.trim().isNotEmpty ? amountController.text.trim() : null,
                        technique: techniqueController.text.trim().isNotEmpty ? techniqueController.text.trim() : null,
                        imageUrl: imageController.text.trim().isNotEmpty ? imageController.text.trim() : null,
                      );
                      if (success && mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('🎉 Win published! +100 XP recorded!'), backgroundColor: Colors.green),
                        );
                        context.read<StatsProvider>().fetchStudentDashboard(silent: true);
                      }
                    },
                    icon: const Icon(Icons.send_rounded, size: 18),
                    label: const Text('Post Win (+100 XP)'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryOrange,
                      foregroundColor: Colors.black,
                      textStyle: const TextStyle(fontWeight: FontWeight.w900),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
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
    final stats = statsProvider.stats;
    final community = context.watch<CommunityProvider>();

    final user = auth.user;
    final effectiveLevel = user?.membershipLevel ?? stats?.membershipLevel ?? 'GENERAL';
    final canPost = LevelHelper.canPostCommunityWin(effectiveLevel);
    final badges = stats?.badges ?? [];

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openCreateWinModal(context, canPost),
        backgroundColor: AppTheme.primaryOrange,
        foregroundColor: Colors.black,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Share Win', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await community.fetchWins();
          await statsProvider.fetchStudentDashboard(silent: true);
        },
        color: AppTheme.primaryOrange,
        child: community.isLoading && community.wins.isEmpty
            ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryOrange))
            : ListView(
                padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 80),
                children: [
                  // Feed Header Banner (matching web /student/feed)
                  Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          AppTheme.primaryOrange.withOpacity(0.15),
                          AppTheme.cardDark,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: AppTheme.primaryOrange.withOpacity(0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppTheme.primaryOrange,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text('✨ SISTERHOOD FEED', style: TextStyle(color: Colors.black, fontSize: 10, fontWeight: FontWeight.w900)),
                            ),
                            const Spacer(),
                            if (!canPost)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.amber.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: Colors.amber.withOpacity(0.3)),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(Icons.lock_rounded, size: 12, color: Colors.amber),
                                    SizedBox(width: 4),
                                    Text('View-Only (Upgrade for Post)', style: TextStyle(color: Colors.amber, fontSize: 10, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Sisterhood Community Feed',
                          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Live sisterhood sales, resin artwork showcases, student milestones, and mentor updates.',
                          style: TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4),
                        ),
                      ],
                    ),
                  ),

                  // Diamond Club Gamification Notice (matching web /student/feed)
                  Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppTheme.cardDark,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.cyan.withOpacity(0.3)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.diamond_rounded, color: Colors.cyanAccent, size: 22),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Diamond Club Gamification', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                              Text(
                                'L1, L2, L3 members earn +100 XP for sharing wins, and active engagement rewards!',
                                style: TextStyle(color: AppTheme.textMuted, fontSize: 10),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Badges Spotlight Ribbon
                  if (badges.isNotEmpty) ...[
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppTheme.cardDark,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.borderDark),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.emoji_events_rounded, color: Colors.amber, size: 16),
                              SizedBox(width: 6),
                              Text('Student Badges Spotlight', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: badges.take(5).map((b) {
                                return Container(
                                  margin: const EdgeInsets.only(right: 8),
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: AppTheme.bgDark,
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: AppTheme.borderDark),
                                  ),
                                  child: Row(
                                    children: [
                                      Text(b.icon, style: const TextStyle(fontSize: 14)),
                                      const SizedBox(width: 6),
                                      Text(b.name, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                    ],
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  // Feed Wins Cards
                  if (community.wins.isEmpty)
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.all(24.0),
                        child: Text('No community wins posted yet. Be the first to share your breakthrough!', style: TextStyle(color: AppTheme.textMuted)),
                      ),
                    )
                  else
                    ...community.wins.map((win) => _buildWinCard(context, win, canPost)),
                ],
              ),
      ),
    );
  }

  Widget _buildWinCard(BuildContext context, CommunityWin win, bool canComment) {
    final community = context.read<CommunityProvider>();
    final controller = _commentControllers.putIfAbsent(win.id, () => TextEditingController());

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author Header
          Row(
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: AppTheme.primaryOrange.withOpacity(0.2),
                child: Text(
                  win.studentName.isNotEmpty ? win.studentName[0].toUpperCase() : 'A',
                  style: const TextStyle(color: AppTheme.primaryOrange, fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(win.studentName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    Text(win.timeAgo, style: const TextStyle(color: AppTheme.textMuted, fontSize: 10)),
                  ],
                ),
              ),
              if (win.amount != null && win.amount!.isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.green.withOpacity(0.3)),
                  ),
                  child: Text(
                    '₹${win.amount}',
                    style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.w900, fontSize: 12),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),

          // Title & Achievement
          Text(win.title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 15)),
          if (win.achievement.isNotEmpty && win.achievement != win.title) ...[
            const SizedBox(height: 4),
            Text(win.achievement, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4)),
          ],

          // Artwork Image (if present)
          if (win.image != null && win.image!.isNotEmpty) ...[
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: Image.network(
                win.image!,
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const SizedBox.shrink(),
              ),
            ),
          ],
          const SizedBox(height: 14),

          // Like & Comments actions
          Row(
            children: [
              GestureDetector(
                onTap: () => community.likeWin(win.id),
                child: Row(
                  children: [
                    const Icon(Icons.favorite_rounded, color: Colors.pinkAccent, size: 18),
                    const SizedBox(width: 6),
                    Text('${win.likes} Likes', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  ],
                ),
              ),
              const SizedBox(width: 20),
              Row(
                children: [
                  const Icon(Icons.chat_bubble_outline_rounded, color: Colors.white70, size: 17),
                  const SizedBox(width: 6),
                  Text('${win.comments.length} Comments', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                ],
              ),
            ],
          ),

          // Comment list
          if (win.comments.isNotEmpty) ...[
            const Divider(color: AppTheme.borderDark, height: 20),
            ...win.comments.take(3).map((c) => Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: RichText(
                text: TextSpan(
                  children: [
                    TextSpan(text: '${c.author}: ', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
                    TextSpan(text: c.text, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
                  ],
                ),
              ),
            )),
          ],

          // Add comment field (gated for view-only members)
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: controller,
                  enabled: canComment,
                  style: const TextStyle(color: Colors.white, fontSize: 12),
                  decoration: InputDecoration(
                    hintText: canComment ? 'Write an encouraging comment...' : 'Upgrade to L1+ to comment',
                    hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: canComment
                    ? () async {
                        final text = controller.text.trim();
                        if (text.isEmpty) return;
                        controller.clear();
                        await community.commentWin(win.id, text);
                      }
                    : () {
                        TierPurchaseDialog.show(context, preselectedTier: 'L1');
                      },
                icon: const Icon(Icons.send_rounded, color: AppTheme.primaryOrange, size: 20),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
