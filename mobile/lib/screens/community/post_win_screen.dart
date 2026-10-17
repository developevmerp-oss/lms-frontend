import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/community_provider.dart';

class PostWinScreen extends StatefulWidget {
  const PostWinScreen({super.key});

  @override
  State<PostWinScreen> createState() => _PostWinScreenState();
}

class _PostWinScreenState extends State<PostWinScreen> {
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    super.dispose();
  }

  void _handlePost() async {
    final title = _titleController.text.trim();
    final content = _contentController.text.trim();

    if (title.isEmpty || content.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter both title and description')),
      );
      return;
    }

    final comm = Provider.of<CommunityProvider>(context, listen: false);
    await comm.postWin(title, content, null);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Celebration win posted to student community wall! 🎉'),
          backgroundColor: AppTheme.accentGreen,
        ),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Post Community Win'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Celebrate Your Art Milestone',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            const Text(
              'Finished a difficult resin piece? Made your first client sale? Share it with the community to inspire your peers!',
              style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
            ),
            const SizedBox(height: 24),

            const Text('Win Headline', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 8),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(hintText: 'e.g. Sold my first geode clock for ₹4,500! 🎉'),
            ),
            const SizedBox(height: 18),

            const Text('Story & Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 8),
            TextField(
              controller: _contentController,
              maxLines: 5,
              decoration: const InputDecoration(
                hintText: 'Share what you made, how long it took, what technique worked best, and advice for fellow students...',
              ),
            ),
            const SizedBox(height: 32),

            ElevatedButton(
              onPressed: _handlePost,
              child: const Text('Share Win on Community Feed'),
            ),
          ],
        ),
      ),
    );
  }
}
