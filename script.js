// ১. বছর অটোমেটিক আপডেট করার জন্য
document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    const footerText = document.querySelector('.footer p');
    if (footerText) {
        footerText.textContent = footerText.textContent.replace('2024', year);
    }
    // টাইপিং অ্যানিমেশন শুরু
    type();
});

// ২. ডার্ক/লাইট মোড টগল
const toggleSwitch = document.querySelector('#checkbox');
if (toggleSwitch) {
    toggleSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('light-mode');
            document.querySelector('.icon').textContent = '☀️';
        } else {
            document.body.classList.remove('light-mode');
            document.querySelector('.icon').textContent = '🌙';
        }
    });
}

// ৩. ল্যাঙ্গুয়েজ সুইচার (BN/EN)
const langBtn = document.querySelector('.lang-btn');
let currentLang = 'en';

if (langBtn) {
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'bn' : 'en';
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute(`data-${currentLang}`);
        });
        langBtn.textContent = currentLang === 'en' ? 'BN' : 'EN';
    });
}

// ৪. অ্যাডভান্সড টাইপিং ইফেক্ট কোড
const words = ["Web Developer", "Freelancer", "Creative Thinker"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;

    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; // শব্দ শেষ হলে ২ সেকেন্ড অপেক্ষা করবে
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}