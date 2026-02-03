<?php
require 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // جلب البيانات من الـ POST
    $order_no = $_POST['order_number'] ?? '';
    $new_status = $_POST['status'] ?? '';
    $action = $_POST['action'] ?? '';
    $reply = $_POST['reply'] ?? ''; // جلب الرد الجديد

    try {
        if ($action === 'update' && !empty($order_no)) {
            $stmt = $pdo->prepare("UPDATE complaints SET status = ? WHERE order_number = ?");
            $stmt->execute([$new_status, $order_no]);
            echo json_encode(['status' => 'success']);
        } 
        // --- الحتة الجديدة لحفظ الرد ---
        elseif ($action === 'save_reply' && !empty($order_no)) {
            $stmt = $pdo->prepare("UPDATE complaints SET admin_reply = ? WHERE order_number = ?");
            $stmt->execute([$reply, $order_no]);
            echo json_encode(['status' => 'success']);
        }
        // ----------------------------
        elseif ($action === 'delete' && !empty($order_no)) {
            $stmt = $pdo->prepare("DELETE FROM complaints WHERE order_number = ?");
            $stmt->execute([$order_no]);
            
            // التأكد إن فيه سطر اتمسح فعلاً
            if ($stmt->rowCount() > 0) {
                echo json_encode(['status' => 'success']);
            } else {
                echo json_encode(['status' => 'error', 'msg' => 'الطلب غير موجود']);
            }
        } else {
            echo json_encode(['status' => 'error', 'msg' => 'بيانات ناقصة']);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'msg' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'msg' => 'طريقة الطلب غير صحيحة']);
}
?>