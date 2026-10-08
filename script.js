// Navigation
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearch();
    initializeModals();
    initializeForms();
    initializeChart();
});

// Navigation between sections
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding section
            const sectionId = link.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInputs = {
        studentSearch: 'studentsTableBody',
        facultySearch: 'faculty-card',
        courseSearch: 'course-card'
    };

    Object.keys(searchInputs).forEach(inputId => {
        const searchInput = document.getElementById(inputId);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                performSearch(searchTerm, searchInputs[inputId]);
            });
        }
    });
}

function performSearch(term, targetClass) {
    if (targetClass === 'studentsTableBody') {
        const tbody = document.getElementById('studentsTableBody');
        const rows = tbody.getElementsByTagName('tr');
        
        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    } else {
        const cards = document.querySelectorAll(`.${targetClass}`);
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(term) ? '' : 'none';
        });
    }
}

// Modal functionality
function initializeModals() {
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Form handling
function initializeForms() {
    // Student form
    const studentForm = document.querySelector('#studentModal .modal-form');
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleStudentSubmit(e.target);
        });
    }

    // Faculty form
    const facultyForm = document.querySelector('#facultyModal .modal-form');
    if (facultyForm) {
        facultyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFacultySubmit(e.target);
        });
    }

    // Course form
    const courseForm = document.querySelector('#courseModal .modal-form');
    if (courseForm) {
        courseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleCourseSubmit(e.target);
        });
    }

    // Attendance form
    const attendanceForm = document.querySelector('#attendanceModal .modal-form');
    if (attendanceForm) {
        attendanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAttendanceSubmit(e.target);
        });
    }

    // Attendance button toggles
    initializeAttendanceButtons();
}

function initializeAttendanceButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-present') || e.target.classList.contains('btn-absent')) {
            const parent = e.target.closest('.attendance-item');
            if (parent) {
                const presentBtn = parent.querySelector('.btn-present');
                const absentBtn = parent.querySelector('.btn-absent');
                
                // Remove active from both
                presentBtn.classList.remove('active');
                absentBtn.classList.remove('active');
                
                // Add active to clicked button
                e.target.classList.add('active');
            }
        }
    });
}

function handleStudentSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Generate student ID
    const studentId = 'STU' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    
    // Get initials
    const firstName = form.querySelector('input[type="text"]').value;
    const lastName = form.querySelectorAll('input[type="text"]')[1].value;
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    
    const email = form.querySelector('input[type="email"]').value;
    const department = form.querySelectorAll('select')[0].value;
    const year = form.querySelectorAll('select')[1].value;
    
    // Add to table
    const tbody = document.getElementById('studentsTableBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${studentId}</td>
        <td>
            <div class="user-cell">
                <div class="user-avatar">${initials}</div>
                <span>${firstName} ${lastName}</span>
            </div>
        </td>
        <td>${email}</td>
        <td>${department}</td>
        <td>${year}</td>
        <td><span class="badge badge-active">Active</span></td>
        <td>
            <button class="btn-icon" title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </button>
            <button class="btn-icon" title="Delete" onclick="deleteRow(this)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </td>
    `;
    
    tbody.insertBefore(newRow, tbody.firstChild);
    
    // Update stats
    updateStudentStats(1);
    
    // Show success notification
    showNotification('Student added successfully!', 'success');
    
    // Close modal and reset form
    closeModal('studentModal');
    form.reset();
}

function handleFacultySubmit(form) {
    const firstName = form.querySelector('input[type="text"]').value;
    const lastName = form.querySelectorAll('input[type="text"]')[1].value;
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    const email = form.querySelector('input[type="email"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const department = form.querySelectorAll('select')[0].value;
    const role = form.querySelectorAll('select')[1].value;
    
    // Create new faculty card
    const cardsGrid = document.querySelector('#faculty .cards-grid');
    const newCard = document.createElement('div');
    newCard.className = 'faculty-card';
    newCard.style.animation = 'fadeIn 0.3s ease-in';
    newCard.innerHTML = `
        <div class="faculty-avatar large">${initials}</div>
        <h3>${firstName} ${lastName}</h3>
        <p class="faculty-role">${role}</p>
        <p class="faculty-dept">${department}</p>
        <div class="faculty-info">
            <div class="info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>${email}</span>
            </div>
            <div class="info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>${phone}</span>
            </div>
        </div>
        <div class="faculty-stats">
            <div class="stat-item">
                <strong>0</strong>
                <span>Courses</span>
            </div>
            <div class="stat-item">
                <strong>0</strong>
                <span>Students</span>
            </div>
        </div>
    `;
    
    cardsGrid.insertBefore(newCard, cardsGrid.firstChild);
    
    // Update stats
    updateFacultyStats(1);
    
    showNotification('Faculty member added successfully!', 'success');
    closeModal('facultyModal');
    form.reset();
}

function handleCourseSubmit(form) {
    const courseCode = form.querySelector('input[type="text"]').value;
    const courseName = form.querySelectorAll('input[type="text"]')[1].value;
    const description = form.querySelector('textarea').value;
    const department = form.querySelector('select').value;
    const faculty = form.querySelectorAll('select')[1].value;
    const schedule = form.querySelectorAll('input[type="text"]')[2].value;
    
    // Create new course card
    const cardsGrid = document.querySelector('#courses .cards-grid');
    const newCard = document.createElement('div');
    newCard.className = 'course-card';
    newCard.style.animation = 'fadeIn 0.3s ease-in';
    newCard.innerHTML = `
        <div class="course-header">
            <span class="course-code">${courseCode}</span>
            <span class="badge badge-active">Active</span>
        </div>
        <h3>${courseName}</h3>
        <p class="course-description">${description}</p>
        <div class="course-meta">
            <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>${faculty}</span>
            </div>
            <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>0 Students</span>
            </div>
        </div>
        <div class="course-schedule">
            <span>${schedule}</span>
        </div>
    `;
    
    cardsGrid.insertBefore(newCard, cardsGrid.firstChild);
    
    // Update stats
    updateCourseStats(1);
    
    showNotification('Course added successfully!', 'success');
    closeModal('courseModal');
    form.reset();
}

function handleAttendanceSubmit(form) {
    showNotification('Attendance marked successfully!', 'success');
    closeModal('attendanceModal');
    form.reset();
}

function deleteRow(button) {
    if (confirm('Are you sure you want to delete this entry?')) {
        const row = button.closest('tr');
        row.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            row.remove();
            updateStudentStats(-1);
            showNotification('Entry deleted successfully!', 'success');
        }, 300);
    }
}

// Update statistics
function updateStudentStats(change) {
    const statNumber = document.querySelector('.stat-card .stat-number');
    if (statNumber) {
        const currentValue = parseInt(statNumber.textContent.replace(',', ''));
        const newValue = currentValue + change;
        statNumber.textContent = newValue.toLocaleString();
    }
}

function updateFacultyStats(change) {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[1]) {
        const statNumber = statCards[1].querySelector('.stat-number');
        const currentValue = parseInt(statNumber.textContent);
        const newValue = currentValue + change;
        statNumber.textContent = newValue;
    }
}

function updateCourseStats(change) {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[2]) {
        const statNumber = statCards[2].querySelector('.stat-number');
        const currentValue = parseInt(statNumber.textContent);
        const newValue = currentValue + change;
        statNumber.textContent = newValue;
    }
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#9333ea' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(147, 51, 234, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Chart initialization (placeholder)
function initializeChart() {
    const canvas = document.getElementById('enrollmentChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Simple bar chart simulation
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Draw placeholder
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Chart visualization would appear here', canvas.width / 2, canvas.height / 2);
        ctx.fillText('(Requires Chart.js library for full implementation)', canvas.width / 2, canvas.height / 2 + 20);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.openModal = openModal;
window.closeModal = closeModal;
window.deleteRow = deleteRow;