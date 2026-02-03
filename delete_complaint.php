// الكود ده يتحط جوه دالة deleteComplaint(orderNo)
const result = await Swal.fire({
    title: 'هل أنت متأكد؟',
    text: `سيتم حذف الطلب رقم #${orderNo} نهائياً`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'نعم، احذف الآن',
    cancelButtonText: 'إلغاء',
    background: '#111',
    color: '#fff'
});

if (result.isConfirmed) {
    const fd = new FormData();
    fd.append('order_number', orderNo);
    fd.append('action', 'delete'); // بنعرف الـ PHP إننا عاوزين نمسح

    try {
        const res = await fetch('update_status.php', { method: 'POST', body: fd });
        const data = await res.json();
        
        if(data.status === 'success') {
            Swal.fire({
                title: 'تم الحذف!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#111',
                color: '#fff'
            });
            loadComplaints(); // تحديث الجدول فوراً عشان السطر يختفي
        } else {
            Swal.fire({ title: 'خطأ!', text: 'فشل في حذف الطلب', icon: 'error' });
        }
    } catch (e) {
        console.error("Error:", e);
        // لو حصل مشكلة في الـ JSON جرب الطريقة المباشرة
        window.location.href = `delete_complaint.php?order_number=${orderNo}`;
    }
}