// === Global Variables ===
let currentTheme = localStorage.getItem('theme') || 'dark';
let totalInstances = 3;
let activeLayer = 'conceptual';

// === DOM Content Loaded ===
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeCursor();
    initializeEventListeners();
    initializeAnimations();
    showLayer('conceptual');
    
    // Update instance count
    updateInstanceCount();
});

// === Theme Management ===
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggle();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeToggle();
    
    // Add theme transition effect
    document.documentElement.style.transition = 'all 0.5s ease';
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 500);
}

function updateThemeToggle() {
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');
    
    if (currentTheme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Cosmic Mode';
    }
}

// === Custom Cursor ===
function initializeCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    // Interactive elements cursor effects
    const interactiveElements = document.querySelectorAll('button, .layer-card, .advantage-card, input, .flip-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            follower.style.transform = 'scale(1.5)';
            follower.style.borderColor = 'var(--primary-glow)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
            follower.style.borderColor = 'var(--primary-glow)';
        });
    });
}

// === Event Listeners ===
function initializeEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportData);
    
    // Student form
    document.getElementById('studentForm').addEventListener('submit', handleStudentSubmit);
    
    // Input validation
    initializeInputValidation();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Scroll animations
    initializeScrollAnimations();
}

// === Three-Schema Architecture ===
function showLayer(layer) {
    activeLayer = layer;
    const visualizationContent = document.getElementById('visualizationContent');
    const activeLayerTitle = document.getElementById('activeLayerTitle');
    const activeLayerCount = document.getElementById('activeLayerCount');
    
    // Update active layer title
    activeLayerTitle.textContent = getLayerTitle(layer);
    activeLayerCount.textContent = '1';
    
    // Remove active class from all layers
    document.querySelectorAll('.layer-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to current layer
    document.querySelector(`.${layer}-layer .layer-card`).classList.add('active');
    
    // Update visualization content with fade transition
    visualizationContent.style.opacity = '0';
    
    setTimeout(() => {
        visualizationContent.innerHTML = getLayerContent(layer);
        visualizationContent.style.opacity = '1';
        
        // Re-initialize animations for new content
        initializeContentAnimations();
    }, 300);
}

function getLayerTitle(layer) {
    const titles = {
        external: 'External Schema - User Views',
        conceptual: 'Conceptual Schema - Logical Structure', 
        internal: 'Internal Schema - Physical Storage'
    };
    return titles[layer] || 'Database Architecture';
}

function getLayerContent(layer) {
    const content = {
        external: `
            <div class="layer-detail-content">
                <h4>🔍 External Schema - User Views</h4>
                <p class="layer-description">Multiple user-specific perspectives of the database, hiding irrelevant data and providing customized access.</p>
                
                <div class="view-mapping">
                    <h5>View to Conceptual Mapping:</h5>
                    <div class="mapping-grid">
                        <div class="mapping-item">
                            <strong>Student View</strong>
                            <span>→ Student + Enrollment entities</span>
                        </div>
                        <div class="mapping-item">
                            <strong>Faculty View</strong>
                            <span>→ Course + Faculty entities</span>
                        </div>
                        <div class="mapping-item">
                            <strong>Admin View</strong>
                            <span>→ All conceptual entities</span>
                        </div>
                    </div>
                </div>
                
                <div class="view-examples">
                    <div class="view-example">
                        <h6>👨‍🎓 Student View</h6>
                        <ul>
                            <li>Personal information</li>
                            <li>Course enrollments</li>
                            <li>Grades and schedule</li>
                            <li>Tuition status</li>
                        </ul>
                    </div>
                    <div class="view-example">
                        <h6>👨‍🏫 Faculty View</h6>
                        <ul>
                            <li>Course assignments</li>
                            <li>Student rosters</li>
                            <li>Grade submission</li>
                            <li>Teaching schedule</li>
                        </ul>
                    </div>
                    <div class="view-example">
                        <h6>👨‍💼 Admin View</h6>
                        <ul>
                            <li>Complete database access</li>
                            <li>User management</li>
                            <li>System reports</li>
                            <li>Maintenance operations</li>
                        </ul>
                    </div>
                </div>
                
                <div class="layer-benefits">
                    <strong>Key Benefits:</strong>
                    <ul>
                        <li>Data Security - Users see only authorized data</li>
                        <li>Customization - Tailored views for different needs</li>
                        <li>Simplicity - Hides database complexity from users</li>
                    </ul>
                </div>
            </div>
        `,
        
        conceptual: `
            <div class="layer-detail-content">
                <h4>🏗️ Conceptual Schema - Logical Structure</h4>
                <p class="layer-description">The complete logical structure of the entire database, defining entities, relationships, constraints, and business rules.</p>
                
                <div class="entity-relationships">
                    <h5>Core Entities & Relationships:</h5>
                    <div class="er-diagram-preview">
                        <div class="entity">Student</div>
                        <div class="relationship">enrolls_in</div>
                        <div class="entity">Course</div>
                    </div>
                    
                    <div class="entity-details">
                        <div class="entity-spec">
                            <strong>Student Entity</strong>
                            <ul>
                                <li>StudentID (PK): INT</li>
                                <li>Name: VARCHAR(50)</li>
                                <li>Email: VARCHAR(100)</li>
                                <li>Major: VARCHAR(50)</li>
                                <li>EnrollmentDate: DATE</li>
                            </ul>
                        </div>
                        <div class="entity-spec">
                            <strong>Course Entity</strong>
                            <ul>
                                <li>CourseID (PK): INT</li>
                                <li>Title: VARCHAR(100)</li>
                                <li>Credits: INT</li>
                                <li>Department: VARCHAR(50)</li>
                                <li>Instructor: VARCHAR(50)</li>
                            </ul>
                        </div>
                        <div class="entity-spec">
                            <strong>Enrollment Relationship</strong>
                            <ul>
                                <li>StudentID (FK): INT</li>
                                <li>CourseID (FK): INT</li>
                                <li>Grade: CHAR(2)</li>
                                <li>Semester: VARCHAR(20)</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="constraints-section">
                    <h5>Integrity Constraints:</h5>
                    <div class="constraints-grid">
                        <div class="constraint">
                            <span class="constraint-icon">🔑</span>
                            <span>Primary Key constraints</span>
                        </div>
                        <div class="constraint">
                            <span class="constraint-icon">🔗</span>
                            <span>Foreign Key relationships</span>
                        </div>
                        <div class="constraint">
                            <span class="constraint-icon">✅</span>
                            <span>Check constraints (Grade: A-F)</span>
                        </div>
                        <div class="constraint">
                            <span class="constraint-icon">🚫</span>
                            <span>Not Null constraints</span>
                        </div>
                        <div class="constraint">
                            <span class="constraint-icon">🔄</span>
                            <span>Referential integrity</span>
                        </div>
                        <div class="constraint">
                            <span class="constraint-icon">⭐</span>
                            <span>Unique constraints</span>
                        </div>
                    </div>
                </div>
                
                <div class="layer-benefits">
                    <strong>Key Benefits:</strong>
                    <ul>
                        <li>Data Independence - Separates logical and physical levels</li>
                        <li>Consistency - Unified view across organization</li>
                        <li>Maintainability - Centralized structure management</li>
                    </ul>
                </div>
            </div>
        `,
        
        internal: `
            <div class="layer-detail-content">
                <h4>💾 Internal Schema - Physical Storage</h4>
                <p class="layer-description">Physical implementation details describing how data is stored, indexed, and accessed in the database system.</p>
                
                <div class="storage-details">
                    <h5>Storage Organization:</h5>
                    <div class="storage-features">
                        <div class="storage-feature">
                            <strong>File Organization</strong>
                            <ul>
                                <li>B+ Tree indexing</li>
                                <li>8KB data pages</li>
                                <li>Clustered tables</li>
                                <li>Extent-based allocation</li>
                            </ul>
                        </div>
                        <div class="storage-feature">
                            <strong>Indexing Strategy</strong>
                            <ul>
                                <li>Primary indexes on all PKs</li>
                                <li>Secondary indexes on frequent queries</li>
                                <li>Composite indexes</li>
                                <li>Bitmap indexes for low-cardinality</li>
                            </ul>
                        </div>
                        <div class="storage-feature">
                            <strong>Performance Optimization</strong>
                            <ul>
                                <li>Query optimization</li>
                                <li>Buffer pool management</li>
                                <li>Query execution plans</li>
                                <li>Statistics-based optimization</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="access-methods">
                    <h5>Access Methods & Paths:</h5>
                    <div class="access-grid">
                        <div class="access-method">
                            <span class="method-icon">🔍</span>
                            <div>
                                <strong>Index Scan</strong>
                                <span>For targeted queries</span>
                            </div>
                        </div>
                        <div class="access-method">
                            <span class="method-icon">📊</span>
                            <div>
                                <strong>Sequential Scan</strong>
                                <span>Full table operations</span>
                            </div>
                        </div>
                        <div class="access-method">
                            <span class="method-icon">⚡</span>
                            <div>
                                <strong>Hash Join</strong>
                                <span>Equality conditions</span>
                            </div>
                        </div>
                        <div class="access-method">
                            <span class="method-icon">🔄</span>
                            <div>
                                <strong>Sort-Merge Join</strong>
                                <span>Range queries</span>
                            </div>
                        </div>
                        <div class="access-method">
                            <span class="method-icon">🎯</span>
                            <div>
                                <strong>Nested Loop</strong>
                                <span>Small datasets</span>
                            </div>
                        </div>
                        <div class="access-method">
                            <span class="method-icon">💡</span>
                            <div>
                                <strong>Bitmap Index</strong>
                                <span>Multiple conditions</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="layer-benefits">
                    <strong>Key Benefits:</strong>
                    <ul>
                        <li>Performance - Optimized storage and access</li>
                        <li>Efficiency - Reduced storage requirements</li>
                        <li>Scalability - Handles large datasets effectively</li>
                    </ul>
                </div>
            </div>
        `
    };
    
    return content[layer] || '<p>Select a layer to view details</p>';
}

// === Schema vs Instance Functionality ===
function handleStudentSubmit(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;
    const studentAge = document.getElementById('studentAge').value;
    const studentEmail = document.getElementById('studentEmail').value;
    
    // Enhanced validation
    const validationErrors = validateStudentData(studentId, studentName, studentAge, studentEmail);
    
    if (validationErrors.length > 0) {
        showNotification(validationErrors.join('<br>'), 'error');
        return;
    }
    
    // Add new instance
    addStudentInstance(studentId, studentName, studentAge, studentEmail);
    
    // Clear form
    document.getElementById('studentForm').reset();
    
    // Show success
    showNotification('Student instance created successfully!', 'success');
}

function validateStudentData(id, name, age, email) {
    const errors = [];
    
    // ID validation
    if (id < 100 || id > 99999) {
        errors.push('Student ID must be between 100 and 99999');
    }
    
    // Name validation
    if (!/^[A-Za-z\s]{2,50}$/.test(name)) {
        errors.push('Name must be 2-50 letters and spaces only');
    }
    
    // Age validation
    if (age < 16 || age > 100) {
        errors.push('Age must be between 16 and 100');
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Check for duplicate ID
    const existingIds = Array.from(document.querySelectorAll('#instanceTable td:first-child'))
        .map(td => td.textContent);
    if (existingIds.includes(id)) {
        errors.push('Student ID must be unique');
    }
    
    return errors;
}

function addStudentInstance(id, name, age, email) {
    const instanceTable = document.getElementById('instanceTable');
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${age}</td>
        <td>${email}</td>
    `;
    
    // Add animation
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(-20px)';
    instanceTable.appendChild(newRow);
    
    // Animate in
    setTimeout(() => {
        newRow.style.transition = 'all 0.5s ease';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
    }, 10);
    
    // Highlight effect
    newRow.style.backgroundColor = 'rgba(6, 214, 160, 0.2)';
    setTimeout(() => {
        newRow.style.backgroundColor = '';
    }, 2000);
    
    // Update counters
    totalInstances++;
    updateInstanceCount();
}

function updateInstanceCount() {
    document.getElementById('totalInstances').textContent = totalInstances;
}

// === DBMS Advantages ===
function toggleAdvantage(advantageId) {
    const advantage = document.getElementById(advantageId);
    const isActive = advantage.classList.contains('active');
    
    // Close all advantages first
    document.querySelectorAll('.advantage-details').forEach(detail => {
        detail.classList.remove('active');
    });
    
    // Toggle clicked advantage
    if (!isActive) {
        advantage.classList.add('active');
        
        // Scroll to advantage
        const advantageCard = advantage.closest('.advantage-card');
        advantageCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest'
        });
    }
}

// === Input Validation ===
function initializeInputValidation() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleInput(this);
        });
        
        input.addEventListener('input', function() {
            clearInputError(this);
        });
    });
}

function validateSingleInput(input) {
    const value = input.value.trim();
    
    if (input.hasAttribute('required') && !value) {
        showInputError(input, 'This field is required');
        return false;
    }
    
    // Specific validations based on input type
    switch(input.id) {
        case 'studentId':
            if (value && (value < 100 || value > 99999)) {
                showInputError(input, 'ID must be 100-99999');
                return false;
            }
            break;
        case 'studentAge':
            if (value && (value < 16 || value > 100)) {
                showInputError(input, 'Age must be 16-100');
                return false;
            }
            break;
        case 'studentEmail':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showInputError(input, 'Invalid email format');
                return false;
            }
            break;
    }
    
    clearInputError(input);
    return true;
}

function showInputError(input, message) {
    clearInputError(input);
    
    input.style.borderColor = 'var(--danger)';
    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--danger);
        font-size: 0.8rem;
        margin-top: 0.5rem;
    `;
    
    input.parentNode.appendChild(errorDiv);
}

function clearInputError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    
    const existingError = input.parentNode.querySelector('.input-error');
    if (existingError) {
        existingError.remove();
    }
}

// === Notification System ===
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        float: right;
        cursor: pointer;
        font-weight: bold;
        margin-left: 1rem;
    `;
    closeBtn.onclick = () => removeNotification(notification);
    notification.appendChild(closeBtn);
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// === Export Functionality ===
function exportData() {
    const data = {
        exportDate: new Date().toISOString(),
        theme: currentTheme,
        activeLayer: activeLayer,
        totalInstances: totalInstances,
        instances: Array.from(document.querySelectorAll('#instanceTable tr')).map(row => ({
            id: row.cells[0].textContent,
            name: row.cells[1].textContent,
            age: row.cells[2].textContent,
            email: row.cells[3].textContent
        }))
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "neodbms_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    showNotification('Data exported successfully!', 'success');
}

// === Keyboard Shortcuts ===
function handleKeyboardShortcuts(e) {
    // Theme toggle: Ctrl/Cmd + T
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Export: Ctrl/Cmd + E
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
    
    // Layer navigation: Ctrl/Cmd + 1/2/3
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '3') {
        e.preventDefault();
        const layers = ['external', 'conceptual', 'internal'];
        showLayer(layers[parseInt(e.key) - 1]);
    }
    
    // Help: Ctrl/Cmd + ?
    if ((e.ctrlKey || e.metaKey) && e.key === '?') {
        e.preventDefault();
        showKeyboardShortcutsHelp();
    }
}

function showKeyboardShortcutsHelp() {
    const shortcuts = `
        <strong>Keyboard Shortcuts:</strong><br>
        • Ctrl+T - Toggle theme<br>
        • Ctrl+E - Export data<br>
        • Ctrl+1 - External Schema<br>
        • Ctrl+2 - Conceptual Schema<br>
        • Ctrl+3 - Internal Schema<br>
        • Ctrl+? - Show this help
    `;
    showNotification(shortcuts, 'info');
}

// === Animations ===
function initializeAnimations() {
    // Initialize GSAP or other animation libraries if needed
    initializeScrollAnimations();
    initializeContentAnimations();
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe animated elements
    document.querySelectorAll('.section, .advantage-card, .layer-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function initializeContentAnimations() {
    // Add animations to dynamically loaded content
    const animatedElements = document.querySelectorAll('.view-example, .entity-spec, .constraint, .storage-feature');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// === Performance Optimization ===
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate any layout-dependent elements
        initializeScrollAnimations();
    }, 250);
});

// === CSS for dynamic content ===
const dynamicStyles = `
    .layer-detail-content {
        animation: fadeInUp 0.5s ease;
    }
    
    .view-examples {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .view-example {
        padding: 1rem;
        background: var(--bg-glass);
        border-radius: 10px;
        border-left: 4px solid var(--primary);
    }
    
    .entity-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .entity-spec {
        padding: 1rem;
        background: var(--bg-glass);
        border-radius: 10px;
        border: 1px solid var(--border-light);
    }
    
    .constraints-grid, .access-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .constraint, .access-method {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        background: var(--bg-glass);
        border-radius: 8px;
    }
    
    .layer-benefits {
        margin-top: 2rem;
        padding: 1rem;
        background: rgba(6, 214, 160, 0.1);
        border-radius: 10px;
        border-left: 4px solid var(--secondary);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);