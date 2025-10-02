let entities = [];
let attributes = [];
let relationships = [];
let currentElement = null;
let selectedElement = null;
let draggedElement = null;
let offsetX = 0, offsetY = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupDragAndDrop();
}

function setupEventListeners() {
    // Help Modal
    const helpButton = document.getElementById('helpButton');
    const modal = document.getElementById('helpModal');
    const closeButton = document.querySelector('.close');

    helpButton.addEventListener('click', function() {
        modal.style.display = 'flex';
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function setupDragAndDrop() {
    // Drag from sidebar
    document.querySelectorAll('.tool-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('toolType', e.target.dataset.type);
        });
    });

    const canvas = document.getElementById('canvas');
    canvas.addEventListener('dragover', (e) => e.preventDefault());
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const toolType = e.dataTransfer.getData('toolType');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (toolType === 'entity') {
            createEntity(x, y);
        } else if (toolType.startsWith('attribute')) {
            const attrType = toolType.replace('attribute-', '');
            createAttribute(x, y, attrType);
        } else if (toolType === 'relationship') {
            createRelationship(x, y);
        }
    });
}

function createEntity(x, y) {
    currentElement = {
        type: 'entity',
        x: x,
        y: y,
        name: '',
        attributes: [],
        pk: ''
    };
    document.getElementById('entityModal').classList.add('active');
}

function saveEntity() {
    const name = document.getElementById('entityName').value.trim();
    const attrs = document.getElementById('entityAttributes').value.trim();
    const pk = document.getElementById('entityPK').value.trim();

    if (!name) {
        alert('Please enter entity name');
        return;
    }

    currentElement.name = name;
    currentElement.attributes = attrs ? attrs.split(',').map(a => a.trim()) : [];
    currentElement.pk = pk;
    currentElement.id = 'entity_' + Date.now();

    const entityDiv = document.createElement('div');
    entityDiv.className = 'entity';
    entityDiv.id = currentElement.id;
    entityDiv.style.left = currentElement.x + 'px';
    entityDiv.style.top = currentElement.y + 'px';
    entityDiv.innerHTML = `
        <div class="entity-name">${name}</div>
        <div style="font-size: 11px; color: #666;">${currentElement.attributes.join(', ')}</div>
    `;

    entityDiv.addEventListener('mousedown', startDrag);
    entityDiv.addEventListener('click', selectElement);
    canvas.appendChild(entityDiv);

    entities.push(currentElement);
    closeModal();
    updateEntitySelects();
}

function createAttribute(x, y, type) {
    currentElement = {
        type: 'attribute',
        subtype: type,
        x: x,
        y: y,
        name: '',
        isKey: false
    };
    document.getElementById('attributeModal').classList.add('active');
}

function saveAttribute() {
    const name = document.getElementById('attributeName').value.trim();
    const isKey = document.getElementById('attrKey').checked;

    if (!name) {
        alert('Please enter attribute name');
        return;
    }

    currentElement.name = name;
    currentElement.isKey = isKey;
    currentElement.id = 'attr_' + Date.now();

    const attrDiv = document.createElement('div');
    attrDiv.className = 'attribute ' + currentElement.subtype;
    if (isKey) attrDiv.classList.add('key');
    attrDiv.id = currentElement.id;
    attrDiv.style.left = currentElement.x + 'px';
    attrDiv.style.top = currentElement.y + 'px';
    attrDiv.textContent = name;

    attrDiv.addEventListener('mousedown', startDrag);
    attrDiv.addEventListener('click', selectElement);
    canvas.appendChild(attrDiv);

    attributes.push(currentElement);
    closeModal();
}

function createRelationship(x, y) {
    currentElement = {
        type: 'relationship',
        x: x,
        y: y,
        name: '',
        entity1: null,
        entity2: null,
        cardinality1: '1',
        cardinality2: '1',
        participation1: 'partial',
        participation2: 'partial'
    };
    updateEntitySelects();
    document.getElementById('relationshipModal').classList.add('active');
}

function updateEntitySelects() {
    const select1 = document.getElementById('entity1Select');
    const select2 = document.getElementById('entity2Select');
    select1.innerHTML = '<option value="">Select Entity</option>';
    select2.innerHTML = '<option value="">Select Entity</option>';

    entities.forEach(entity => {
        const option1 = document.createElement('option');
        option1.value = entity.id;
        option1.textContent = entity.name;
        const option2 = option1.cloneNode(true);
        select1.appendChild(option1);
        select2.appendChild(option2);
    });
}

