<?php
require_once 'db.php'; // التأكد من وجود ملف الاتصال بالقاعدة
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $national_id = $_POST['national_id'] ?? '';
    $order_no    = $_POST['order_no'] ?? '';

    if (empty($national_id) || empty($order_no)) {
        echo json_encode(['status' => 'error', 'msg' => 'برجاء إدخال كافة البيانات المطلوب.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    try {
        // التعديل هنا: ضفنا admin_reply لجملة الـ SELECT عشان الرد يظهر للمواطن
        $stmt = $pdo->prepare("SELECT full_name, status, admin_reply FROM complaints WHERE national_id = ? AND order_number = ? LIMIT 1");
        $stmt->execute([$national_id, $order_no]);
        $complaint = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($complaint) {
            echo json_encode(['status' => 'success', 'data' => $complaint], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(['status' => 'error', 'msg' => 'عذراً، البيانات غير مطابقة للسجلات.'], JSON_UNESCAPED_UNICODE);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'msg' => 'حدث خطأ فني في السيرفر.'], JSON_UNESCAPED_UNICODE);
    }
}
?>