document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // إظهار لودنج بسيط بشكل شيك
    Swal.fire({
        title: 'جاري التحقق',
        html: 'انتظر لحظة من فضلك...',
        timerProgressBar: true,
        background: '#111',
        color: '#d4af37',
        didOpen: () => {
            Swal.showLoading();
        }
    });

    const fd = new FormData();
    fd.append('username', user);
    fd.append('password', pass);

    try {
        const response = await fetch('auth.php', { method: 'POST', body: fd });
        const result = await response.json();

        if (result.status === 'success') {
            // تنبيه النجاح
            Swal.fire({
                icon: 'success',
                title: 'أهلاً بك يا سيادة النائب',
                text: 'تم تسجيل الدخول بنجاح، جاري تحويلك للوحة التحكم...',
                background: '#111',
                color: '#fff',
                iconColor: '#d4af37',
                showConfirmButton: false,
                timer: 2000
            });
            setTimeout(() => { window.location.href = 'dashbord.php'; }, 2000);
        } else {
            // التنبيه "الجامد" اللي طلبته في حالة الخطأ
            Swal.fire({
                icon: 'error',
                title: 'عفواً.. خطأ في الدخول',
                text: result.msg, // الرسالة اللي جاية من PHP
                background: '#111',
                color: '#fff',
                iconColor: '#ff4d4d',
                confirmButtonText: 'حاول مرة أخرى',
                confirmButtonColor: '#d4af37',
                showClass: {
                    popup: 'animate__animated animate__shakeX' // حركة اهتزاز لو مفعل مكتبة Animate.css
                }
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'warning',
            title: 'مشكلة في الاتصال',
            text: 'تأكد من تشغيل السيرفر المحلي (XAMPP)',
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#d4af37'
        });
    }
});