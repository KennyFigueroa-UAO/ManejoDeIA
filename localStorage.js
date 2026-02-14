/**
 * ========================================
 * MÓDULO DE GESTIÓN DE LOCALSTORAGE
 * ========================================
 * Este archivo contiene todas las funciones para interactuar
 * con localStorage de manera segura y eficiente.
 */

const StorageManager = {
    // Claves para almacenamiento
    KEYS: {
        PRODUCTS: 'inventory_products',
        MOVEMENTS: 'inventory_movements',
        CATEGORIES: 'inventory_categories',
        USERS: 'inventory_users',
        CURRENT_USER: 'inventory_current_user'
    },

    /**
     * Inicializa el localStorage con datos de ejemplo si está vacío
     */
    initialize() {
        console.log('🔧 Inicializando localStorage...');
        
        // Inicializar usuarios si no existen
        if (!this.get(this.KEYS.USERS)) {
            const defaultUsers = [
                { 
                    id: 1, 
                    username: 'admin', 
                    password: 'admin123', // En producción, usar hash
                    fullName: 'Administrador Principal',
                    role: 'admin',
                    email: 'admin@inventario.com',
                    createdAt: new Date().toISOString()
                }
            ];
            this.save(this.KEYS.USERS, defaultUsers);
            console.log('✅ Usuarios inicializados (Usuario: admin, Contraseña: admin123)');
        }
        
        // Inicializar categorías si no existen
        if (!this.get(this.KEYS.CATEGORIES)) {
            const defaultCategories = [
                { id: 1, name: 'Electrónica', color: '#6366f1' },
                { id: 2, name: 'Alimentos', color: '#10b981' },
                { id: 3, name: 'Bebidas', color: '#f59e0b' },
                { id: 4, name: 'Limpieza', color: '#06b6d4' },
                { id: 5, name: 'Papelería', color: '#8b5cf6' }
            ];
            this.save(this.KEYS.CATEGORIES, defaultCategories);
            console.log('✅ Categorías inicializadas');
        }

        // Inicializar productos si no existen
        if (!this.get(this.KEYS.PRODUCTS)) {
            const defaultProducts = [
                { id: 1, name: 'Laptop HP', category: 'Electrónica', stock: 15, price: 899.99, minStock: 5 },
                { id: 2, name: 'Mouse Logitech', category: 'Electrónica', stock: 45, price: 25.99, minStock: 10 },
                { id: 3, name: 'Arroz 1kg', category: 'Alimentos', stock: 120, price: 2.50, minStock: 30 },
                { id: 4, name: 'Agua Mineral 500ml', category: 'Bebidas', stock: 200, price: 0.75, minStock: 50 },
                { id: 5, name: 'Detergente Líquido', category: 'Limpieza', stock: 8, price: 5.99, minStock: 10 },
                { id: 6, name: 'Cuaderno A4', category: 'Papelería', stock: 55, price: 1.99, minStock: 20 },
                { id: 7, name: 'Teclado Mecánico', category: 'Electrónica', stock: 3, price: 129.99, minStock: 5 },
                { id: 8, name: 'Café Premium 250g', category: 'Alimentos', stock: 25, price: 8.50, minStock: 10 }
            ];
            this.save(this.KEYS.PRODUCTS, defaultProducts);
            console.log('✅ Productos inicializados');
        }

        // Inicializar movimientos si no existen
        if (!this.get(this.KEYS.MOVEMENTS)) {
            const defaultMovements = [
                { 
                    id: 1, 
                    productId: 1, 
                    productName: 'Laptop HP',
                    type: 'entrada', 
                    quantity: 10, 
                    reason: 'Compra a proveedor',
                    date: this.getDateDaysAgo(5),
                    notes: 'Pedido mensual'
                },
                { 
                    id: 2, 
                    productId: 3, 
                    productName: 'Arroz 1kg',
                    type: 'salida', 
                    quantity: 30, 
                    reason: 'Venta',
                    date: this.getDateDaysAgo(3),
                    notes: 'Cliente mayorista'
                },
                { 
                    id: 3, 
                    productId: 5, 
                    productName: 'Detergente Líquido',
                    type: 'salida', 
                    quantity: 12, 
                    reason: 'Venta',
                    date: this.getDateDaysAgo(2),
                    notes: ''
                },
                { 
                    id: 4, 
                    productId: 4, 
                    productName: 'Agua Mineral 500ml',
                    type: 'entrada', 
                    quantity: 100, 
                    reason: 'Compra a proveedor',
                    date: this.getDateDaysAgo(1),
                    notes: 'Reabastecimiento'
                }
            ];
            this.save(this.KEYS.MOVEMENTS, defaultMovements);
            console.log('✅ Movimientos inicializados');
        }

        console.log('✅ LocalStorage inicializado correctamente');
    },

    /**
     * Obtiene una fecha X días en el pasado
     */
    getDateDaysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
    },

    /**
     * Guarda datos en localStorage
     * @param {string} key - Clave de almacenamiento
     * @param {any} data - Datos a guardar
     * @returns {boolean} - true si se guardó correctamente
     */
    save(key, data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            console.log(`💾 Guardado en localStorage: ${key}`);
            return true;
        } catch (error) {
            console.error('❌ Error al guardar en localStorage:', error);
            return false;
        }
    },

    /**
     * Obtiene datos de localStorage
     * @param {string} key - Clave de almacenamiento
     * @returns {any|null} - Datos recuperados o null
     */
    get(key) {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            console.error('❌ Error al leer de localStorage:', error);
            return null;
        }
    },

    /**
     * Elimina datos de localStorage
     * @param {string} key - Clave a eliminar
     * @returns {boolean} - true si se eliminó correctamente
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            console.log(`🗑️ Eliminado de localStorage: ${key}`);
            return true;
        } catch (error) {
            console.error('❌ Error al eliminar de localStorage:', error);
            return false;
        }
    },

    /**
     * Limpia todo el localStorage
     */
    clear() {
        try {
            localStorage.clear();
            console.log('🗑️ LocalStorage limpiado completamente');
            return true;
        } catch (error) {
            console.error('❌ Error al limpiar localStorage:', error);
            return false;
        }
    },

    /**
     * Obtiene todos los productos
     */
    getProducts() {
        return this.get(this.KEYS.PRODUCTS) || [];
    },

    /**
     * Guarda todos los productos
     */
    saveProducts(products) {
        return this.save(this.KEYS.PRODUCTS, products);
    },

    /**
     * Obtiene un producto por ID
     */
    getProductById(id) {
        const products = this.getProducts();
        return products.find(p => p.id === parseInt(id));
    },

    /**
     * Agrega un nuevo producto
     */
    addProduct(product) {
        const products = this.getProducts();
        
        // Generar nuevo ID
        const newId = products.length > 0 
            ? Math.max(...products.map(p => p.id)) + 1 
            : 1;
        
        const newProduct = { id: newId, ...product };
        products.push(newProduct);
        
        return this.saveProducts(products) ? newProduct : null;
    },

    /**
     * Actualiza un producto existente
     */
    updateProduct(id, updatedData) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === parseInt(id));
        
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData };
            return this.saveProducts(products) ? products[index] : null;
        }
        
        return null;
    },

    /**
     * Elimina un producto
     */
    deleteProduct(id) {
        const products = this.getProducts();
        const filteredProducts = products.filter(p => p.id !== parseInt(id));
        
        if (filteredProducts.length < products.length) {
            return this.saveProducts(filteredProducts);
        }
        
        return false;
    },

    /**
     * Obtiene todos los movimientos
     */
    getMovements() {
        return this.get(this.KEYS.MOVEMENTS) || [];
    },

    /**
     * Guarda todos los movimientos
     */
    saveMovements(movements) {
        return this.save(this.KEYS.MOVEMENTS, movements);
    },

    /**
     * Agrega un nuevo movimiento
     */
    addMovement(movement) {
        const movements = this.getMovements();
        
        // Generar nuevo ID
        const newId = movements.length > 0 
            ? Math.max(...movements.map(m => m.id)) + 1 
            : 1;
        
        const newMovement = { 
            id: newId, 
            date: new Date().toISOString().split('T')[0],
            ...movement 
        };
        
        movements.push(newMovement);
        return this.saveMovements(movements) ? newMovement : null;
    },

    /**
     * Obtiene todas las categorías
     */
    getCategories() {
        return this.get(this.KEYS.CATEGORIES) || [];
    },

    /**
     * Guarda todas las categorías
     */
    saveCategories(categories) {
        return this.save(this.KEYS.CATEGORIES, categories);
    },

    /**
     * Agrega una nueva categoría
     */
    addCategory(category) {
        const categories = this.getCategories();
        
        // Generar nuevo ID
        const newId = categories.length > 0 
            ? Math.max(...categories.map(c => c.id)) + 1 
            : 1;
        
        const newCategory = { id: newId, ...category };
        categories.push(newCategory);
        
        return this.saveCategories(categories) ? newCategory : null;
    },

    /**
     * Elimina una categoría
     */
    deleteCategory(id) {
        const categories = this.getCategories();
        const filteredCategories = categories.filter(c => c.id !== parseInt(id));
        
        if (filteredCategories.length < categories.length) {
            return this.saveCategories(filteredCategories);
        }
        
        return false;
    },

    /**
     * Actualiza el stock de un producto
     */
    updateProductStock(productId, quantity, type) {
        const product = this.getProductById(productId);
        
        if (!product) {
            console.error('❌ Producto no encontrado');
            return false;
        }

        let newStock;
        if (type === 'entrada') {
            newStock = product.stock + parseInt(quantity);
        } else if (type === 'salida') {
            newStock = product.stock - parseInt(quantity);
            if (newStock < 0) {
                console.error('❌ Stock insuficiente');
                return false;
            }
        } else {
            console.error('❌ Tipo de movimiento inválido');
            return false;
        }

        return this.updateProduct(productId, { stock: newStock });
    },

    /**
     * Obtiene el rol del usuario actual
     */
    getUserRole() {
        const currentUser = this.getCurrentUser();
        return currentUser ? currentUser.role : null;
    },

    /**
     * Establece el rol del usuario (DEPRECATED - usar loginUser)
     */
    setUserRole(role) {
        // Mantenido por compatibilidad, pero ya no se usa
        return this.save('inventory_user_role_deprecated', role);
    },

    /**
     * Cierra sesión del usuario
     */
    logout() {
        return this.remove(this.KEYS.CURRENT_USER);
    },

    /**
     * ========================================
     * GESTIÓN DE USUARIOS
     * ========================================
     */

    /**
     * Obtiene todos los usuarios
     */
    getUsers() {
        return this.get(this.KEYS.USERS) || [];
    },

    /**
     * Guarda todos los usuarios
     */
    saveUsers(users) {
        return this.save(this.KEYS.USERS, users);
    },

    /**
     * Obtiene un usuario por ID
     */
    getUserById(id) {
        const users = this.getUsers();
        return users.find(u => u.id === parseInt(id));
    },

    /**
     * Obtiene un usuario por username
     */
    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(u => u.username === username);
    },

    /**
     * Valida las credenciales de login
     */
    validateLogin(username, password) {
        const user = this.getUserByUsername(username);
        if (user && user.password === password) {
            return user;
        }
        return null;
    },

    /**
     * Inicia sesión de usuario
     */
    loginUser(user) {
        const userToStore = { ...user };
        delete userToStore.password; // No almacenar la contraseña en currentUser
        return this.save(this.KEYS.CURRENT_USER, userToStore);
    },

    /**
     * Obtiene el usuario actual
     */
    getCurrentUser() {
        return this.get(this.KEYS.CURRENT_USER);
    },

    /**
     * Agrega un nuevo usuario
     */
    addUser(userData) {
        const users = this.getUsers();
        
        // Verificar que el username no exista
        if (users.some(u => u.username === userData.username)) {
            console.error('❌ El nombre de usuario ya existe');
            return null;
        }

        // Generar nuevo ID
        const newId = users.length > 0 
            ? Math.max(...users.map(u => u.id)) + 1 
            : 1;
        
        const newUser = { 
            id: newId, 
            createdAt: new Date().toISOString(),
            ...userData 
        };
        
        users.push(newUser);
        return this.saveUsers(users) ? newUser : null;
    },

    /**
     * Actualiza un usuario existente
     */
    updateUser(id, updatedData) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === parseInt(id));
        
        if (index !== -1) {
            // Si se está cambiando el username, verificar que no exista
            if (updatedData.username && updatedData.username !== users[index].username) {
                if (users.some(u => u.username === updatedData.username)) {
                    console.error('❌ El nombre de usuario ya existe');
                    return null;
                }
            }
            
            users[index] = { ...users[index], ...updatedData };
            return this.saveUsers(users) ? users[index] : null;
        }
        
        return null;
    },

    /**
     * Elimina un usuario
     */
    deleteUser(id) {
        const users = this.getUsers();
        
        // No permitir eliminar si es el único administrador
        const user = users.find(u => u.id === parseInt(id));
        if (user && user.role === 'admin') {
            const adminCount = users.filter(u => u.role === 'admin').length;
            if (adminCount <= 1) {
                console.error('❌ No se puede eliminar el último administrador');
                return false;
            }
        }
        
        const filteredUsers = users.filter(u => u.id !== parseInt(id));
        
        if (filteredUsers.length < users.length) {
            return this.saveUsers(filteredUsers);
        }
        
        return false;
    },

    /**
     * Exporta todos los datos a un objeto JSON
     */
    exportData() {
        return {
            products: this.getProducts(),
            movements: this.getMovements(),
            categories: this.getCategories(),
            exportDate: new Date().toISOString()
        };
    },

    /**
     * Importa datos desde un objeto JSON
     */
    importData(data) {
        try {
            if (data.products) this.saveProducts(data.products);
            if (data.movements) this.saveMovements(data.movements);
            if (data.categories) this.saveCategories(data.categories);
            console.log('✅ Datos importados correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error al importar datos:', error);
            return false;
        }
    }
};

// Inicializar el almacenamiento cuando se carga el script
console.log('📦 StorageManager cargado');
