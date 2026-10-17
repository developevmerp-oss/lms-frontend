import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/api/api_client.dart';
import '../../core/api/endpoints.dart';
import '../../core/theme/app_theme.dart';
import '../common/tier_purchase_dialog.dart';

class WebinarScreen extends StatefulWidget {
  const WebinarScreen({super.key});

  @override
  State<WebinarScreen> createState() => _WebinarScreenState();
}

class _WebinarScreenState extends State<WebinarScreen> {
  List<dynamic> _webinars = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchWebinars();
  }

  Future<void> _fetchWebinars() async {
    setState(() => _isLoading = true);
    try {
      final res = await ApiClient.get(Endpoints.webinarEvents);
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data['success'] == true && data['data'] is List) {
          _webinars = data['data'];
        }
      }
    } catch (_) {}
    setState(() => _isLoading = false);
  }

  void _openUrl(String? url) async {
    if (url == null || url.isEmpty) return;
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      appBar: AppBar(
        backgroundColor: AppTheme.bgDark,
        elevation: 0,
        title: const Text('Live Webinar Hub', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
      ),
      body: RefreshIndicator(
        onRefresh: _fetchWebinars,
        color: AppTheme.primaryOrange,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryOrange))
            : _webinars.isEmpty
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24.0),
                      child: Text('No upcoming live webinar events found.', style: TextStyle(color: AppTheme.textMuted)),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _webinars.length,
                    itemBuilder: (ctx, idx) {
                      final item = _webinars[idx];
                      final title = item['title']?.toString() ?? 'Webinar';
                      final desc = item['description']?.toString() ?? '';
                      final zoomUrl = item['zoomJoinUrl']?.toString();
                      final waUrl = item['whatsappGroupUrl']?.toString();
                      final prepVideoUrl = item['prepVideoUrl']?.toString();
                      final scheduledAt = item['scheduledAt']?.toString() ?? '';

                      return Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppTheme.cardDark,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.borderDark),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppTheme.primaryOrange.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text('⚡ Fast Track Webinar', style: TextStyle(color: AppTheme.primaryOrange, fontSize: 10, fontWeight: FontWeight.bold)),
                            ),
                            const SizedBox(height: 10),
                            Text(title, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                            if (desc.isNotEmpty) ...[
                              const SizedBox(height: 6),
                              Text(desc, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4)),
                            ],
                            const SizedBox(height: 10),
                            Row(
                              children: [
                                const Icon(Icons.calendar_today_rounded, size: 14, color: AppTheme.textMuted),
                                const SizedBox(width: 6),
                                Text(scheduledAt.split('T')[0], style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                              ],
                            ),
                            const SizedBox(height: 16),

                            // Action buttons
                            Row(
                              children: [
                                if (zoomUrl != null && zoomUrl.isNotEmpty)
                                  Expanded(
                                    child: ElevatedButton.icon(
                                      onPressed: () => _openUrl(zoomUrl),
                                      icon: const Icon(Icons.video_call_rounded, size: 16),
                                      label: const Text('Join Zoom'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppTheme.primaryOrange,
                                        foregroundColor: Colors.black,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                      ),
                                    ),
                                  ),
                                if (waUrl != null && waUrl.isNotEmpty) ...[
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: OutlinedButton.icon(
                                      onPressed: () => _openUrl(waUrl),
                                      icon: const Icon(Icons.chat_bubble_rounded, size: 16, color: Colors.greenAccent),
                                      label: const Text('VIP WhatsApp', style: TextStyle(color: Colors.greenAccent)),
                                      style: OutlinedButton.styleFrom(
                                        side: const BorderSide(color: Colors.greenAccent),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                      ),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            if (prepVideoUrl != null && prepVideoUrl.isNotEmpty) ...[
                              const SizedBox(height: 10),
                              SizedBox(
                                width: double.infinity,
                                child: TextButton.icon(
                                  onPressed: () => _openUrl(prepVideoUrl),
                                  icon: const Icon(Icons.play_circle_rounded, size: 16, color: Colors.cyanAccent),
                                  label: const Text('Watch Preparation Workshop Video', style: TextStyle(color: Colors.cyanAccent, fontSize: 12)),
                                ),
                              ),
                            ],
                          ],
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}
