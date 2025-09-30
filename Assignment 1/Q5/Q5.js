// Enhanced Relational Algebra Visualizer with Fixed Logic
class RelationalAlgebraVisualizer {
    constructor() {
        this.tables = {};
        this.results = {};
        this.currentOperation = null;
        this.operationCount = 0;
        this.operationHistory = [];
        this.isDarkMode = true;
        this.nextTableId = 1;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeApp();
        this.initializeCursor();
    }

    initializeElements() {
        // Form elements
        this.tableNameInput = document.getElementById('tableName');
        this.columnsInput = document.getElementById('columns');
        this.dataInput = document.getElementById('data');
        this.createTableBtn = document.getElementById('createTable');
        this.selectTableDropdown = document.getElementById('selectTable');
        this.clearFormBtn = document.getElementById('clearForm');
        this.addSampleBtn = document.getElementById('addSample');
        this.clearAllBtn = document.getElementById('clearAll');
        this.exportResultBtn = document.getElementById('exportResult');
        this.saveResultBtn = document.getElementById('saveResult');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        this.toggleTablesBtn = document.getElementById('toggleTables');

        // Display elements
        this.tablesContainer = document.getElementById('tablesContainer');
        this.operationParams = document.getElementById('operationParams');
        this.resultPanel = document.getElementById('resultPanel');
        this.resultTable = document.getElementById('resultTable');
        this.operationIndicator = document.getElementById('operationIndicator');
        this.resultStats = document.getElementById('resultStats');
        this.historyList = document.getElementById('historyList');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Stats elements
        this.tableCount = document.getElementById('tableCount');
        this.operationCount = document.getElementById('operationCount');
        this.resultCount = document.getElementById('resultCount');

        // Theme
        this.themeSwitch = document.getElementById('themeSwitch');
    }

