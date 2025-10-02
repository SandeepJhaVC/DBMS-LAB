// landing.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Tool file paths
    const toolPaths = {
        q1: '/Users/divyansh/Desktop/CSE/Sem 3/DBMS/DBMS-LAB/Assignment 1/Q1/Q1.html',
        q3: '/Users/divyansh/Desktop/CSE/Sem 3/DBMS/DBMS-LAB/Assignment 1/Q3/Q3.html',
        q5: '/Users/divyansh/Desktop/CSE/Sem 3/DBMS/DBMS-LAB/Assignment 1/Q5/Q5.html',
        q7: '/Users/divyansh/Desktop/CSE/Sem 3/DBMS/DBMS-LAB/Assignment 1/Q7/Q7.html'
    };
    
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeHelp = document.querySelector('.close-help');
    const toolCards = document.querySelectorAll('.tool-card');
    const toolLaunchBtns = document.querySelectorAll('.tool-launch-btn');
    const customCursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Custom Cursor
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    // Interactive elements cursor effect
    const interactiveElements = document.querySelectorAll('button, .tool-card, .member-card, .theme-toggle, .help-btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            customCursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(2)';
        });
        
        element.addEventListener('mouseleave', () => {
            customCursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
    
    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        showNotification(`Switched to ${newTheme === 'dark' ? 'Cosmic Mode' : 'Light Mode'}`, 'info');
    });
    
    // Help Modal
    helpBtn.addEventListener('click', () => {
        helpModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeHelp.addEventListener('click', () => {
        helpModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Tool Cards Interaction
    toolCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('tool-launch-btn')) {
                const tool = card.getAttribute('data-tool');
                launchTool(tool);
            }
        });
    });
    
    toolLaunchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tool = btn.getAttribute('data-tool');
            launchTool(tool);
        });
    });
    
    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl + T to toggle theme
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            themeToggle.click();
        }
        
        // Ctrl + ? to open help
        if (e.ctrlKey && e.key === '?') {
            e.preventDefault();
            helpBtn.click();
        }
        
        // Ctrl + 1-4 to launch tools
        if (e.ctrlKey && e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            const tools = ['q1', 'q3', 'q5', 'q7'];
            const toolIndex = parseInt(e.key) - 1;
            if (tools[toolIndex]) {
                launchTool(tools[toolIndex]);
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            helpModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Scroll Animation
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
    
    // Observe elements for scroll animation
    document.querySelectorAll('.tool-card, .member-card, .hero-content, .group-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Function to set theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle button text
        const themeText = themeToggle.querySelector('.theme-text');
        const themeIcon = themeToggle.querySelector('.theme-icon');
        
        if (theme === 'dark') {
            themeText.textContent = 'Cosmic Mode';
            themeIcon.textContent = '🌙';
        } else {
            themeText.textContent = 'Light Mode';
            themeIcon.textContent = '☀️';
        }
    }
    
    // Function to launch tools
    function launchTool(tool) {
        const toolNames = {
            q1: 'DBMS Architecture Visualizer',
            q3: 'ER/EER Diagram Builder Pro',
            q5: 'Relational Algebra Visualizer',
            q7: 'Transaction Management Simulator'
        };
        
        showNotification(`Launching ${toolNames[tool]}...`, 'info');
        
        // Check if the file exists and open it
        if (toolPaths[tool]) {
            // For local file system, we need to use file:// protocol
            const filePath = toolPaths[tool];
            
            // Create a link element to test if file exists
            const link = document.createElement('a');
            link.href = 'file://' + filePath;
            link.target = '_blank';
            
            // Try to open the file
            try {
                link.click();
                showNotification(`${toolNames[tool]} launched successfully!`, 'success');
            } catch (error) {
                console.error('Error opening tool:', error);
                showNotification(`Could not open ${toolNames[tool]}. File may not exist at the specified path.`, 'error');
            }
        } else {
            showNotification(`Tool path not configured for ${toolNames[tool]}`, 'error');
        }
        
        // Highlight the selected tool
        highlightTool(tool);
    }
    
    // Function to highlight selected tool
    function highlightTool(tool) {
        toolCards.forEach(card => {
            card.style.transform = 'scale(0.95)';
            card.style.opacity = '0.7';
        });
        
        const selectedCard = document.querySelector(`[data-tool="${tool}"]`);
        selectedCard.style.transform = 'scale(1.05)';
        selectedCard.style.opacity = '1';
        selectedCard.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.5)';
        
        setTimeout(() => {
            toolCards.forEach(card => {
                card.style.transform = '';
                card.style.opacity = '';
                card.style.boxShadow = '';
            });
        }, 2000);
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Add some dynamic effects to the hero section
    const heroContent = document.querySelector('.hero-content');
    
    heroContent.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = heroContent.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        heroContent.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
    });
    
    heroContent.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    });
    
    // Initialize with a welcome message
    setTimeout(() => {
        showNotification('Welcome to DBMS Learning Suite!', 'success');
    }, 1000);
    
    // Add some particles to the background on click
    document.addEventListener('click', (e) => {
        createParticle(e.clientX, e.clientY);
    });
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    // Add CSS for particles
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: particleFloat 1s ease-out forwards;
        }
        
        @keyframes particleFloat {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});