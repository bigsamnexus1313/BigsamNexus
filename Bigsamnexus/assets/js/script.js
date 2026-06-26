// Initialize AOS Animation Library
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Navigation Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }
});

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenu = document.getElementById('close-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

// Close mobile menu when clicking on links
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Calendar Booking System
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthEl = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const nextStepBtn = document.getElementById('nextStep');
const submitBookingBtn = document.getElementById('submitBooking');
const backToCalendarBtn = document.getElementById('backToCalendar');
const timeSlotsContainer = document.getElementById('timeSlots');
const progress1 = document.getElementById('progress1');
const progress2 = document.getElementById('progress2');
const progress3 = document.getElementById('progress3');

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let currentStep = 1;

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthEl.textContent = `${months[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    let html = '';
    
    for (let i = 0; i < firstDay; i++) {
        html += `<div></div>`;
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today.setHours(0,0,0,0);
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        let classes = 'calendar-day h-10 flex items-center justify-center rounded-lg text-sm cursor-pointer ';
        
        if (isPast || isWeekend) {
            classes += 'disabled text-gray-600';
        } else if (isSelected) {
            classes += 'selected';
        } else {
            classes += 'text-gray-300 hover:text-gold-400';
        }
        
        if (isToday && !isSelected) {
            classes += ' border border-gold-400/50';
        }
        
        html += `<div class="${classes}" data-date="${date.toISOString()}" onclick="selectDate(this)">${day}</div>`;
    }
    
    calendarGrid.innerHTML = html;
}

function selectDate(el) {
    if (el.classList.contains('disabled')) return;
    
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    selectedDate = new Date(el.dataset.date);
}

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Time Slots
const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM'
];

function renderTimeSlots() {
    timeSlotsContainer.innerHTML = timeSlots.map(time => `
        <button type="button" class="time-slot px-4 py-3 rounded-lg text-sm font-medium text-gray-300" onclick="selectTime(this, '${time}')">
            ${time}
        </button>
    `).join('');
}

function selectTime(el, time) {
    document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
    selectedTime = time;
}

// Multi-step Form Logic
nextStepBtn.addEventListener('click', () => {
    if (currentStep === 1) {
        if (!selectedDate) {
            alert('Please select a date first.');
            return;
        }
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        progress2.classList.add('active');
        currentStep = 2;
        renderTimeSlots();
    } else if (currentStep === 2) {
        if (!selectedTime) {
            alert('Please select a time slot.');
            return;
        }
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
        progress3.classList.add('active');
        nextStepBtn.classList.add('hidden');
        submitBookingBtn.classList.remove('hidden');
        currentStep = 3;
    }
});

backToCalendarBtn.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
    progress2.classList.remove('active');
    currentStep = 1;
});

const EMAILJS_PUBLIC_KEY = 'nB2IbjSHdZBl9Pi8Y';
const EMAILJS_SERVICE_ID = 'service_1049gfs';
const EMAILJS_TEMPLATE_ID = 'template_76kfc4i';

function isEmailJSConfigured() {
    return ![EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID].some(value => !value || value.includes('YOUR_'));
}

async function sendWithEmailJS(templateParams) {
    if (!isEmailJSConfigured()) {
        console.warn('EmailJS is not configured yet. Replace the placeholder values in assets/js/script.js.');
        return { ok: false, error: 'EmailJS is not configured yet.' };
    }

    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        return { ok: response.status === 200, error: null };
    } catch (error) {
        const errorMessage = error?.text || error?.message || 'Unknown EmailJS error';
        console.error('EmailJS submission failed:', error);
        return { ok: false, error: errorMessage };
    }
}

// Unified Lead Form Submit
document.getElementById('singleLeadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = document.getElementById('singleLeadForm');
    const success = document.getElementById('bookingSuccess');
    const submitButton = document.getElementById('submitBooking');

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const fullName = form.querySelector('[name="fullName"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const businessName = form.querySelector('[name="businessName"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const businessType = form.querySelector('[name="businessType"]').value.trim();
    const monthlyRevenue = form.querySelector('[name="monthlyRevenue"]').value.trim();
    const website = form.querySelector('[name="website"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    const consent = form.querySelector('[name="consent"]').checked;
    const serviceId = form.querySelector('[name="serviceId"]').value.trim();
    const bookingDate = selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not selected';
    const bookingTime = selectedTime || 'Not selected';

    const subject = `New Lead Request from ${fullName}`;
    const body = `Hello Bigsam Nexus,\n\nYou have a new lead request.\n\nService ID: ${serviceId}\nName: ${fullName}\nEmail: ${email}\nBusiness: ${businessName}\nPhone: ${phone}\nBusiness Type: ${businessType}\nMonthly Revenue: ${monthlyRevenue}\nWebsite: ${website || 'Not provided'}\nPreferred Date: ${bookingDate}\nPreferred Time: ${bookingTime}\n\nBusiness Goals / Challenges:\n${message}\n\nConsent to receive updates: ${consent ? 'Yes' : 'No'}`;

    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Sending...</span>';

    const result = await sendWithEmailJS({
        to_email: 'bigsamnexus1313@gmail.com',
        subject,
        message: body,
        from_name: fullName,
        reply_to: email,
        business_name: businessName,
        phone,
        business_type: businessType,
        monthly_revenue: monthlyRevenue,
        website,
        service_id: serviceId,
        preferred_date: bookingDate,
        preferred_time: bookingTime,
        consent: consent ? 'Yes' : 'No'
    });

    if (!result.ok) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Request My Free Consultation';

        const fallbackMailto = `mailto:bigsamnexus1313@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = fallbackMailto;
        alert(`Your request could not be sent automatically right now.\n\nEmailJS error: ${result.error || 'Unknown error'}\n\nYour email app should open with the details pre-filled. Please send it from there if needed.`);
        return;
    }

    submitButton.disabled = false;
    submitButton.innerHTML = 'Request My Free Consultation';
    form.style.display = 'none';
    success.classList.remove('hidden');
});

// "Submit Another Request" — attached once, outside the submit handler,
// to avoid stacking duplicate listeners on repeat submissions.
document.getElementById('bookAnother').addEventListener('click', () => {
    const form = document.getElementById('singleLeadForm');
    const success = document.getElementById('bookingSuccess');

    success.classList.add('hidden');
    form.style.display = 'block';
    form.reset();
    currentStep = 1;
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
    progress2.classList.remove('active');
    progress3.classList.remove('active');
    nextStepBtn.classList.remove('hidden');
    submitBookingBtn.classList.add('hidden');
    selectedDate = null;
    selectedTime = null;
    renderCalendar();
});

// Initialize Calendar
renderCalendar();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Counter Animation for Metrics
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Intersection Observer for counters
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const metricValue = entry.target.querySelector('.metric-value');
            if (metricValue && !metricValue.classList.contains('counted')) {
                metricValue.classList.add('counted');
                const text = metricValue.textContent;
                const num = parseInt(text.replace(/[^0-9]/g, ''));
                if (!isNaN(num)) {
                    animateValue(metricValue, 0, num, 2000);
                }
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.metric-value').forEach(el => {
    observer.observe(el.parentElement);
});
