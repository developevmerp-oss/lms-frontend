import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../models/course_model.dart';

class CoursePlayerScreen extends StatefulWidget {
  final CourseModel course;
  const CoursePlayerScreen({super.key, required this.course});

  @override
  State<CoursePlayerScreen> createState() => _CoursePlayerScreenState();
}

class _CoursePlayerScreenState extends State<CoursePlayerScreen> {
  int _activeChapterIndex = 0;
  bool _isPlaying = true;

  @override
  Widget build(BuildContext context) {
    final activeChapter = widget.course.chapters.isNotEmpty
        ? widget.course.chapters[_activeChapterIndex]
        : ChapterModel(id: '0', title: 'Lesson 1', duration: '15 mins');

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.course.title, style: const TextStyle(fontSize: 16)),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Embedded Video Player Area
          Container(
            height: 220,
            width: double.infinity,
            color: Colors.black,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Simulated high-def video stream
                Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF0F172A), Color(0xFF0284C7)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.waves_rounded, size: 54, color: Colors.cyanAccent),
                        const SizedBox(height: 8),
                        Text(
                          activeChapter.title,
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                ),

                // Video controls overlay
                IconButton(
                  iconSize: 56,
                  icon: Icon(
                    _isPlaying ? Icons.pause_circle_filled_rounded : Icons.play_circle_fill_rounded,
                    color: Colors.white,
                  ),
                  onPressed: () => setState(() => _isPlaying = !_isPlaying),
                ),

                // Scrubber bar at bottom
                Positioned(
                  bottom: 8,
                  left: 16,
                  right: 16,
                  child: Row(
                    children: [
                      const Text('04:12', style: TextStyle(fontSize: 10, color: Colors.white70)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: const LinearProgressIndicator(
                            value: 0.35,
                            minHeight: 4,
                            backgroundColor: Colors.white24,
                            valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primary),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(activeChapter.duration, style: const TextStyle(fontSize: 10, color: Colors.white70)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Chapter details & XP Reward
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Lesson ${_activeChapterIndex + 1} of ${widget.course.chapters.length}',
                      style: const TextStyle(color: AppTheme.textMuted, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.accentGreen.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text('+100 XP On Completion', style: TextStyle(color: AppTheme.accentGreen, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  activeChapter.title,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                ),
              ],
            ),
          ),
          const Divider(color: Color(0xFF1E293B), height: 1),

          // Chapter List Header
          const Padding(
            padding: EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Text(
              'Curriculum Chapters & Lessons',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textMuted),
            ),
          ),

          // Scrollable Chapter List
          Expanded(
            child: ListView.builder(
              itemCount: widget.course.chapters.length,
              itemBuilder: (context, index) {
                final ch = widget.course.chapters[index];
                final isSelected = index == _activeChapterIndex;

                return Container(
                  color: isSelected ? const Color(0xFF1E293B) : Colors.transparent,
                  child: ListTile(
                    leading: CircleAvatar(
                      radius: 14,
                      backgroundColor: isSelected
                          ? AppTheme.primary
                          : ch.isCompleted
                              ? AppTheme.accentGreen
                              : const Color(0xFF131B2E),
                      child: Icon(
                        ch.isCompleted ? Icons.check : Icons.play_arrow_rounded,
                        size: 16,
                        color: Colors.white,
                      ),
                    ),
                    title: Text(
                      ch.title,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                        color: isSelected ? Colors.white : AppTheme.textLight,
                      ),
                    ),
                    subtitle: Text(ch.duration, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                    trailing: const Icon(Icons.download_rounded, size: 18, color: AppTheme.textMuted),
                    onTap: () {
                      setState(() {
                        _activeChapterIndex = index;
                      });
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