    bindEvents() {
        // Table operations
        this.createTableBtn.addEventListener('click', () => this.createTable());
        this.clearFormBtn.addEventListener('click', () => this.clearForm());
        this.addSampleBtn.addEventListener('click', () => this.addSampleData());
        this.clearAllBtn.addEventListener('click', () => this.clearAllTables());
        this.exportResultBtn.addEventListener('click', () => this.exportResult());
        this.saveResultBtn.addEventListener('click', () => this.saveResultAsTable());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.toggleTablesBtn.addEventListener('click', () => this.toggleTablesView());

        // Operation buttons
        document.querySelectorAll('.op-btn[data-op]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const operation = e.currentTarget.dataset.op;
                this.showOperationParams(operation);
            });
        });

        document.getElementById('clearResult').addEventListener('click', () => this.clearResult());

        // Theme toggle
        this.themeSwitch.addEventListener('click', () => this.toggleTheme());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Table selection change
        this.selectTableDropdown.addEventListener('change', () => this.onTableSelectionChange());
    }

    initializeApp() {
        this.loadTheme();
        this.addSampleData();
        this.updateStats();
        this.showNotification('Welcome to Relational Algebra Visualizer!', 'info');
    }

    initializeCursor() {
        const cursor = document.querySelector('.custom-cursor');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effects
        const hoverElements = ['button', 'a', 'input', 'select', 'textarea', '.op-btn', '.icon-btn', '.table-card'];
        
        hoverElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
            });
        });
    }

    // Theme Management
    loadTheme() {
        const savedTheme = localStorage.getItem('ra-theme');
        this.isDarkMode = savedTheme ? savedTheme === 'dark' : true;
        this.applyTheme();
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        localStorage.setItem('ra-theme', this.isDarkMode ? 'dark' : 'light');
        this.showNotification(`Theme switched to ${this.isDarkMode ? 'dark' : 'light'} mode`, 'info');
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        this.themeSwitch.innerHTML = this.isDarkMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }

    // Enhanced Table Management with Proper Schema Handling
    createTable() {
        const name = this.tableNameInput.value.trim();
        const columns = this.columnsInput.value.split(',').map(col => col.trim()).filter(c => c !== '');
        const dataLines = this.dataInput.value.split('\n').map(l => l.trim()).filter(line => line !== '');

        if (!this.validateTableInput(name, columns, dataLines)) return;

        // Parse data with enhanced type detection and preservation
        const { data, schema } = this.parseTableDataWithSchema(dataLines, columns);

        // Add table with schema information
        this.tables[name] = { 
            columns, 
            data,
            schema,
            createdAt: new Date().toISOString()
        };

        this.clearForm();
        this.updateTableDropdown();
        this.renderTables();
        this.updateStats();
        
        this.showNotification(`Table "${name}" created successfully!`, 'success');
    }

    validateTableInput(name, columns, dataLines) {
        if (!name) {
            this.showNotification('Please enter a table name', 'error');
            return false;
        }

        if (this.tables[name]) {
            this.showNotification(`Table "${name}" already exists`, 'error');
            return false;
        }

        if (columns.length === 0) {
            this.showNotification('Please enter at least one column', 'error');
            return false;
        }

        // Check for duplicate column names
        const uniqueColumns = new Set(columns);
        if (uniqueColumns.size !== columns.length) {
            this.showNotification('Column names must be unique', 'error');
            return false;
        }

        // Validate data lines
        for (let i = 0; i < dataLines.length; i++) {
            const values = dataLines[i].split(',').map(val => val.trim());
            if (values.length !== columns.length) {
                this.showNotification(
                    `Row ${i + 1} has ${values.length} values but expected ${columns.length}`,
                    'error'
                );
                return false;
            }
        }

        return true;
    }

    parseTableDataWithSchema(dataLines, columns) {
        const data = [];
        const schema = {};
        
        // Initialize schema
        columns.forEach(col => {
            schema[col] = { type: 'unknown', nullable: true };
        });

        dataLines.forEach((line, rowIndex) => {
            const values = line.split(',').map(val => val.trim());
            const parsedRow = [];
            
            values.forEach((value, colIndex) => {
                const columnName = columns[colIndex];
                let parsedValue = this.parseValue(value);
                
                // Update schema information
                if (value === '') {
                    schema[columnName].nullable = true;
                } else {
                    const valueType = this.detectValueType(parsedValue);
                    if (schema[columnName].type === 'unknown') {
                        schema[columnName].type = valueType;
                    } else if (schema[columnName].type !== valueType) {
                        schema[columnName].type = 'string'; // Fallback to string for mixed types
                    }
                }
                
                parsedRow.push(parsedValue);
            });
            
            data.push(parsedRow);
        });

        return { data, schema };
    }

    parseValue(value) {
        if (value === '') return null;
        if (!isNaN(value) && value.trim() !== '' && !value.includes(' ')) {
            // Preserve numeric formatting
            const num = parseFloat(value);
            return num % 1 === 0 ? parseInt(value) : num;
        }
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
        
        // Remove surrounding quotes if present, but preserve the string
        const unquoted = value.replace(/^['"](.*)['"]$/, '$1');
        return unquoted === '' ? value : unquoted;
    }

    detectValueType(value) {
        if (value === null) return 'null';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'boolean';
        return 'string';
    }

    deleteTable(tableName) {
        if (confirm(`Are you sure you want to delete the table "${tableName}"?`)) {
            delete this.tables[tableName];
            this.updateTableDropdown();
            this.renderTables();
            this.updateStats();
            this.clearResult();
            this.showNotification(`Table "${tableName}" deleted`, 'info');
        }
    }

    clearAllTables() {
        if (Object.keys(this.tables).length === 0) return;
        
        if (confirm('Are you sure you want to delete all tables?')) {
            this.tables = {};
            this.results = {};
            this.updateTableDropdown();
            this.renderTables();
            this.updateStats();
            this.clearResult();
            this.clearHistory();
            this.showNotification('All tables cleared', 'info');
        }
    }

    // Enhanced UI Updates
    updateTableDropdown() {
        // Clear existing options except the first one
        while (this.selectTableDropdown.options.length > 1) {
            this.selectTableDropdown.remove(1);
        }

        // Add tables to dropdown
        Object.keys(this.tables).forEach(tableName => {
            const option = document.createElement('option');
            option.value = tableName;
            option.textContent = `${tableName} (${this.tables[tableName].data.length} rows)`;
            this.selectTableDropdown.appendChild(option);
        });
    }

    onTableSelectionChange() {
        const selectedTable = this.selectTableDropdown.value;
        if (selectedTable && this.operationParams.innerHTML.includes('projectTableSelect')) {
            this.updateProjectColumns(selectedTable);
        }
    }

    renderTables() {
        this.tablesContainer.innerHTML = '';

        if (Object.keys(this.tables).length === 0) {
            this.tablesContainer.innerHTML = `
                <div class="empty-state glass-card" style="grid-column: 1 / -1;">
                    <div class="empty-icon">
                        <i class="fas fa-database"></i>
                    </div>
                    <h3>No Relations Created</h3>
                    <p>Create your first relation to get started with relational algebra operations</p>
                    <button class="btn btn-outline" onclick="visualizer.addSampleData()">
                        <i class="fas fa-vial"></i> Load Sample Data
                    </button>
                </div>
            `;
            return;
        }

        Object.entries(this.tables).forEach(([tableName, table]) => {
            const tableCard = this.createTableCard(tableName, table);
            this.tablesContainer.appendChild(tableCard);
        });
    }

    createTableCard(tableName, table) {
        const card = document.createElement('div');
        card.className = 'table-card glass-card fade-in';
        
        card.innerHTML = `
            <div class="table-header">
                <div>
                    <div class="table-name">${this.escapeHtml(tableName)}</div>
                    <div class="table-stats">${table.data.length} rows × ${table.columns.length} columns</div>
                </div>
                <div class="table-actions">
                    <button class="btn btn-outline btn-sm" onclick="visualizer.useTableForOperation('${this.escapeJsString(tableName)}')">
                        <i class="fas fa-play"></i> Use
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="visualizer.deleteTable('${this.escapeJsString(tableName)}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="table-content">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                ${table.columns.map(col => `<th>${this.escapeHtml(col)}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${table.data.slice(0, 15).map(row => `
                                <tr>
                                    ${row.map(cell => `<td>${this.escapeHtml(this.formatCellValue(cell))}</td>`).join('')}
                                </tr>
                            `).join('')}
                            ${table.data.length > 15 ? `
                                <tr>
                                    <td colspan="${table.columns.length}" style="text-align: center; color: var(--text-muted); font-style: italic;">
                                        ... and ${table.data.length - 15} more rows
                                    </td>
                                </tr>
                            ` : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        return card;
    }

    useTableForOperation(tableName) {
        this.selectTableDropdown.value = tableName;
        this.showNotification(`Selected "${tableName}" for operations`, 'info');
    }

    // Enhanced Operations with Fixed Logic
    showOperationParams(operation) {
        this.currentOperation = operation;
        this.operationParams.innerHTML = '';
        this.resultPanel.style.display = 'block';

        const tableNames = Object.keys(this.tables);

        switch (operation) {
            case 'select':
                this.renderSelectOperation(tableNames);
                break;
            case 'project':
                this.renderProjectOperation(tableNames);
                break;
            case 'join':
                this.renderJoinOperation(tableNames);
                break;
            case 'union':
                this.renderSetOperation(tableNames, 'union');
                break;
            case 'difference':
                this.renderSetOperation(tableNames, 'difference');
                break;
            case 'intersect':
                this.renderSetOperation(tableNames, 'intersect');
                break;
        }
    }

    renderSelectOperation(tableNames) {
        if (tableNames.length === 0) {
            this.showNotification('Create tables first to perform operations', 'error');
            return;
        }

        const selectedTable = this.selectTableDropdown.value || tableNames[0];
        const columns = this.tables[selectedTable]?.columns || [];

        this.operationParams.innerHTML = `
            <div class="param-group">
                <label for="selectTableForOp"><i class="fas fa-table"></i> Table</label>
                <select id="selectTableForOp">
                    ${tableNames.map(name => 
                        `<option value="${this.escapeHtml(name)}" ${name === selectedTable ? 'selected' : ''}>
                            ${this.escapeHtml(name)}
                        </option>`
                    ).join('')}
                </select>
            </div>
            <div class="param-group">
                <label for="selectCondition"><i class="fas fa-filter"></i> Condition</label>
                <input type="text" id="selectCondition" 
                       placeholder="e.g., Major = 'Computer Science' AND GPA > 3.5"
                       value="GPA > 3.5">
                <small style="color: var(--text-muted); display: block; margin-top: 8px;">
                    Supports: =, !=, >, >=, <, <=, AND, OR, NOT, (). Use single quotes for text values.
                </small>
            </div>
            <button id="execSelectBtn" class="btn btn-primary btn-glow">
                <i class="fas fa-play"></i> Execute SELECT (σ)
            </button>
        `;

        document.getElementById('execSelectBtn').addEventListener('click', () => this.executeSelect());
        this.operationIndicator.textContent = 'SELECT (σ)';
    }

    renderProjectOperation(tableNames) {
        if (tableNames.length === 0) {
            this.showNotification('Create tables first to perform operations', 'error');
            return;
        }

        const selectedTable = this.selectTableDropdown.value || tableNames[0];
        const columns = this.tables[selectedTable]?.columns || [];

        this.operationParams.innerHTML = `
            <div class="param-group">
                <label for="projectTableSelect"><i class="fas fa-table"></i> Table</label>
                <select id="projectTableSelect">
                    ${tableNames.map(name => 
                        `<option value="${this.escapeHtml(name)}" ${name === selectedTable ? 'selected' : ''}>
                            ${this.escapeHtml(name)} (${this.tables[name].data.length} rows)
                        </option>`
                    ).join('')}
                </select>
            </div>
            <div class="param-group">
                <label><i class="fas fa-columns"></i> Select Columns</label>
                <div class="columns-checkbox-group">
                    ${columns.map(col => `
                        <label class="checkbox-label">
                            <input type="checkbox" value="${this.escapeHtml(col)}" checked>
                            <span>${this.escapeHtml(col)}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="param-group">
                <label for="projectDistinct">
                    <input type="checkbox" id="projectDistinct" checked>
                    Remove duplicate rows
                </label>
            </div>
            <button id="execProjectBtn" class="btn btn-primary btn-glow">
                <i class="fas fa-play"></i> Execute PROJECT (π)
            </button>
        `;

        document.getElementById('projectTableSelect').addEventListener('change', (e) => {
            this.updateProjectColumns(e.target.value);
        });

        document.getElementById('execProjectBtn').addEventListener('click', () => this.executeProject());
        this.operationIndicator.textContent = 'PROJECT (π)';
    }

    updateProjectColumns(tableName) {
        const columns = this.tables[tableName]?.columns || [];
        const container = this.operationParams.querySelector('.columns-checkbox-group');
        container.innerHTML = columns.map(col => `
            <label class="checkbox-label">
                <input type="checkbox" value="${this.escapeHtml(col)}" checked>
                <span>${this.escapeHtml(col)}</span>
            </label>
        `).join('');
    }

    renderJoinOperation(tableNames) {
        if (tableNames.length < 2) {
            this.showNotification('Need at least 2 tables for JOIN operation', 'error');
            return;
        }

        this.operationParams.innerHTML = `
            <div class="param-row">
                <div class="param-group">
                    <label for="joinTable1"><i class="fas fa-table"></i> First Table</label>
                    <select id="joinTable1">
                        ${tableNames.map(name => 
                            `<option value="${this.escapeHtml(name)}">${this.escapeHtml(name)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="param-group">
                    <label for="joinTable2"><i class="fas fa-table"></i> Second Table</label>
                    <select id="joinTable2">
                        ${tableNames.map(name => 
                            `<option value="${this.escapeHtml(name)}" ${name === tableNames[1] ? 'selected' : ''}>
                                ${this.escapeHtml(name)}
                            </option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <div class="param-group">
                <label><i class="fas fa-link"></i> Join Type</label>
                <select id="joinType">
                    <option value="inner">INNER JOIN (Natural) - Matching rows only</option>
                    <option value="left">LEFT JOIN - All rows from first table</option>
                    <option value="right">RIGHT JOIN - All rows from second table</option>
                </select>
            </div>
            <div class="param-group">
                <label><i class="fas fa-info-circle"></i> Join automatically on common column names</label>
            </div>
            <button id="execJoinBtn" class="btn btn-primary btn-glow">
                <i class="fas fa-play"></i> Execute JOIN (⨝)
            </button>
        `;

        document.getElementById('execJoinBtn').addEventListener('click', () => this.executeJoin());
        this.operationIndicator.textContent = 'JOIN (⨝)';
    }

    renderSetOperation(tableNames, operation) {
        if (tableNames.length < 2) {
            this.showNotification('Need at least 2 tables for this operation', 'error');
            return;
        }

        const opConfig = {
            union: { symbol: '∪', name: 'UNION' },
            difference: { symbol: '-', name: 'DIFFERENCE' },
            intersect: { symbol: '∩', name: 'INTERSECT' }
        }[operation];

        this.operationParams.innerHTML = `
            <div class="param-row">
                <div class="param-group">
                    <label for="${operation}Table1"><i class="fas fa-table"></i> First Table</label>
                    <select id="${operation}Table1">
                        ${tableNames.map(name => 
                            `<option value="${this.escapeHtml(name)}">${this.escapeHtml(name)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="param-group">
                    <label for="${operation}Table2"><i class="fas fa-table"></i> Second Table</label>
                    <select id="${operation}Table2">
                        ${tableNames.map(name => 
                            `<option value="${this.escapeHtml(name)}" ${name === tableNames[1] ? 'selected' : ''}>
                                ${this.escapeHtml(name)}
                            </option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <div class="param-group">
                <label><i class="fas fa-info-circle"></i> Tables must have compatible schemas (same columns)</label>
            </div>
            <button id="exec${operation.charAt(0).toUpperCase() + operation.slice(1)}Btn" class="btn btn-primary btn-glow">
                <i class="fas fa-play"></i> Execute ${opConfig.name} (${opConfig.symbol})
            </button>
        `;

        document.getElementById(`exec${operation.charAt(0).toUpperCase() + operation.slice(1)}Btn`)
            .addEventListener('click', () => this.executeSetOperation(operation));
        this.operationIndicator.textContent = `${opConfig.name} (${opConfig.symbol})`;
    }

    // Enhanced Operation Execution with Fixed Logic
    async executeSelect() {
        this.showLoading();
        
        try {
            const tableName = document.getElementById('selectTableForOp').value;
            const condition = document.getElementById('selectCondition').value;

            if (!tableName || !condition) {
                this.showNotification('Please select a table and enter a condition', 'error');
                return;
            }

            const table = this.tables[tableName];
            const resultData = await this.performSelect(table, condition);

            this.displayResult(
                table.columns, 
                resultData, 
                `σ[${condition}](${tableName})`,
                resultData.length
            );
            this.addToHistory('SELECT', `σ[${condition}](${tableName})`, resultData.length);
            this.incrementOperationCount();
        } catch (error) {
            this.showNotification(`Error in SELECT operation: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async performSelect(table, condition) {
        return new Promise((resolve, reject) => {
            try {
                if (!condition.trim()) {
                    resolve([...table.data]); // Return all rows if no condition
                    return;
                }

                const tokens = this.tokenizeCondition(condition);
                const ast = this.parseCondition(tokens);
                const result = table.data.filter(row => this.evaluateCondition(ast, row, table.columns));
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    async executeProject() {
        this.showLoading();
        
        try {
            const tableName = document.getElementById('projectTableSelect').value;
            const table = this.tables[tableName];
            const distinct = document.getElementById('projectDistinct')?.checked ?? true;

            const selectedColumns = Array.from(
                this.operationParams.querySelectorAll('input[type="checkbox"]:checked')
            ).map(cb => cb.value);

            if (selectedColumns.length === 0) {
                this.showNotification('Please select at least one column', 'error');
                return;
            }

            const { columns: resultColumns, data: resultData } = await this.performProject(table, selectedColumns, distinct);

            this.displayResult(
                resultColumns,
                resultData,
                `π[${selectedColumns.join(', ')}](${tableName})`,
                resultData.length
            );
            this.addToHistory('PROJECT', `π[${selectedColumns.join(', ')}](${tableName})`, resultData.length);
            this.incrementOperationCount();
        } catch (error) {
            this.showNotification(`Error in PROJECT operation: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async performProject(table, columns, distinct = true) {
        return new Promise((resolve) => {
            const columnIndices = columns.map(col => table.columns.indexOf(col));
            const projectedData = table.data.map(row => columnIndices.map(i => row[i]));
            
            let resultData = projectedData;
            if (distinct) {
                // Use proper deep comparison for duplicates
                const uniqueMap = new Map();
                projectedData.forEach(row => {
                    const key = JSON.stringify(row);
                    if (!uniqueMap.has(key)) {
                        uniqueMap.set(key, row);
                    }
                });
                resultData = Array.from(uniqueMap.values());
            }

            resolve({ columns, data: resultData });
        });
    }

    async executeJoin() {
        this.showLoading();
        
        try {
            const table1Name = document.getElementById('joinTable1').value;
            const table2Name = document.getElementById('joinTable2').value;
            const joinType = document.getElementById('joinType').value;

            const table1 = this.tables[table1Name];
            const table2 = this.tables[table2Name];

            const { columns, data } = await this.performJoin(table1, table2, table1Name, table2Name, joinType);

            this.displayResult(
                columns,
                data,
                `${table1Name} ${this.getJoinSymbol(joinType)} ${table2Name}`,
                data.length
            );
            this.addToHistory('JOIN', `${table1Name} ${this.getJoinSymbol(joinType)} ${table2Name}`, data.length);
            this.incrementOperationCount();
        } catch (error) {
            this.showNotification(`Error in JOIN operation: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    getJoinSymbol(joinType) {
        const symbols = {
            inner: '⨝',
            left: '⟕',
            right: '⟖'
        };
        return symbols[joinType] || '⨝';
    }

    async performJoin(table1, table2, table1Name, table2Name, joinType = 'inner') {
        return new Promise((resolve, reject) => {
            try {
                // Find common columns for natural join
                const commonColumns = table1.columns.filter(col => table2.columns.includes(col));
                
                if (commonColumns.length === 0) {
                    reject(new Error('No common columns found for natural join'));
                    return;
                }

                // Build result columns with table prefixes for disambiguation
                const resultColumns = [
                    ...table1.columns.map(col => `${table1Name}.${col}`),
                    ...table2.columns
                        .filter(col => !commonColumns.includes(col))
                        .map(col => `${table2Name}.${col}`)
                ];

                const resultData = [];
                const commonIndices = commonColumns.map(col => ({
                    col,
                    idx1: table1.columns.indexOf(col),
                    idx2: table2.columns.indexOf(col)
                }));

                // Perform join based on common columns with proper type comparison
                table1.data.forEach(row1 => {
                    let matched = false;
                    
                    table2.data.forEach(row2 => {
                        // Check if all common columns match with type-aware comparison
                        const isMatch = commonIndices.every(({ idx1, idx2 }) => {
                            return this.valuesEqual(row1[idx1], row2[idx2]);
                        });

                        if (isMatch) {
                            matched = true;
                            // Merge rows
                            const mergedRow = [
                                ...row1,
                                ...table2.columns
                                    .filter(col => !commonColumns.includes(col))
                                    .map(col => row2[table2.columns.indexOf(col)])
                            ];
                            resultData.push(mergedRow);
                        }
                    });

                    // Handle LEFT JOIN
                    if (joinType === 'left' && !matched) {
                        const leftRow = [
                            ...row1,
                            ...table2.columns
                                .filter(col => !commonColumns.includes(col))
                                .map(() => null)
                        ];
                        resultData.push(leftRow);
                    }
                });

                // Handle RIGHT JOIN
                if (joinType === 'right') {
                    table2.data.forEach(row2 => {
                        const isMatched = table1.data.some(row1 => {
                            return commonIndices.every(({ idx1, idx2 }) => {
                                return this.valuesEqual(row1[idx1], row2[idx2]);
                            });
                        });

                        if (!isMatched) {
                            const rightRow = [
                                ...table1.columns.map(() => null),
                                ...row2
                            ];
                            resultData.push(rightRow);
                        }
                    });
                }

                resolve({ columns: resultColumns, data: resultData });
            } catch (error) {
                reject(error);
            }
        });
    }

    async executeSetOperation(operation) {
        this.showLoading();
        
        try {
            const table1Name = document.getElementById(`${operation}Table1`).value;
            const table2Name = document.getElementById(`${operation}Table2`).value;

            const table1 = this.tables[table1Name];
            const table2 = this.tables[table2Name];

            // Enhanced schema compatibility check
            if (!this.schemasCompatible(table1.columns, table2.columns)) {
                this.showNotification('Tables must have compatible schemas for set operations', 'error');
                return;
            }

            const resultData = await this.performSetOperation(table1, table2, operation);

            const opConfig = {
                union: { symbol: '∪', name: 'UNION' },
                difference: { symbol: '-', name: 'DIFFERENCE' },
                intersect: { symbol: '∩', name: 'INTERSECT' }
            }[operation];

            this.displayResult(
                table1.columns,
                resultData,
                `${table1Name} ${opConfig.symbol} ${table2Name}`,
                resultData.length
            );
            this.addToHistory(opConfig.name, `${table1Name} ${opConfig.symbol} ${table2Name}`, resultData.length);
            this.incrementOperationCount();
        } catch (error) {
            this.showNotification(`Error in ${operation.toUpperCase()} operation: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async performSetOperation(table1, table2, operation) {
        return new Promise((resolve) => {
            // Use type-aware comparison for set operations
            const set1 = new Map();
            table1.data.forEach(row => {
                const key = this.createRowKey(row);
                set1.set(key, row);
            });

            const set2 = new Map();
            table2.data.forEach(row => {
                const key = this.createRowKey(row);
                set2.set(key, row);
            });

            let result;
            switch (operation) {
                case 'union':
                    result = Array.from(new Map([...set1, ...set2]).values());
                    break;
                case 'difference':
                    result = table1.data.filter(row1 => {
                        const key = this.createRowKey(row1);
                        return !set2.has(key);
                    });
                    break;
                case 'intersect':
                    result = table1.data.filter(row1 => {
                        const key = this.createRowKey(row1);
                        return set2.has(key);
                    });
                    break;
                default:
                    result = [];
            }

            resolve(result);
        });
    }

    // Enhanced comparison utilities
    valuesEqual(a, b) {
        if (a === null && b === null) return true;
        if (a === null || b === null) return false;
        
        // Handle numeric comparison
        if (typeof a === 'number' && typeof b === 'number') {
            return Math.abs(a - b) < Number.EPSILON;
        }
        
        // Handle string comparison (case insensitive)
        if (typeof a === 'string' && typeof b === 'string') {
            return a.toLowerCase() === b.toLowerCase();
        }
        
        // Handle boolean comparison
        if (typeof a === 'boolean' && typeof b === 'boolean') {
            return a === b;
        }
        
        // Fallback to strict equality
        return a === b;
    }

    createRowKey(row) {
        // Create a consistent key for row comparison that handles different types
        return row.map(cell => {
            if (cell === null) return 'NULL';
            if (typeof cell === 'number') return `N${cell}`;
            if (typeof cell === 'boolean') return `B${cell}`;
            return `S${String(cell).toLowerCase()}`;
        }).join('|');
    }

    schemasCompatible(cols1, cols2) {
        if (cols1.length !== cols2.length) return false;
        
        // For set operations, we need compatible domains, not necessarily same names
        // But for simplicity, we'll require same column names in same order
        return cols1.every((col, i) => col === cols2[i]);
    }

    // Enhanced Condition Parser with Proper Operator Precedence
    tokenizeCondition(condition) {
        const tokens = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = '';

        for (let i = 0; i < condition.length; i++) {
            const char = condition[i];

            if ((char === '"' || char === "'") && (i === 0 || condition[i-1] !== '\\')) {
                if (!inQuotes) {
                    inQuotes = true;
                    quoteChar = char;
                    if (current.trim()) {
                        tokens.push(current.trim());
                        current = '';
                    }
                } else if (char === quoteChar) {
                    inQuotes = false;
                    tokens.push(current);
                    current = '';
                    continue;
                }
            } else if (!inQuotes && '()=!><'.includes(char)) {
                if (current.trim()) {
                    tokens.push(current.trim());
                    current = '';
                }
                // Handle compound operators
                if (char === '!' && i + 1 < condition.length && condition[i+1] === '=') {
                    tokens.push('!=');
                    i++; // Skip next character
                } else if (char === '<' && i + 1 < condition.length && condition[i+1] === '=') {
                    tokens.push('<=');
                    i++;
                } else if (char === '>' && i + 1 < condition.length && condition[i+1] === '=') {
                    tokens.push('>=');
                    i++;
                } else {
                    tokens.push(char);
                }
            } else if (!inQuotes && char === ' ') {
                if (current.trim()) {
                    tokens.push(current.trim());
                    current = '';
                }
            } else {
                current += char;
            }
        }

        if (current.trim()) {
            tokens.push(current.trim());
        }

        return tokens.filter(t => t !== '');
    }

    parseCondition(tokens) {
        let index = 0;

        const parseExpression = () => {
            let left = parseTerm();

            while (index < tokens.length && (tokens[index] === 'AND' || tokens[index] === 'OR')) {
                const operator = tokens[index++];
                const right = parseTerm();
                left = { type: 'binary', operator, left, right };
            }

            return left;
        };

        const parseTerm = () => {
            if (tokens[index] === 'NOT') {
                index++;
                const expr = parseTerm();
                return { type: 'not', expr };
            }

            if (tokens[index] === '(') {
                index++;
                const expr = parseExpression();
                if (tokens[index++] !== ')') throw new Error('Missing closing parenthesis');
                return expr;
            }

            return parseComparison();
        };

        const parseComparison = () => {
            const left = tokens[index++];
            
            if (index >= tokens.length) throw new Error('Incomplete comparison');

            const operator = tokens[index++];
            if (!['=', '!=', '>', '>=', '<', '<='].includes(operator)) {
                throw new Error(`Invalid operator: ${operator}`);
            }

            if (index >= tokens.length) throw new Error('Missing value after operator');

            const right = tokens[index++];
            
            return { type: 'comparison', operator, left, right };
        };

        const result = parseExpression();
        
        if (index < tokens.length) {
            throw new Error('Unexpected tokens at end of condition');
        }

        return result;
    }

    evaluateCondition(node, row, columns) {
        switch (node.type) {
            case 'comparison':
                return this.evaluateComparison(node, row, columns);
            case 'binary':
                const left = this.evaluateCondition(node.left, row, columns);
                const right = this.evaluateCondition(node.right, row, columns);
                return node.operator === 'AND' ? (left && right) : (left || right);
            case 'not':
                return !this.evaluateCondition(node.expr, row, columns);
            default:
                return false;
        }
    }

    evaluateComparison(node, row, columns) {
        const columnIndex = columns.indexOf(node.left);
        if (columnIndex === -1) throw new Error(`Column not found: ${node.left}`);

        const cellValue = row[columnIndex];
        const comparisonValue = this.parseValue(node.right);

        switch (node.operator) {
            case '=': return this.valuesEqual(cellValue, comparisonValue);
            case '!=': return !this.valuesEqual(cellValue, comparisonValue);
            case '>': return this.compareValues(cellValue, comparisonValue) > 0;
            case '>=': return this.compareValues(cellValue, comparisonValue) >= 0;
            case '<': return this.compareValues(cellValue, comparisonValue) < 0;
            case '<=': return this.compareValues(cellValue, comparisonValue) <= 0;
            default: return false;
        }
    }

    compareValues(a, b) {
        // Handle null values
        if (a === null && b === null) return 0;
        if (a === null) return -1;
        if (b === null) return 1;

        // Handle numeric comparison
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        }

        // Handle string comparison
        if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b);
        }

        // Mixed types - convert to string for comparison
        return String(a).localeCompare(String(b));
    }

    // Enhanced Result Display
    displayResult(columns, data, title, rowCount) {
        this.resultTable.innerHTML = `
            <thead>
                <tr>
                    ${columns.map(col => `<th>${this.escapeHtml(col)}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${data.length > 0 ? data.map(row => `
                    <tr>
                        ${row.map(cell => `<td>${this.escapeHtml(this.formatCellValue(cell))}</td>`).join('')}
                    </tr>
                `).join('') : `
                    <tr>
                        <td colspan="${columns.length}" style="text-align: center; color: var(--text-muted); padding: 40px;">
                            <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                            No rows match the criteria
                        </td>
                    </tr>
                `}
            </tbody>
        `;

        this.operationIndicator.textContent = title;
        this.resultStats.textContent = `${rowCount} row${rowCount !== 1 ? 's' : ''}`;
        this.resultPanel.style.display = 'block';
        
        // Store current result for saving
        this.currentResult = { columns, data, title };
        
        // Scroll to result with smooth animation
        setTimeout(() => {
            this.resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }

    clearResult() {
        this.resultPanel.style.display = 'none';
        this.operationParams.innerHTML = '';
        this.currentOperation = null;
        this.currentResult = null;
    }

    saveResultAsTable() {
        if (!this.currentResult) {
            this.showNotification('No result to save', 'error');
            return;
        }

        const tableName = `Result_${this.nextTableId++}`;
        this.tables[tableName] = {
            columns: this.currentResult.columns,
            data: this.currentResult.data,
            schema: this.inferSchema(this.currentResult.columns, this.currentResult.data),
            createdAt: new Date().toISOString()
        };

        this.updateTableDropdown();
        this.renderTables();
        this.updateStats();
        this.showNotification(`Result saved as table "${tableName}"`, 'success');
    }

    inferSchema(columns, data) {
        const schema = {};
        columns.forEach(col => {
            schema[col] = { type: 'unknown', nullable: false };
        });

        data.forEach(row => {
            row.forEach((cell, index) => {
                const col = columns[index];
                if (cell === null) {
                    schema[col].nullable = true;
                } else {
                    const type = this.detectValueType(cell);
                    if (schema[col].type === 'unknown') {
                        schema[col].type = type;
                    } else if (schema[col].type !== type) {
                        schema[col].type = 'string';
                    }
                }
            });
        });

        return schema;
    }

    // Enhanced Sample Data with Proper Schema
    addSampleData() {
        this.tables = {
            'Students': {
                columns: ['StudentID', 'Name', 'Major', 'GPA', 'Year'],
                data: [
                    [1, 'Alice Johnson', 'Computer Science', 3.8, 'Senior'],
                    [2, 'Bob Smith', 'Mathematics', 3.5, 'Junior'],
                    [3, 'Charlie Brown', 'Physics', 3.2, 'Sophomore'],
                    [4, 'Diana Davis', 'Computer Science', 3.9, 'Senior'],
                    [5, 'Eve Wilson', 'Mathematics', 3.7, 'Junior'],
                    [6, 'Frank Miller', 'Computer Science', 3.4, 'Freshman']
                ],
                schema: {
                    'StudentID': { type: 'number', nullable: false },
                    'Name': { type: 'string', nullable: false },
                    'Major': { type: 'string', nullable: false },
                    'GPA': { type: 'number', nullable: false },
                    'Year': { type: 'string', nullable: false }
                },
                createdAt: new Date().toISOString()
            },
            'Courses': {
                columns: ['CourseID', 'CourseName', 'Department', 'Credits'],
                data: [
                    ['CS101', 'Introduction to Programming', 'Computer Science', 4],
                    ['CS102', 'Data Structures', 'Computer Science', 4],
                    ['MATH201', 'Calculus I', 'Mathematics', 3],
                    ['MATH202', 'Linear Algebra', 'Mathematics', 3],
                    ['PHYS101', 'Classical Mechanics', 'Physics', 4],
                    ['CS201', 'Algorithms', 'Computer Science', 4]
                ],
                schema: {
                    'CourseID': { type: 'string', nullable: false },
                    'CourseName': { type: 'string', nullable: false },
                    'Department': { type: 'string', nullable: false },
                    'Credits': { type: 'number', nullable: false }
                },
                createdAt: new Date().toISOString()
            },
            'Enrollments': {
                columns: ['EnrollmentID', 'StudentID', 'CourseID', 'Grade', 'Semester'],
                data: [
                    [1, 1, 'CS101', 'A', 'Fall 2024'],
                    [2, 1, 'CS102', 'B+', 'Spring 2024'],
                    [3, 2, 'MATH201', 'A-', 'Fall 2024'],
                    [4, 3, 'CS101', 'C+', 'Fall 2024'],
                    [5, 4, 'CS101', 'A', 'Fall 2024'],
                    [6, 4, 'CS102', 'A-', 'Spring 2024'],
                    [7, 5, 'MATH201', 'B', 'Fall 2024'],
                    [8, 6, 'CS101', 'B-', 'Fall 2024'],
                    [9, 2, 'MATH202', 'A', 'Spring 2024'],
                    [10, 5, 'CS201', 'B+', 'Spring 2024']
                ],
                schema: {
                    'EnrollmentID': { type: 'number', nullable: false },
                    'StudentID': { type: 'number', nullable: false },
                    'CourseID': { type: 'string', nullable: false },
                    'Grade': { type: 'string', nullable: false },
                    'Semester': { type: 'string', nullable: false }
                },
                createdAt: new Date().toISOString()
            }
        };

        this.updateTableDropdown();
        this.renderTables();
        this.updateStats();
        this.showNotification('Sample data loaded successfully! Try: SELECT Students WHERE GPA > 3.5', 'success');
    }

    // Utility Methods
    clearForm() {
        this.tableNameInput.value = '';
        this.columnsInput.value = '';
        this.dataInput.value = '';
        this.tableNameInput.focus();
    }

    updateStats() {
        this.tableCount.textContent = Object.keys(this.tables).length;
        this.resultCount.textContent = this.operationCount;
    }

    incrementOperationCount() {
        this.operationCount++;
        this.updateStats();
    }

    formatCellValue(value) {
        if (value === null || value === undefined) return 'NULL';
        if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
        if (typeof value === 'number' && Number.isInteger(value)) return value.toString();
        if (typeof value === 'number') return value.toFixed(2);
        return String(value);
    }

    // History Management
    addToHistory(operation, details, rowCount) {
        const historyItem = {
            id: Date.now(),
            operation,
            details,
            rowCount,
            timestamp: new Date().toLocaleTimeString()
        };

        this.operationHistory.unshift(historyItem);
        if (this.operationHistory.length > 10) {
            this.operationHistory = this.operationHistory.slice(0, 10);
        }

        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = this.operationHistory.map(item => `
            <div class="history-item">
                <div>
                    <div class="history-op">${item.operation}</div>
                    <div class="history-details">${this.escapeHtml(item.details)}</div>
                </div>
                <div>
                    <div class="history-time">${item.timestamp}</div>
                    <div style="color: var(--text-muted); font-size: 0.8rem;">${item.rowCount} rows</div>
                </div>
            </div>
        `).join('');
    }

    clearHistory() {
        this.operationHistory = [];
        this.renderHistory();
        this.showNotification('Operation history cleared', 'info');
    }

    // Enhanced UI Interactions
    showLoading() {
        this.loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }

    toggleTablesView() {
        const tablesContainer = this.tablesContainer;
        tablesContainer.classList.toggle('expanded');
        
        if (tablesContainer.classList.contains('expanded')) {
            tablesContainer.style.gridTemplateColumns = '1fr';
            this.toggleTablesBtn.innerHTML = '<i class="fas fa-compress"></i> Normal View';
        } else {
            tablesContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(380px, 1fr))';
            this.toggleTablesBtn.innerHTML = '<i class="fas fa-expand"></i> Expand View';
        }
    }

    exportResult() {
        if (!this.currentResult) {
            this.showNotification('No result to export', 'error');
            return;
        }

        const { columns, data } = this.currentResult;
        let csvContent = columns.join(',') + '\n';
        csvContent += data.map(row => 
            row.map(cell => {
                if (cell === null) return '';
                if (typeof cell === 'string') return `"${cell.replace(/"/g, '""')}"`;
                return String(cell);
            }).join(',')
        ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relational_algebra_result.csv';
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Result exported as CSV', 'success');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    this.tableNameInput.focus();
                    break;
                case 'd':
                    e.preventDefault();
                    this.addSampleData();
                    break;
                case 'Escape':
                    this.clearResult();
                    break;
                case 'h':
                    e.preventDefault();
                    this.clearHistory();
                    break;
            }
        }
    }

    // Security utilities
    escapeHtml(str) {
        if (str === null || str === undefined) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    escapeJsString(s) {
        return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    }
}

// Initialize the application
let visualizer;
document.addEventListener('DOMContentLoaded', () => {
    visualizer = new RelationalAlgebraVisualizer();
});

// Add global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    if (visualizer) {
        visualizer.showNotification('An unexpected error occurred. Check console for details.', 'error');
    }
});