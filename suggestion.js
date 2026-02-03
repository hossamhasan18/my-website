document.addEventListener('DOMContentLoaded', function() {
    
    // 1. إدارة شاشة التحميل (Preloader)
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => { loader.style.display = 'none'; }, 500);
            }, 800);
        });
    }

    // 2. التحقق من المدخلات الرقمية (الموبايل والبطاقة)
    const phoneInput = document.querySelector('input[name="phone"]');
    const nationalIdInput = document.querySelector('input[name="national_id"]');

    // وظيفة لمنع كتابة أي شيء غير الأرقام
    const onlyNumbers = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    };

    if(phoneInput) phoneInput.addEventListener('input', onlyNumbers);
    if(nationalIdInput) nationalIdInput.addEventListener('input', onlyNumbers);

    // 3. معالجة إرسال الفورم (Form Submission)
    const form = document.getElementById('suggestionForm');
    if(form) {
        form.addEventListener('submit', function(e) {
            const btn = this.querySelector('button');
            const nationalId = nationalIdInput.value;
            const phone = phoneInput.value;

            // التحقق من طول رقم البطاقة (14 رقم)
            if(nationalId.length !== 14) {
                e.preventDefault(); // وقف الإرسال
                alert('عذراً، يجب أن يكون رقم البطاقة الشخصية 14 رقماً صحيحاً.');
                return false;
            }

            // التحقق من طول رقم الموبايل (11 رقم)
            if(phone.length !== 11) {
                e.preventDefault();
                alert('عذراً، يجب أن يكون رقم الموبايل 11 رقماً.');
                return false;
            }

            // لو البيانات صح، غير شكل الزرار وخليه يبعت
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin ms-2"></i> جاري حفظ مقترحك...';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.7';
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من حالة الإرسال من اللينك
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'success') {
        
        Swal.fire({
            title: '<span class="brand-ruqaa gold-text">تم الإرسال بنجاح</span>',
            html: '<p class="text-white">شكراً لك.. تم استلام مقترحك بنجاح وسيتم عرضه على مكتب النائب عبده مأمون.</p>',
            icon: 'success',
            iconColor: '#d4af37', // لون علامة الصح ذهبي
            background: '#111',   // خلفية سوداء فخمة
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#d4af37',
            showClass: {
                popup: 'animate__animated animate__fadeInUp' // حركة ظهور ناعمة
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown'
            }
        }).then(() => {
            // كود لتنظيف الرابط بعد إغلاق الرسالة
            window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
});