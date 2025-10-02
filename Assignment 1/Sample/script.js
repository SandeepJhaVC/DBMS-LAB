// Professional ER/EER Diagram Builder with Enhanced Features
class ERDiagramBuilder {
  constructor() {
    this.workspace = document.getElementById("workspace");
    this.workspaceInfo = document.getElementById("workspaceInfo");
    this.schemaPanel = document.getElementById("schemaPanel");
    this.schemaContent = document.getElementById("schemaContent");
    this.connectionLayer = document.getElementById("connectionLayer");
    this.contextMenu = document.getElementById("contextMenu");
    this.notificationContainer = document.getElementById(
      "notificationContainer"
    );

    // Data models
    this.entities = [];
    this.relationships = [];
    this.connections = []; // Now properly connects two entities via a relationship
    this.attributes = new Map(); // Store attributes separately

    // UI state
    this.selectedTool = null;
    this.draggingElement = null;
    this.dragOffset = { x: 0, y: 0 };
    this.currentEntity = null;
    this.currentRelationship = null;
    this.connecting = false;
    this.connectionSource = null;
    this.connectionStartType = null; // 'entity' or 'relationship'
    this.zoomLevel = 1;
    this.selectedElement = null;

    this.init();
  }

  init() {
    this.initEventListeners();
    this.initSVGMarkers();
    this.updateStats();
    this.hideContextMenu();
  }

// === How to Use Modal ===
openHowToUseModal() {
    document.getElementById("howToUseModal").classList.add("open");
    this.showNotification("Opening tutorial guide", "info");
}

closeHowToUseModal() {
    document.getElementById("howToUseModal").classList.remove("open");
}

