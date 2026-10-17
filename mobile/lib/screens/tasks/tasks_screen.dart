import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../models/assignment_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/task_provider.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  final _fileUrlController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TaskProvider>().fetchAssignments();
    });
  }

  @override
  void dispose() {
    _fileUrlController.dispose();
    super.dispose();
  }

  void _showSubmitModal(BuildContext context, Assignment assignment) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.cardDark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Submit ${assignment.title}', style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Paste your Google Drive, Imgur, or cloud link for mentor review:', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
            const SizedBox(height: 12),
            TextField(
              controller: _fileUrlController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(labelText: 'Artwork File URL', hintText: 'https://...'),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel', style: TextStyle(color: AppTheme.textMuted))),
          ElevatedButton(
            onPressed: () async {
              final url = _fileUrlController.text.trim();
              if (url.isEmpty) return;
              Navigator.pop(ctx);
              final success = await context.read<TaskProvider>().submitAssignment(assignment.id, url);
              _fileUrlController.clear();
              if (success && mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('🎉 Assignment submitted! A mentor will review it shortly.'), backgroundColor: Colors.green),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryOrange, foregroundColor: Colors.black),
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final taskProvider = context.watch<TaskProvider>();
    final userId = auth.user?.id;

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      appBar: AppBar(
        backgroundColor: AppTheme.bgDark,
        elevation: 0,
        title: const Text('Daily Tasks & Missions', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
      ),
      body: RefreshIndicator(
        onRefresh: () => taskProvider.fetchAssignments(),
        color: AppTheme.primaryOrange,
        child: taskProvider.isLoading
            ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryOrange))
            : taskProvider.assignments.isEmpty
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24.0),
                      child: Text('You are all caught up! No active assignments right now.', style: TextStyle(color: AppTheme.textMuted)),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: taskProvider.assignments.length,
                    itemBuilder: (ctx, idx) {
                      final assn = taskProvider.assignments[idx];
                      final mySub = assn.submissions.where((s) => s.studentId == userId).firstOrNull;

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
                                Expanded(
                                  child: Text(
                                    assn.title,
                                    style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppTheme.primaryOrange.withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text('+${assn.points} XP', style: const TextStyle(color: AppTheme.primaryOrange, fontWeight: FontWeight.w900, fontSize: 12)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(assn.description, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4)),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                const Icon(Icons.calendar_today_rounded, size: 13, color: AppTheme.textMuted),
                                const SizedBox(width: 6),
                                Text('Due: ${assn.dueDate.split('T')[0]}', style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                              ],
                            ),
                            const SizedBox(height: 16),

                            // Submission Status or Action
                            if (mySub != null)
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.symmetric(vertical: 10),
                                decoration: BoxDecoration(
                                  color: mySub.status == 'approved'
                                      ? Colors.green.withOpacity(0.15)
                                      : mySub.status == 'rejected'
                                          ? Colors.red.withOpacity(0.15)
                                          : Colors.amber.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  mySub.status == 'approved'
                                      ? '✓ Approved (+${mySub.pointsAwarded ?? assn.points} XP)'
                                      : mySub.status == 'rejected'
                                          ? '✗ Needs Improvement'
                                          : '⏳ Pending Review',
                                  style: TextStyle(
                                    color: mySub.status == 'approved'
                                        ? Colors.greenAccent
                                        : mySub.status == 'rejected'
                                            ? Colors.redAccent
                                            : Colors.amber,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              )
                            else
                              SizedBox(
                                width: double.infinity,
                                height: 42,
                                child: ElevatedButton.icon(
                                  onPressed: () => _showSubmitModal(context, assn),
                                  icon: const Icon(Icons.upload_file_rounded, size: 16),
                                  label: const Text('Submit Assignment'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.primaryOrange,
                                    foregroundColor: Colors.black,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}
