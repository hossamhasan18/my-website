<?php
$conn = new mysqli("localhost", "root", "", "maimoun_db");
if(isset($_GET['id'])){
    $id = $_GET['id'];
    // جلب اسم الصورة لمسحها من السيرفر
    $res = $conn->query("SELECT image_path FROM news WHERE id=$id");
    $row = $res->fetch_assoc();
    if($row) unlink("uploads/news/" . $row['image_path']);
    
    // حذف الخبر
    $conn->query("DELETE FROM news WHERE id=$id");
}
header("Location: dashbord.php");
?>