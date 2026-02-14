/**
 * ========================================
 * APLICACIÓN DE GESTIÓN DE INVENTARIO
 * ========================================
 * Archivo principal con toda la lógica de negocio
 */

// Variables globales
let currentUser = null;
let currentView = 'dashboard';
let productChart = null;

/**
 * ========================================
 * INICIALIZACIÓN DE LA APLICACIÓN
 * ========================================
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando aplicación de inventario...');
    
    // Inicializar localStorage
    StorageManager.initialize();
    
    // Verificar si hay usuario logueado
    const savedUser = StorageManager.getCurrentUser();
    if (savedUser) {
        currentUser = savedUser;
        showMainApp();
    } else {
        showLoginScreen();
    }
    
    // Configurar event listeners
    setupEventListeners();
});

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Navegación
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Productos
    document.getElementById('addProductBtn').addEventListener('click', () => openProductModal());
    document.getElementById('saveProductBtn').addEventListener('click', saveProduct);
    document.getElementById('searchProduct').addEventListener('input', filterProducts);
    document.getElementById('filterCategory').addEventListener('change', filterProducts);
    document.getElementById('sortProducts').addEventListener('change', filterProducts);
    
    // Movimientos
    document.getElementById('addEntryBtn').addEventListener('click', () => openMovementModal('entrada'));
    document.getElementById('addExitBtn').addEventListener('click', () => openMovementModal('salida'));
    document.getElementById('saveMovementBtn').addEventListener('click', saveMovement);
    document.getElementById('filterMovementType').addEventListener('change', filterMovements);
    document.getElementById('filterDateFrom').addEventListener('change', filterMovements);
    document.getElementById('filterDateTo').addEventListener('change', filterMovements);
    
    // Categorías
    document.getElementById('addCategoryBtn').addEventListener('click', openCategoryModal);
    document.getElementById('saveCategoryBtn').addEventListener('click', saveCategory);
    
    // Usuarios
    document.getElementById('addUserBtn').addEventListener('click', () => openUserModal());
    document.getElementById('saveUserBtn').addEventListener('click', saveUser);
}

/**
 * ========================================
 * GESTIÓN DE AUTENTICACIÓN
 * ========================================
 */

/**
 * Muestra la pantalla de login
 */
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('d-none');
    document.getElementById('mainApp').classList.add('d-none');
}

/**
 * Muestra la aplicación principal
 */
function showMainApp() {
    document.getElementById('loginScreen').classList.add('d-none');
    document.getElementById('mainApp').classList.remove('d-none');
    
    // Actualizar badge de usuario
    const badge = document.getElementById('userBadge');
    badge.textContent = currentUser.role === 'admin' 
        ? `👑 ${currentUser.fullName}` 
        : `👤 ${currentUser.fullName}`;
    badge.className = currentUser.role === 'admin' ? 'badge bg-warning' : 'badge bg-info';
    
    // Configurar permisos según rol
    configureRolePermissions();
    
    // Cargar vista inicial
    loadView('dashboard');
}

/**
 * Maneja el login
 */
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showNotification('Por favor completa todos los campos', 'warning');
        return;
    }
    
    // Validar credenciales
    const user = StorageManager.validateLogin(username, password);
    
    if (user) {
        currentUser = user;
        StorageManager.loginUser(user);
        showNotification(`Bienvenido, ${user.fullName}`, 'success');
        document.getElementById('loginForm').reset();
        showMainApp();
    } else {
        showNotification('Usuario o contraseña incorrectos', 'danger');
    }
}

/**
 * Maneja el logout
 */
function handleLogout() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        StorageManager.logout();
        currentUser = null;
        document.getElementById('loginForm').reset();
        showNotification('Sesión cerrada correctamente', 'info');
        showLoginScreen();
    }
}

/**
 * Configura permisos según el rol
 */
function configureRolePermissions() {
    const isAdmin = currentUser.role === 'admin';
    
    // Mostrar/ocultar opciones según rol
    document.getElementById('categoriesNav').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('statsNav').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('usersNav').style.display = isAdmin ? 'block' : 'none';
}

/**
 * ========================================
 * GESTIÓN DE NAVEGACIÓN
 * ========================================
 */

/**
 * Maneja la navegación entre vistas
 */
function handleNavigation(e) {
    e.preventDefault();
    const view = e.currentTarget.dataset.view;
    
    // Actualizar enlaces activos
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Cargar vista
    loadView(view);
}

/**
 * Carga una vista específica
 */
