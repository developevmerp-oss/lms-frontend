import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_theme.dart';
import '../../models/student_stats_model.dart';

class TierPurchaseDialog extends StatefulWidget {
  final String preselectedTier;
  final List<LevelTier> tiers;

  const TierPurchaseDialog({
    super.key,
    this.preselectedTier = 'L1',
    this.tiers = const [],
  });

  static void show(BuildContext context, {String preselectedTier = 'L1', List<LevelTier> tiers = const []}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => TierPurchaseDialog(preselectedTier: preselectedTier, tiers: tiers),
    );
  }

  @override
  State<TierPurchaseDialog> createState() => _TierPurchaseDialogState();
}

class _TierPurchaseDialogState extends State<TierPurchaseDialog> {
  late String _selectedCode;
  String _paymentMode = 'full'; // 'full' or 'installment'

  final List<Map<String, dynamic>> _defaultCatalog = [
    {
      'code': 'L0',
      'name': 'Fast Track',
      'price': '₹499',
      'originalPrice': '₹2,499',
      'icon': '⚡',
      'desc': 'Foundational resin chemistry, bubble-free mixing, and essential art setup.',
      'benefits': [
        '3 Foundational video courses',
        'Resin safety & PPE guidelines',
        'Ratio calculators & tools list',
        'Win Wall community access'
      ],
    },
    {
      'code': 'L1',
      'name': 'Explore Membership',
      'price': '₹4,999',
      'originalPrice': '₹9,999',
      'icon': '🥈',
      'desc': 'Core casting techniques, marbling, lotus ponds, and first client sales.',
      'benefits': [
        'All 5 Level 1 video masterclasses',
        'Coasters, keychains, ocean waves',
        'Weekly live coaching calls with Vrajangna',
        'Client pricing templates'
      ],
    },
    {
      'code': 'L2',
      'name': 'Master Membership',
      'price': '₹19,999',
      'originalPrice': '₹34,999',
      'icon': '🏆',
      'desc': 'High-ticket geode wall art, luxury clocks, and advanced 3D ripple ocean pours.',
      'benefits': [
        'All 12+ Courses across L0, L1, L2',
        'Crystal cluster geode wall art',
        '3D ripple ocean pours & luxury clocks',
        'Priority critique & portfolio review'
      ],
    },
    {
      'code': 'L3',
      'name': 'Renaissance Certification',
      'price': '₹59,999',
      'originalPrice': '₹99,999',
      'icon': '💎',
      'desc': 'Commercial business scaling to ₹3 Lakhs/month, river tables, and flower preservation.',
      'benefits': [
        'All 30 masterclasses unlocked',
        'Wood river tables & varmala preservation',
        'Northstar Business Revenue Tracker',
        'Commercial branding blueprint'
      ],
    },
  ];

  @override
  void initState() {
    super.initState();
    _selectedCode = widget.preselectedTier;
  }

  Map<String, dynamic> _getSelectedTierData() {
    return _defaultCatalog.firstWhere(
      (t) => t['code'] == _selectedCode,
      orElse: () => _defaultCatalog[1],
    );
  }

  void _openWhatsAppAssistance(Map<String, dynamic> tier) {
    final text = Uri.encodeComponent(
      'Hello Vrajangna Ma\'am / Team Ravishing Art Hub!\n\n'
      'I want to upgrade my LMS account to *${tier['name']} (${tier['code']})* (${tier['price']}).\n'
      'Please assist me with instant enrollment.',
    );
    launchUrl(Uri.parse('https://wa.me/919429424263?text=$text'), mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final activeTier = _getSelectedTierData();

    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
      decoration: const BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 44,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Upgrade Membership',
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
                    ),
                    Text(
                      'Select a tier to unlock courses, masterclasses & perks',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.close, color: Colors.white70),
                ),
              ],
            ),
          ),
          const Divider(color: AppTheme.borderDark, height: 1),

          // Tier selector tabs
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _defaultCatalog.map((tier) {
                  final isSelected = tier['code'] == _selectedCode;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      selected: isSelected,
                      label: Text('${tier['icon']} ${tier['code']} · ${tier['price']}'),
                      selectedColor: AppTheme.primaryOrange,
                      backgroundColor: AppTheme.bgDark,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.black : Colors.white70,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                      onSelected: (val) {
                        if (val) {
                          setState(() {
                            _selectedCode = tier['code'];
                          });
                        }
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          // Details content
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              children: [
                // Price & Name Card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.primaryOrange.withOpacity(0.15),
                        Colors.amber.withOpacity(0.05),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.primaryOrange.withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            activeTier['name'],
                            style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryOrange,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              activeTier['code'],
                              style: const TextStyle(color: Colors.black, fontWeight: FontWeight.w900, fontSize: 11),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            activeTier['price'],
                            style: const TextStyle(color: Colors.amber, fontSize: 26, fontWeight: FontWeight.w900),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            activeTier['originalPrice'],
                            style: const TextStyle(
                              color: AppTheme.textMuted,
                              fontSize: 14,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        activeTier['desc'],
                        style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Benefits Checklist
                const Text(
                  'What You Will Unlock:',
                  style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                ...((activeTier['benefits'] as List<String>).map((b) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle_rounded, color: Colors.greenAccent, size: 18),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(b, style: const TextStyle(color: Colors.white70, fontSize: 13)),
                      ),
                    ],
                  ),
                ))),

                const SizedBox(height: 20),

                // WhatsApp Support Option
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.green.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.chat_bubble_outline_rounded, color: Colors.greenAccent, size: 22),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Need assistance or EMI option?', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                            Text('Chat directly with Vrajangna Ma\'am\'s team on WhatsApp', style: TextStyle(color: AppTheme.textMuted, fontSize: 10)),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () => _openWhatsAppAssistance(activeTier),
                        child: const Text('Chat', style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),

          // Bottom Action
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: AppTheme.bgDark,
              border: Border(top: BorderSide(color: AppTheme.borderDark)),
            ),
            child: SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: () {
                  _openWhatsAppAssistance(activeTier);
                },
                icon: const Icon(Icons.flash_on_rounded, size: 18),
                label: Text('Enroll & Upgrade · ${activeTier['price']}'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryOrange,
                  foregroundColor: Colors.black,
                  textStyle: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
