import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../models/community_win_model.dart';
import '../../providers/community_provider.dart';
import 'post_win_screen.dart';

class CommunityFeedScreen extends StatefulWidget {
  const CommunityFeedScreen({super.key});

  @override
  State<CommunityFeedScreen> createState() => _CommunityFeedScreenState();
}

class _CommunityFeedScreenState extends State<CommunityFeedScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<CommunityProvider>(context, listen: false).fetchWins();
    });
  }

  @override
  Widget build(BuildContext context) {
    final communityProvider = Provider.of<CommunityProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Community Win Wall'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primary,
        icon: const Icon(Icons.add_photo_alternate_rounded, color: Colors.white),
        label: const Text('Celebrate Win', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const PostWinScreen()),
          );
        },
      ),
      body: communityProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => communityProvider.fetchWins(),
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: communityProvider.wins.length,
                itemBuilder: (context, index) {
                  final win = communityProvider.wins[index];
                  return _buildWinPostCard(win);
                },
              ),
            ),
    );
  }

  Widget _buildWinPostCard(CommunityWinModel win) {
    final community = Provider.of<CommunityProvider>(context, listen: false);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF131B2E),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author Header
          Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: AppTheme.primary,
                  child: Text(
                    win.authorName.isNotEmpty ? win.authorName[0].toUpperCase() : 'A',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(win.authorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      const Text('Resin Academy Member', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                    ],
                  ),
                ),
                const Text('🔥 WIN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.orange)),
              ],
            ),
          ),

          // Artwork Image (If present)
          if (win.imageUrl != null && win.imageUrl!.isNotEmpty)
            Container(
              height: 200,
              width: double.infinity,
              color: Colors.black26,
              child: Image.network(
                win.imageUrl!,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const Center(
                  child: Icon(Icons.palette_outlined, size: 48, color: Colors.white30),
                ),
              ),
            ),

          // Content
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(win.title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                Text(win.content, style: const TextStyle(color: Colors.white70, fontSize: 13)),
                const SizedBox(height: 12),

                // Likes & Comments Actions
                Row(
                  children: [
                    GestureDetector(
                      onTap: () => community.toggleLike(win.id),
                      child: Row(
                        children: [
                          Icon(
                            win.isLiked ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                            size: 18,
                            color: win.isLiked ? Colors.redAccent : AppTheme.textMuted,
                          ),
                          const SizedBox(width: 6),
                          Text('${win.likesCount} Cheers', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                    const SizedBox(width: 20),
                    Row(
                      children: [
                        const Icon(Icons.chat_bubble_outline_rounded, size: 18, color: AppTheme.textMuted),
                        const SizedBox(width: 6),
                        Text('${win.commentsCount} Comments', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
