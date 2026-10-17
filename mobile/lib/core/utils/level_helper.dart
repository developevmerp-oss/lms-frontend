class LevelHelper {
  static const Map<String, int> hierarchy = {
    'GENERAL': -1,
    'L0': 0,
    'L1': 1,
    'L2': 2,
    'L3': 3,
    'L3+': 4,
  };

  /// Mirror of getLevelCode in StudentNav.tsx
  static String getLevelCode(String? levelName, [int points = 0]) {
    final normalized = (levelName ?? '').toUpperCase();
    if (normalized.contains('GENERAL')) return 'GENERAL';
    if (normalized == 'L3+' ||
        normalized.contains('L3+') ||
        normalized.contains('MASTERS') ||
        normalized.contains('PILES')) {
      return 'L3+';
    }
    if (normalized == 'L3' ||
        normalized.contains('L3') ||
        normalized.contains('DIAMOND') ||
        normalized.contains('RENAISSANCE')) {
      return 'L3';
    }
    if (normalized == 'L2' ||
        normalized.contains('L2') ||
        normalized.contains('GOLD') ||
        normalized.contains('MASTER MEMBERSHIP')) {
      return 'L2';
    }
    if (normalized == 'L1' ||
        normalized.contains('L1') ||
        normalized.contains('SILVER') ||
        normalized.contains('EXPLORE')) {
      return 'L1';
    }
    if (normalized == 'L0' ||
        normalized.contains('L0') ||
        normalized.contains('FAST TRACK') ||
        normalized.contains('FAST START') ||
        normalized.contains('BRONZE')) {
      return 'L0';
    }
    return 'GENERAL';
  }

  static bool isGeneral(String? level) => getLevelCode(level) == 'GENERAL';

  static bool isL0Accessible(String? level) => !isGeneral(level);

  static bool isEventsAccessible(String? level) {
    final code = getLevelCode(level);
    return code == 'L1' || code == 'L2' || code == 'L3' || code == 'L3+';
  }

  static bool isNorthstarAccessible(String? level) {
    final code = getLevelCode(level);
    return code == 'L3' || code == 'L3+';
  }

  static bool canPostCommunityWin(String? level) {
    final code = getLevelCode(level);
    return code != 'GENERAL' && code != 'L0';
  }

  static int getLevelOrder(String? level) {
    final code = getLevelCode(level);
    return hierarchy[code] ?? -1;
  }
}
