<?php
require 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'] ?? '';
    $details = $_POST['details'] ?? '';
    
    if (isset($_FILES['postImage']) && $_FILES['postImage']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/news/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $fileExtension = pathinfo($_FILES['postImage']['name'], PATHINFO_EXTENSION);
        $fileName = time() . '_' . uniqid() . '.' . $fileExtension;
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['postImage']['tmp_name'], $targetPath)) {
            try {
                $stmt = $pdo->prepare("INSERT INTO news (title, details, image_path) VALUES (?, ?, ?)");
                $stmt->execute([$title, $details, $targetPath]);
                echo json_encode(['success' => true]);
            } catch (Exception $e) {
                echo json_encode(['success' => false, 'message' => 'خطأ في الحفظ للقاعدة']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'فشل في رفع الملف']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'لم يتم اختيار صورة']);
    }
}