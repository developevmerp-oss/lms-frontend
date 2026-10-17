import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../models/course_model.dart';
import '../../providers/course_provider.dart';
import 'course_player_screen.dart';

class CoursesListScreen extends StatefulWidget {
  const CoursesListScreen({super.key});

  @override
  State<CoursesListScreen> createState() => _CoursesListScreenState();
}

class _CoursesListScreenState extends State<CoursesListScreen> {
  final List<String> _levelTabs = ['All', 'L0', 'L1', 'L2', 'L3'];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<CourseProvider>(context, listen: false).fetchCourses();
    });
  }

  @override
  Widget build(BuildContext context) {
    final courseProvider = Provider.of<CourseProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Course Curriculum'),
      ),
      body: Column(
        children: [
          // Filter Tabs
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: _levelTabs.map((level) {
                final isSelected = courseProvider.selectedLevel == level;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(
                      level == 'All' ? 'All Levels' : 'Level $level',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : AppTheme.textMuted,
                      ),
                    ),
                    selected: isSelected,
                    selectedColor: AppTheme.primary,
                    backgroundColor: const Color(0xFF131B2E),
                    onSelected: (_) => courseProvider.filterByLevel(level),
                  ),
                );
              }).toList(),
            ),
          ),

          // Course Cards List
          Expanded(
            child: courseProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: () => courseProvider.fetchCourses(),
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: courseProvider.courses.length,
                      itemBuilder: (context, index) {
                        final course = courseProvider.courses[index];
                        return _buildCourseCard(course);
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildCourseCard(CourseModel course) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF131B2E),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: course.isLocked ? Colors.redAccent.withOpacity(0.3) : const Color(0xFF1E293B),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top thumbnail & Level Badge
          Stack(
            children: [
              Container(
                height: 140,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  gradient: LinearGradient(
                    colors: [
                      course.level == 'L0'
                          ? Colors.blue.withOpacity(0.6)
                          : course.level == 'L1'
                              ? Colors.cyan.withOpacity(0.6)
                              : course.level == 'L2'
                                  ? Colors.amber.withOpacity(0.6)
                                  : Colors.purple.withOpacity(0.6),
                      Colors.black87,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Center(
                  child: Icon(
                    course.isLocked ? Icons.lock_outline_rounded : Icons.palette_outlined,
                    size: 48,
                    color: Colors.white70,
                  ),
                ),
              ),
              Positioned(
                top: 12,
                left: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.75),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white24),
                  ),
                  child: Text(
                    'Level ${course.level}',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppTheme.accentAmber),
                  ),
                ),
              ),
              if (course.isLocked)
                Positioned(
                  top: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.redAccent,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'LOCKED (UPGRADE)',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.white),
                    ),
                  ),
                ),
            ],
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  course.title,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                Text(
                  course.description,
                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 14),

                // Progress
                if (!course.isLocked) ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('${course.chapters.length} Video Lessons', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                      Text('${(course.progress * 100).toInt()}% Done', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.accentGreen)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: course.progress,
                      minHeight: 5,
                      backgroundColor: Colors.grey[800],
                      valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.accentGreen),
                    ),
                  ),
                  const SizedBox(height: 14),
                ],

                // Action button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: course.isLocked ? const Color(0xFF1E293B) : AppTheme.primary,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: course.isLocked
                        ? () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Contact your academy mentor or upgrade tier to unlock Level 3.')),
                            );
                          }
                        : () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => CoursePlayerScreen(course: course)),
                            );
                          },
                    child: Text(course.isLocked ? '🔒 Upgrade to Unlock' : 'Open Course Curriculum'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
