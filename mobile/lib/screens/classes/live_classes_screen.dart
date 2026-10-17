import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../models/live_class_model.dart';
import '../../providers/class_provider.dart';

class LiveClassesScreen extends StatefulWidget {
  const LiveClassesScreen({super.key});

  @override
  State<LiveClassesScreen> createState() => _LiveClassesScreenState();
}

class _LiveClassesScreenState extends State<LiveClassesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ClassProvider>(context, listen: false).fetchClasses();
    });
  }

  @override
  Widget build(BuildContext context) {
    final classProvider = Provider.of<ClassProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Workshops & Replays'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.primary,
          labelColor: Colors.white,
          unselectedLabelColor: AppTheme.textMuted,
          tabs: const [
            Tab(text: 'Upcoming Live Classes'),
            Tab(text: 'Past Replay Vault'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Upcoming Tab
          RefreshIndicator(
            onRefresh: () => classProvider.fetchClasses(),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: classProvider.upcomingClasses.length,
              itemBuilder: (context, index) {
                final cls = classProvider.upcomingClasses[index];
                return _buildClassCard(cls, isReplay: false);
              },
            ),
          ),

          // Replays Tab
          RefreshIndicator(
            onRefresh: () => classProvider.fetchClasses(),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: classProvider.pastClasses.length,
              itemBuilder: (context, index) {
                final cls = classProvider.pastClasses[index];
                return _buildClassCard(cls, isReplay: true);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildClassCard(LiveClassModel cls, {required bool isReplay}) {
    final timeFormatted = DateFormat('EEE, MMM d • h:mm a').format(cls.scheduledAt);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF131B2E),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E293B)),
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
                  color: isReplay ? Colors.blue.withOpacity(0.15) : Colors.red.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  isReplay ? 'VIDEO REPLAY' : '🔴 UPCOMING LIVE',
                  style: TextStyle(
                    color: isReplay ? Colors.lightBlue : Colors.redAccent,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const Text(
                '+100 Attendance XP',
                style: TextStyle(color: AppTheme.accentGreen, fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(cls.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text('Mentor: ${cls.instructor}', style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
          const SizedBox(height: 4),
          Text(timeFormatted, style: const TextStyle(color: AppTheme.secondary, fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 16),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              icon: Icon(isReplay ? Icons.play_arrow_rounded : Icons.videocam_rounded, size: 18),
              label: Text(isReplay ? 'Watch Recorded Replay' : '1-Click Join Google Meet / Zoom'),
              style: ElevatedButton.styleFrom(
                backgroundColor: isReplay ? const Color(0xFF1E293B) : Colors.redAccent,
              ),
              onPressed: () async {
                final classProvider = Provider.of<ClassProvider>(context, listen: false);
                await classProvider.joinClass(cls.id);
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Attendance recorded! Opening live meeting link...'),
                      backgroundColor: AppTheme.accentGreen,
                    ),
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
