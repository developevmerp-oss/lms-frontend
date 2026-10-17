import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../models/assignment_model.dart';
import '../../providers/task_provider.dart';
import 'submit_artwork_screen.dart';

class TasksDeskScreen extends StatefulWidget {
  const TasksDeskScreen({super.key});

  @override
  State<TasksDeskScreen> createState() => _TasksDeskScreenState();
}

class _TasksDeskScreenState extends State<TasksDeskScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<TaskProvider>(context, listen: false).fetchAssignments();
    });
  }

  @override
  Widget build(BuildContext context) {
    final taskProvider = Provider.of<TaskProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Homework & Artwork Review'),
      ),
      body: taskProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => taskProvider.fetchAssignments(),
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: taskProvider.assignments.length,
                itemBuilder: (context, index) {
                  final task = taskProvider.assignments[index];
                  return _buildAssignmentCard(task);
                },
              ),
            ),
    );
  }

  Widget _buildAssignmentCard(AssignmentModel task) {
    final sub = task.mySubmission;

    Color statusColor = Colors.orange;
    String statusText = 'Pending Submission';

    if (sub != null) {
      if (sub.status == 'approved') {
        statusColor = AppTheme.accentGreen;
        statusText = 'Approved (+${sub.xpAwarded ?? task.xpReward} XP)';
      } else if (sub.status == 'pending') {
        statusColor = Colors.amber;
        statusText = 'Under Mentor Review';
      } else {
        statusColor = Colors.redAccent;
        statusText = 'Revision Requested';
      }
    }

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
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  statusText,
                  style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 11),
                ),
              ),
              Text(
                '+${task.xpReward} XP',
                style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.accentAmber, fontSize: 13),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(task.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text(task.description, style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
          const SizedBox(height: 14),

          // Mentor Feedback Card (If approved or reviewed)
          if (sub?.feedbackNotes != null && sub!.feedbackNotes!.isNotEmpty) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppTheme.accentGreen.withOpacity(0.3)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('👨‍🏫', style: TextStyle(fontSize: 18)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Mentor Critique:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.accentGreen)),
                        const SizedBox(height: 2),
                        Text(sub.feedbackNotes!, style: const TextStyle(fontSize: 12, color: Colors.white70)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
          ],

          // Submit Artwork Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              icon: Icon(sub != null ? Icons.refresh : Icons.camera_alt_outlined, size: 18),
              label: Text(sub != null ? 'Re-Submit Updated Photo' : 'Upload Artwork for Review'),
              style: ElevatedButton.styleFrom(
                backgroundColor: sub != null ? const Color(0xFF1E293B) : AppTheme.primary,
              ),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => SubmitArtworkScreen(assignment: task)),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
