// 1. إجبار المتصفح يفتح من بداية الصفحة ويمسح الهاش
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
    fetchNews(); 
    
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// 3. دالة جلب الأخبار (تم تحسين الرندر للموبايل)
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

// 4. دالة فتح المودال
function showFullNews(title, text, imgSrc) {
    const modalEl = document.getElementById('newsDetailModal'); 
    if (!modalEl) {
        alert("عذراً، لم يتم العثور على نافذة عرض التفاصيل في الصفحة.");
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

    if (typeof bootstrap !== 'undefined') {
        const myModal = new bootstrap.Modal(modalEl);
        myModal.show();
    }
}

// 5. السكرول الناعم (تم التعديل ليناسب الموبايل والنافبار الـ Fixed)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            // حساب ارتفاع النافبار الفعلي عشان السكرول م يغطيش العنوان
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition, 
                behavior: 'smooth'
            });

            // قفل قائمة الموبايل أوتوماتيكياً بعد الضغط على أي رابط
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});
// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('loader-hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Navbar scroll effect
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

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu close on click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            const navbarToggler = document.querySelector('.navbar-toggler');
            navbarToggler.click();
        }
    });
});

// Card hover effect for touch devices
if ('ontouchstart' in window) {
    document.querySelectorAll('.service-card, .news-card').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.classList.add('gold-border-hover');
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('gold-border-hover');
            }, 300);
        });
    });
}