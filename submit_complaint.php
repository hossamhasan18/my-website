<?php
// إعدادات عرض الأخطاء للتصحيح
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db.php'; 
header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        // استلام البيانات النصية
        $full_name   = $_POST['full_name'] ?? '';
        $national_id = $_POST['national_id'] ?? '';
        $phone       = $_POST['phone'] ?? '';
        $village     = $_POST['village'] ?? '';
        $req_type    = $_POST['reqType'] ?? ''; // تأكد أن الاسم يطابق الـ name في الـ HTML
        $message     = $_POST['message'] ?? '';
        $category    = $_POST['category'] ?? ''; // أضفنا التصنيف أيضاً

        // --- معالجة رفع الصورة ---
        $attachment_name = null;
        if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === 0) {
            $upload_dir = 'uploads/';
            
            // إنشاء المجلد لو مش موجود
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            // توليد اسم فريد للصورة لمنع التكرار
            $file_ext = pathinfo($_FILES['attachment']['name'], PATHINFO_EXTENSION);
            $attachment_name = "IMG_" . time() . "_" . rand(100, 999) . "." . $file_ext;
            $target_file = $upload_dir . $attachment_name;

            // نقل الملف للمجلد
            move_uploaded_file($_FILES['attachment']['tmp_name'], $target_file);
        }

        // 1. توليد رقم طلب فريد (مثل الظاهر في الداشبورد)
        $order_number = "AM-" . date("Y") . "-" . rand(1000, 9999);

        // 2. كود الإدخال في قاعدة البيانات (أضفنا عمود attachment و category)
        $sql = "INSERT INTO complaints (order_number, full_name, national_id, phone, village, req_type, category, message, attachment, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $order_number,
            $full_name,
            $national_id,
            $phone,
            $village,
            $req_type,
            $category,
            $message,
            $attachment_name, // اسم الصورة المحفوظة
        ]);

        // 3. الرد على المتصفح
        echo json_encode([
            "status" => "success",
            "order_number" => $order_number
        ]);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "خطأ في السيرفر: " . $e->getMessage()
    ]);
}
?>