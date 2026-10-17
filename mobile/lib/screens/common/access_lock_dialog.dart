import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class AccessLockDialog extends StatelessWidget {
  final String featureName;
  final String requiredLevel;
  final int requiredPoints;
  final String currentLevel;
  final int currentPoints;
  final String description;
  final VoidCallback? onUpgrade;

  const AccessLockDialog({
    super.key,
    required this.featureName,
    required this.requiredLevel,
    required this.requiredPoints,
    required this.currentLevel,
    required this.currentPoints,
    required this.description,
    this.onUpgrade,
  });

  static void show(
    BuildContext context, {
    required String featureName,
    required String requiredLevel,
    required int requiredPoints,
    required String currentLevel,
    required int currentPoints,
    required String description,
    VoidCallback? onUpgrade,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => AccessLockDialog(
        featureName: featureName,
        requiredLevel: requiredLevel,
        requiredPoints: requiredPoints,
        currentLevel: currentLevel,
        currentPoints: currentPoints,
        description: description,
        onUpgrade: onUpgrade,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppTheme.cardDark,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: const BorderSide(color: AppTheme.borderDark),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Icon
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: Colors.amber.withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.amber.withOpacity(0.3)),
              ),
              child: const Icon(Icons.lock_rounded, color: Colors.amber, size: 32),
            ),
            const SizedBox(height: 16),

            // Title
            Text(
              '$featureName is Locked',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.w900,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),

            // Description
            Text(
              description,
              style: const TextStyle(
                color: AppTheme.textSecondary,
                fontSize: 13,
                height: 1.4,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),

            // Requirement vs Current Comparison Box
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.bgDark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Required Tier:', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                      Text(requiredLevel, style: const TextStyle(color: Colors.amber, fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  if (requiredPoints > 0) ...[
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Required XP:', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                        Text('${requiredPoints.toString()} XP', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                  const Divider(color: AppTheme.borderDark, height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Your Current Status:', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                      Text('$currentLevel · $currentPoints XP', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Upgrade Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).pop();
                  if (onUpgrade != null) onUpgrade!();
                },
                icon: const Icon(Icons.flash_on_rounded, size: 18),
                label: const Text('Upgrade Level / Unlock Access'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryOrange,
                  foregroundColor: Colors.black,
                  textStyle: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ),
            const SizedBox(height: 8),

            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Dismiss', style: TextStyle(color: AppTheme.textMuted, fontSize: 13)),
            ),
          ],
        ),
      ),
    );
  }
}
