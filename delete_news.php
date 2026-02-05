<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "maimoun_db");

if(isset($_GET['id'])){
    $id = intval($_GET['id']);
    
    // 1. مسح الصورة أولاً
    $res = $conn->query("SELECT image_path FROM news WHERE id=$id");
    if($row = $res->fetch_assoc()){
        @unlink("uploads/news/" . $row['image_path']);
    }
    
    // 2. مسح السطر من القاعدة
    if($conn->query("DELETE FROM news WHERE id=$id")){
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}
exit;