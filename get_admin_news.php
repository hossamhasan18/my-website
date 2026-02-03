<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "maimoun_db");
$result = $conn->query("SELECT id, title, image_path, created_at FROM news ORDER BY id DESC");
$news = [];
while($row = $result->fetch_assoc()) { $news[] = $row; }
echo json_encode($news);
?>