function saveRelationship() {
    const name = document.getElementById('relationshipName').value.trim();
    const entity1Id = document.getElementById('entity1Select').value;
    const entity2Id = document.getElementById('entity2Select').value;
    const card1 = document.getElementById('cardinality1').value;
    const card2 = document.getElementById('cardinality2').value;
    const part1 = document.getElementById('participation1').value;
    const part2 = document.getElementById('participation2').value;

    if (!name || !entity1Id || !entity2Id) {
        alert('Please fill all required fields');
        return;
    }

    if (entity1Id === entity2Id) {
        alert('Please select two different entities');
        return;
    }

    currentElement.name = name;
    currentElement.entity1 = entity1Id;
    currentElement.entity2 = entity2Id;
    currentElement.cardinality1 = card1;
    currentElement.cardinality2 = card2;
    currentElement.participation1 = part1;
    currentElement.participation2 = part2;
    currentElement.id = 'rel_' + Date.now();

    const relDiv = document.createElement('div');
    relDiv.className = 'relationship';
    relDiv.id = currentElement.id;
    relDiv.style.left = currentElement.x + 'px';
    relDiv.style.top = currentElement.y + 'px';
    relDiv.innerHTML = `<div class="relationship-label">${name}</div>`;

    relDiv.addEventListener('mousedown', startDrag);
    relDiv.addEventListener('click', selectElement);
    canvas.appendChild(relDiv);

    relationships.push(currentElement);
    closeModal();
    drawConnections();
}

function startDrag(e) {
    if (e.target.tagName === 'INPUT') return;
    draggedElement = e.currentTarget;
    const rect = draggedElement.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
    if (!draggedElement) return;
    const canvasRect = canvas.getBoundingClientRect();
    let x = e.clientX - canvasRect.left - offsetX;
    let y = e.clientY - canvasRect.top - offsetY;

    // Boundary checking
    x = Math.max(0, Math.min(x, canvasRect.width - draggedElement.offsetWidth));
    y = Math.max(0, Math.min(y, canvasRect.height - draggedElement.offsetHeight));

    draggedElement.style.left = x + 'px';
    draggedElement.style.top = y + 'px';

    // Update position in data
    const id = draggedElement.id;
    const entity = entities.find(e => e.id === id);
    const attr = attributes.find(a => a.id === id);
    const rel = relationships.find(r => r.id === id);

    if (entity) {
        entity.x = x;
        entity.y = y;
    } else if (attr) {
        attr.x = x;
        attr.y = y;
    } else if (rel) {
        rel.x = x;
        rel.y = y;
    }

    drawConnections();
}

function stopDrag() {
    draggedElement = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

function selectElement(e) {
    if (selectedElement) {
        selectedElement.classList.remove('selected');
    }
    selectedElement = e.currentTarget;
    selectedElement.classList.add('selected');
}

function deleteSelected() {
    if (!selectedElement) {
        alert('Please select an element to delete');
        return;
    }

    const id = selectedElement.id;
    entities = entities.filter(e => e.id !== id);
    attributes = attributes.filter(a => a.id !== id);
    relationships = relationships.filter(r => r.id !== id);

    selectedElement.remove();
    selectedElement = null;
    drawConnections();
}

function drawConnections() {
    const svg = document.getElementById('connectionsSvg');
    svg.innerHTML = '';

    relationships.forEach(rel => {
        const entity1 = document.getElementById(rel.entity1);
        const entity2 = document.getElementById(rel.entity2);
        const relDiv = document.getElementById(rel.id);

        if (entity1 && entity2 && relDiv) {
            const rect1 = entity1.getBoundingClientRect();
            const rect2 = entity2.getBoundingClientRect();
            const rectRel = relDiv.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();

            const x1 = rect1.left + rect1.width / 2 - canvasRect.left;
            const y1 = rect1.top + rect1.height / 2 - canvasRect.top;
            const x2 = rect2.left + rect2.width / 2 - canvasRect.left;
            const y2 = rect2.top + rect2.height / 2 - canvasRect.top;
            const xRel = rectRel.left + rectRel.width / 2 - canvasRect.left;
            const yRel = rectRel.top + rectRel.height / 2 - canvasRect.top;

            // Line from entity1 to relationship
            const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line1.setAttribute('x1', x1);
            line1.setAttribute('y1', y1);
            line1.setAttribute('x2', xRel);
            line1.setAttribute('y2', yRel);
            line1.setAttribute('class', 'connection-line');
            if (rel.participation1 === 'total') {
                line1.setAttribute('stroke-width', '4');
            }
            svg.appendChild(line1);

            // Line from relationship to entity2
            const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line2.setAttribute('x1', xRel);
            line2.setAttribute('y1', yRel);
            line2.setAttribute('x2', x2);
            line2.setAttribute('y2', y2);
            line2.setAttribute('class', 'connection-line');
            if (rel.participation2 === 'total') {
                line2.setAttribute('stroke-width', '4');
            }
            svg.appendChild(line2);

            // Add cardinality labels
            addCardinalityLabel(x1, y1, xRel, yRel, rel.cardinality1);
            addCardinalityLabel(x2, y2, xRel, yRel, rel.cardinality2);
        }
    });
}

function addCardinalityLabel(x1, y1, x2, y2, cardinality) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    const label = document.createElement('div');
    label.className = 'cardinality-label';
    label.textContent = cardinality === '1' ? '1' : 'N';
    label.style.left = (midX - 10) + 'px';
    label.style.top = (midY - 10) + 'px';
    
    document.getElementById('canvas').appendChild(label);
}

