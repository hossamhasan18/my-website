<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'];
    $details = $_POST['details'];
    
    // معالجة الصورة
    $image = $_FILES['postImage'];
    $imageName = time() . '_' . $image['name'];
    $targetDir = "uploads/news/";
    
    if (!file_exists($targetDir)) { mkdir($targetDir, 0777, true); }
    
    if (move_uploaded_file($image['tmp_name'], $targetDir . $imageName)) {
        $sql = "INSERT INTO news (title, details, image_path) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$title, $details, $targetDir . $imageName]);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'فشل رفع الصورة']);
    }
}