function loadView(viewName) {
    // Ocultar todas las vistas
    document.querySelectorAll('.view-container').forEach(view => {
        view.classList.add('d-none');
    });
    
    // Mostrar vista seleccionada
    const viewElement = document.getElementById(viewName + 'View');
    if (viewElement) {
        viewElement.classList.remove('d-none');
        currentView = viewName;
        
        // Cargar datos de la vista
        switch(viewName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'products':
                loadProducts();
                break;
            case 'movements':
                loadMovements();
                break;
            case 'categories':
                loadCategories();
                break;
            case 'statistics':
                loadStatistics();
                break;
            case 'users':
                loadUsers();
                break;
        }
    }
}

/**
 * ========================================
 * VISTA: DASHBOARD
 * ========================================
 */

/**
 * Carga el dashboard con estadísticas generales
 */
function loadDashboard() {
    const products = StorageManager.getProducts();
    const movements = StorageManager.getMovements();
    
    // Calcular estadísticas
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockProducts = products.filter(p => p.stock <= p.minStock);
    const totalMovements = movements.length;
    
    // Actualizar estadísticas
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalStock').textContent = totalStock.toLocaleString();
    document.getElementById('lowStock').textContent = lowStockProducts.length;
    document.getElementById('totalMovements').textContent = totalMovements;
    
    // Mostrar productos con stock bajo
    displayLowStockProducts(lowStockProducts);
    
    // Mostrar movimientos recientes
    displayRecentMovements(movements);
}

/**
 * Muestra productos con stock bajo
 */
function displayLowStockProducts(products) {
    const container = document.getElementById('lowStockList');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="bi bi-check-circle"></i><p>No hay productos con stock bajo</p></div>';
        return;
    }
    
    container.innerHTML = products.slice(0, 5).map(product => `
        <div class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${product.name}</strong>
                    <br>
                    <small class="text-muted">${product.category}</small>
                </div>
                <span class="stock-badge ${getStockClass(product)}">
                    ${product.stock} unidades
                </span>
            </div>
        </div>
    `).join('');
}

/**
 * Muestra movimientos recientes
 */
function displayRecentMovements(movements) {
    const container = document.getElementById('recentMovements');
    const recent = movements.slice(-5).reverse();
    
    if (recent.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="bi bi-inbox"></i><p>No hay movimientos registrados</p></div>';
        return;
    }
    
    container.innerHTML = recent.map(movement => `
        <div class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${movement.productName}</strong>
                    <br>
                    <small class="text-muted">${formatDate(movement.date)} - ${movement.reason}</small>
                </div>
                <span class="badge badge-${movement.type}">
                    ${movement.type === 'entrada' ? '+' : '-'}${movement.quantity}
                </span>
            </div>
        </div>
    `).join('');
}

/**
 * ========================================
 * VISTA: PRODUCTOS
 * ========================================
 */

/**
 * Carga la lista de productos
 */
function loadProducts() {
    // Actualizar selector de categorías
    updateCategorySelectors();
    
    // Mostrar productos
    filterProducts();
}

/**
 * Filtra y muestra productos según criterios
 */
function filterProducts() {
    let products = StorageManager.getProducts();
    
    // Filtrar por búsqueda
    const searchTerm = document.getElementById('searchProduct').value.toLowerCase();
    if (searchTerm) {
        products = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filtrar por categoría
    const categoryFilter = document.getElementById('filterCategory').value;
    if (categoryFilter) {
        products = products.filter(p => p.category === categoryFilter);
    }
    
    // Ordenar
    const sortBy = document.getElementById('sortProducts').value;
    products.sort((a, b) => {
        switch(sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'stock':
                return b.stock - a.stock;
            case 'price':
                return b.price - a.price;
            default:
                return 0;
        }
    });
    
    displayProducts(products);
}

/**
 * Muestra la tabla de productos
 */
function displayProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4"><i class="bi bi-inbox"></i> No se encontraron productos</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><strong>${product.name}</strong></td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td><span class="stock-badge ${getStockClass(product)}">${product.stock}</span></td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-warning" onclick="editProduct(${product.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    ${currentUser.role === 'admin' ? `
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Abre el modal de producto
 */
function openProductModal(productId = null) {
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');
    
    form.reset();
    
    if (productId) {
        // Editar producto
        const product = StorageManager.getProductById(productId);
        if (product) {
            title.textContent = 'Editar Producto';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productMinStock').value = product.minStock;
        }
    } else {
        // Nuevo producto
        title.textContent = 'Nuevo Producto';
        document.getElementById('productId').value = '';
    }
    
    updateCategorySelectors();
    modal.show();
}

/**
 * Guarda un producto (crear o actualizar)
 */
function saveProduct() {
    const id = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        price: parseFloat(document.getElementById('productPrice').value),
        minStock: parseInt(document.getElementById('productMinStock').value)
    };
    
    // Validar datos
    if (!productData.name || !productData.category) {
        showNotification('Por favor completa todos los campos', 'warning');
        return;
    }
    
    let success;
    if (id) {
        // Actualizar producto existente
        success = StorageManager.updateProduct(id, productData);
        if (success) {
            showNotification('Producto actualizado correctamente', 'success');
        }
    } else {
        // Crear nuevo producto
        success = StorageManager.addProduct(productData);
        if (success) {
            showNotification('Producto creado correctamente', 'success');
        }
    }
    
    if (success) {
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        loadProducts();
    } else {
        showNotification('Error al guardar el producto', 'danger');
    }
}

