// Global state
let currentState = null;
let currentTransaction = null;
let transactionHistory = [];
let currentUser = 'alice';
let userPrivileges = {
    admin: { accounts: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], transactions: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'] },
    alice: { accounts: ['SELECT', 'UPDATE'], transactions: ['SELECT'] },
    bob: { accounts: ['SELECT'], transactions: [] }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateDateTime();
});

function initializeApp() {
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize theme
    initTheme();
    
    // Set initial active section
    showSection('states');
    
    // Initialize transaction state
    resetTransactionState();
}

function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    // Cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('button, .nav-item, .user-card, .acid-card, .state, .privilege-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            follower.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
        });
    });
}

function initTheme() {
    const themeSwitch = document.getElementById('checkbox');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (prefersDark) {
        document.body.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    } else {
        document.body.setAttribute('data-theme', 'light');
        themeSwitch.checked = false;
    }
    
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
        }
    });
}

function setupEventListeners() {
    // Help Modal
    const helpButton = document.getElementById('helpButton');
    const modal = document.getElementById('helpModal');
    const closeButton = document.querySelector('.close');

    helpButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            showSection(tab);
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Transaction State Controls
    document.getElementById('beginTransaction').addEventListener('click', beginTransaction);
    document.getElementById('commitTransaction').addEventListener('click', commitTransaction);
    document.getElementById('rollbackTransaction').addEventListener('click', rollbackTransaction);
    document.getElementById('simulateFailure').addEventListener('click', simulateFailure);
    
    // ACID Property Demos
    document.querySelectorAll('.btn-demo').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.acid-card');
            const demoContent = card.querySelector('.demo-content');
            const isActive = demoContent.classList.contains('active');
            
            // Close all other demos
            document.querySelectorAll('.demo-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.querySelectorAll('.btn-demo').forEach(btn => {
                btn.textContent = 'Show Demo';
            });
            
            // Toggle current demo
            if (!isActive) {
                demoContent.classList.add('active');
                this.textContent = 'Hide Demo';
            } else {
                demoContent.classList.remove('active');
                this.textContent = 'Show Demo';
            }
        });
    });
    
    // Bank Transfer Demo
    document.querySelectorAll('.btn-transfer').forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = parseInt(this.getAttribute('data-amount'));
            simulateBankTransfer(amount);
        });
    });
    
    document.querySelector('.btn-transfer-fail').addEventListener('click', simulateTransferFailure);
    
    // Constraint Demo
    document.querySelectorAll('.btn-withdraw').forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = parseInt(this.getAttribute('data-amount'));
            simulateWithdrawal(amount);
        });
    });
    
    // Isolation Demo
    document.querySelector('.btn-isolation').addEventListener('click', simulateIsolation);
    
    // Durability Demo
    document.querySelector('.btn-crash').addEventListener('click', simulateCrash);
    document.querySelector('.btn-recover').addEventListener('click', simulateRecovery);
    
    // Dirty Read Transactions
    document.querySelectorAll('.tx-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tx = this.getAttribute('data-tx');
            const op = this.getAttribute('data-op');
            handleTransactionOperation(tx, op);
        });
    });
    
    // User Management
    document.querySelectorAll('.user-card').forEach(card => {
        card.addEventListener('click', function() {
            const user = this.getAttribute('data-user');
            selectUser(user);
        });
    });
    
    // Privilege Management
    document.querySelectorAll('.privilege-item input').forEach(checkbox => {
        checkbox.addEventListener('change', updateSQLCommand);
    });
    
    // Command Buttons
    document.querySelectorAll('.btn-grant, .btn-revoke, .btn-execute').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handlePrivilegeAction(action);
        });
    });
    
    // Access Test
    document.querySelector('.btn-test').addEventListener('click', testAccess);
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
}

// Transaction State Management
function beginTransaction() {
    currentTransaction = {
        id: 'TX_' + Date.now(),
        state: 'active',
        startTime: new Date()
    };
    
    updateTransactionState('active');
    addLogEntry('Transaction started: ' + currentTransaction.id);
    
    // Enable/disable buttons
    document.getElementById('beginTransaction').disabled = true;
    document.getElementById('commitTransaction').disabled = false;
    document.getElementById('rollbackTransaction').disabled = false;
    document.getElementById('simulateFailure').disabled = false;
}

function commitTransaction() {
    if (!currentTransaction) return;
    
    updateTransactionState('partially-committed');
    addLogEntry('All operations done - Moving to partially committed state');
    
    setTimeout(() => {
        updateTransactionState('committed');
        addLogEntry('Transaction committed successfully - Changes saved');
        resetTransactionControls();
    }, 1000);
}

function rollbackTransaction() {
    if (!currentTransaction) return;
    
    updateTransactionState('failed');
    addLogEntry('Transaction failed - Starting rollback');
    
    setTimeout(() => {
        updateTransactionState('aborted');
        addLogEntry('Transaction rolled back - No changes saved');
        resetTransactionControls();
    }, 1000);
}

