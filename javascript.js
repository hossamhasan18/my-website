// تفعيل مكتبة AOS
AOS.init({ duration: 1000, once: true });

// شاشة التحميل
window.addEventListener("load", function() {
    const preloader = document.getElementById("preloader");
    setTimeout(() => {
        preloader.classList.add("loader-hidden");
    }, 600);
});

// سكرول الناف بار
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNavbar');
    if (window.scrollY > 50) {
        navbar.style.background = "#000";
        navbar.style.padding = "5px 0";
    } else {
        navbar.style.background = "rgba(8, 8, 8, 0.98)";
        navbar.style.padding = "10px 0";
    }
});

// سموث سكرول
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // غلق القائمة في الموبايل بعد الضغط
            const navCollapse = document.querySelector('.navbar-collapse');
            if (navCollapse.classList.contains('show')) {
                navCollapse.classList.remove('show');
            }
        }
    });
});
// الطريقة الصح والمحترفة
const reviewBtn = document.querySelector('.btn-review-order');

if (reviewBtn) { // لو الزرار موجود فعلاً في الصفحة
    reviewBtn.addEventListener('click', function() {
        console.log("تم الضغط على زر مراجعة الطلب");
        // باقي الكود بتاعك هنا
    });
}