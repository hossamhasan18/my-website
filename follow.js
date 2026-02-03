document.getElementById('trackForm').onsubmit = async function(e) {
    e.preventDefault();
    
    const national_id = document.getElementById('national_id_input').value;
    const order_no = document.getElementById('order_no_input').value;

    const formData = new FormData();
    formData.append('national_id', national_id);
    formData.append('order_no', order_no);

    // رسالة التحميل
    Swal.fire({
        title: 'جاري البحث في السجلات...',
        background: '#111',
        color: '#d4af37',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const response = await fetch('track_logic.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            
            // --- مصفوفة الترجمة والألوان ---
            let statusHTML = '';
            
            if (result.data.status === 'pending') {
                statusHTML = '<b style="color: #ffc107;">قيد الانتظار</b>'; // أصفر
            } else if (result.data.status === 'accepted') {
                statusHTML = '<b style="color: #0dcaf0;">تم قبول طلبك</b>'; // أزرق
            } else if (result.data.status === 'solved') {
                statusHTML = '<b style="color: #28a745;">تم حل الشكوى بنجاح</b>'; // أخضر
            } else {
                statusHTML = `<b style="color: #fff;">${result.data.status}</b>`;
            }

            // --- تحضير نص الرد إذا وجد ---
            let adminReplyHTML = '';
            if (result.data.admin_reply) {
                adminReplyHTML = `
                    <div style="margin-top:15px; padding:10px; border:1px solid #d4af37; border-radius:8px; background:#000;">
                        <p style="color:#d4af37; font-weight:bold; margin-bottom:5px;">📢 رد المكتب:</p>
                        <p style="color:#fff; margin:0;">${result.data.admin_reply}</p>
                    </div>`;
            }

            // إظهار النتيجة النهائية بالعربي مع الرد
            Swal.fire({
                title: `<span style="color:#d4af37">أهلاً بك يا أ/ ${result.data.full_name}</span>`,
                html: `<div style="margin-top:10px;">
                        <p style="color:#fff; font-size:1.2rem;">حالة طلبك هي: ${statusHTML}</p>
                        ${adminReplyHTML}
                       </div>`,
                icon: 'success',
                background: '#111',
                confirmButtonColor: '#d4af37',
                confirmButtonText: 'حسناً'
            });

        } else {
            // رسالة الخطأ لو البيانات غلط
            Swal.fire({
                icon: 'error',
                title: 'عذراً...',
                text: result.msg,
                background: '#111',
                color: '#fff',
                confirmButtonColor: '#d4af37'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ في الاتصال',
            text: 'حدثت مشكلة فنية، حاول مرة أخرى',
            background: '#111',
            color: '#fff'
        });
    }
};