<?php
require 'db.php'; // التأكد من الاتصال بقاعدة البيانات

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    try {
        // تحضير أمر الحذف من جدول المقترحات
        // ملاحظة: تأكد أن اسم الجدول هو suggestions في قاعدة البيانات عندك
        $stmt = $pdo->prepare("DELETE FROM suggestions WHERE id = ?");
        $stmt->execute([$id]);

        // بعد الحذف يرجعك لصفحة الداشبورد تلقائياً
        header("Location: admin_dashboard.php?msg=deleted");
        exit();
    } catch (Exception $e) {
        echo "خطأ في الحذف: " . $e->getMessage();
    }
} else {
    echo "لم يتم تحديد معرف المقترح";
}
?>