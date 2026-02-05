// 1. تشغيل جلب البيانات أول ما الصفحة تفتح
document.addEventListener('DOMContentLoaded', () => {
    loadComplaints();
    loadSuggestions();
    displayNewsForAdmin(); 
});

// دالة موحدة لرسائل التنبيه (SweetAlert)
const toast = (title, icon = 'success') => {
    Swal.fire({
        title: title,
        icon: icon,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        background: '#111',
        color: '#fff'
    });
};

// 2. وظيفة جلب الشكاوى وعرضها في الجدول
async function loadComplaints() {
    try {
        const response = await fetch('get_complaints.php');
        const complaints = await response.json();
        const tableBody = document.getElementById('complaintsTable');
        
        if(document.getElementById('total-count')) document.getElementById('total-count').textContent = complaints.length;
        if(document.getElementById('solved-count')) {
            const solved = complaints.filter(item => item.status === 'solved').length;
            document.getElementById('solved-count').textContent = solved;
        }

        if (!tableBody) return;
        tableBody.innerHTML = ''; 

        complaints.forEach(item => {
            let statusText = '', statusClass = '';
            if(item.status === 'pending') { statusText = 'قيد الانتظار'; statusClass = 'bg-warning text-dark'; }
            else if(item.status === 'accepted') { statusText = 'مقبول'; statusClass = 'bg-primary'; }
            else { statusText = 'تم الحل'; statusClass = 'bg-success'; }

            tableBody.innerHTML += `
                <tr>
                    <td style="color: #ffffff !important;">#${item.order_number}</td>
                    <td style="color: #ffffff !important;">${item.full_name}</td>
                    <td style="color: #ffffff !important;">${item.phone}</td>
                    <td>
                        <div class="d-flex gap-1">
                            <input type="text" id="reply-${item.order_number}" class="form-control form-control-sm bg-black text-white border-secondary" placeholder="اكتب ردك..." value="${item.admin_reply || ''}">
                            <button class="btn btn-sm btn-gold-fill" onclick="sendQuickReply('${item.order_number}')"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </td>
                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="btn-group gap-1">
                            <button class="btn btn-sm btn-outline-warning" onclick="viewDetails('${item.order_number}')"><i class="fas fa-eye"></i></button>
                            <button class="btn btn-sm btn-success" onclick="updateStatus('${item.order_number}', 'solved')">حل</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteComplaint('${item.order_number}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error("خطأ في جلب الشكاوى"); }
}

// 3. وظيفة جلب المقترحات
async function loadSuggestions() {
    try {
        const response = await fetch('get_suggestions.php');
        const data = await response.json();
        const tableBody = document.getElementById('suggestionsTable');
        if(document.getElementById('suggestions-count')) document.getElementById('suggestions-count').textContent = data.length;
        if(!tableBody) return;
        tableBody.innerHTML = ''; 

        data.forEach(item => {
            const itemData = JSON.stringify(item).replace(/'/g, "&apos;");
            tableBody.innerHTML += `
                <tr>
                    <td style="color: #ffffff !important;">${item.full_name}</td>
                    <td style="color: #ffffff !important;">${item.phone}</td>
                    <td style="color: #ffffff !important;">${item.village}</td>
                    <td><span class="badge bg-outline-warning" style="border:1px solid #d4af37; color:#d4af37">${item.category}</span></td>
                    <td>
                        <div class="btn-group gap-2">
                            <button class="btn btn-sm btn-outline-warning" onclick='viewSuggestionDetails(${itemData})'><i class="fas fa-eye"></i> عرض</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteSuggestion(${item.id})"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error("خطأ في جلب المقترحات"); }
}

// 4. دالة عرض التفاصيل (المودال)
async function viewDetails(orderNo) {
    try {
        const response = await fetch('get_complaints.php');
        const complaints = await response.json();
        const item = complaints.find(c => String(c.order_number) === String(orderNo));

        if (item) {
            document.getElementById('m-order-no').textContent = item.order_number;
            document.getElementById('m-name').textContent = item.full_name;
            document.getElementById('m-phone').textContent = item.phone;
            document.getElementById('m-village').textContent = item.village;
            document.getElementById('m-national-id').textContent = item.national_id || 'غير مسجل';
            document.getElementById('m-type').textContent = item.req_type;
            document.getElementById('m-message').textContent = item.message;

            const imgWrapper = document.getElementById('m-attachment-wrapper');
            const imgTag = document.getElementById('m-attachment-img');
            const photo = item.image_path || item.attachment;

            if (photo) {
                imgTag.src = 'uploads/' + photo;
                if(imgWrapper) imgWrapper.style.display = 'block';
            } else {
                if(imgWrapper) imgWrapper.style.display = 'none';
            }

            new bootstrap.Modal(document.getElementById('complaintModal')).show();
        }
    } catch (e) { console.error("خطأ"); }
}

// 5. دالة الرد السريع ببوكس تنبيه
async function sendQuickReply(orderNo) {
    const replyValue = document.getElementById(`reply-${orderNo}`).value;
    const fd = new FormData();
    fd.append('order_number', orderNo);
    fd.append('reply', replyValue);
    fd.append('action', 'save_reply');
    
    await fetch('update_status.php', { method: 'POST', body: fd });
    toast('تم حفظ الرد وإرساله');
}

// 6. دالة حل الشكوى ببوكس تأكيد
async function updateStatus(orderNo, newStatus) {
    Swal.fire({
        title: 'تأكيد الحل',
        text: "هل تريد وضع علامة 'تم الحل' على هذه الشكوى؟",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#333',
        confirmButtonText: 'نعم، تم الحل',
        cancelButtonText: 'تراجع',
        background: '#111', color: '#fff'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const fd = new FormData();
            fd.append('order_number', orderNo);
            fd.append('status', newStatus);
            fd.append('action', 'update');
            await fetch('update_status.php', { method: 'POST', body: fd });
            loadComplaints();
            toast('تم تحديث الحالة بنجاح');
        }
    });
}

// 7. دالة الحذف ببوكس احترافي
async function deleteComplaint(orderNo) {
    Swal.fire({
        title: 'حذف الشكوى؟',
        text: "لن يمكنك استعادة هذه البيانات مرة أخرى!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#333',
        confirmButtonText: 'إلغاء نهائي',
        cancelButtonText: 'تراجع',
        background: '#111', color: '#fff'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const fd = new FormData();
            fd.append('order_number', orderNo);
            fd.append('action', 'delete');
            await fetch('update_status.php', { method: 'POST', body: fd });
            loadComplaints();
            toast('تم الحذف بنجاح', 'error');
        }
    });
}

// 8. حذف المقترح ببوكس
async function deleteSuggestion(id) {
    Swal.fire({
        title: 'حذف المقترح؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'حذف',
        background: '#111', color: '#fff'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`delete_suggestion.php?id=${id}`);
            loadSuggestions();
            toast('تم حذف المقترح');
        }
    });
}

