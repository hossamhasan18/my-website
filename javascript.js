// 1. إجبار المتصفح يفتح من بداية الصفحة فوق خالص ويمسح الهاش (#about)
if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
}

window.scrollTo(0, 0);

// 2. تشغيل الأنميشن واللودر
AOS.init({ duration: 1000, once: true });

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 800);
    }
    fetchNews(); // نداء جلب الأخبار
    
    // ضمان إضافي للصعود للأعلى بعد اختفاء اللودر
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// 3. دالة جلب الأخبار من قاعدة البيانات
async function fetchNews() {
    const container = document.getElementById('newsContainer');
    if (!container) return;

    try {
        const response = await fetch('get_news.php');
        const data = await response.json();

        if (!data || data.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-secondary"><p>لا توجد أخبار منشورة حالياً.</p></div>';
            return;
        }

        container.innerHTML = '';
        data.forEach(item => {
            const safeTitle = item.title.replace(/'/g, "\\'").replace(/"/g, "&quot;");
            const safeDesc = item.description.replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, "<br>");
            const imgPath = `uploads/news/${item.image}`;

            container.innerHTML += `
                <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
                    <div class="card news-card h-100 gold-border-hover bg-black">
                        <div class="news-img-box" style="height: 250px; background: #000; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <img src="${imgPath}" class="card-img-top" 
                                 style="max-width: 100%; max-height: 100%; object-fit: contain;" 
                                 onerror="this.src='abdo.jpeg'">
                        </div>
                        <div class="card-body p-4 text-end">
                            <h5 class="card-title gold-text brand-ruqaa">${item.title}</h5>
                            <p class="card-text text-light-gray small">${item.description.substring(0, 100)}...</p>
                            <button class="btn btn-link gold-text p-0 text-decoration-none fw-bold" 
                                onclick="showFullNews('${safeTitle}', '${safeDesc}', '${imgPath}')">
                                اقرأ المزيد <i class="fas fa-arrow-left ms-2"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// 4. دالة فتح المودال (تم تحسين الأمان عشان الخطأ اللي بيظهرلك)
function showFullNews(title, text, imgSrc) {
    const modalEl = document.getElementById('newsDetailModal'); // اتأكد إن الـ ID ده هو اللي في HTML
    if (!modalEl) {
        alert("عذراً، لم يتم العثور على نافذة عرض التفاصيل في الصفحة.");
        console.error("المودال newsDetailModal غير موجود في الـ HTML");
        return;
    }

    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerHTML = text; 
    
    const modalImg = document.getElementById('modalImg');
    if(modalImg) {
        modalImg.src = imgSrc;
        modalImg.style.objectFit = "contain";
        modalImg.style.backgroundColor = "#000";
    }

    // تشغيل المودال بطريقة تمنع تعارض المكتبات
    if (typeof bootstrap !== 'undefined') {
        const myModal = new bootstrap.Modal(modalEl);
        myModal.show();
    } else {
        console.error("Bootstrap library is not loaded!");
    }
}

// 5. تعديل سلوك التنقل داخل الصفحة (Smooth Scroll)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70, 
                behavior: 'smooth'
            });
        }
    });
});