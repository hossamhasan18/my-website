// 1. إخفاء الـ Loader بمجرد فتح الصفحة
window.onload = function() {
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
};

// 2. معالجة الإرسال وبقاء المستخدم في الصفحة
document.getElementById('complaintForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const loader = document.getElementById('loader-wrapper');
    const successModal = document.getElementById('successModal');
    const displayOrderNo = document.getElementById('displayOrderNo');

    // إظهار الـ Loader
    if (loader) {
        loader.style.display = 'flex';
        loader.style.opacity = '1';
    }

    const formData = new FormData(this);

    try {
        const response = await fetch('submit_complaint.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        // إخفاء الـ Loader
        if (loader) loader.style.display = 'none';

        if (result.status === 'success') {
            // عرض رقم الشكوى في المودال
            displayOrderNo.textContent = result.order_number;
            // إظهار نافذة النجاح
            successModal.style.display = 'flex';
            // تفريغ الفورم عشان يقدر يبعت غيرها لو عاوز
            this.reset();
        } else {
            alert("فشل الإرسال: " + (result.message || "خطأ غير معروف"));
        }
    } catch (error) {
        if (loader) loader.style.display = 'none';
        alert("خطأ في الاتصال بالسيرفر!");
    }
});

// 3. وظيفة إغلاق المودال (البقاء في نفس الصفحة)
function closeSuccessModal() {
    // إغفاء النافذة فقط دون أي تحويل
    document.getElementById('successModal').style.display = 'none';
    
    // اختياري: ممكن تعمل scroll لأعلى الصفحة عشان المستخدم يعرف إنه خلص
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. وظيفة نسخ الرقم
function copyOrderNumber() {
    const text = document.getElementById('displayOrderNo').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert("تم نسخ رقم الشكوى: " + text);
    });
}