function simulateFailure() {
    if (!currentTransaction) return;
    
    updateTransactionState('failed');
    addLogEntry('💥 System crash detected!');
    
    setTimeout(() => {
        updateTransactionState('aborted');
        addLogEntry('Automatic rollback completed after crash');
        resetTransactionControls();
    }, 1500);
}

function updateTransactionState(state) {
    // Update visual state
    document.querySelectorAll('.state').forEach(stateEl => {
        stateEl.classList.remove('active-state');
    });
    
    const targetState = document.querySelector(`[data-state="${state}"]`);
    if (targetState) {
        targetState.classList.add('active-state');
    }
    
    // Update current state
    currentState = state;
    if (currentTransaction) {
        currentTransaction.state = state;
    }
}

function resetTransactionState() {
    currentTransaction = null;
    currentState = null;
    
    document.querySelectorAll('.state').forEach(stateEl => {
        stateEl.classList.remove('active-state');
    });
    
    // Set initial state to active
    document.querySelector('[data-state="active"]').classList.add('active-state');
}

function resetTransactionControls() {
    document.getElementById('beginTransaction').disabled = false;
    document.getElementById('commitTransaction').disabled = true;
    document.getElementById('rollbackTransaction').disabled = true;
    document.getElementById('simulateFailure').disabled = true;
    
    setTimeout(() => {
        resetTransactionState();
    }, 2000);
}

function addLogEntry(message) {
    const logEntries = document.getElementById('logEntries');
    const timestamp = new Date().toLocaleTimeString();
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <span class="timestamp">${timestamp}</span>
        <span class="message">${message}</span>
    `;
    
    logEntries.appendChild(logEntry);
    logEntries.scrollTop = logEntries.scrollHeight;
}

// ACID Demos
function simulateBankTransfer(amount) {
    const accountA = document.querySelector('#accountA .balance');
    const accountB = document.querySelector('#accountB .balance');
    
    const balanceA = parseInt(accountA.textContent.replace('₹', '').replace(',', ''));
    const balanceB = parseInt(accountB.textContent.replace('₹', '').replace(',', ''));
    
    if (balanceA >= amount) {
        // Atomic operation - both updates happen or none
        accountA.textContent = '₹' + (balanceA - amount).toLocaleString();
        accountB.textContent = '₹' + (balanceB + amount).toLocaleString();
        
        addLogEntry(`✅ Atomic transfer: ₹${amount.toLocaleString()} from Account A to Account B`);
    } else {
        addLogEntry('❌ Transfer failed: Not enough money in Account A');
    }
}

function simulateTransferFailure() {
    addLogEntry('💥 Simulating system crash during transfer...');
    
    setTimeout(() => {
        addLogEntry('✅ Atomicity maintained: No partial updates - both accounts unchanged');
        // Reset to original state (simulating rollback)
        document.querySelector('#accountA .balance').textContent = '₹10,000';
        document.querySelector('#accountB .balance').textContent = '₹5,000';
    }, 1000);
}

function simulateWithdrawal(amount) {
    const balanceDisplay = document.querySelector('.balance-display');
    let balance = parseInt(balanceDisplay.textContent.replace('₹', '').replace(',', ''));
    
    if (balance - amount >= 0) {
        balance -= amount;
        balanceDisplay.textContent = '₹' + balance.toLocaleString();
        addLogEntry(`✅ Withdrawal successful: ₹${amount.toLocaleString()}. New balance: ₹${balance.toLocaleString()}`);
    } else {
        addLogEntry(`❌ Withdrawal failed: Cannot have negative balance. You tried to withdraw ₹${amount.toLocaleString()} but only have ₹${balance.toLocaleString()}`);
    }
}

function simulateIsolation() {
    const tx1Status = document.querySelector('#tx1 .tx-status');
    const tx2Status = document.querySelector('#tx2 .tx-status');
    
    tx1Status.textContent = 'Reading: Balance = ₹10,000';
    tx2Status.textContent = 'Reading: Balance = ₹10,000';
    
    addLogEntry('✅ Isolation: Both transactions read consistent data without interfering');
}

function simulateCrash() {
    const statusIndicator = document.querySelector('.status-indicator');
    statusIndicator.style.background = '#ef4444';
    addLogEntry('💥 System crashed!');
}

function simulateRecovery() {
    const statusIndicator = document.querySelector('.status-indicator');
    statusIndicator.style.background = '#10b981';
    addLogEntry('✅ Durability: Data recovered from transaction log after crash');
}

// Dirty Read Simulation
function handleTransactionOperation(txId, operation) {
    const txLog = document.getElementById(`txLog${txId}`);
    const sharedBalance = document.getElementById('sharedBalance');
    const dataStatus = document.getElementById('dataStatus');
    
    // Reset steps
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    
    switch(operation) {
        case 'begin':
            addTransactionLog(txLog, `Transaction ${txId} started`);
            break;
            
        case 'update':
            if (txId === '1') {
                sharedBalance.textContent = '₹500';
                dataStatus.textContent = 'Uncommitted';
                dataStatus.style.color = '#f59e0b';
                addTransactionLog(txLog, 'Updated balance to ₹500 (NOT SAVED YET)');
                
                // Activate step 1
                document.querySelector('[data-step="1"]').classList.add('active');
            }
            break;
            
        case 'read':
            if (txId === '2') {
                const balance = sharedBalance.textContent;
                addTransactionLog(txLog, `Read balance: ${balance} (DIRTY READ - wrong data!)`);
                
                // Activate step 2
                document.querySelector('[data-step="2"]').classList.add('active');
            }
            break;
            
        case 'rollback':
            if (txId === '1') {
                sharedBalance.textContent = '₹1,000';
                dataStatus.textContent = 'Committed';
                dataStatus.style.color = '#10b981';
                addTransactionLog(txLog, 'Rollback - balance restored to ₹1,000');
                
                // Activate step 3
                document.querySelector('[data-step="3"]').classList.add('active');
                
                // Show the consequence
                setTimeout(() => {
                    const tx2Log = document.getElementById('txLog2');
                    addTransactionLog(tx2Log, '❌ ERROR: Working with wrong ₹500 data!');
                    document.querySelector('[data-step="4"]').classList.add('active');
                }, 500);
            }
            break;
            
        case 'commit':
            addTransactionLog(txLog, 'Transaction committed');
            break;
    }
}

function addTransactionLog(logElement, message) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${timestamp}] ${message}`;
    logElement.appendChild(logEntry);
    logElement.scrollTop = logElement.scrollHeight;
}

