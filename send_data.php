<?php
header('Content-Type: application/json');
require 'db.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $order_number = 'AM-' . date('Y') . '-' . rand(1000, 9999);
        
        $sql = "INSERT INTO complaints (order_number, req_type, full_name, national_id, phone, category, village, subject, message, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $order_number,
            $_POST['reqType'] ?? 'طلب عام',
            $_POST['full_name'] ?? '',
            $_POST['national_id'] ?? '',
            $_POST['phone'] ?? '',
            $_POST['category'] ?? '',
            $_POST['village'] ?? '',
            $_POST['subject'] ?? '',
            $_POST['message'] ?? ''
        ]);

        echo json_encode(['status' => 'success', 'order_no' => $order_number]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'msg' => $e->getMessage()]);
    }
}
?>