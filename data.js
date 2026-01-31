/**
 * نظام تسجيل بيانات المقابلة - النائب عبده مأمون
 * وظيفة الملف: إدارة شاشة التحميل والتحقق من صحة البيانات
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. إدارة شاشة التحميل (Preloader)
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 800); // يختفي بعد 0.8 ثانية من اكتمال تحميل العناصر
        });
    }

    // 2. التحقق من صحة النموذج قبل الإرسال
    const bookingForm = document.querySelector('form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            // جلب القيم للتأكد من وجودها
            const inputs = bookingForm.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff4d4d'; // تحويل اللون للأحمر في حالة الخطأ
                } else {
                    input.style.borderColor = 'rgba(212, 175, 55, 0.2)'; // إعادة اللون الطبيعي
                }
            });

            if (!isValid) {
                e.preventDefault(); // منع الانتقال للصفحة التالية
                alert('برجاء ملء جميع الحقول المطلوبة بشكل صحيح.');
            } else {
                // إضافة تأثير بصري على زر الإرسال قبل الانتقال
                const submitBtn = bookingForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> جاري التحميل...';
                submitBtn.style.pointerEvents = 'none';
            }
        });
    }

    // 3. منع إدخال أي شيء غير الأرقام في حقل البطاقة والموبايل
    const numericInputs = document.querySelectorAll('input[type="tel"], input[maxlength="14"]');
    numericInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, ''); // حذف أي حرف غير رقمي فوراً
        });
    });

});