class Endpoints {
  // Use production backend API by default; for local emulator use http://10.0.2.2:5000/api
  static const String baseUrl = 'https://api.ravishingarthub.com/api';
  static String get serverBaseUrl => baseUrl.replaceAll(RegExp(r'/api/?$'), '');

  // Auth
  static const String login = '$baseUrl/auth/login';
  static const String register = '$baseUrl/auth/register';
  static const String me = '$baseUrl/auth/me';
  static const String profile = '$baseUrl/auth/profile';
  static const String forgotPassword = '$baseUrl/auth/forgot-password';
  static const String resetPassword = '$baseUrl/auth/reset-password';

  // Dashboard & Student Stats (the primary unified data contract)
  static const String studentDashboard = '$baseUrl/dashboard/student';
  static const String studentRoutine = '$baseUrl/dashboard/student/routine';
  static const String studentSales = '$baseUrl/dashboard/student/sales'; // POST {amount, productName, date}, DELETE /:id
  static const String levels = '$baseUrl/dashboard/levels';
  static const String offers = '$baseUrl/dashboard/offers';
  static const String badges = '$baseUrl/dashboard/badges';
  static const String communityWins = '$baseUrl/dashboard/community-wins';

  // Courses
  static const String courses = '$baseUrl/courses';

  // Classes & Live Masterclasses
  static const String classes = '$baseUrl/classes';
  static String classJoin(String id) => '$baseUrl/classes/$id/join';

  // Webinar Events
  static const String webinarEvents = '$baseUrl/webinar/events';

  // Rewards Store
  static const String rewards = '$baseUrl/rewards';
  static String rewardRedeem(String id) => '$baseUrl/rewards/$id/redeem';

  // Leaderboard
  static const String leaderboard = '$baseUrl/leaderboard';

  // Certificates
  static const String myCertificates = '$baseUrl/certificates/mine';

  // Portfolio
  static const String portfolio = '$baseUrl/portfolio';

  // Assignments / Tasks
  static const String studentAssignments = '$baseUrl/assignments/student';
  static String submitAssignment(String id) => '$baseUrl/assignments/$id/submit';

  // Payments & Installments
  static const String paymentKey = '$baseUrl/payments/key';
  static const String createOrder = '$baseUrl/payments/create-order';
  static const String verifyPayment = '$baseUrl/payments/verify';
  static const String recordPaymentFailure = '$baseUrl/payments/record-failure';
  static const String myInstallments = '$baseUrl/payments/my-installments';

  // Upload
  static const String uploadVideo = '$baseUrl/upload/video';
}
