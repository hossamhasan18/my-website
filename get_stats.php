<?php
include 'db.php'; // ملف الاتصال بتاعك

header('Content-Type: application/json');

try {
    // 1. عدد الطلبات المحلولة
    $stmt1 = $pdo->query("SELECT COUNT(*) FROM complaints WHERE status = 'solved'");
    $solved = $stmt1->fetchColumn();

    // 2. إجمالي الطلبات (التواصل المباشر)
    $stmt2 = $pdo->query("SELECT COUNT(*) FROM complaints");
    $total = $stmt2->fetchColumn();

    echo json_encode([
        'solved' => $solved,
        'total' => $total
    ]);
} catch (Exception $e) {
    echo json_encode(['solved' => 0, 'total' => 0]);
}
?>