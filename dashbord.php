<?php
session_start();
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    header("Location: login.html");
    exit;
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة التحكم | مكتب النائب عبده مأمون</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="dashbord.css">
    <style>
        /* ستايل إضافي بسيط لتحسين شكل خانة الرد السريع */
        .quick-reply-input {
            background: #000 !important;
            border: 1px solid #444 !important;
            color: #fff !important;
            font-size: 0.85rem;
        }
        .quick-reply-input:focus {
            border-color: #d4af37 !important;
            box-shadow: none;
        }
    </style>
</head>
<body>

    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <img src="logo.png" alt="Logo" class="admin-logo">
            <h5 class="brand-ruqaa gold-text"> النائب عبده مأمون</h5>
        </div>
        <nav class="sidebar-nav">
            <a href="#" class="nav-item active"><i class="fas fa-chart-line"></i> الإحصائيات</a>
            <a href="#posts-section" class="nav-item"><i class="fas fa-plus-circle"></i> نشر خبر</a>
            <a href="#complaints-section" class="nav-item"><i class="fas fa-tasks"></i> إدارة الشكاوى</a>
            <a href="#suggestions-section" class="nav-item"><i class="fas fa-lightbulb"></i> المقترحات الواردة</a>
            <a href="logout.php" class="nav-item logout"><i class="fas fa-sign-out-alt"></i> خروج</a>
        </nav>
    </aside>

    <main class="main-wrapper">
        <header class="admin-header d-flex justify-content-between align-items-center">
            <div class="header-info">
                <h2 class="brand-ruqaa gold-text">لوحة التحكم</h2>
                <p class="text-secondary small">إدارة الشكاوى، الأخبار، ومقترحات المواطنين</p>
            </div>
        </header>

        <section class="stats-grid mb-5">
            <div class="stat-box">
                <div class="stat-info"><span>إجمالي الشكاوى</span><h3 id="total-count">0</h3></div>
                <i class="fas fa-file-invoice"></i>
            </div>
            <div class="stat-box">
                <div class="stat-info"><span>المقترحات الجديدة</span><h3 id="suggestions-count">0</h3></div>
                <i class="fas fa-lightbulb text-warning"></i>
            </div>
            <div class="stat-box">
                <div class="stat-info"><span>تم الحل</span><h3 id="solved-count">0</h3></div>
                <i class="fas fa-check-double text-success"></i>
            </div>
        </section>

        <section id="posts-section" class="content-card mb-5">
            <h4 class="brand-ruqaa gold-text mb-4">نشر خبر جديد للجمهور</h4>
            <form action="save_post.php" method="POST" enctype="multipart/form-data">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input type="text" name="news_title" class="form-control-custom w-100 mb-3" placeholder="عنوان الخبر" required>
                        <textarea name="news_text" class="form-control-custom w-100" rows="6" placeholder="تفاصيل الخبر..." required></textarea>
                    </div>
                    <div class="col-md-6">
                        <div class="custom-file-upload">
                            <input type="file" id="postImage" name="news_image" accept="image/*" class="d-none" required>
                            <label for="postImage" class="cursor-pointer w-100 py-5 text-center">
                                <i class="fas fa-cloud-upload-alt fa-3x gold-text mb-3"></i>
                                <p class="text-secondary">ارفع صورة الخبر الاحترافية</p>
                            </label>
                        </div>
                        <button type="submit" class="btn-gold-fill w-100 py-3 mt-3 fw-bold">تأكيد النشر</button>
                    </div>
                </div>
            </form>
        </section>

        <section id="complaints-section" class="content-card mb-5">
            <h4 class="brand-ruqaa gold-text mb-4">طلبات المواطنين والشكاوى</h4>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>رقم الشكوى</th>
                            <th>الاسم</th>
                            <th>الموبايل</th>
                            <th>رد الإدارة (يرسل للمواطن)</th> <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="complaintsTable"></tbody>
                </table>
            </div>
        </section>

        <section id="suggestions-section" class="content-card mb-5">
            <h4 class="brand-ruqaa gold-text mb-4">مقترحات تطوير الدائرة</h4>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>صاحب المقترح</th>
                            <th>الموبايل</th>
                            <th>البلدة</th>
                            <th>المجال</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="suggestionsTable"></tbody>
                </table>
            </div>
        </section>
    </main>

    <div class="modal fade" id="complaintModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content bg-dark text-white" style="border: 1px solid #d4af37; border-radius: 15px;">
                <div class="modal-header">
                    <h5 class="modal-title gold-text brand-ruqaa">تفاصيل طلب المواطن</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3 text-end">
                        <div class="col-md-6"><p><strong>🔢 رقم الطلب:</strong> #<span id="m-order-no"></span></p></div>
                        <div class="col-md-6"><p><strong>👤 الاسم:</strong> <span id="m-name"></span></p></div>
                        <div class="col-md-6"><p><strong>📞 الهاتف:</strong> <span id="m-phone"></span></p></div>
                        <div class="col-md-6"><p><strong>🏠 البلدة:</strong> <span id="m-village"></span></p></div>
                        <div class="col-md-6"><p><strong>🪪 رقم البطاقة:</strong> <span id="m-national-id"></span></p></div>
                        <div class="col-md-12"><p><strong>📂 نوع الطلب:</strong> <span id="m-type" class="badge bg-primary"></span></p></div>
                        <div class="col-md-12">
                            <p><strong>📝 نص الشكوى:</strong></p>
                            <div id="m-message" class="p-3 border rounded bg-black text-light"></div>
                        </div>
                        <div id="m-attachment-wrapper" class="col-md-12 text-center" style="display:none;">
                            <p class="text-end"><strong>📎 المرفق:</strong></p>
                            <a id="m-attachment-link" href="#" target="_blank">
                                <img id="m-attachment-img" src="" class="img-fluid rounded border border-warning" style="max-height:300px;">
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="suggestionModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content bg-dark text-white" style="border: 1px solid #d4af37; border-radius: 15px;">
                <div class="modal-header">
                    <h5 class="modal-title gold-text brand-ruqaa">تفاصيل المقترح التطويري</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3 text-end">
                        <div class="col-md-6"><p><strong>👤 الاسم:</strong> <span id="s-name"></span></p></div>
                        <div class="col-md-6"><p><strong>📞 الهاتف:</strong> <span id="s-phone"></span></p></div>
                        <div class="col-md-6"><p><strong>🪪 رقم البطاقة:</strong> <span id="s-national-id" class="text-warning"></span></p></div>
                        <div class="col-md-6"><p><strong>🏠 البلدة:</strong> <span id="s-village"></span></p></div>
                        <div class="col-md-12"><p><strong>📂 المجال:</strong> <span id="s-category" class="badge bg-primary"></span></p></div>
                        <div class="col-md-12">
                            <p><strong>📝 نص المقترح:</strong></p>
                            <div id="s-details" class="p-3 border rounded bg-black text-light"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="dashbord.js"></script>
</body>
</html>