document.addEventListener('DOMContentLoaded', function() {
    
    // 1. شاشة التحميل (Preloader)
    const loader = document.getElementById('loader-wrapper');
    window.addEventListener('load', function() {
        setTimeout(() => {
            if(loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }
        }, 1000);
    });

    // 2. اختيار اليوم من النتيجة
    const dayItems = document.querySelectorAll('.day-item:not(.muted)');
    const dayLabel = document.getElementById('current-day-label');

    dayItems.forEach(item => {
        item.addEventListener('click', function() {
            dayItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            if(dayLabel) {
                dayLabel.innerText = this.innerText + " فبراير 2026";
            }
        });
    });

    // 3. اختيار الوقت
    const timeBtns = document.querySelectorAll('.time-btn:not(.disabled)');
    timeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            timeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});