/**
 * Editar producto
 */
function editProduct(id) {
    openProductModal(id);
}

/**
 * Eliminar producto
 */
function deleteProduct(id) {
    if (currentUser.role !== 'admin') {
        showNotification('Solo los administradores pueden eliminar productos', 'warning');
        return;
    }
    
    const product = StorageManager.getProductById(id);
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
        if (StorageManager.deleteProduct(id)) {
            showNotification('Producto eliminado correctamente', 'success');
            loadProducts();
        } else {
            showNotification('Error al eliminar el producto', 'danger');
        }
    }
}

/**
 * ========================================
 * VISTA: MOVIMIENTOS
 * ========================================
 */

/**
 * Carga la lista de movimientos
 */
function loadMovements() {
    filterMovements();
}

/**
 * Filtra y muestra movimientos
 */
function filterMovements() {
    let movements = StorageManager.getMovements();
    
    // Filtrar por tipo
    const typeFilter = document.getElementById('filterMovementType').value;
    if (typeFilter) {
        movements = movements.filter(m => m.type === typeFilter);
    }
    
    // Filtrar por rango de fechas
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    
    if (dateFrom) {
        movements = movements.filter(m => m.date >= dateFrom);
    }
    
    if (dateTo) {
        movements = movements.filter(m => m.date <= dateTo);
    }
    
    displayMovements(movements);
}

/**
 * Muestra la tabla de movimientos
 */
function displayMovements(movements) {
    const tbody = document.getElementById('movementsTableBody');
    
    if (movements.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4"><i class="bi bi-inbox"></i> No se encontraron movimientos</td></tr>';
        return;
    }
    
    // Ordenar por fecha descendente
    movements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tbody.innerHTML = movements.map(movement => `
        <tr>
            <td>${movement.id}</td>
            <td>${formatDate(movement.date)}</td>
            <td><strong>${movement.productName}</strong></td>
            <td><span class="badge badge-${movement.type}">${movement.type.toUpperCase()}</span></td>
            <td>${movement.quantity}</td>
            <td>${movement.reason}</td>
        </tr>
    `).join('');
}

/**
 * Abre el modal de movimiento
 */
function openMovementModal(type) {
    const modal = new bootstrap.Modal(document.getElementById('movementModal'));
    const form = document.getElementById('movementForm');
    const title = document.getElementById('movementModalTitle');
    const reasonSelect = document.getElementById('movementReason');
    
    form.reset();
    document.getElementById('movementType').value = type;
    
    title.textContent = type === 'entrada' ? 'Nueva Entrada' : 'Nueva Salida';
    title.className = `modal-title text-${type === 'entrada' ? 'success' : 'danger'}`;
    
    // Actualizar opciones de motivo según tipo
    if (type === 'entrada') {
        reasonSelect.innerHTML = `
            <option value="Compra a proveedor">Compra a proveedor</option>
            <option value="Devolución de cliente">Devolución de cliente</option>
            <option value="Ajuste de inventario">Ajuste de inventario</option>
            <option value="Donación">Donación</option>
        `;
    } else {
        reasonSelect.innerHTML = `
            <option value="Venta">Venta</option>
            <option value="Pérdida">Pérdida</option>
            <option value="Daño">Daño</option>
            <option value="Devolución a proveedor">Devolución a proveedor</option>
        `;
    }
    
    // Cargar productos
    const products = StorageManager.getProducts();
    const productSelect = document.getElementById('movementProduct');
    productSelect.innerHTML = products.map(p => 
        `<option value="${p.id}">${p.name} (Stock: ${p.stock})</option>`
    ).join('');
    
    modal.show();
}

