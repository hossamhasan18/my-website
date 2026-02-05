<?php
header('Content-Type: application/json; charset=utf-8');
$conn = new mysqli("localhost", "root", "", "maimoun_db");
$conn->set_charset("utf8");

// التعديل: سحبنا الأسماء الأصلية من الجدول عشان تطابق الـ JavaScript
$limit = isset($_GET['all']) ? "" : "LIMIT 6";
$sql = "SELECT id, title, details, image_path, created_at FROM news ORDER BY id DESC $limit";

$result = $conn->query($sql);
$news = [];
while($row = $result->fetch_assoc()) { 
    $news[] = $row; 
}
echo json_encode($news, JSON_UNESCAPED_UNICODE);
?>