// 1. تشغيل جلب البيانات أول ما الصفحة تفتح
document.addEventListener('DOMContentLoaded', () => {
    loadComplaints();
    loadSuggestions();
    loadAdminNews();
});

// 2. وظيفة جلب الشكاوى وعرضها في الجدول مع خانة الرد السريع
async function loadComplaints() {
    try {
        const response = await fetch('get_complaints.php');
        const complaints = await response.json();
        const tableBody = document.getElementById('complaintsTable');
        
        // --- التعديل هنا فقط لتحديث العدادات المربوطة بالـ ID في الـ HTML ---
        if(document.getElementById('total-count')) {
            document.getElementById('total-count').textContent = complaints.length;
        }
        if(document.getElementById('solved-count')) {
            const solved = complaints.filter(item => item.status === 'solved').length;
            document.getElementById('solved-count').textContent = solved;
        }
        // -----------------------------------------------------------------

        if (!tableBody) return;
        tableBody.innerHTML = ''; 

        complaints.forEach(item => {
            let statusText = '', statusClass = '';
            if(item.status === 'pending') { statusText = 'قيد الانتظار'; statusClass = 'bg-warning text-dark'; }
            else if(item.status === 'accepted') { statusText = 'مقبول'; statusClass = 'bg-primary'; }
            else { statusText = 'تم الحل'; statusClass = 'bg-success'; }

            tableBody.innerHTML += `
                <tr>
                    <td>#${item.order_number}</td>
                    <td>${item.full_name}</td>
                    <td>${item.phone}</td>
                    <td>
                        <div class="d-flex gap-1">
                            <input type="text" id="reply-${item.order_number}" 
                                   class="form-control form-control-sm bg-black text-white border-secondary" 
                                   style="font-size:0.8rem;"
                                   placeholder="اكتب ردك..." value="${item.admin_reply || ''}">
                            <button class="btn btn-sm btn-gold-fill" onclick="sendQuickReply('${item.order_number}')">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </td>
                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="btn-group gap-1">
                            <button class="btn btn-sm btn-outline-warning" onclick="viewDetails('${item.order_number}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-success" onclick="updateStatus('${item.order_number}', 'solved')">حل</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteComplaint('${item.order_number}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error("خطأ في جلب الشكاوى"); }
}

// 3. وظيفة إرسال الرد السريع للمواطن
async function sendQuickReply(orderNo) {
    const replyValue = document.getElementById(`reply-${orderNo}`).value;
    const fd = new FormData();
    fd.append('order_number', orderNo);
    fd.append('reply', replyValue);
    fd.append('action', 'save_reply');

    try {
        const res = await fetch('update_status.php', { method: 'POST', body: fd });
        const data = await res.json();
        if(data.status === 'success') {
            Swal.fire({ 
                title: 'تم حفظ الرد!', 
                icon: 'success', 
                toast: true, 
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 2000,
                background: '#111',
                color: '#fff'
            });
        }
    } catch (e) { console.error("خطأ في إرسال الرد"); }
}

// 4. وظيفة عرض تفاصيل الشكوى (زرار العين)
async function viewDetails(orderNo) {
    try {
        const res = await fetch('get_complaints.php');
        const data = await res.json();
        const item = data.find(c => String(c.order_number) === String(orderNo));

        if(item) {
            document.getElementById('m-order-no').textContent = item.order_number;
            document.getElementById('m-name').textContent = item.full_name;
            document.getElementById('m-phone').textContent = item.phone;
            document.getElementById('m-national-id').textContent = item.national_id;
            document.getElementById('m-village').textContent = item.village;
            document.getElementById('m-type').textContent = item.req_type;
            document.getElementById('m-message').textContent = item.message;

            const img = document.getElementById('m-attachment-img');
            const link = document.getElementById('m-attachment-link');
            const wrapper = document.getElementById('m-attachment-wrapper');
            
            if(item.attachment) {
                img.src = 'uploads/' + item.attachment;
                link.href = 'uploads/' + item.attachment;
                if(wrapper) wrapper.style.display = 'block';
            } else {
                if(wrapper) wrapper.style.display = 'none';
            }

            var myModal = new bootstrap.Modal(document.getElementById('complaintModal'));
            myModal.show();
        }
    } catch (e) { console.error("خطأ في عرض التفاصيل"); }
}

// 5. وظيفة مسح الشكوى
async function deleteComplaint(orderNo) {
    const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: `سيتم حذف الطلب رقم #${orderNo} نهائياً`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        background: '#111', color: '#fff'
    });

    if (result.isConfirmed) {
        const fd = new FormData();
        fd.append('order_number', orderNo);
        fd.append('action', 'delete');
        try {
            const res = await fetch('update_status.php', { method: 'POST', body: fd });
            const resData = await res.json();
            if(resData.status === 'success') {
                Swal.fire({ title: 'تم الحذف!', icon: 'success', background: '#111', color: '#fff' });
                loadComplaints();
            }
        } catch (e) { console.error("خطأ في المسح"); }
    }
}

// 6. وظيفة تحديث الحالة
async function updateStatus(orderNo, newStatus) {
    const fd = new FormData();
    fd.append('order_number', orderNo);
    fd.append('status', newStatus);
    fd.append('action', 'update');

    const res = await fetch('update_status.php', { method: 'POST', body: fd });
    const result = await res.json();
    if(result.status === 'success') {
        Swal.fire({ title: 'تم التحديث!', icon: 'success', background: '#111', color: '#fff' });
        loadComplaints();
    }
}

// 7. وظائف المقترحات والأخبار
async function loadSuggestions() {
    try {
        const response = await fetch('get_suggestions.php');
        const data = await response.json();
        const tableBody = document.getElementById('suggestionsTable');
        if(document.getElementById('suggestions-count')) document.getElementById('suggestions-count').textContent = data.length;
        if(!tableBody) return;
        tableBody.innerHTML = ''; 

        data.forEach(item => {
            tableBody.innerHTML += `
                <tr>
                    <td>${item.full_name}</td>
                    <td>${item.phone}</td>
                    <td>${item.village}</td>
                    <td><span class="badge bg-outline-warning" style="border:1px solid #d4af37; color:#d4af37">${item.category}</span></td>
                    <td>
                        <div class="btn-group gap-2">
                            <button class="btn btn-sm btn-outline-warning" onclick='viewSuggestionDetails(${JSON.stringify(item)})'>
                                <i class="fas fa-eye"></i> عرض
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteSuggestion(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error("خطأ في جلب المقترحات"); }
}

function viewSuggestionDetails(item) {
    document.getElementById('s-name').textContent = item.full_name;
    document.getElementById('s-phone').textContent = item.phone;
    document.getElementById('s-national-id').textContent = item.national_id;
    document.getElementById('s-village').textContent = item.village;
    document.getElementById('s-category').textContent = item.category;
    document.getElementById('s-details').textContent = item.details;
    new bootstrap.Modal(document.getElementById('suggestionModal')).show();
}

async function deleteSuggestion(id) {
    const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "سيتم حذف المقترح نهائياً",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        background: '#111', color: '#fff'
    });
    if (result.isConfirmed) {
        fetch(`delete_suggestion.php?id=${id}`)
        .then(() => {
            Swal.fire({ title: 'تم الحذف!', icon: 'success', background: '#111', color: '#fff' });
            loadSuggestions();
        });
    }
}

function loadAdminNews() {
    fetch('get_admin_news.php').then(res => res.json()).then(data => {
        const tbody = document.getElementById('newsAdminTable');
        if(!tbody) return;
        tbody.innerHTML = '';
        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="uploads/news/${item.image_path}" width="50" class="rounded"></td>
                    <td>${item.title}</td>
                    <td>${item.created_at}</td>
                    <td>
                        <a href="delete_news.php?id=${item.id}" class="btn btn-sm btn-danger" onclick="return confirm('هل أنت متأكد؟')">
                            <i class="fas fa-trash"></i> حذف
                        </a>
                    </td>
                </tr>`;
        });
    });
}