// Privilege Management
function selectUser(user) {
    currentUser = user;
    
    // Update UI
    document.querySelectorAll('.user-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-user="${user}"]`).classList.add('active');
    
    // Update privilege checkboxes
    updatePrivilegeUI();
    updateSQLCommand();
}

function updatePrivilegeUI() {
    const privileges = userPrivileges[currentUser];
    
    // Update accounts table privileges
    const accountPrivileges = document.querySelectorAll('.table-card .privilege-item input');
    accountPrivileges.forEach(checkbox => {
        const priv = checkbox.getAttribute('data-priv');
        checkbox.checked = privileges.accounts.includes(priv);
    });
}

function updateSQLCommand() {
    const sqlCommand = document.getElementById('sqlCommand');
    const selectedPrivileges = Array.from(document.querySelectorAll('.privilege-item input:checked'))
        .map(checkbox => checkbox.getAttribute('data-priv'));
    
    if (selectedPrivileges.length > 0) {
        sqlCommand.textContent = `GRANT ${selectedPrivileges.join(', ')} ON accounts TO ${currentUser};`;
    } else {
        sqlCommand.textContent = `REVOKE ALL PRIVILEGES ON accounts FROM ${currentUser};`;
    }
}

function handlePrivilegeAction(action) {
    const selectedPrivileges = Array.from(document.querySelectorAll('.privilege-item input:checked'))
        .map(checkbox => checkbox.getAttribute('data-priv'));
    
    switch(action) {
        case 'grant':
            userPrivileges[currentUser].accounts = [...new Set([...userPrivileges[currentUser].accounts, ...selectedPrivileges])];
            addLogEntry(`✅ Granted ${selectedPrivileges.join(', ')} on accounts to ${currentUser}`);
            break;
            
        case 'revoke':
            userPrivileges[currentUser].accounts = userPrivileges[currentUser].accounts.filter(
                priv => !selectedPrivileges.includes(priv)
            );
            addLogEntry(`❌ Revoked ${selectedPrivileges.join(', ')} on accounts from ${currentUser}`);
            break;
            
        case 'execute':
            // Simulate SQL execution
            const sqlCommand = document.getElementById('sqlCommand').textContent;
            addLogEntry(`⚡ Executed: ${sqlCommand}`);
            break;
    }
    
    updatePrivilegeUI();
}

function testAccess() {
    const testResult = document.querySelector('.test-result');
    const successIndicator = testResult.querySelector('.success');
    const errorIndicator = testResult.querySelector('.error');
    
    const hasSelectPrivilege = userPrivileges[currentUser].accounts.includes('SELECT');
    
    // Hide both indicators first
    successIndicator.classList.remove('active');
    errorIndicator.classList.remove('active');
    
    if (hasSelectPrivilege) {
        successIndicator.classList.add('active');
        addLogEntry(`✅ ${currentUser} can read from accounts table`);
    } else {
        errorIndicator.classList.add('active');
        addLogEntry(`❌ ${currentUser} cannot read from accounts table`);
    }
}

// Utility Functions
function updateDateTime() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleTimeString();
    setTimeout(updateDateTime, 1000);
}

// Add some initial log entries for demonstration
setTimeout(() => {
    addLogEntry('🚀 Transaction Simulator started');
    addLogEntry('Click "How to Use" for instructions');
}, 1000);