/**
 * Guarda un movimiento
 */
function saveMovement() {
    const type = document.getElementById('movementType').value;
    const productId = parseInt(document.getElementById('movementProduct').value);
    const quantity = parseInt(document.getElementById('movementQuantity').value);
    const reason = document.getElementById('movementReason').value;
    const notes = document.getElementById('movementNotes').value;
    
    // Validar datos
    if (!productId || !quantity || quantity <= 0) {
        showNotification('Por favor completa todos los campos correctamente', 'warning');
        return;
    }
    
    // Obtener producto
    const product = StorageManager.getProductById(productId);
    if (!product) {
        showNotification('Producto no encontrado', 'danger');
        return;
    }
    
    // Validar stock para salidas
    if (type === 'salida' && quantity > product.stock) {
        showNotification(`Stock insuficiente. Disponible: ${product.stock}`, 'warning');
        return;
    }
    
    // Crear movimiento
    const movementData = {
        productId: productId,
        productName: product.name,
        type: type,
        quantity: quantity,
        reason: reason,
        notes: notes
    };
    
    const movement = StorageManager.addMovement(movementData);
    
    if (movement) {
        // Actualizar stock del producto
        const updated = StorageManager.updateProductStock(productId, quantity, type);
        
        if (updated) {
            showNotification(`${type === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente`, 'success');
            bootstrap.Modal.getInstance(document.getElementById('movementModal')).hide();
            loadMovements();
            
            // Si estamos en el dashboard, actualizarlo
            if (currentView === 'dashboard') {
                loadDashboard();
            }
        } else {
            showNotification('Error al actualizar el stock', 'danger');
        }
    } else {
        showNotification('Error al registrar el movimiento', 'danger');
    }
}

/**
 * ========================================
 * VISTA: CATEGORÍAS
 * ========================================
 */

/**
 * Carga las categorías
 */
