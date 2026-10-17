import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../models/assignment_model.dart';
import '../../providers/task_provider.dart';

class SubmitArtworkScreen extends StatefulWidget {
  final AssignmentModel assignment;
  const SubmitArtworkScreen({super.key, required this.assignment});

  @override
  State<SubmitArtworkScreen> createState() => _SubmitArtworkScreenState();
}

class _SubmitArtworkScreenState extends State<SubmitArtworkScreen> {
  final _notesController = TextEditingController();
  File? _pickedFile;

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _handleSubmit() async {
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);
    final success = await taskProvider.submitArtwork(
      widget.assignment.id,
      _notesController.text.trim(),
      _pickedFile,
    );

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Artwork submitted successfully! Placed in mentor review queue.'),
          backgroundColor: AppTheme.accentGreen,
        ),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final taskProvider = Provider.of<TaskProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Submit Homework'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.assignment.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Text(
              'Upload crisp, clear photos of your finished resin artwork. Mentor will review your cell structure, finish, and award +${widget.assignment.xpReward} XP.',
              style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
            ),
            const SizedBox(height: 24),

            // Artwork Photo Upload Box
            GestureDetector(
              onTap: () {
                // In production, uses ImagePicker. For quick testing, simulates selected photo:
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Camera / Gallery selector active.')),
                );
              },
              child: Container(
                height: 180,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFF131B2E),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.primary.withOpacity(0.4), style: BorderStyle.solid),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.add_a_photo_outlined, size: 40, color: AppTheme.primary),
                    SizedBox(height: 8),
                    Text('Tap to Take Photo or Pick from Gallery', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    SizedBox(height: 4),
                    Text('High-resolution JPG or PNG supported', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Project Notes Field
            const Text('Project Notes & Formulas Used', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 8),
            TextField(
              controller: _notesController,
              maxLines: 4,
              decoration: const InputDecoration(
                hintText: 'e.g. Mixed 150g 2:1 resin, heated with gun at 45 degree angle for 30s. Pigment was Titanium White...',
              ),
            ),
            const SizedBox(height: 32),

            // Submit Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: taskProvider.isLoading ? null : _handleSubmit,
                child: taskProvider.isLoading
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Text('Submit for Mentor Evaluation'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
