// Relational Algebra Visualizer - Enhanced Version
// Main application class
class RelationalAlgebraVisualizer {
    constructor() {
        this.tables = new Map();
        this.operationHistory = [];
        this.currentResult = null;
        this.currentOperation = null;
        this.theme = 'dark';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadSampleData();
        this.updateTableDropdown();
        this.updateStats();
        this.initTheme();
        
        // Add keyboard shortcuts
        this.initKeyboardShortcuts();
        
        console.log('Relational Algebra Visualizer initialized');
    }
    
    // Initialize theme
    initTheme() {
        const savedTheme = localStorage.getItem('ra-theme') || 'dark';
        this.setTheme(savedTheme);
        
        document.getElementById('themeSwitch').addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    // Toggle between dark and light theme
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(this.theme);
        
        // Update theme button icon
        const themeIcon = document.querySelector('#themeSwitch i');
        themeIcon.className = this.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Save preference
        localStorage.setItem('ra-theme', this.theme);
    }
    
    // Set theme
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
    }
    
    // Initialize keyboard shortcuts
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N: Focus on table name
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.getElementById('tableName').focus();
            }
            
            // Ctrl/Cmd + D: Load sample data
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.loadSampleData();
            }
            
            // Esc: Clear current result
            if (e.key === 'Escape') {
                this.clearResult();
            }
            
            // Ctrl/Cmd + H: Clear history
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                this.clearHistory();
            }
            
            // Ctrl/Cmd + ?: Toggle help
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.toggleHelp();
            }
        });
    }
    
    // Bind event listeners
    bindEvents() {
        // Table creation
        document.getElementById('createTable').addEventListener('click', () => this.createTable());
        document.getElementById('addSample').addEventListener('click', () => this.loadSampleData());
        document.getElementById('clearForm').addEventListener('click', () => this.clearForm());
        
        // Operations
        document.querySelectorAll('.op-btn').forEach(btn => {
            if (btn.id !== 'clearResult') {
                btn.addEventListener('click', (e) => this.showOperationParams(e.target.closest('.op-btn').dataset.op));
            }
        });
        
        document.getElementById('clearResult').addEventListener('click', () => this.clearResult());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAllTables());
        document.getElementById('exportResult').addEventListener('click', () => this.exportResult());
        document.getElementById('saveResult').addEventListener('click', () => this.saveResultAsTable());
        
        // Table selection
        document.getElementById('selectTable').addEventListener('change', () => this.onTableSelect());
        
        // Help and UI
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());
        document.getElementById('closeHelp').addEventListener('click', () => this.hideHelp());
        document.getElementById('startTutorial').addEventListener('click', () => this.startTutorial());
        document.getElementById('toggleTables').addEventListener('click', () => this.toggleTablesView());
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
        
        // Modal close on overlay click
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target.id === 'helpModal') {
                this.hideHelp();
            }
        });
        
        // Footer links
        document.getElementById('docLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showHelp();
        });
        
        document.getElementById('issueLink').addEventListener('click', (e) => {
            e.preventDefault();
            alert('Please report issues at: github.com/username/relational-algebra-visualizer/issues');
        });
        
        document.getElementById('shortcutsLink').addEventListener('click', (e) => {
            e.preventDefault();
            alert('Keyboard Shortcuts:\n\nCtrl/Cmd + N: New table\nCtrl/Cmd + D: Sample data\nEsc: Clear result\nCtrl/Cmd + H: Clear history\nCtrl/Cmd + /: Help');
        });
    }
    
    // Create a new table
    createTable() {
        const name = document.getElementById('tableName').value.trim();
        const columnsInput = document.getElementById('columns').value.trim();
        const dataInput = document.getElementById('data').value.trim();
        
        // Validation
        if (!name) {
            this.showError('Please enter a table name');
            return;
        }
        
        if (this.tables.has(name)) {
            this.showError(`Table "${name}" already exists`);
            return;
        }
        
        if (!columnsInput) {
            this.showError('Please enter column names');
            return;
        }
        
        const columns = columnsInput.split(',').map(col => col.trim()).filter(col => col);
        
        if (columns.length === 0) {
            this.showError('Please enter valid column names');
            return;
        }
        
        // Parse data
        const rows = [];
        if (dataInput) {
            const dataLines = dataInput.split('\n');
            
            for (let i = 0; i < dataLines.length; i++) {
                const line = dataLines[i].trim();
                if (!line) continue;
                
                const values = line.split(',').map(val => val.trim());
                
                if (values.length !== columns.length) {
                    this.showError(`Row ${i+1} has ${values.length} values, but expected ${columns.length}`);
                    return;
                }
                
                rows.push(values);
            }
        }
        
        // Create table
        const table = {
            name: name,
            columns: columns,
            data: rows
        };
        
        this.tables.set(name, table);
        this.displayTable(table);
        this.updateTableDropdown();
        this.updateStats();
        this.clearForm();
        
        this.showSuccess(`Table "${name}" created successfully with ${rows.length} rows`);
        this.addToHistory('create', `Created table "${name}"`);
    }
    
    // Display a table in the UI
    displayTable(table) {
        const container = document.getElementById('tablesContainer');
        
        const tableCard = document.createElement('div');
        tableCard.className = 'table-card glass-card';
        tableCard.innerHTML = `
            <div class="table-header">
                <div class="table-name">${table.name}</div>
                <div class="table-stats">${table.data.length} rows × ${table.columns.length} cols</div>
                <div class="table-actions">
                    <button class="select-table" data-table="${table.name}">Select</button>
                    <button class="delete-table" data-table="${table.name}">Delete</button>
                </div>
            </div>
            <div class="table-content">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                ${table.columns.map(col => `<th>${col}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${table.data.length > 0 
                                ? table.data.map(row => 
                                    `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
                                  ).join('')
                                : `<tr><td colspan="${table.columns.length}" style="text-align: center; padding: 30px; color: var(--text-muted);">No data</td></tr>`
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Add event listeners for table actions
        tableCard.querySelector('.select-table').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('selectTable').value = table.name;
            this.onTableSelect();
        });
        
        tableCard.querySelector('.delete-table').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteTable(table.name);
        });
        
        container.appendChild(tableCard);
        
        // Add animation
        setTimeout(() => {
            tableCard.style.opacity = '1';
        }, 10);
    }
    
    // Delete a table
    deleteTable(name) {
        if (!confirm(`Are you sure you want to delete table "${name}"?`)) {
            return;
        }
        
        this.tables.delete(name);
        
        // Remove from UI
        const tableCard = document.querySelector(`.table-card .table-name:contains("${name}")`)?.closest('.table-card');
        if (tableCard) {
            tableCard.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                tableCard.remove();
            }, 500);
        }
        
        // Update dropdown
        this.updateTableDropdown();
        this.updateStats();
        
        this.showSuccess(`Table "${name}" deleted successfully`);
        this.addToHistory('delete', `Deleted table "${name}"`);
    }
    
    // Update table dropdown
    updateTableDropdown() {
        const select = document.getElementById('selectTable');
        const currentValue = select.value;
        
        // Clear existing options except the first one
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Add tables
        this.tables.forEach((table, name) => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = `${name} (${table.data.length} rows)`;
            select.appendChild(option);
        });
        
        // Restore previous selection if it still exists
        if (this.tables.has(currentValue)) {
            select.value = currentValue;
        }
    }
    
    // Update statistics
    updateStats() {
        document.getElementById('tableCount').textContent = this.tables.size;
        document.getElementById('operationCount').textContent = this.operationHistory.length;
        document.getElementById('resultCount').textContent = this.currentResult ? 1 : 0;
    }
    
    // Clear form
    clearForm() {
        document.getElementById('tableName').value = '';
        document.getElementById('columns').value = '';
        document.getElementById('data').value = '';
    }
    
    // Load sample data
    loadSampleData() {
        // Clear existing tables
        this.tables.clear();
        document.getElementById('tablesContainer').innerHTML = '';
        
        // Sample tables
        const sampleTables = [
            {
                name: 'Students',
                columns: ['ID', 'Name', 'Major', 'GPA'],
                data: [
                    ['1', 'Alice Johnson', 'Computer Science', '3.8'],
                    ['2', 'Bob Smith', 'Mathematics', '3.5'],
                    ['3', 'Carol Davis', 'Physics', '3.9'],
                    ['4', 'David Wilson', 'Computer Science', '3.2'],
                    ['5', 'Eva Brown', 'Biology', '3.7']
                ]
            },
            {
                name: 'Courses',
                columns: ['CourseID', 'Title', 'Department', 'Credits'],
                data: [
                    ['CS101', 'Introduction to Programming', 'Computer Science', '4'],
                    ['CS201', 'Data Structures', 'Computer Science', '4'],
                    ['MA101', 'Calculus I', 'Mathematics', '3'],
                    ['PH101', 'Physics I', 'Physics', '4'],
                    ['BI101', 'Biology I', 'Biology', '3']
                ]
            },
            {
                name: 'Enrollments',
                columns: ['StudentID', 'CourseID', 'Grade'],
                data: [
                    ['1', 'CS101', 'A'],
                    ['1', 'CS201', 'A-'],
                    ['2', 'MA101', 'B+'],
                    ['2', 'CS101', 'B'],
                    ['3', 'PH101', 'A'],
                    ['4', 'CS101', 'C+'],
                    ['4', 'CS201', 'B-'],
                    ['5', 'BI101', 'A-']
                ]
            }
        ];
        
        // Create sample tables
        sampleTables.forEach(table => {
            this.tables.set(table.name, table);
            this.displayTable(table);
        });
        
        this.updateTableDropdown();
        this.updateStats();
        
        this.showSuccess('Sample data loaded successfully');
        this.addToHistory('sample', 'Loaded sample data');
    }
    
    // Show operation parameters based on selected operation
    showOperationParams(operation) {
        const paramsContainer = document.getElementById('operationParams');
        const selectedTable = document.getElementById('selectTable').value;
        
        if (!selectedTable) {
            this.showError('Please select a table first');
            return;
        }
        
        this.currentOperation = operation;
        
        let paramsHTML = '';
        
        switch(operation) {
            case 'select':
                paramsHTML = `
                    <h3>SELECT (σ) Operation</h3>
                    <p>Filter rows based on a condition</p>
                    <div class="param-group">
                        <label for="selectCondition">Condition</label>
                        <input type="text" id="selectCondition" placeholder="e.g., GPA > 3.5 AND Major = 'Computer Science'">
                        <small>Use operators: =, !=, >, >=, <, <=, AND, OR, NOT</small>
                    </div>
                    <button class="btn btn-primary" id="applySelect">Apply SELECT</button>
                `;
                break;
                
            case 'project':
                const table = this.tables.get(selectedTable);
                paramsHTML = `
                    <h3>PROJECT (π) Operation</h3>
                    <p>Select specific columns to keep</p>
                    <div class="param-group">
                        <label>Select Columns</label>
                        <div class="columns-checkbox">
                            ${table.columns.map(col => `
                                <label class="checkbox-label">
                                    <input type="checkbox" name="projectColumns" value="${col}" checked>
                                    ${col}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <button class="btn btn-primary" id="applyProject">Apply PROJECT</button>
                `;
                break;
                
            case 'join':
                paramsHTML = `
                    <h3>JOIN (⨝) Operation</h3>
                    <p>Combine two tables based on matching values</p>
                    <div class="param-row">
                        <div class="form-group">
                            <label for="joinTable2">Second Table</label>
                            <select id="joinTable2">
                                <option value="">-- Select table --</option>
                                ${Array.from(this.tables.entries())
                                    .filter(([name]) => name !== selectedTable)
                                    .map(([name]) => `<option value="${name}">${name}</option>`)
                                    .join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="joinType">Join Type</label>
                            <select id="joinType">
                                <option value="inner">INNER JOIN</option>
                                <option value="left">LEFT JOIN</option>
                                <option value="right">RIGHT JOIN</option>
                            </select>
                        </div>
                    </div>
                    <div class="param-group">
                        <label for="joinCondition">Join Condition</label>
                        <input type="text" id="joinCondition" placeholder="e.g., Students.ID = Enrollments.StudentID">
                        <small>Specify columns to join on using table.column notation</small>
                    </div>
                    <button class="btn btn-primary" id="applyJoin">Apply JOIN</button>
                `;
                break;
                
            case 'union':
            case 'difference':
            case 'intersect':
                const opSymbol = operation === 'union' ? '∪' : operation === 'difference' ? '-' : '∩';
                const opName = operation === 'union' ? 'UNION' : operation === 'difference' ? 'DIFFERENCE' : 'INTERSECT';
                
                paramsHTML = `
                    <h3>${opName} (${opSymbol}) Operation</h3>
                    <p>${operation === 'union' ? 'Combine rows from two tables' : 
                         operation === 'difference' ? 'Find rows in first table not in second' : 
                         'Find common rows between two tables'}</p>
                    <div class="param-group">
                        <label for="${operation}Table2">Second Table</label>
                        <select id="${operation}Table2">
                            <option value="">-- Select table --</option>
                            ${Array.from(this.tables.entries())
                                .filter(([name]) => name !== selectedTable)
                                .map(([name]) => `<option value="${name}">${name}</option>`)
                                .join('')}
                        </select>
                    </div>
                    <button class="btn btn-primary" id="apply${operation.charAt(0).toUpperCase() + operation.slice(1)}">Apply ${opName}</button>
                `;
                break;
        }
        
        paramsContainer.innerHTML = paramsHTML;
        
        // Add event listeners for apply buttons
        switch(operation) {
            case 'select':
                document.getElementById('applySelect').addEventListener('click', () => this.applySelect());
                break;
            case 'project':
                document.getElementById('applyProject').addEventListener('click', () => this.applyProject());
                break;
            case 'join':
                document.getElementById('applyJoin').addEventListener('click', () => this.applyJoin());
                break;
            case 'union':
                document.getElementById('applyUnion').addEventListener('click', () => this.applyUnion());
                break;
            case 'difference':
                document.getElementById('applyDifference').addEventListener('click', () => this.applyDifference());
                break;
            case 'intersect':
                document.getElementById('applyIntersect').addEventListener('click', () => this.applyIntersect());
                break;
        }
        
        // Scroll to params
        paramsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Handle table selection
    onTableSelect() {
        const selectedTable = document.getElementById('selectTable').value;
        
        if (selectedTable) {
            // Highlight the selected table
            document.querySelectorAll('.table-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            const selectedCard = document.querySelector(`.table-name:contains("${selectedTable}")`)?.closest('.table-card');
            if (selectedCard) {
                selectedCard.classList.add('selected');
                selectedCard.style.border = '2px solid var(--primary)';
                selectedCard.style.boxShadow = 'var(--shadow-strong)';
            }
        }
    }
    
    // Apply SELECT operation
    applySelect() {
        const tableName = document.getElementById('selectTable').value;
        const condition = document.getElementById('selectCondition').value.trim();
        
        if (!condition) {
            this.showError('Please enter a condition');
            return;
        }
        
        this.showLoading();
        
        setTimeout(() => {
            try {
                const table = this.tables.get(tableName);
                const result = this.performSelect(table, condition);
                
                this.displayResult(result, `SELECT (σ) from ${tableName} where ${condition}`);
                this.addToHistory('select', `SELECT from ${tableName} where ${condition}`);
                
                this.hideLoading();
            } catch (error) {
                this.hideLoading();
                this.showError(`Error in SELECT operation: ${error.message}`);
            }
        }, 800);
    }
    
    // Perform SELECT operation
    performSelect(table, condition) {
        // Simple condition parser (for demonstration)
        const rows = table.data.filter(row => {
            // Create a context object with column values
            const context = {};
            table.columns.forEach((col, index) => {
                context[col] = row[index];
            });
            
            // Evaluate condition (simplified for demo)
            try {
                return this.evaluateCondition(condition, context);
            } catch (e) {
                throw new Error(`Invalid condition: ${condition}`);
            }
        });
        
        return {
            name: `SELECT_${table.name}`,
            columns: table.columns,
            data: rows
        };
    }
    
    // Evaluate condition (simplified for demo)
    evaluateCondition(condition, context) {
        // Replace column names with their values
        let expr = condition;
        for (const col in context) {
            const value = context[col];
            const quotedValue = isNaN(value) ? `'${value}'` : value;
            expr = expr.replace(new RegExp(col, 'g'), quotedValue);
        }
        
        // Evaluate the expression
        // WARNING: Using eval in production is dangerous, this is for demo only
        try {
            return eval(expr);
        } catch (e) {
            throw new Error(`Cannot evaluate condition: ${condition}`);
        }
    }
    
    // Apply PROJECT operation
    applyProject() {
        const tableName = document.getElementById('selectTable').value;
        const selectedColumns = Array.from(document.querySelectorAll('input[name="projectColumns"]:checked'))
            .map(cb => cb.value);
        
        if (selectedColumns.length === 0) {
            this.showError('Please select at least one column');
            return;
        }
        
        this.showLoading();
        
        setTimeout(() => {
            try {
                const table = this.tables.get(tableName);
                const result = this.performProject(table, selectedColumns);
                
                this.displayResult(result, `PROJECT (π) from ${tableName} on [${selectedColumns.join(', ')}]`);
                this.addToHistory('project', `PROJECT from ${tableName} on ${selectedColumns.join(', ')}`);
                
                this.hideLoading();
            } catch (error) {
                this.hideLoading();
                this.showError(`Error in PROJECT operation: ${error.message}`);
            }
        }, 600);
    }
    
    // Perform PROJECT operation
    performProject(table, columns) {
        const columnIndices = columns.map(col => table.columns.indexOf(col));
        
        if (columnIndices.some(idx => idx === -1)) {
            throw new Error('One or more columns not found in table');
        }
        
        const newData = table.data.map(row => 
            columnIndices.map(idx => row[idx])
        );
        
        return {
            name: `PROJECT_${table.name}`,
            columns: columns,
            data: newData
        };
    }
    
    // Apply JOIN operation
    applyJoin() {
        const table1Name = document.getElementById('selectTable').value;
        const table2Name = document.getElementById('joinTable2').value;
        const joinType = document.getElementById('joinType').value;
        const condition = document.getElementById('joinCondition').value.trim();
        
        if (!table2Name) {
            this.showError('Please select a second table');
            return;
        }
        
        if (!condition) {
            this.showError('Please enter a join condition');
            return;
        }
        
        this.showLoading();
        
        setTimeout(() => {
            try {
                const table1 = this.tables.get(table1Name);
                const table2 = this.tables.get(table2Name);
                const result = this.performJoin(table1, table2, joinType, condition);
                
                this.displayResult(result, `${joinType.toUpperCase()} JOIN (⨝) of ${table1Name} and ${table2Name} on ${condition}`);
                this.addToHistory('join', `${joinType.toUpperCase()} JOIN of ${table1Name} and ${table2Name}`);
                
                this.hideLoading();
            } catch (error) {
                this.hideLoading();
                this.showError(`Error in JOIN operation: ${error.message}`);
            }
        }, 1000);
    }
    
    // Perform JOIN operation
    performJoin(table1, table2, joinType, condition) {
        // Parse condition (simplified for demo)
        // Expected format: table1.column = table2.column
        const parts = condition.split('=').map(part => part.trim());
        if (parts.length !== 2) {
            throw new Error('Join condition must be in format: table.column = table.column');
        }
        
        const [leftCol, rightCol] = parts;
        const [leftTable, leftColName] = leftCol.split('.');
        const [rightTable, rightColName] = rightCol.split('.');
        
        if (!leftTable || !leftColName || !rightTable || !rightColName) {
            throw new Error('Join condition must specify table and column names');
        }
        
        // Determine which table is which
        const isLeftTable1 = leftTable === table1.name || (leftTable !== table2.name && table1.columns.includes(leftColName));
        const leftTableObj = isLeftTable1 ? table1 : table2;
        const rightTableObj = isLeftTable1 ? table2 : table1;
        const actualLeftCol = isLeftTable1 ? leftColName : rightColName;
        const actualRightCol = isLeftTable1 ? rightColName : leftColName;
        
        const leftColIndex = leftTableObj.columns.indexOf(actualLeftCol);
        const rightColIndex = rightTableObj.columns.indexOf(actualRightCol);
        
        if (leftColIndex === -1) {
            throw new Error(`Column ${actualLeftCol} not found in ${leftTableObj.name}`);
        }
        
        if (rightColIndex === -1) {
            throw new Error(`Column ${actualRightCol} not found in ${rightTableObj.name}`);
        }
        
        // Create result columns (avoid duplicate column names)
        const resultColumns = [
            ...leftTableObj.columns.map(col => `${leftTableObj.name}.${col}`),
            ...rightTableObj.columns.map(col => `${rightTableObj.name}.${col}`)
        ];
        
        // Perform join based on type
        let resultData = [];
        
        if (joinType === 'inner' || joinType === 'left') {
            // Left table rows
            leftTableObj.data.forEach(leftRow => {
                const matches = rightTableObj.data.filter(rightRow => 
                    leftRow[leftColIndex] === rightRow[rightColIndex]
                );
                
                if (matches.length > 0) {
                    // Add matches
                    matches.forEach(match => {
                        resultData.push([...leftRow, ...match]);
                    });
                } else if (joinType === 'left') {
                    // For left join, include left row with nulls for right table
                    resultData.push([...leftRow, ...Array(rightTableObj.columns.length).fill('NULL')]);
                }
            });
        }
        
        if (joinType === 'right') {
            // Right table rows
            rightTableObj.data.forEach(rightRow => {
                const matches = leftTableObj.data.filter(leftRow => 
                    leftRow[leftColIndex] === rightRow[rightColIndex]
                );
                
                if (matches.length > 0) {
                    // Add matches
                    matches.forEach(match => {
                        resultData.push([...match, ...rightRow]);
                    });
                } else {
                    // For right join, include right row with nulls for left table
                    resultData.push([...Array(leftTableObj.columns.length).fill('NULL'), ...rightRow]);
                }
            });
        }
        
        return {
            name: `${joinType.toUpperCase()}_JOIN_${table1.name}_${table2.name}`,
            columns: resultColumns,
            data: resultData
        };
    }
    
    // Apply UNION operation
    applyUnion() {
        this.applySetOperation('union');
    }
    
    // Apply DIFFERENCE operation
    applyDifference() {
        this.applySetOperation('difference');
    }
    
    // Apply INTERSECT operation
    applyIntersect() {
        this.applySetOperation('intersect');
    }
    
    // Apply set operations (UNION, DIFFERENCE, INTERSECT)
    applySetOperation(operation) {
        const table1Name = document.getElementById('selectTable').value;
        const table2Name = document.getElementById(`${operation}Table2`).value;
        
        if (!table2Name) {
            this.showError('Please select a second table');
            return;
        }
        
        this.showLoading();
        
        setTimeout(() => {
            try {
                const table1 = this.tables.get(table1Name);
                const table2 = this.tables.get(table2Name);
                
                // Check schema compatibility
                if (!this.areSchemasCompatible(table1, table2)) {
                    this.showError('Tables must have compatible schemas for set operations');
                    this.hideLoading();
                    return;
                }
                
                const result = this.performSetOperation(table1, table2, operation);
                
                const opSymbol = operation === 'union' ? '∪' : operation === 'difference' ? '-' : '∩';
                const opName = operation === 'union' ? 'UNION' : operation === 'difference' ? 'DIFFERENCE' : 'INTERSECT';
                
                this.displayResult(result, `${table1Name} ${opSymbol} ${table2Name}`);
                this.addToHistory(operation, `${opName} of ${table1Name} and ${table2Name}`);
                
                this.hideLoading();
            } catch (error) {
                this.hideLoading();
                this.showError(`Error in ${operation.toUpperCase()} operation: ${error.message}`);
            }
        }, 700);
    }
    
    // Check if schemas are compatible for set operations
    areSchemasCompatible(table1, table2) {
        if (table1.columns.length !== table2.columns.length) {
            return false;
        }
        
        // For set operations, we need the same number of columns
        // In a real implementation, you might also check data types
        return true;
    }
    
    // Perform set operations - FIXED VERSION
    performSetOperation(table1, table2, operation) {
        // Create a string representation of each row for comparison
        const table1Rows = table1.data.map(row => JSON.stringify(row));
        const table2Rows = table2.data.map(row => JSON.stringify(row));
        
        let resultRows = [];
        
        switch(operation) {
            case 'union':
                // UNION: All unique rows from both tables
                const unionSet = new Set([...table1Rows, ...table2Rows]);
                resultRows = Array.from(unionSet).map(str => JSON.parse(str));
                break;
                
            case 'intersect':
                // INTERSECT: Rows that appear in both tables
                const intersectSet = table1Rows.filter(rowStr => 
                    table2Rows.includes(rowStr)
                );
                resultRows = intersectSet.map(str => JSON.parse(str));
                break;
                
            case 'difference':
                // DIFFERENCE: Rows in table1 but not in table2
                const differenceSet = table1Rows.filter(rowStr => 
                    !table2Rows.includes(rowStr)
                );
                resultRows = differenceSet.map(str => JSON.parse(str));
                break;
        }
        
        return {
            name: `${operation.toUpperCase()}_${table1.name}_${table2.name}`,
            columns: [...table1.columns], // Use table1's column names
            data: resultRows
        };
    }
    
    // Display operation result
    displayResult(result, operationText) {
        this.currentResult = result;
        
        // Update operation indicator
        document.getElementById('operationIndicator').textContent = operationText.split(' ')[0];
        document.getElementById('resultStats').textContent = `${result.data.length} rows`;
        
        // Display result table
        const resultTable = document.getElementById('resultTable');
        resultTable.innerHTML = `
            <thead>
                <tr>
                    ${result.columns.map(col => `<th>${col}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${result.data.length > 0 
                    ? result.data.map(row => 
                        `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
                      ).join('')
                    : `<tr><td colspan="${result.columns.length}" style="text-align: center; padding: 40px; color: var(--text-muted);">No results</td></tr>`
                }
            </tbody>
        `;
        
        // Show result panel with animation
        const resultPanel = document.getElementById('resultPanel');
        resultPanel.style.display = 'block';
        resultPanel.style.animation = 'fadeIn 0.8s ease-out';
        
        // Scroll to result
        resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        this.updateStats();
    }
    
    // Clear result
    clearResult() {
        this.currentResult = null;
        document.getElementById('resultTable').innerHTML = '';
        document.getElementById('resultPanel').style.display = 'none';
        document.getElementById('operationParams').innerHTML = '';
        this.updateStats();
    }
    
    // Clear all tables
    clearAllTables() {
        if (!confirm('Are you sure you want to delete all tables? This action cannot be undone.')) {
            return;
        }
        
        this.tables.clear();
        document.getElementById('tablesContainer').innerHTML = '';
        this.clearResult();
        this.updateTableDropdown();
        this.updateStats();
        
        this.showSuccess('All tables cleared successfully');
        this.addToHistory('clear', 'Cleared all tables');
    }
    
    // Save result as a new table
    saveResultAsTable() {
        if (!this.currentResult) {
            this.showError('No result to save');
            return;
        }
        
        const tableName = prompt('Enter a name for the new table:', this.currentResult.name);
        
        if (!tableName) return;
        
        if (this.tables.has(tableName)) {
            this.showError(`Table "${tableName}" already exists`);
            return;
        }
        
        const newTable = {
            name: tableName,
            columns: [...this.currentResult.columns],
            data: this.currentResult.data.map(row => [...row])
        };
        
        this.tables.set(tableName, newTable);
        this.displayTable(newTable);
        this.updateTableDropdown();
        this.updateStats();
        
        this.showSuccess(`Result saved as table "${tableName}"`);
        this.addToHistory('save', `Saved result as "${tableName}"`);
    }
    
    // Export result
    exportResult() {
        if (!this.currentResult) {
            this.showError('No result to export');
            return;
        }
        
        // Create CSV content
        const csvContent = [
            this.currentResult.columns.join(','),
            ...this.currentResult.data.map(row => row.join(','))
        ].join('\n');
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentResult.name}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccess(`Result exported as ${this.currentResult.name}.csv`);
    }
    
    // Add operation to history
    addToHistory(type, description) {
        const historyItem = {
            type: type,
            description: description,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.operationHistory.unshift(historyItem);
        
        // Keep only last 20 items
        if (this.operationHistory.length > 20) {
            this.operationHistory.pop();
        }
        
        this.updateHistory();
        this.updateStats();
    }
    
    // Update history display
    updateHistory() {
        const historyList = document.getElementById('historyList');
        
        historyList.innerHTML = this.operationHistory.map(item => `
            <div class="history-item">
                <div class="history-op">
                    <div class="history-icon">
                        <i class="fas fa-${this.getHistoryIcon(item.type)}"></i>
                    </div>
                    <div class="history-details">
                        <div class="history-name">${item.description}</div>
                        <div class="history-desc">${this.getHistoryTypeName(item.type)}</div>
                    </div>
                </div>
                <div class="history-time">${item.timestamp}</div>
            </div>
        `).join('');
    }
    
    // Get history icon based on operation type
    getHistoryIcon(type) {
        const icons = {
            'create': 'plus',
            'delete': 'trash',
            'sample': 'vial',
            'select': 'filter',
            'project': 'project-diagram',
            'join': 'link',
            'union': 'merge',
            'difference': 'minus',
            'intersect': 'exchange-alt',
            'clear': 'broom',
            'save': 'save'
        };
        
        return icons[type] || 'history';
    }
    
    // Get history type name
    getHistoryTypeName(type) {
        const names = {
            'create': 'Table Created',
            'delete': 'Table Deleted',
            'sample': 'Sample Data',
            'select': 'SELECT Operation',
            'project': 'PROJECT Operation',
            'join': 'JOIN Operation',
            'union': 'UNION Operation',
            'difference': 'DIFFERENCE Operation',
            'intersect': 'INTERSECT Operation',
            'clear': 'All Tables Cleared',
            'save': 'Result Saved'
        };
        
        return names[type] || 'Operation';
    }
    
    // Clear history
    clearHistory() {
        if (this.operationHistory.length === 0) return;
        
        if (!confirm('Clear all operation history?')) {
            return;
        }
        
        this.operationHistory = [];
        this.updateHistory();
        this.updateStats();
        
        this.showSuccess('Operation history cleared');
    }
    
    // Show loading overlay
    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }
    
    // Hide loading overlay
    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
    
    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    // Show notification
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} glass-card`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 15px 20px;
            border-radius: var(--border-radius);
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            animation: slideInRight 0.5s ease-out;
            border-left: 4px solid ${type === 'error' ? 'var(--danger)' : 'var(--success)'};
            box-shadow: var(--shadow-strong);
        `;
        
        // Add close button event
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        });
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.5s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }
        }, 5000);
        
        // Add CSS animations if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Show help modal
    showHelp() {
        document.getElementById('helpModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Hide help modal
    hideHelp() {
        document.getElementById('helpModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Toggle help modal
    toggleHelp() {
        if (document.getElementById('helpModal').style.display === 'flex') {
            this.hideHelp();
        } else {
            this.showHelp();
        }
    }
    
    // Start interactive tutorial
    startTutorial() {
        this.hideHelp();
        this.showSuccess('Interactive tutorial started! Follow the steps to learn how to use the visualizer.');
        
        // In a real implementation, you would guide the user through steps
        setTimeout(() => {
            document.getElementById('tableName').focus();
            this.showNotification('Step 1: Enter a table name like "Employees"', 'info');
        }, 1000);
    }
    
    // Toggle tables view (compact/expanded)
    toggleTablesView() {
        const container = document.getElementById('tablesContainer');
        const toggleBtn = document.getElementById('toggleTables');
        const icon = toggleBtn.querySelector('i');
        
        if (container.classList.contains('compact-view')) {
            container.classList.remove('compact-view');
            container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(380px, 1fr))';
            icon.className = 'fas fa-expand';
            toggleBtn.innerHTML = '<i class="fas fa-expand"></i> Compact View';
        } else {
            container.classList.add('compact-view');
            container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
            icon.className = 'fas fa-compress';
            toggleBtn.innerHTML = '<i class="fas fa-compress"></i> Expanded View';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.raVisualizer = new RelationalAlgebraVisualizer();
});