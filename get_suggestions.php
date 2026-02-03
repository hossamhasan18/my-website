<?php
// منع أي رسائل خطأ جانبية تخرب الـ JSON
error_reporting(0);
header('Content-Type: application/json; charset=utf-8');

// بيانات الاتصال المباشرة (نفس اللي نجحت في ملف الحفظ)
$host = "localhost";
$user = "root";
$pass = "";
$db   = "maimoun_db";

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die(json_encode(["error" => "فشل الاتصال"]));
}

// جلب البيانات من الجدول اللي شوفناه في الصورة
$sql = "SELECT * FROM suggestions ORDER BY id DESC";
$result = $conn->query($sql);

$data = array();
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// إرسال البيانات النهائية
echo json_encode($data, JSON_UNESCAPED_UNICODE);
$conn->close();
?>