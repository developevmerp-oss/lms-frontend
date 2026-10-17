import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/stats_provider.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final statsProvider = context.watch<StatsProvider>();
    final notifications = statsProvider.stats?.notifications ?? [];

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      appBar: AppBar(
        backgroundColor: AppTheme.bgDark,
        elevation: 0,
        title: const Text('Notifications & Broadcasts', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
      ),
      body: RefreshIndicator(
        onRefresh: () => statsProvider.fetchStudentDashboard(),
        color: AppTheme.primaryOrange,
        child: notifications.isEmpty
            ? const Center(
                child: Padding(
                  padding: EdgeInsets.all(24.0),
                  child: Text('No announcements or notifications yet.', style: TextStyle(color: AppTheme.textMuted)),
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: notifications.length,
                itemBuilder: (ctx, idx) {
                  final notif = notifications[idx];
                  final title = notif is Map ? notif['title']?.toString() ?? 'Update' : 'Update';
                  final msg = notif is Map ? notif['message']?.toString() ?? '' : '';
                  final type = notif is Map ? notif['type']?.toString() ?? 'info' : 'info';
                  final date = notif is Map ? notif['createdAt']?.toString() ?? '' : '';

                  final isOffer = type == 'offer';
                  final isEvent = type == 'event';

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.cardDark,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: isOffer
                            ? Colors.red.withOpacity(0.3)
                            : isEvent
                                ? Colors.blue.withOpacity(0.3)
                                : AppTheme.borderDark,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              isOffer ? '🔥 SPECIAL OFFER' : isEvent ? '🎥 LIVE CLASS' : '📢 ANNOUNCEMENT',
                              style: TextStyle(
                                color: isOffer ? Colors.redAccent : isEvent ? Colors.lightBlueAccent : AppTheme.primaryOrange,
                                fontSize: 10,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            if (date.isNotEmpty)
                              Text(date.split('T')[0], style: const TextStyle(color: AppTheme.textMuted, fontSize: 10)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(title, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text(msg, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4)),
                      ],
                    ),
                  );
                },
              ),
      ),
    );
  }
}
