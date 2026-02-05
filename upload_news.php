<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['news_id']; // استلام الأيدي
    $title = $_POST['news_title'];
    $details = $_POST['news_text'];
    
    // 1. تحديث البيانات الأساسية (العنوان والتفاصيل)
    $sql = "UPDATE news SET title = ?, details = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$title, $details, $id]);

    // 2. معالجة الصورة (فقط لو رفع صورة جديدة)
    if (!empty($_FILES['news_image']['name'])) {
        $image = $_FILES['news_image'];
        $imageName = time() . '_' . $image['name'];
        $targetDir = "uploads/news/";

        if (!file_exists($targetDir)) { mkdir($targetDir, 0777, true); }

        if (move_uploaded_file($image['tmp_name'], $targetDir . $imageName)) {
            // تحديث مسار الصورة في قاعدة البيانات
            $sqlImg = "UPDATE news SET image_path = ? WHERE id = ?";
            $stmtImg = $pdo->prepare($sqlImg);
            $stmtImg->execute([$targetDir . $imageName, $id]);
        }
    }

    // التحويل لصفحة الداشبورد بعد النجاح
    header("Location: dashbord.php?update=success");
    exit;
}
?>