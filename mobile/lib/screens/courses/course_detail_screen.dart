import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_theme.dart';
import '../../models/course_model.dart';

class CourseDetailScreen extends StatefulWidget {
  final Course course;

  const CourseDetailScreen({super.key, required this.course});

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  Chapter? _activeChapter;

  @override
  void initState() {
    super.initState();
    if (widget.course.chapters.isNotEmpty) {
      _activeChapter = widget.course.chapters.first;
    }
  }

  void _launchMediaUrl(String? url) async {
    if (url == null || url.isEmpty) return;
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final course = widget.course;
    final chapters = course.chapters;

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      appBar: AppBar(
        backgroundColor: AppTheme.bgDark,
        elevation: 0,
        title: Text(
          course.title,
          style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          // Active Video Player Banner
          Container(
            height: 200,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.black,
              border: Border.all(color: AppTheme.borderDark),
            ),
            child: _activeChapter != null
                ? Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.play_circle_filled_rounded, color: AppTheme.primaryOrange, size: 56),
                      const SizedBox(height: 10),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Text(
                          _activeChapter!.title,
                          style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                          textAlign: TextAlign.center,
                          maxLines: 2,
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (_activeChapter!.videoUrl != null && _activeChapter!.videoUrl!.isNotEmpty)
                        ElevatedButton.icon(
                          onPressed: () => _launchMediaUrl(_activeChapter!.videoUrl),
                          icon: const Icon(Icons.open_in_new_rounded, size: 16),
                          label: const Text('Play Full Video Lesson'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryOrange,
                            foregroundColor: Colors.black,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                    ],
                  )
                : const Center(
                    child: Text('No video lessons available', style: TextStyle(color: AppTheme.textMuted)),
                  ),
          ),

          // Course info & chapters list
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text(
                  course.title,
                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 6),
                Text(
                  course.description,
                  style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13, height: 1.4),
                ),
                const SizedBox(height: 20),

                // Chapters header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Curriculum & Lessons',
                      style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      '${chapters.length} Total',
                      style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                if (chapters.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 24),
                    child: Text('Curriculum lessons will be posted soon.', style: TextStyle(color: AppTheme.textMuted)),
                  )
                else
                  ...chapters.map((ch) {
                    final isPlaying = _activeChapter?.id == ch.id;
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      decoration: BoxDecoration(
                        color: isPlaying ? AppTheme.primaryOrange.withOpacity(0.1) : AppTheme.cardDark,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isPlaying ? AppTheme.primaryOrange.withOpacity(0.5) : AppTheme.borderDark,
                        ),
                      ),
                      child: ListTile(
                        onTap: () {
                          setState(() {
                            _activeChapter = ch;
                          });
                        },
                        leading: CircleAvatar(
                          radius: 16,
                          backgroundColor: isPlaying ? AppTheme.primaryOrange : AppTheme.bgDark,
                          child: Icon(
                            isPlaying ? Icons.play_arrow_rounded : Icons.lock_open_rounded,
                            color: isPlaying ? Colors.black : Colors.white70,
                            size: 16,
                          ),
                        ),
                        title: Text(
                          ch.title,
                          style: TextStyle(
                            color: isPlaying ? Colors.white : Colors.white70,
                            fontSize: 13,
                            fontWeight: isPlaying ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                        trailing: ch.pdfUrl != null && ch.pdfUrl!.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.picture_as_pdf_rounded, color: Colors.amber, size: 20),
                                onPressed: () => _launchMediaUrl(ch.pdfUrl),
                              )
                            : null,
                      ),
                    );
                  }),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