function loadCategories() {
    const categories = StorageManager.getCategories();
    const products = StorageManager.getProducts();
    const container = document.getElementById('categoriesGrid');
    
    if (categories.length === 0) {
        container.innerHTML = '<div class="col-12 empty-state"><i class="bi bi-tags"></i><p>No hay categorías registradas</p></div>';
        return;
    }
    
    container.innerHTML = categories.map(category => {
        const categoryProducts = products.filter(p => p.category === category.name);
        const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
        
        return `
            <div class="col-md-4">
                <div class="category-card" style="border-left-color: ${category.color}">
                    <div class="category-header">
                        <span class="category-name" style="color: ${category.color}">${category.name}</span>
                        <button class="btn btn-sm btn-danger" onclick="deleteCategory(${category.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span class="category-count">${categoryProducts.length} productos</span>
                        <span class="category-count">Stock: ${totalStock}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Abre el modal de categoría
 */
function openCategoryModal() {
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    document.getElementById('categoryForm').reset();
    modal.show();
}

/**
 * Guarda una categoría
 */
function saveCategory() {
    const name = document.getElementById('categoryName').value.trim();
    const color = document.getElementById('categoryColor').value;
    
    if (!name) {
        showNotification('Por favor ingresa un nombre para la categoría', 'warning');
        return;
    }
    
    // Verificar que no exista
    const categories = StorageManager.getCategories();
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        showNotification('Ya existe una categoría con ese nombre', 'warning');
        return;
    }
    
    const category = StorageManager.addCategory({ name, color });
    
    if (category) {
        showNotification('Categoría creada correctamente', 'success');
        bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
        loadCategories();
        updateCategorySelectors();
    } else {
        showNotification('Error al crear la categoría', 'danger');
    }
}

/**
 * Elimina una categoría
 */
function deleteCategory(id) {
    const categories = StorageManager.getCategories();
    const category = categories.find(c => c.id === id);
    
    if (!category) return;
    
    // Verificar que no haya productos con esa categoría
    const products = StorageManager.getProducts();
    const hasProducts = products.some(p => p.category === category.name);
    
    if (hasProducts) {
        showNotification('No se puede eliminar una categoría que tiene productos asignados', 'warning');
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
        if (StorageManager.deleteCategory(id)) {
            showNotification('Categoría eliminada correctamente', 'success');
            loadCategories();
            updateCategorySelectors();
        } else {
            showNotification('Error al eliminar la categoría', 'danger');
        }
    }
}

/**
 * ========================================
 * VISTA: ESTADÍSTICAS
 * ========================================
 */

/**
 * Carga las estadísticas
 */
function loadStatistics() {
    const products = StorageManager.getProducts();
    const movements = StorageManager.getMovements();
    
    displayTopProducts(movements, products);
    displayStockByCategory(products);
    displayMonthlyMovements(movements);
    displayMovementsChart(movements);
}

/**
 * Muestra productos más vendidos
 */
function displayTopProducts(movements, products) {
    const sales = {};
    
    movements.filter(m => m.type === 'salida' && m.reason === 'Venta')
        .forEach(m => {
            sales[m.productId] = (sales[m.productId] || 0) + m.quantity;
        });
    
    const topProducts = Object.entries(sales)
        .map(([id, quantity]) => ({
            product: products.find(p => p.id === parseInt(id)),
            quantity
        }))
        .filter(item => item.product)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
    
    const container = document.getElementById('topProducts');
    
    if (topProducts.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay ventas registradas</p>';
        return;
    }
    
    container.innerHTML = topProducts.map((item, index) => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <span class="badge bg-warning">${index + 1}</span>
                <strong class="ms-2">${item.product.name}</strong>
            </div>
            <span class="badge bg-primary">${item.quantity} unidades</span>
        </div>
    `).join('');
}

/**
 * Muestra stock por categoría
 */
function displayStockByCategory(products) {
    const stockByCategory = {};
    
    products.forEach(p => {
        stockByCategory[p.category] = (stockByCategory[p.category] || 0) + p.stock;
    });
    
    const container = document.getElementById('stockByCategory');
    
    container.innerHTML = Object.entries(stockByCategory)
        .sort((a, b) => b[1] - a[1])
        .map(([category, stock]) => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong>${category}</strong>
                <span class="badge bg-secondary">${stock} unidades</span>
            </div>
        `).join('');
}

/**
 * Muestra movimientos del mes
 */
function displayMonthlyMovements(movements) {
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthMovements = movements.filter(m => m.date.startsWith(thisMonth));
    
    const entries = monthMovements.filter(m => m.type === 'entrada').length;
    const exits = monthMovements.filter(m => m.type === 'salida').length;
    
    const container = document.getElementById('monthlyMovements');
    
    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <strong>Entradas</strong>
            <span class="badge bg-success">${entries}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <strong>Salidas</strong>
            <span class="badge bg-danger">${exits}</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between align-items-center">
            <strong>Total</strong>
            <span class="badge bg-primary">${monthMovements.length}</span>
        </div>
    `;
}

/**
 * Muestra gráfico de movimientos
 */
function displayMovementsChart(movements) {
    const ctx = document.getElementById('movementsChart');
    
    // Obtener últimos 7 días
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
    }
    
    const entriesData = last7Days.map(date => 
        movements.filter(m => m.date === date && m.type === 'entrada').length
    );
    
    const exitsData = last7Days.map(date => 
        movements.filter(m => m.date === date && m.type === 'salida').length
    );
    
    // Destruir gráfico anterior si existe
    if (productChart) {
        productChart.destroy();
    }
    
    productChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days.map(d => formatDate(d)),
            datasets: [
                {
                    label: 'Entradas',
                    data: entriesData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Salidas',
                    data: exitsData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

/**
 * ========================================
 * VISTA: USUARIOS
 * ========================================
 */

/**
 * Carga la lista de usuarios
 */
function loadUsers() {
    const users = StorageManager.getUsers();
    displayUsers(users);
}

/**
 * Muestra la tabla de usuarios
 */
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4"><i class="bi bi-inbox"></i> No hay usuarios registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td><strong>${user.username}</strong></td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td><span class="badge ${user.role === 'admin' ? 'bg-warning' : 'bg-info'}">${user.role === 'admin' ? 'Administrador' : 'Empleado'}</span></td>
            <td>${formatDate(user.createdAt.split('T')[0])}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-warning" onclick="editUser(${user.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    ${user.id !== currentUser.id ? `
                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : '<span class="badge bg-secondary">Tú</span>'}
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Abre el modal de usuario
 */
function openUserModal(userId = null) {
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    const form = document.getElementById('userForm');
    const title = document.getElementById('userModalTitle');
    
    form.reset();
    
    if (userId) {
        // Editar usuario
        const user = StorageManager.getUserById(userId);
        if (user) {
            title.textContent = 'Editar Usuario';
            document.getElementById('userId').value = user.id;
            document.getElementById('userUsername').value = user.username;
            document.getElementById('userUsername').disabled = true; // No permitir cambiar username
            document.getElementById('userFullName').value = user.fullName;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPassword').value = user.password;
            document.getElementById('userRole').value = user.role;
        }
    } else {
        // Nuevo usuario
        title.textContent = 'Nuevo Usuario';
        document.getElementById('userId').value = '';
        document.getElementById('userUsername').disabled = false;
    }
    
    modal.show();
}

/**
 * Guarda un usuario (crear o actualizar)
 */
function saveUser() {
    const id = document.getElementById('userId').value;
    const username = document.getElementById('userUsername').value.trim();
    const fullName = document.getElementById('userFullName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    
    // Validar datos
    if (!username || !fullName || !email || !password || !role) {
        showNotification('Por favor completa todos los campos', 'warning');
        return;
    }
    
    // Validar username (sin espacios)
    if (username.includes(' ')) {
        showNotification('El nombre de usuario no puede contener espacios', 'warning');
        return;
    }
    
    // Validar contraseña
    if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'warning');
        return;
    }
    
    const userData = {
        username,
        fullName,
        email,
        password,
        role
    };
    
    let success;
    if (id) {
        // Actualizar usuario existente
        success = StorageManager.updateUser(id, userData);
        if (success) {
            showNotification('Usuario actualizado correctamente', 'success');
        }
    } else {
        // Crear nuevo usuario
        success = StorageManager.addUser(userData);
        if (success) {
            showNotification('Usuario creado correctamente', 'success');
        } else {
            showNotification('Error: El nombre de usuario ya existe', 'danger');
            return;
        }
    }
    
    if (success) {
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        loadUsers();
    } else {
        showNotification('Error al guardar el usuario', 'danger');
    }
}

/**
 * Editar usuario
 */
function editUser(id) {
    openUserModal(id);
}

/**
 * Eliminar usuario
 */
function deleteUser(id) {
    const user = StorageManager.getUserById(id);
    
    if (!user) return;
    
    if (user.id === currentUser.id) {
        showNotification('No puedes eliminar tu propio usuario', 'warning');
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar al usuario "${user.fullName}"?`)) {
        if (StorageManager.deleteUser(id)) {
            showNotification('Usuario eliminado correctamente', 'success');
            loadUsers();
        } else {
            showNotification('Error: No se puede eliminar el último administrador', 'danger');
        }
    }
}

/**
 * ========================================
 * FUNCIONES AUXILIARES
 * ========================================
 */

/**
 * Actualiza los selectores de categorías
 */
function updateCategorySelectors() {
    const categories = StorageManager.getCategories();
    
    // Actualizar selector en modal de producto
    const productCategorySelect = document.getElementById('productCategory');
    if (productCategorySelect) {
        const currentValue = productCategorySelect.value;
        productCategorySelect.innerHTML = categories.map(c => 
            `<option value="${c.name}">${c.name}</option>`
        ).join('');
        productCategorySelect.value = currentValue;
    }
    
    // Actualizar filtro de categorías
    const filterCategorySelect = document.getElementById('filterCategory');
    if (filterCategorySelect) {
        const currentValue = filterCategorySelect.value;
        filterCategorySelect.innerHTML = '<option value="">Todas las categorías</option>' +
            categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
        filterCategorySelect.value = currentValue;
    }
}

/**
 * Obtiene la clase CSS según el nivel de stock
 */
function getStockClass(product) {
    if (product.stock === 0) return 'stock-critical';
    if (product.stock <= product.minStock) return 'stock-low';
    return 'stock-good';
}

/**
 * Formatea una fecha
 */
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

/**
 * Muestra una notificación toast
 */
function showNotification(message, type = 'info') {
    const toast = document.getElementById('notificationToast');
    const toastBody = document.getElementById('toastMessage');
    
    toastBody.textContent = message;
    
    // Cambiar color según tipo
    toast.className = 'toast';
    switch(type) {
        case 'success':
            toast.classList.add('bg-success', 'text-white');
            break;
        case 'danger':
            toast.classList.add('bg-danger', 'text-white');
            break;
        case 'warning':
            toast.classList.add('bg-warning');
            break;
        default:
            toast.classList.add('bg-info', 'text-white');
    }
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

console.log('✅ Aplicación cargada correctamente');
