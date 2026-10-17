import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_theme.dart';
import '../../models/course_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/course_provider.dart';
import '../../providers/stats_provider.dart';
import '../common/tier_purchase_dialog.dart';
import 'course_detail_screen.dart';

class CoursesScreen extends StatefulWidget {
  const CoursesScreen({super.key});

  @override
  State<CoursesScreen> createState() => _CoursesScreenState();
}

class _CoursesScreenState extends State<CoursesScreen> {
  String _selectedLevelFilter = 'ALL';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CourseProvider>().fetchCourses();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final statsProvider = context.watch<StatsProvider>();
    final courseProvider = context.watch<CourseProvider>();
    final stats = statsProvider.stats;
    final user = auth.user;

    final filterOptions = ['ALL', 'L0', 'L1', 'L2', 'L3'];

    final filteredCourses = courseProvider.courses.where((c) {
      if (_selectedLevelFilter == 'ALL') return true;
      final lvl = (c.levelCode ?? '').toUpperCase();
      return lvl == _selectedLevelFilter;
    }).toList();

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      body: RefreshIndicator(
        onRefresh: () => courseProvider.fetchCourses(),
        color: AppTheme.primaryOrange,
        child: Column(
          children: [
            // Level Filter Chips
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: filterOptions.map((f) {
                    final isSelected = _selectedLevelFilter == f;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        selected: isSelected,
                        label: Text(f == 'ALL' ? 'All Masterclasses' : f),
                        selectedColor: AppTheme.primaryOrange,
                        backgroundColor: AppTheme.cardDark,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.black : Colors.white70,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                        onSelected: (val) {
                          if (val) setState(() => _selectedLevelFilter = f);
                        },
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            // Courses List
            Expanded(
              child: courseProvider.isLoading
                  ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryOrange))
                  : filteredCourses.isEmpty
                      ? const Center(
                          child: Text('No courses found in this category.', style: TextStyle(color: AppTheme.textMuted)),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          itemCount: filteredCourses.length,
                          itemBuilder: (ctx, index) {
                            final course = filteredCourses[index];
                            final isUnlocked = courseProvider.isCourseUnlocked(course, stats, user?.membershipLevel);
                            return _buildCourseCard(context, course, isUnlocked);
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCourseCard(BuildContext context, Course course, bool isUnlocked) {
    final lvl = course.levelCode ?? 'NONE';
    final isStandalone = lvl == 'NONE' || lvl.isEmpty;

    bool isExpired = false;
    bool isUpcoming = false;
    if (isStandalone) {
      final now = DateTime.now();
      if (course.validityEndDate != null && course.validityEndDate!.isNotEmpty) {
        final end = DateTime.tryParse(course.validityEndDate!);
        if (end != null && now.isAfter(end)) {
          isExpired = true;
        }
      }
      if (course.validityStartDate != null && course.validityStartDate!.isNotEmpty) {
        final start = DateTime.tryParse(course.validityStartDate!);
        if (start != null && now.isBefore(start)) {
          isUpcoming = true;
        }
      }
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isExpired ? Colors.red.withOpacity(0.4) : AppTheme.borderDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail / Header
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                child: course.image != null && course.image!.isNotEmpty
                    ? Image.network(
                        course.image!,
                        height: 160,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => _buildPlaceholderThumb(),
                      )
                    : _buildPlaceholderThumb(),
              ),
              Positioned(
                top: 12,
                left: 12,
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.8),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppTheme.primaryOrange.withOpacity(0.4)),
                      ),
                      child: Text(
                        lvl == 'NONE' ? 'Standalone Masterclass' : 'Level $lvl',
                        style: const TextStyle(color: AppTheme.primaryOrange, fontWeight: FontWeight.w900, fontSize: 11),
                      ),
                    ),
                    if (isStandalone && (isExpired || isUpcoming)) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isExpired ? Colors.red.withOpacity(0.85) : Colors.blue.withOpacity(0.85),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          isExpired ? 'Expired' : 'Upcoming',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: isUnlocked ? Colors.green.withOpacity(0.8) : Colors.black.withOpacity(0.8),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    isUnlocked ? Icons.lock_open_rounded : Icons.lock_rounded,
                    color: isUnlocked ? Colors.white : Colors.amber,
                    size: 16,
                  ),
                ),
              ),
            ],
          ),

          // Course info
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  course.title,
                  style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                Text(
                  course.description,
                  style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${course.chapters.length} Video Lessons',
                      style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                    ),
                    if (isUnlocked)
                      ElevatedButton.icon(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => CourseDetailScreen(course: course)),
                          );
                        },
                        icon: const Icon(Icons.play_arrow_rounded, size: 16),
                        label: const Text('Start Learning'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryOrange,
                          foregroundColor: Colors.black,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      )
                    else if (isStandalone && isExpired)
                      OutlinedButton.icon(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Course validity has expired. Enrollment is closed.'),
                              backgroundColor: Colors.redAccent,
                            ),
                          );
                        },
                        icon: const Icon(Icons.timer_off_rounded, size: 14, color: Colors.redAccent),
                        label: const Text('Enrollment Expired'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.redAccent,
                          side: const BorderSide(color: Colors.redAccent),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      )
                    else if (isStandalone && isUpcoming)
                      OutlinedButton.icon(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Enrollment for this course will open soon.'),
                              backgroundColor: Colors.blueAccent,
                            ),
                          );
                        },
                        icon: const Icon(Icons.schedule_rounded, size: 14, color: Colors.blueAccent),
                        label: const Text('Enrollment Upcoming'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.blueAccent,
                          side: const BorderSide(color: Colors.blueAccent),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      )
                    else
                      OutlinedButton.icon(
                        onPressed: () {
                          TierPurchaseDialog.show(
                            context,
                            preselectedTier: (lvl == 'NONE' || lvl.isEmpty) ? 'L0' : lvl,
                          );
                        },
                        icon: const Icon(Icons.lock_rounded, size: 14, color: Colors.amber),
                        label: Text('Unlock Course ${course.price ?? ''}'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.amber,
                          side: const BorderSide(color: Colors.amber),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaceholderThumb() {
    return Container(
      height: 160,
      width: double.infinity,
      color: AppTheme.bgDark,
      child: const Center(
        child: Icon(Icons.palette_rounded, color: Colors.white24, size: 48),
      ),
    );
  }
}
