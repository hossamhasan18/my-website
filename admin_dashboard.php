<?php
require 'db.php'; // تأكد أن ملف الاتصال بقاعدة البيانات موجود

// جلب جميع الطلبات من الأحدث للأقدم
$stmt = $pdo->query("SELECT * FROM complaints ORDER BY id DESC");
$complaints = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>لوحة تحكم المكتب الفني | النائب عبده مأمون</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --gold: #c5a059; --dark: #121212; --card: #1e1e1e; }
        body { font-family: 'Cairo', sans-serif; background-color: #000; color: #fff; padding-top: 20px; }
        .dashboard-container { background: var(--card); border: 1px solid var(--gold); border-radius: 15px; padding: 25px; margin-bottom: 50px; }
        .table { color: #fff; border-color: #333; }
        .table thead { background: var(--gold); color: #000; }
        .status-badge { padding: 5px 10px; border-radius: 5px; font-size: 0.85rem; }
        .bg-pending { background: #ffd700; color: #000; } /* قيد الانتظار */
        .bg-success { background: #28a745; color: #fff; } /* مقبول */
        .bg-danger { background: #dc3545; color: #fff; }  /* مرفوض */
        .btn-action { color: var(--gold); border: 1px solid var(--gold); transition: 0.3s; }
        .btn-action:hover { background: var(--gold); color: #000; }
        .village-tag { font-size: 0.8rem; background: #333; padding: 2px 8px; border-radius: 4px; border: 1px solid #444; }
    </style>
</head>
<body>

<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold"><i class="fas fa-user-shield gold-text me-2"></i> لوحة تحكم الإدارة</h2>
        <a href="index.html" class="btn btn-outline-light btn-sm">خروج للموقع</a>
    </div>

    <div class="dashboard-container shadow-lg">
        <h4 class="gold-text mb-4 border-bottom border-secondary pb-2">قائمة طلبات المواطنين المستلمة</h4>
        
        <div class="table-responsive">
            <table class="table table-hover align-middle text-center">
                <thead>
                    <tr>
                        <th>رقم الطلب</th>
                        <th>التاريخ</th>
                        <th>الاسم</th>
                        <th>القرية/المركز</th>
                        <th>النوع</th>
                        <th>الموضوع</th>
                        <th>المرفقات</th>
                        <th>الحالة</th>
                        <th>إجراء</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($complaints as $c): ?>
                    <tr>
                        <td class="fw-bold text-info"><?php echo $c['order_number']; ?></td>
                        <td style="font-size: 0.85rem;"><?php echo date('Y-m-d', strtotime($c['created_at'])); ?></td>
                        <td><?php echo htmlspecialchars($c['full_name']); ?></td>
                        <td><span class="village-tag"><?php echo htmlspecialchars($c['village']); ?></span></td>
                        <td><?php echo $c['category']; ?></td>
                        <td><?php echo htmlspecialchars($c['subject']); ?></td>
                        <td>
                            <?php if(!empty($c['attachment_path'])): ?>
                                <a href="<?php echo $c['attachment_path']; ?>" target="_blank" class="btn btn-sm btn-action"><i class="fas fa-file-download"></i></a>
                            <?php else: ?>
                                <span class="text-muted small">لا يوجد</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <form action="update_status.php" method="POST" class="d-flex gap-1">
                                <input type="hidden" name="id" value="<?php echo $c['id']; ?>">
                                <select name="status" class="form-select form-select-sm bg-dark text-white border-secondary" onchange="this.form.submit()">
                                    <option value="pending" <?php if($c['status']=='pending') echo 'selected'; ?>>قيد المراجعة</option>
                                    <option value="مقبول" <?php if($c['status']=='مقبول') echo 'selected'; ?>>مقبول</option>
                                    <option value="جاري التنفيذ" <?php if($c['status']=='جاري التنفيذ') echo 'selected'; ?>>جاري التنفيذ</option>
                                    <option value="تم الرفض" <?php if($c['status']=='تم الرفض') echo 'selected'; ?>>تم الرفض</option>
                                </select>
                            </form>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-light" onclick="viewDetails('<?php echo addslashes($c['message']); ?>', '<?php echo $c['phone']; ?>')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
function viewDetails(msg, phone) {
    alert("تفاصيل الطلب:\n\n" + msg + "\n\nرقم الهاتف للتواصل: " + phone);
}
</script>

</body>
</html>