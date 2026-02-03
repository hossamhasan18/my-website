<?php
// تأكد من اسم القاعدة maimoun_db كما في phpMyAdmin عندك
$conn = new mysqli("localhost", "root", "", "maimoun_db");
$conn->set_charset("utf8");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $conn->real_escape_string($_POST['news_title']);
    $details = $conn->real_escape_string($_POST['news_text']);
    
    // إعداد مجلد الصور
    $target_dir = "uploads/news/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $file_name = time() . "_" . basename($_FILES["news_image"]["name"]);
    $target_file = $target_dir . $file_name;

    if (move_uploaded_file($_FILES["news_image"]["tmp_name"], $target_file)) {
        // الاستعلام الصحيح لجدولك (title, details, image_path)
        $sql = "INSERT INTO news (title, details, image_path, created_at) 
                VALUES ('$title', '$details', '$file_name', NOW())";

        if ($conn->query($sql)) {
            echo "<script>
                    alert('✅ تم نشر الخبر بنجاح وسيظهر في الرئيسية الآن');
                    window.location.href='dashbord.php';
                  </script>";
        } else {
            echo "❌ خطأ في قاعدة البيانات: " . $conn->error;
        }
    } else {
        echo "❌ فشل رفع الصورة. تأكد من وجود مجلد uploads/news/";
    }
}
?>