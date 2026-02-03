<?php
// تفعيل إظهار الأخطاء عشان لو فيه مشكلة تظهر لنا
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// تحديد اليوزر والباسورد
$admin_user = "admin";
$admin_pass = "2026"; 

// استقبال البيانات
$user = isset($_POST['username']) ? $_POST['username'] : '';
$pass = isset($_POST['password']) ? $_POST['password'] : '';

header('Content-Type: application/json');

if ($user === $admin_user && $pass === $admin_pass) {
    $_SESSION['is_logged_in'] = true;
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "msg" => "بيانات الدخول غير صحيحة"]);
}
exit();