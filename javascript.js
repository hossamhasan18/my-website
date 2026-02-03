// 1. إعدادات البداية والأنميشن
AOS.init({ duration: 1000, once: true });

// 2. إدارة اللودر وجلب البيانات عند التحميل
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            // إخفاء نهائي بعد الأنميشن
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }, 800);
    }
    
    fetchNews(); 
    
    // التأكد إن الصفحة تبدأ من فوق
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }
});

// 3. دالة جلب الأخبار (نفس التنسيق بتاعك بالظبط)
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

// 4. دالة فتح المودال (التفاصيل)
function showFullNews(title, text, imgSrc) {
    const modalEl = document.getElementById('newsDetailModal'); 
    if (!modalEl) return;

    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerHTML = text; 
    
    const modalImg = document.getElementById('modalImg');
    if(modalImg) {
        modalImg.src = imgSrc;
        modalImg.style.objectFit = "contain";
        modalImg.style.backgroundColor = "#000";
    }

    if (typeof bootstrap !== 'undefined') {
        const myModal = new bootstrap.Modal(modalEl);
        myModal.show();
    }
}

// 5. السكرول الناعم وقفل القائمة في الموبايل
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            
            // قفل القائمة في الموبايل فوراً
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }

            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition, 
                behavior: 'smooth'
            });
        }
    });
});

// 6. تأثير النافبار عند السكرول
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '8px 0';
        navbar.style.backgroundColor = 'rgba(8, 8, 8, 0.95)';
    } else {
        navbar.style.padding = '12px 0';
        navbar.style.backgroundColor = 'rgba(8, 8, 8, 0.98)';
    }
});