function generateSchema() {
    if (entities.length === 0) {
        alert('Please create at least one entity first');
        return;
    }

    let schema = '═══════════════════════════════════════\n';
    schema += '         RELATIONAL SCHEMA\n';
    schema += '═══════════════════════════════════════\n\n';

    // Generate entity tables
    entities.forEach(entity => {
        schema += `TABLE: ${entity.name}\n`;
        schema += '─────────────────────────────\n';
        
        if (entity.attributes.length > 0) {
            entity.attributes.forEach(attr => {
                const isPK = attr === entity.pk;
                schema += `  • ${attr}${isPK ? ' [PRIMARY KEY]' : ''}\n`;
            });
        }

        // Add foreign keys from relationships
        relationships.forEach(rel => {
            if (rel.entity1 === entity.id || rel.entity2 === entity.id) {
                const isEntity1 = rel.entity1 === entity.id;
                const card1 = rel.cardinality1;
                const card2 = rel.cardinality2;
                
                // N:1 or N:M relationship
                if ((isEntity1 && card1 === 'N' && card2 === '1') || 
                    (!isEntity1 && card2 === 'N' && card1 === '1')) {
                    const otherEntity = entities.find(e => 
                        e.id === (isEntity1 ? rel.entity2 : rel.entity1)
                    );
                    if (otherEntity) {
                        schema += `  • ${otherEntity.name}_${otherEntity.pk} [FOREIGN KEY → ${otherEntity.name}]\n`;
                    }
                }
            }
        });

        schema += '\n';
    });

    // Generate relationship tables for M:N
    const manyToManyRels = relationships.filter(r => r.cardinality1 === 'N' && r.cardinality2 === 'N');
    if (manyToManyRels.length > 0) {
        schema += 'MANY-TO-MANY RELATIONSHIP TABLES:\n';
        schema += '─────────────────────────────\n\n';
        
        manyToManyRels.forEach(rel => {
            const entity1 = entities.find(e => e.id === rel.entity1);
            const entity2 = entities.find(e => e.id === rel.entity2);
            
            if (entity1 && entity2) {
                schema += `TABLE: ${rel.name}\n`;
                schema += '─────────────────────────────\n';
                schema += `  • ${entity1.name}_${entity1.pk} [PRIMARY KEY, FOREIGN KEY → ${entity1.name}]\n`;
                schema += `  • ${entity2.name}_${entity2.pk} [PRIMARY KEY, FOREIGN KEY → ${entity2.name}]\n`;
                schema += '\n';
            }
        });
    }

    schema += '═══════════════════════════════════════\n';
    schema += `Total Tables: ${entities.length + manyToManyRels.length}\n`;
    schema += '═══════════════════════════════════════';

    document.getElementById('schemaOutput').textContent = schema;
    document.getElementById('schemaModal').classList.add('active');
}

function clearCanvas() {
    if (confirm('Are you sure you want to clear the entire canvas?')) {
        const canvas = document.getElementById('canvas');
        canvas.innerHTML = '';
        entities = [];
        attributes = [];
        relationships = [];
        selectedElement = null;
        
        const svg = document.getElementById('connectionsSvg');
        svg.innerHTML = '';
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Reset form fields
    document.getElementById('entityName').value = '';
    document.getElementById('entityAttributes').value = '';
    document.getElementById('entityPK').value = '';
    document.getElementById('attributeName').value = '';
    document.getElementById('attrKey').checked = false;
    document.getElementById('relationshipName').value = '';
}

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});

// Redraw connections on window resize
window.addEventListener('resize', drawConnections);

// Click on canvas to deselect
document.getElementById('canvas').addEventListener('click', (e) => {
    if (e.target === document.getElementById('canvas')) {
        if (selectedElement) {
            selectedElement.classList.remove('selected');
            selectedElement = null;
        }
    }
});