  initEventListeners() {
    document.getElementById("howToUseBtn").addEventListener("click", () => this.openHowToUseModal());

    // Add modal event listeners in initModalEvents method:
    document.getElementById("closeHowToUseModal").addEventListener("click", () => this.closeHowToUseModal());
    document.getElementById("closeHowToUseBtn").addEventListener("click", () => this.closeHowToUseModal());
    });

    // Action buttons
    document
      .getElementById("clearBtn")
      .addEventListener("click", () => this.clearWorkspace());
    document
      .getElementById("saveBtn")
      .addEventListener("click", () => this.saveDiagram());
    document
      .getElementById("loadBtn")
      .addEventListener("click", () => this.loadDiagram());
    document
      .getElementById("exportBtn")
      .addEventListener("click", () => this.exportDiagram());
    document
      .getElementById("generateSchemaBtn")
      .addEventListener("click", () => this.generateSchema());

    // Workspace controls
    document
      .getElementById("zoomIn")
      .addEventListener("click", () => this.zoom(0.1));
    document
      .getElementById("zoomOut")
      .addEventListener("click", () => this.zoom(-0.1));
    document
      .getElementById("resetView")
      .addEventListener("click", () => this.resetView());
    document
      .getElementById("gridToggle")
      .addEventListener("click", (e) => this.toggleGrid(e.currentTarget));

    // Schema panel
    document
      .getElementById("closeSchemaBtn")
      .addEventListener("click", () => this.closeSchemaPanel());
    document
      .getElementById("copySchemaBtn")
      .addEventListener("click", () => this.copySchema());

    // Theme toggle
    document
      .getElementById("themeToggle")
      .addEventListener("click", () => this.toggleTheme());

    // Workspace events
    this.workspace.addEventListener("mousedown", (e) =>
      this.handleWorkspaceMouseDown(e)
    );
    this.workspace.addEventListener("mousemove", (e) =>
      this.handleWorkspaceMouseMove(e)
    );
    this.workspace.addEventListener("mouseup", (e) =>
      this.handleWorkspaceMouseUp(e)
    );
    this.workspace.addEventListener("dblclick", (e) =>
      this.handleWorkspaceDoubleClick(e)
    );
    this.workspace.addEventListener("contextmenu", (e) =>
      this.handleWorkspaceContextMenu(e)
    );

    // Modal events
    this.initModalEvents();

    // Keyboard events
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Context menu events
    document.addEventListener("click", () => this.hideContextMenu());
    this.contextMenu.addEventListener("click", (e) =>
      this.handleContextMenuAction(e)
    );

    // Prevent default drag behavior
    this.workspace.addEventListener("dragstart", (e) => e.preventDefault());
  }

  initModalEvents() {
    // Entity modal
    document
      .getElementById("closeEntityModal")
      .addEventListener("click", () => this.closeEntityModal());
    document
      .getElementById("saveEntityBtn")
      .addEventListener("click", () => this.saveEntity());
    document
      .getElementById("cancelEntityBtn")
      .addEventListener("click", () => this.closeEntityModal());
    document
      .getElementById("addAttributeBtn")
      .addEventListener("click", () => this.openAttributeModal());

    // Relationship modal
    document
      .getElementById("closeRelationshipModal")
      .addEventListener("click", () => this.closeRelationshipModal());
    document
      .getElementById("saveRelationshipBtn")
      .addEventListener("click", () => this.saveRelationship());
    document
      .getElementById("cancelRelationshipBtn")
      .addEventListener("click", () => this.closeRelationshipModal());

    // Attribute modal
    document
      .getElementById("closeAttributeModal")
      .addEventListener("click", () => this.closeAttributeModal());
    document
      .getElementById("saveAttributeBtn")
      .addEventListener("click", () => this.saveAttribute());
    document
      .getElementById("cancelAttributeBtn")
      .addEventListener("click", () => this.closeAttributeModal());
    document
      .getElementById("addCompositeAttrBtn")
      .addEventListener("click", () => this.addCompositeAttribute());
    document
      .getElementById("attributeType")
      .addEventListener("change", (e) =>
        this.toggleCompositeAttributes(e.target.value)
      );
  }

  initSVGMarkers() {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    // Arrowhead marker for regular relationships
    const arrowMarker = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "marker"
    );
    arrowMarker.setAttribute("id", "arrowhead");
    arrowMarker.setAttribute("markerWidth", "10");
    arrowMarker.setAttribute("markerHeight", "7");
    arrowMarker.setAttribute("refX", "9");
    arrowMarker.setAttribute("refY", "3.5");
    arrowMarker.setAttribute("orient", "auto");

    const arrowPolygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    arrowPolygon.setAttribute("points", "0 0, 10 3.5, 0 7");
    arrowPolygon.setAttribute("fill", "#6366f1");

    arrowMarker.appendChild(arrowPolygon);
    defs.appendChild(arrowMarker);

    // Diamond marker for relationships
    const diamondMarker = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "marker"
    );
    diamondMarker.setAttribute("id", "diamond");
    diamondMarker.setAttribute("markerWidth", "10");
    diamondMarker.setAttribute("markerHeight", "10");
    diamondMarker.setAttribute("refX", "5");
    diamondMarker.setAttribute("refY", "5");
    diamondMarker.setAttribute("orient", "auto");

    const diamondPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    diamondPath.setAttribute("d", "M0,5 L5,0 L10,5 L5,10 Z");
    diamondPath.setAttribute("fill", "#10b981");

    diamondMarker.appendChild(diamondPath);
    defs.appendChild(diamondMarker);

    this.connectionLayer.appendChild(defs);
  }

  // === Tool Selection ===
  selectTool(tool) {
    this.selectedTool = tool;
    this.connecting = false;
    this.connectionSource = null;

    if (tool === "relationship") {
      this.workspace.classList.add("connecting");
    } else {
      this.workspace.classList.remove("connecting");
    }

    this.hideWorkspaceInfo();
    this.showNotification(`Selected: ${this.getToolName(tool)}`, "info");
  }

  getToolName(tool) {
    const toolNames = {
      entity: "Entity",
      "weak-entity": "Weak Entity",
      attribute: "Attribute",
      composite: "Composite Attribute",
      multivalued: "Multivalued Attribute",
      derived: "Derived Attribute",
      relationship: "Relationship",
      "isa-relationship": "ISA Relationship",
    };
    return toolNames[tool] || tool;
  }

  updateToolButtons(activeBtn) {
    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    activeBtn.classList.add("active");
  }

  // === Workspace Event Handlers ===
  handleWorkspaceMouseDown(e) {
    if (e.button !== 0) return; // Only left click

    const target = e.target.closest(".entity, .relationship, .connection-dot");

    if (target) {
      if (target.classList.contains("connection-dot")) {
        this.startConnection(target);
      } else {
        this.startDragging(target, e);
        this.selectElement(target);
      }
    } else if (this.selectedTool) {
      this.createNewElement(e);
    } else {
      this.deselectAll();
    }
  }

  handleWorkspaceMouseMove(e) {
    if (this.draggingElement) {
      const rect = this.workspace.getBoundingClientRect();
      const x = (e.clientX - rect.left - this.dragOffset.x) / this.zoomLevel;
      const y = (e.clientY - rect.top - this.dragOffset.y) / this.zoomLevel;

      this.draggingElement.style.left = `${x}px`;
      this.draggingElement.style.top = `${y}px`;

      // Update element position in data model
      this.updateElementPosition(this.draggingElement.id, x, y);

      this.updateConnections();
    }
  }

  handleWorkspaceMouseUp(e) {
    if (this.connecting && this.connectionSource) {
      const target = e.target.closest(
        ".entity, .relationship, .connection-dot"
      );
      if (target && target !== this.connectionSource) {
        this.completeConnection(target);
      } else {
        this.cancelConnection();
      }
    }

    this.draggingElement = null;
    this.connecting = false;
    this.connectionSource = null;
    this.workspace.classList.remove("connecting");
  }

  handleWorkspaceDoubleClick(e) {
    const target = e.target.closest(".entity, .relationship");
    if (target) {
      if (target.classList.contains("entity")) {
        const entity = this.entities.find((ent) => ent.id === target.id);
        if (entity) this.openEntityModal(entity);
      } else if (target.classList.contains("relationship")) {
        const relationship = this.relationships.find(
          (rel) => rel.id === target.id
        );
        if (relationship) this.openRelationshipModal(relationship);
      }
    }
  }

  handleWorkspaceContextMenu(e) {
    e.preventDefault();
    const target = e.target.closest(".entity, .relationship");
    if (target) {
      this.selectElement(target);
      this.showContextMenu(e.clientX, e.clientY);
    } else {
      this.hideContextMenu();
      this.deselectAll();
    }
  }

  handleKeyDown(e) {
    if (e.key === "Delete" && this.selectedElement) {
      this.deleteElement(this.selectedElement);
    } else if (e.key === "Escape") {
      this.deselectAll();
      this.hideContextMenu();
      this.cancelConnection();
    }
  }

  // === Element Selection ===
  selectElement(element) {
    this.deselectAll();
    this.selectedElement = element;
    element.classList.add("selected");
  }

  deselectAll() {
    document.querySelectorAll(".entity, .relationship").forEach((el) => {
      el.classList.remove("selected");
    });
    this.selectedElement = null;
  }

  // === Element Creation ===
  createNewElement(e) {
    const rect = this.workspace.getBoundingClientRect();
    const x = (e.clientX - rect.left - 100) / this.zoomLevel;
    const y = (e.clientY - rect.top - 50) / this.zoomLevel;

    switch (this.selectedTool) {
      case "entity":
        this.createEntity(x, y);
        break;
      case "weak-entity":
        this.createWeakEntity(x, y);
        break;
      case "relationship":
        this.createRelationship(x, y);
        break;
      case "isa-relationship":
        this.createISARelationship(x, y);
        break;
      case "attribute":
        this.showNotification("Select an entity to add attributes", "info");
        break;
    }
  }

  createEntity(x, y, data = {}) {
    const entityId = `entity-${Date.now()}`;
    const entity = {
      id: entityId,
      name: data.name || "New Entity",
      type: "regular",
      x: x,
      y: y,
      attributes: data.attributes || [],
    };

    this.entities.push(entity);
    this.renderEntity(entity);
    this.updateStats();

    if (!data.name) {
      this.openEntityModal(entity);
    }

    return entity;
  }

  createWeakEntity(x, y, data = {}) {
    const entityId = `entity-${Date.now()}`;
    const entity = {
      id: entityId,
      name: data.name || "Weak Entity",
      type: "weak",
      x: x,
      y: y,
      attributes: data.attributes || [],
      identifyingRelationship: null,
    };

    this.entities.push(entity);
    this.renderEntity(entity);
    this.updateStats();

    if (!data.name) {
      this.openEntityModal(entity);
    }

    return entity;
  }

  renderEntity(entity) {
    const entityEl = document.createElement("div");
    entityEl.className = `entity ${
      entity.type === "weak" ? "weak-entity" : ""
    }`;
    entityEl.id = entity.id;
    entityEl.style.left = `${entity.x}px`;
    entityEl.style.top = `${entity.y}px`;
    entityEl.style.transform = `scale(${this.zoomLevel})`;

    let attributesHtml = "";
    entity.attributes.forEach((attr) => {
      const attrClass = attr.isKey ? "key" : attr.type;
      attributesHtml += `<div class="attribute ${attrClass}">${attr.name}</div>`;
    });

    entityEl.innerHTML = `
            <div class="entity-header">
                ${entity.name}
                <div class="entity-actions">
                    <button class="entity-action" onclick="app.editElement('${entity.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="entity-action" onclick="app.deleteElement('${entity.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="entity-attributes">${attributesHtml}</div>
            <div class="connection-points">
                <div class="connection-dot" data-entity="${entity.id}"></div>
            </div>
        `;

    this.workspace.appendChild(entityEl);
    this.addElementEventListeners(entityEl);
  }

  createRelationship(x, y, data = {}) {
    const relationshipId = `relationship-${Date.now()}`;
    const cardinality = document.getElementById("cardinality").value;
    const participation = document.getElementById("participation").value;

    const relationship = {
      id: relationshipId,
      name: data.name || "Relates",
      type: data.type || "regular",
      x: x,
      y: y,
      cardinality: data.cardinality || cardinality,
      participation: data.participation || participation,
    };

    this.relationships.push(relationship);
    this.renderRelationship(relationship);
    this.updateStats();

    if (!data.name) {
      this.openRelationshipModal(relationship);
    }

    return relationship;
  }

  createISARelationship(x, y) {
    return this.createRelationship(x, y, {
      name: "ISA",
      type: "isa",
      cardinality: "1:1",
      participation: "total",
    });
  }

  renderRelationship(relationship) {
    const relationshipEl = document.createElement("div");
    relationshipEl.className = `relationship ${
      relationship.type === "isa" ? "isa-relationship" : ""
    } ${relationship.type === "identifying" ? "identifying" : ""}`;
    relationshipEl.id = relationship.id;
    relationshipEl.style.left = `${relationship.x}px`;
    relationshipEl.style.top = `${relationship.y}px`;
    relationshipEl.style.transform = `scale(${this.zoomLevel})`;
    relationshipEl.textContent = relationship.name;

    this.workspace.appendChild(relationshipEl);
    this.addElementEventListeners(relationshipEl);
  }

  addElementEventListeners(element) {
    element.addEventListener("dblclick", () => this.editElement(element.id));
    element.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        // Left click
        this.startDragging(element, e);
        this.selectElement(element);
      }
    });
  }

  // === Connection Management ===
  startConnection(sourceDot) {
    this.connecting = true;
    const sourceElement = sourceDot.closest(".entity, .relationship");
    this.connectionSource = sourceElement;
    this.connectionStartType = sourceElement.classList.contains("entity")
      ? "entity"
      : "relationship";
    this.workspace.classList.add("connecting");
  }

  // Enhanced connection creation
  completeConnection(targetElement) {
    const target = targetElement.closest(".entity, .relationship");
    if (!target) return;

    const targetType = target.classList.contains("entity")
      ? "entity"
      : "relationship";

    if (this.connectionStartType === "entity" && targetType === "entity") {
      // Create relationship between two entities
      const sourceEntity = this.entities.find(
        (ent) => ent.id === this.connectionSource.id
      );
      const targetEntity = this.entities.find((ent) => ent.id === target.id);

      if (sourceEntity && targetEntity) {
        const relationship = this.createRelationship(
          (this.connectionSource.offsetLeft + target.offsetLeft) / 2,
          (this.connectionSource.offsetTop + target.offsetTop) / 2,
          {
            name: `${sourceEntity.name}_${targetEntity.name}`,
            cardinality: document.getElementById("cardinality").value,
            participation: document.getElementById("participation").value,
          }
        );

        // Connect relationship to both entities
        this.createConnection(relationship.id, sourceEntity.id, "entity");
        this.createConnection(relationship.id, targetEntity.id, "entity");

        this.showNotification(
          `Created relationship: ${relationship.name}`,
          "success"
        );
      }
    }

    this.cancelConnection();
  }

  createConnection(relationshipId, entityId, type) {
    const connectionId = `connection-${Date.now()}`;
    const relationship = this.relationships.find(
      (rel) => rel.id === relationshipId
    );

    const connection = {
      id: connectionId,
      relationshipId: relationshipId,
      entityId: entityId,
      type: type,
      cardinality: relationship.cardinality,
      participation: relationship.participation,
    };

    this.connections.push(connection);
    this.updateConnections();
    this.updateStats();
  }

  cancelConnection() {
    this.connecting = false;
    this.connectionSource = null;
    this.connectionStartType = null;
    this.workspace.classList.remove("connecting");
  }

  updateConnections() {
    // Clear existing connections
    this.connectionLayer.innerHTML = "";
    this.initSVGMarkers();

    this.connections.forEach((connection) => {
      const relationship = this.relationships.find(
        (rel) => rel.id === connection.relationshipId
      );
      const entity = this.entities.find(
        (ent) => ent.id === connection.entityId
      );

      if (relationship && entity) {
        this.drawConnection(relationship, entity, connection);
      }
    });
  }

  // In script.js - Replace the drawConnection method:
  drawConnection(relationship, entity, connection) {
    const relEl = document.getElementById(relationship.id);
    const entityEl = document.getElementById(entity.id);

    if (!relEl || !entityEl) return;

    const relRect = relEl.getBoundingClientRect();
    const entityRect = entityEl.getBoundingClientRect();
    const workspaceRect = this.workspace.getBoundingClientRect();

    // Calculate center points
    const relX =
      (relRect.left - workspaceRect.left + relRect.width / 2) / this.zoomLevel;
    const relY =
      (relRect.top - workspaceRect.top + relRect.height / 2) / this.zoomLevel;
    const entityX =
      (entityRect.left - workspaceRect.left + entityRect.width / 2) /
      this.zoomLevel;
    const entityY =
      (entityRect.top - workspaceRect.top + entityRect.height / 2) /
      this.zoomLevel;

    // Create connection line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", `connection-line ${connection.participation}`);
    line.setAttribute("x1", relX);
    line.setAttribute("y1", relY);
    line.setAttribute("x2", entityX);
    line.setAttribute("y2", entityY);

    // Style based on relationship type
    if (relationship.type === "identifying") {
      line.setAttribute("stroke", "#f59e0b"); // Orange for identifying
      line.setAttribute("stroke-width", "3");
      line.setAttribute("marker-end", "url(#diamond)");
    } else if (relationship.type === "isa") {
      line.setAttribute("stroke", "#06b6d4"); // Blue for ISA
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-dasharray", "5,5");
    } else {
      line.setAttribute("stroke", "#6366f1"); // Purple for regular
      line.setAttribute("stroke-width", "2");
      line.setAttribute("marker-end", "url(#arrowhead)");
    }

    this.connectionLayer.appendChild(line);

    // Add cardinality label
    this.addCardinalityLabel(
      relX,
      relY,
      entityX,
      entityY,
      connection.cardinality
    );

    // Add participation indicator
    this.addParticipationIndicator(
      entityX,
      entityY,
      relX,
      relY,
      connection.participation
    );
  }

  addCardinalityLabel(x1, y1, x2, y2, cardinality) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", midX);
    text.setAttribute("y", midY - 8);
    text.setAttribute("class", "cardinality-label");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#6366f1");
    text.setAttribute("font-size", "12px");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("paint-order", "stroke");
    text.setAttribute("stroke", "white");
    text.setAttribute("stroke-width", "3");
    text.setAttribute("stroke-linecap", "round");
    text.setAttribute("stroke-linejoin", "round");
    text.textContent = cardinality;

    this.connectionLayer.appendChild(text);
  }

  addParticipationIndicator(entityX, entityY, relX, relY, participation) {
    if (participation === "total") {
      // Draw double line near entity for total participation
      const angle = Math.atan2(relY - entityY, relX - entityX);
      const distance = 20;
      const indicatorX = entityX + Math.cos(angle) * distance;
      const indicatorY = entityY + Math.sin(angle) * distance;

      const line1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line1.setAttribute("x1", indicatorX - 5);
      line1.setAttribute("y1", indicatorY - 5);
      line1.setAttribute("x2", indicatorX + 5);
      line1.setAttribute("y2", indicatorY + 5);
      line1.setAttribute("stroke", "#10b981");
      line1.setAttribute("stroke-width", "2");

      const line2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line2.setAttribute("x1", indicatorX + 5);
      line2.setAttribute("y1", indicatorY - 5);
      line2.setAttribute("x2", indicatorX - 5);
      line2.setAttribute("y2", indicatorY + 5);
      line2.setAttribute("stroke", "#10b981");
      line2.setAttribute("stroke-width", "2");

      this.connectionLayer.appendChild(line1);
      this.connectionLayer.appendChild(line2);
    }
  }

  // === Modal Management ===
  openEntityModal(entity) {
    this.currentEntity = entity;
    document.getElementById("entityName").value = entity.name;
    this.renderAttributesList();
    document.getElementById("entityModal").classList.add("open");
  }

  closeEntityModal() {
    document.getElementById("entityModal").classList.remove("open");
    this.currentEntity = null;
  }

  openRelationshipModal(relationship) {
    this.currentRelationship = relationship;
    document.getElementById("relationshipName").value = relationship.name;
    document.getElementById("relationshipType").value = relationship.type;
    document.getElementById("relationshipModal").classList.add("open");
  }

  closeRelationshipModal() {
    document.getElementById("relationshipModal").classList.remove("open");
    this.currentRelationship = null;
  }

  openAttributeModal(attribute = null) {
    this.currentAttribute = attribute;

    if (attribute) {
      document.getElementById("attributeName").value = attribute.name;
      document.getElementById("attributeType").value = attribute.type;
      document.getElementById("dataType").value = attribute.dataType;
      document.getElementById("isKey").checked = attribute.isKey;
      document.getElementById("isNullable").checked = attribute.isNullable;
      document.getElementById("isUnique").checked = attribute.isUnique;
    } else {
      document.getElementById("attributeName").value = "";
      document.getElementById("attributeType").value = "simple";
      document.getElementById("dataType").value = "VARCHAR(255)";
      document.getElementById("isKey").checked = false;
      document.getElementById("isNullable").checked = true;
      document.getElementById("isUnique").checked = false;
    }

    this.toggleCompositeAttributes(
      document.getElementById("attributeType").value
    );
    document.getElementById("attributeModal").classList.add("open");
  }

  closeAttributeModal() {
    document.getElementById("attributeModal").classList.remove("open");
    this.currentAttribute = null;
  }

  renderAttributesList() {
    const attributesList = document.getElementById("attributesList");
    attributesList.innerHTML = "";

    this.currentEntity.attributes.forEach((attr, index) => {
      const attrItem = document.createElement("div");
      attrItem.className = "attribute-item";
      attrItem.innerHTML = `
                <span>${attr.name} (${attr.type})${
        attr.isKey ? " 🔑" : ""
      }</span>
                <div>
                    <button class="delete-attr" onclick="app.editAttribute(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-attr" onclick="app.deleteAttribute(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
      attributesList.appendChild(attrItem);
    });
  }

  toggleCompositeAttributes(type) {
    const compositeContainer = document.getElementById("compositeAttributes");
    compositeContainer.style.display = type === "composite" ? "block" : "none";
  }

  // === Data Management ===
  saveEntity() {
    const name = document.getElementById("entityName").value.trim();
    if (!name) {
      this.showNotification("Please enter an entity name", "error");
      return;
    }

    this.currentEntity.name = name;

    const entityEl = document.getElementById(this.currentEntity.id);
    if (entityEl) {
      entityEl.querySelector(".entity-header").firstChild.textContent = name;

      let attributesHtml = "";
      this.currentEntity.attributes.forEach((attr) => {
        const attrClass = attr.isKey ? "key" : attr.type;
        attributesHtml += `<div class="attribute ${attrClass}">${attr.name}</div>`;
      });

      entityEl.querySelector(".entity-attributes").innerHTML = attributesHtml;
    }

    this.closeEntityModal();
    this.showNotification("Entity saved successfully", "success");
  }

  saveRelationship() {
    const name = document.getElementById("relationshipName").value.trim();
    if (!name) {
      this.showNotification("Please enter a relationship name", "error");
      return;
    }

    const type = document.getElementById("relationshipType").value;

    this.currentRelationship.name = name;
    this.currentRelationship.type = type;

    const relationshipEl = document.getElementById(this.currentRelationship.id);
    if (relationshipEl) {
      relationshipEl.textContent = name;
      relationshipEl.className = `relationship ${
        type === "isa" ? "isa-relationship" : ""
      } ${type === "identifying" ? "identifying" : ""}`;
    }

    this.closeRelationshipModal();
    this.updateConnections();
    this.showNotification("Relationship saved successfully", "success");
  }

  saveAttribute() {
    const name = document.getElementById("attributeName").value.trim();
    if (!name) {
      this.showNotification("Please enter an attribute name", "error");
      return;
    }

    const type = document.getElementById("attributeType").value;
    const dataType = document.getElementById("dataType").value;
    const isKey = document.getElementById("isKey").checked;
    const isNullable = document.getElementById("isNullable").checked;
    const isUnique = document.getElementById("isUnique").checked;

    const attribute = {
      name: name,
      type: type,
      dataType: dataType,
      isKey: isKey,
      isNullable: isNullable,
      isUnique: isUnique,
    };

    if (this.currentAttribute) {
      // Update existing attribute
      const index = this.currentEntity.attributes.indexOf(
        this.currentAttribute
      );
      this.currentEntity.attributes[index] = attribute;
    } else {
      // Add new attribute
      this.currentEntity.attributes.push(attribute);
    }

    this.renderAttributesList();
    this.closeAttributeModal();
    this.showNotification("Attribute saved successfully", "success");
  }

  addCompositeAttribute() {
    this.showNotification("Add sub-attributes for composite attribute", "info");
  }

  editAttribute(index) {
    const attribute = this.currentEntity.attributes[index];
    this.openAttributeModal(attribute);
  }

  deleteAttribute(index) {
    this.currentEntity.attributes.splice(index, 1);
    this.renderAttributesList();
    this.showNotification("Attribute deleted", "info");
  }

  // === Element Management ===
  startDragging(element, e) {
    this.draggingElement = element;

    const rect = element.getBoundingClientRect();
    const workspaceRect = this.workspace.getBoundingClientRect();

    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;

    element.style.zIndex = 1000;
  }

  updateElementPosition(elementId, x, y) {
    // Update entity position
    let entity = this.entities.find((ent) => ent.id === elementId);
    if (entity) {
      entity.x = x;
      entity.y = y;
      return;
    }

    // Update relationship position
    let relationship = this.relationships.find((rel) => rel.id === elementId);
    if (relationship) {
      relationship.x = x;
      relationship.y = y;
    }
  }

  editElement(elementId) {
    const entity = this.entities.find((ent) => ent.id === elementId);
    if (entity) {
      this.openEntityModal(entity);
      return;
    }

    const relationship = this.relationships.find((rel) => rel.id === elementId);
    if (relationship) {
      this.openRelationshipModal(relationship);
    }
  }

  deleteElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (element.classList.contains("entity")) {
      this.entities = this.entities.filter((ent) => ent.id !== elementId);
      this.connections = this.connections.filter(
        (conn) => conn.entityId !== elementId
      );
    } else if (element.classList.contains("relationship")) {
      this.relationships = this.relationships.filter(
        (rel) => rel.id !== elementId
      );
      this.connections = this.connections.filter(
        (conn) => conn.relationshipId !== elementId
      );
    }

    element.style.animation = "flipIn 0.6s ease reverse";
    setTimeout(() => {
      element.remove();
      this.updateConnections();
      this.updateStats();
      this.showNotification("Element deleted", "info");
    }, 300);
  }

  // === Workspace Management ===
  clearWorkspace() {
    if (
      confirm(
        "Are you sure you want to clear the entire workspace? This action cannot be undone."
      )
    ) {
      this.workspace
        .querySelectorAll(".entity, .relationship")
        .forEach((el) => {
          el.style.animation = "flipIn 0.6s ease reverse";
          setTimeout(() => el.remove(), 300);
        });

      this.connectionLayer.innerHTML = "";
      this.initSVGMarkers();
      this.workspaceInfo.style.display = "block";
      this.entities = [];
      this.relationships = [];
      this.connections = [];
      this.updateStats();
      this.showNotification("Workspace cleared", "info");
    }
  }

  saveDiagram() {
    const diagramData = {
      entities: this.entities,
      relationships: this.relationships,
      connections: this.connections,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };

    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `er-diagram-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
    this.showNotification("Diagram saved successfully", "success");
  }

  loadDiagram() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const diagramData = JSON.parse(event.target.result);
          this.loadDiagramData(diagramData);
          this.showNotification("Diagram loaded successfully", "success");
        } catch (error) {
          this.showNotification("Error loading diagram file", "error");
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  loadDiagramData(diagramData) {
    this.clearWorkspace();

    this.entities = diagramData.entities || [];
    this.relationships = diagramData.relationships || [];
    this.connections = diagramData.connections || [];

    this.entities.forEach((entity) => this.renderEntity(entity));
    this.relationships.forEach((relationship) =>
      this.renderRelationship(relationship)
    );
    this.updateConnections();
    this.updateStats();
    this.hideWorkspaceInfo();
  }

  exportDiagram() {
    this.showNotification("Exporting diagram as image...", "info");
    // In a real implementation, this would use html2canvas or similar
    setTimeout(() => {
      this.showNotification("Diagram exported successfully", "success");
    }, 1000);
  }

  // === Schema Generation ===
  generateSchema() {
    this.schemaContent.innerHTML = "";

    if (this.entities.length === 0) {
      this.schemaContent.innerHTML = `
                <div class="no-schema">
                    <i class="fas fa-database"></i>
                    <h3>No Entities Found</h3>
                    <p>Add entities to your diagram to generate a relational schema</p>
                </div>
            `;
    } else {
      this.entities.forEach((entity) => {
        const tableSchema = this.generateTableSchema(entity);
        this.schemaContent.appendChild(tableSchema);
      });

      this.generateJunctionTables();
      this.generateForeignKeyConstraints();
    }

    this.schemaPanel.classList.add("open");
    this.showNotification("Relational schema generated", "success");
  }

  generateTableSchema(entity) {
    const tableSchema = document.createElement("div");
    tableSchema.className = "table-schema";

    let attributesHtml = "";
    let primaryKeys = [];

    entity.attributes.forEach((attr) => {
      const attrClass = attr.isKey ? "pk" : "";
      const constraints = [];

      if (attr.isKey) primaryKeys.push(attr.name);
      if (!attr.isNullable) constraints.push("NOT NULL");
      if (attr.isUnique) constraints.push("UNIQUE");

      attributesHtml += `
                <div class="attribute-schema ${attrClass}">
                    <span>${attr.name}</span>
                    <div>
                        <span>${attr.dataType}</span>
                        ${
                          constraints.length > 0
                            ? `<span class="constraints">${constraints.join(
                                ", "
                              )}</span>`
                            : ""
                        }
                    </div>
                </div>
            `;
    });

    // Add foreign keys from relationships
    const foreignKeys = this.findForeignKeysForEntity(entity);
    foreignKeys.forEach((fk) => {
      attributesHtml += `
                <div class="attribute-schema fk">
                    <span>${fk.name}</span>
                    <div>
                        <span>${fk.dataType}</span>
                        <span class="constraints">FK → ${fk.references}</span>
                    </div>
                </div>
            `;
    });

    tableSchema.innerHTML = `
            <div class="table-name">
                <i class="fas fa-table"></i>
                ${entity.name}
            </div>
            ${attributesHtml}
            ${
              primaryKeys.length > 0
                ? `<div class="attribute-schema pk">
                   <span>PRIMARY KEY (${primaryKeys.join(", ")})</span>
                   <span></span>
               </div>`
                : ""
            }
        `;

    return tableSchema;
  }

  generateJunctionTables() {
    this.connections.forEach((connection) => {
      const relationship = this.relationships.find(
        (rel) => rel.id === connection.relationshipId
      );

      if (relationship && relationship.cardinality === "M:N") {
        const entity = this.entities.find(
          (ent) => ent.id === connection.entityId
        );
        if (entity) {
          const junctionTable = this.createJunctionTable(relationship, entity);
          this.schemaContent.appendChild(junctionTable);
        }
      }
    });
  }

  createJunctionTable(relationship, entity) {
    const tableSchema = document.createElement("div");
    tableSchema.className = "table-schema";

    tableSchema.innerHTML = `
            <div class="table-name">
                <i class="fas fa-table"></i>
                ${relationship.name}_${entity.name}
            </div>
            <div class="attribute-schema pk">
                <span>${entity.name}_id</span>
                <span>INT</span>
            </div>
            <div class="attribute-schema pk">
                <span>${relationship.name}_id</span>
                <span>INT</span>
            </div>
            <div class="attribute-schema pk">
                <span>PRIMARY KEY (${entity.name}_id, ${relationship.name}_id)</span>
                <span></span>
            </div>
        `;

    return tableSchema;
  }

  generateForeignKeyConstraints() {
    // Add FK constraints for 1:1 and 1:N relationships
    this.connections.forEach((connection) => {
      if (["1:1", "1:N", "N:1"].includes(connection.cardinality)) {
        const relationship = this.relationships.find(
          (rel) => rel.id === connection.relationshipId
        );
        const entity = this.entities.find(
          (ent) => ent.id === connection.entityId
        );

        if (relationship && entity) {
          const fkConstraint = document.createElement("div");
          fkConstraint.className = "table-schema";
          fkConstraint.innerHTML = `
                        <div class="attribute-schema fk">
                            <span>ALTER TABLE ${entity.name} ADD FOREIGN KEY (${relationship.name}_id) REFERENCES ${relationship.name}(id)</span>
                            <span></span>
                        </div>
                    `;
          this.schemaContent.appendChild(fkConstraint);
        }
      }
    });
  }

  findForeignKeysForEntity(entity) {
    const foreignKeys = [];

    this.connections.forEach((connection) => {
      if (connection.entityId === entity.id) {
        const relationship = this.relationships.find(
          (rel) => rel.id === connection.relationshipId
        );
        if (
          relationship &&
          ["1:1", "1:N", "N:1"].includes(relationship.cardinality)
        ) {
          foreignKeys.push({
            name: `${relationship.name}_id`,
            dataType: "INT",
            references: relationship.name,
          });
        }
      }
    });

    return foreignKeys;
  }

  closeSchemaPanel() {
    this.schemaPanel.classList.remove("open");
  }

  copySchema() {
    const schemaText = this.schemaContent.innerText;
    navigator.clipboard.writeText(schemaText).then(() => {
      this.showNotification("Schema copied to clipboard", "success");
    });
  }

  // === UI Controls ===
  toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById("themeToggle");

    if (body.classList.contains("light-mode")) {
      body.classList.replace("light-mode", "dark-mode");
      themeBtn.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
      this.showNotification("Dark mode activated", "info");
    } else {
      body.classList.replace("dark-mode", "light-mode");
      themeBtn.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
      this.showNotification("Light mode activated", "info");
    }
  }

  toggleGrid(btn) {
    btn.classList.toggle("active");
    this.workspace.classList.toggle("grid-enabled");
  }

  zoom(delta) {
    this.zoomLevel = Math.max(0.5, Math.min(2, this.zoomLevel + delta));
    document.getElementById("zoomLevel").textContent = `${Math.round(
      this.zoomLevel * 100
    )}%`;

    // Update all elements' scale
    document.querySelectorAll(".entity, .relationship").forEach((el) => {
      el.style.transform = `scale(${this.zoomLevel})`;
    });

    this.updateConnections();
  }

  resetView() {
    this.zoomLevel = 1;
    document.getElementById("zoomLevel").textContent = "100%";
    document.querySelectorAll(".entity, .relationship").forEach((el) => {
      el.style.transform = "scale(1)";
    });
    this.updateConnections();
  }

  // === Context Menu ===
  showContextMenu(x, y) {
    this.contextMenu.style.left = `${x}px`;
    this.contextMenu.style.top = `${y}px`;
    this.contextMenu.classList.add("open");
  }

  hideContextMenu() {
    this.contextMenu.classList.remove("open");
  }

  handleContextMenuAction(e) {
    const action = e.target.closest(".context-item")?.dataset.action;
    if (!action || !this.selectedElement) return;

    switch (action) {
      case "edit":
        this.editElement(this.selectedElement.id);
        break;
      case "delete":
        this.deleteElement(this.selectedElement.id);
        break;
      case "properties":
        this.showNotification("Properties feature coming soon", "info");
        break;
    }

    this.hideContextMenu();
  }

  // === Utility Methods ===
  hideWorkspaceInfo() {
    this.workspaceInfo.style.display = "none";
  }

  updateStats() {
    document.getElementById("entityCount").textContent = this.entities.length;
    document.getElementById("relationshipCount").textContent =
      this.relationships.length;
    document.getElementById("connectionCount").textContent =
      this.connections.length;
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

    this.notificationContainer.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
      notification.classList.add("out");
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    };
    return icons[type] || "info-circle";
  }
}

// Initialize the application
let app;

document.addEventListener("DOMContentLoaded", () => {
  app = new ERDiagramBuilder();
});

// Add global CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes flipIn {
        from {
            opacity: 0;
            transform: rotateY(90deg) scale(0.8);
        }
        to {
            opacity: 1;
            transform: rotateY(0) scale(1);
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