// دالة المقترحات
function viewSuggestionDetails(item) {
    document.getElementById('s-name').textContent = item.full_name;
    document.getElementById('s-phone').textContent = item.phone;
    document.getElementById('s-village').textContent = item.village;
    document.getElementById('s-category').textContent = item.category;
    document.getElementById('s-details').textContent = item.details;
    new bootstrap.Modal(document.getElementById('suggestionModal')).show();
}

// دالة الأخبار المحدثة
async function displayNewsForAdmin() {
    const tableBody = document.getElementById('newsManagementTable');
    if (!tableBody) return;
    try {
        const response = await fetch('get_news.php?all=true');
        const data = await response.json();
        tableBody.innerHTML = ''; 
        data.forEach(item => {
            const itemJSON = JSON.stringify(item).replace(/"/g, '&quot;');
            
            // التعديل هنا: أضفنا مسار المجلد قبل اسم الصورة
            tableBody.innerHTML += `<tr>
                <td><img src="uploads/news/${item.image_path}" style="width:60px; height:40px; border-radius:5px; object-fit:cover;" onerror="this.src='logo.png'"></td>
                <td style="color:#fff">${item.title}</td>
                <td style="color:#aaa; font-size: 0.85rem;">
                    <span class="text-truncate-custom" style="max-width: 150px; display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${item.details || ''}
                    </span>
                </td>
                <td class="text-secondary">${item.created_at || ''}</td>
                <td>
                    <div class="btn-group gap-1">
                        <button onclick='viewNewsItem(${itemJSON})' class="btn btn-outline-info btn-sm"><i class="fas fa-eye"></i></button>
                        <button onclick='openEditNewsModal(${itemJSON})' class="btn btn-outline-warning btn-sm"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteNews(${item.id})" class="btn btn-outline-danger btn-sm"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>`;
        });
    } catch (e) { console.error("Error loading news", e); }
}

// دالة لفتح مودال التعديل وملء البيانات
function openEditNewsModal(item) {
    document.getElementById('edit-news-id').value = item.id;
    document.getElementById('edit-news-title').value = item.title;
    document.getElementById('edit-news-text').value = item.details || '';
    new bootstrap.Modal(document.getElementById('editNewsModal')).show();
}

// دالة لعرض الخبر في مودال العرض بشكل منسق
function viewNewsItem(item) {
    document.getElementById('v-news-title').textContent = item.title;
    
    // التعديل هنا: أضفنا مسار المجلد قبل اسم الصورة
    const newsImg = document.getElementById('v-news-img');
    newsImg.src = "uploads/news/" + item.image_path; 
    
    const contentDiv = document.getElementById('m-news-content-view');
    contentDiv.textContent = item.details || 'لا يوجد تفاصيل لهذا الخبر';
    
    new bootstrap.Modal(document.getElementById('viewNewsModal')).show();
}

function deleteNews(id) {
    Swal.fire({
        title: 'حذف الخبر؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'نعم، احذف',
        background: '#111', color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`delete_news.php?id=${id}`).then(() => {
                displayNewsForAdmin();
                toast('تم حذف الخبر');
            });
        }
    });
}