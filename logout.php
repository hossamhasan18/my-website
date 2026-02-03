<?php
session_start();
session_destroy(); // يمسح جلسة الدخول
header("Location: login.html"); // يرجعه للوجن
exit;
?>