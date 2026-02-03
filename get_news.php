<?php
header('Content-Type: application/json; charset=utf-8');
$conn = new mysqli("localhost", "root", "", "maimoun_db");
$conn->set_charset("utf8");

// لو باعتين كلمة all في الرابط، هات كله.. لو مش باعتين هات 6 بس
$limit = isset($_GET['all']) ? "" : "LIMIT 6";
$sql = "SELECT title, details as description, image_path as image FROM news ORDER BY id DESC $limit";

$result = $conn->query($sql);
$news = [];
while($row = $result->fetch_assoc()) { $news[] = $row; }
echo json_encode($news, JSON_UNESCAPED_UNICODE);
?>