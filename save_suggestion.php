<?php
// 1. بيانات الاتصال مباشرة لضمان عدم حدوث خطأ في المتغيرات
$host = "localhost";
$user = "root"; 
$pass = ""; 
$db   = "maimoun_db"; 

$conn = new mysqli($host, $user, $pass, $db);

// ضبط الترميز عشان العربي
$conn->set_charset("utf8mb4");

// التحقق من الاتصال
if ($conn->connect_error) {
    die("فشل الاتصال بقاعدة البيانات: " . $conn->connect_error);
}

// 2. استلام البيانات من الفورم
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // تأمين البيانات
    $full_name   = $conn->real_escape_string($_POST['full_name']);
    $phone       = $conn->real_escape_string($_POST['phone']);
    $national_id = $conn->real_escape_string($_POST['national_id']);
    $village     = $conn->real_escape_string($_POST['village']);
    $category    = $conn->real_escape_string($_POST['category']);
    $details     = $conn->real_escape_string($_POST['details']);

    // 3. الإدخال في الجدول
    $sql = "INSERT INTO suggestions (full_name, phone, national_id, village, category, details) 
            VALUES ('$full_name', '$phone', '$national_id', '$village', '$category', '$details')";

    if ($conn->query($sql) === TRUE) {
        // التحويل لصفحة النجاح
        header("Location: suggestion.html?status=success");
        exit();
    } else {
        echo "خطأ في الاستعلام: " . $conn->error;
    }
}

$conn->close();
?>