<?php
require 'db.php'; // تأكد إن ملف db.php فيه بيانات القاعدة maimoun_db
header('Content-Type: application/json');

try {
    // جلب كل الشكاوى مرتبة من الأحدث للأقدم
    $stmt = $pdo->query("SELECT * FROM complaints ORDER BY id DESC");
    $complaints = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // إرسال البيانات كـ JSON
    echo json_encode($complaints);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>