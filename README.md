# Sistema de Gestión de Inventario

## 📋 Descripción

Aplicación web completa para la gestión de inventario empresarial con control de productos, movimientos, categorías y estadísticas. Desarrollada con HTML5, CSS3 (Bootstrap), JavaScript Vanilla y localStorage para persistencia de datos.

## ✨ Características Principales

### Roles del Sistema

#### 👑 Administrador
- ✅ Crear, editar y eliminar productos
- ✅ Definir y gestionar categorías
- ✅ Visualizar inventario completo
- ✅ Acceder a historial completo de movimientos
- ✅ Panel de estadísticas avanzadas
- ✅ **Crear, editar y eliminar usuarios**
- ✅ **Asignar roles a usuarios**
- ✅ Gestión completa del sistema

#### 👤 Empleado
- ✅ Registrar entradas de productos (compras)
- ✅ Registrar salidas de productos (ventas/pérdidas)
- ✅ Consultar inventario disponible
- ✅ Ver historial de movimientos
- ❌ No puede eliminar productos ni categorías
- ❌ No puede gestionar usuarios

### Funcionalidades Implementadas

0. **Sistema de Autenticación**
   - Login con usuario y contraseña
   - Usuario administrador por defecto (admin/admin123)
   - Gestión completa de usuarios por parte del administrador
   - Protección contra eliminación del último administrador
   - Sesión persistente con localStorage

1. **CRUD Completo de Productos**
   - Crear nuevos productos con categoría, stock, precio y stock mínimo
   - Editar información de productos existentes
   - Eliminar productos (solo administradores)
   - Búsqueda y filtrado avanzado

2. **Control Automático de Stock**
   - Actualización automática al registrar entradas/salidas
   - Validación de stock disponible para salidas
   - Alertas de stock bajo
   - Stock mínimo configurable por producto

3. **Gestión de Movimientos**
   - Registro de entradas (compras, devoluciones, ajustes)
   - Registro de salidas (ventas, pérdidas, daños)
   - Historial completo con filtros por fecha y tipo
   - Motivos personalizables

4. **Sistema de Categorías**
   - Creación de categorías con colores personalizados
   - Visualización de productos por categoría
   - Stock agregado por categoría
   - Prevención de eliminación de categorías con productos

5. **Dashboard y Estadísticas**
   - Métricas principales (total productos, stock total, stock bajo)
   - Productos más vendidos
   - Distribución de stock por categoría
   - Gráfico de movimientos de los últimos 7 días
   - Movimientos recientes

6. **Persistencia de Datos**
   - Almacenamiento automático en localStorage
   - Datos de ejemplo pre-cargados
   - Sin pérdida de información al recargar

7. **Interfaz Moderna**
   - Diseño responsivo (funciona en móviles, tablets y desktop)
   - Tema profesional con gradientes y animaciones
   - Notificaciones toast para feedback
   - Modales para formularios
   - Iconos de Bootstrap Icons

## 🚀 Cómo Usar

### Instalación

1. **Descarga los archivos:**
   - index.html
   - style.css
   - localStorage.js
   - app.js

2. **Abre el archivo index.html en tu navegador**
   - Doble clic en index.html
   - O arrastra el archivo a tu navegador
   - O usa un servidor local (Live Server en VS Code)

### Primer Uso

1. **Inicia sesión con el usuario por defecto:**
   - **Usuario:** admin
   - **Contraseña:** admin123
   - Este usuario tiene permisos de Administrador

2. **Explora el sistema:**
   - La aplicación viene con datos de ejemplo pre-cargados
   - Navega por las diferentes secciones usando el menú lateral

### Gestión de Usuarios (solo Administrador)

**Crear Nuevo Usuario:**
1. Ve a la sección "Usuarios"
2. Haz clic en "Nuevo Usuario"
3. Completa el formulario:
   - Nombre de usuario (único, sin espacios)
   - Nombre completo
   - Email
   - Contraseña (mínimo 6 caracteres)
   - Rol (Empleado o Administrador)
4. Haz clic en "Guardar"

**Editar Usuario:**
1. En la tabla de usuarios, haz clic en el botón amarillo (editar)
2. Modifica los campos necesarios
3. Guarda los cambios

**Eliminar Usuario:**
1. Haz clic en el botón rojo (eliminar)
2. Confirma la eliminación
3. **Nota:** No puedes eliminar tu propio usuario ni el último administrador del sistema

### Gestión de Productos

**Agregar Producto:**
1. Ve a la sección "Productos"
2. Haz clic en "Nuevo Producto"
3. Completa el formulario:
   - Nombre del producto
   - Categoría
   - Stock inicial
   - Precio
   - Stock mínimo (para alertas)
4. Haz clic en "Guardar"

**Editar Producto:**
1. En la tabla de productos, haz clic en el botón amarillo (editar)
2. Modifica los campos necesarios
3. Guarda los cambios

**Eliminar Producto (solo Administrador):**
1. Haz clic en el botón rojo (eliminar)
2. Confirma la eliminación

### Registrar Movimientos

**Nueva Entrada:**
1. Ve a "Movimientos"
2. Haz clic en "Nueva Entrada" (botón verde)
3. Selecciona el producto
4. Ingresa la cantidad
5. Selecciona el motivo (Compra, Devolución, etc.)
6. Agrega notas si es necesario
7. Registra

**Nueva Salida:**
1. Haz clic en "Nueva Salida" (botón rojo)
2. Selecciona el producto
3. Ingresa la cantidad (debe ser ≤ stock disponible)
4. Selecciona el motivo (Venta, Pérdida, etc.)
5. Registra

### Gestión de Categorías (solo Administrador)

1. Ve a "Categorías"
2. Haz clic en "Nueva Categoría"
3. Ingresa el nombre
4. Selecciona un color
5. Guarda

**Nota:** No puedes eliminar categorías que tengan productos asignados.

### Ver Estadísticas (solo Administrador)

La sección "Estadísticas" muestra:
- Top 5 productos más vendidos
- Stock distribuido por categoría
- Movimientos del mes actual
- Gráfico de entradas/salidas de los últimos 7 días

## 🔧 Estructura de Archivos

```
proyecto/
│
├── index.html          # Estructura HTML principal
├── style.css           # Estilos personalizados y diseño
├── localStorage.js     # Gestión de persistencia de datos
├── app.js              # Lógica de negocio y control de UI
└── README.md           # Este archivo
```

## 💾 Estructura de Datos

### Usuarios
```javascript
{
  id: 1,
  username: "admin",
  password: "admin123", // En producción usar hash
  fullName: "Administrador Principal",
  role: "admin", // o "employee"
  email: "admin@inventario.com",
  createdAt: "2026-02-14T00:00:00.000Z"
}
```

### Productos
```javascript
{
  id: 1,
  name: "Laptop HP",
  category: "Electrónica",
  stock: 15,
  price: 899.99,
  minStock: 5
}
```

### Movimientos
```javascript
{
  id: 1,
  productId: 1,
  productName: "Laptop HP",
  type: "entrada", // o "salida"
  quantity: 10,
  reason: "Compra a proveedor",
  date: "2026-02-14",
  notes: "Pedido mensual"
}
```

### Categorías
```javascript
{
  id: 1,
  name: "Electrónica",
  color: "#6366f1"
}
```

## 🎨 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones
- **Bootstrap 5.3** - Framework CSS responsivo
- **Bootstrap Icons** - Iconografía
- **JavaScript Vanilla** - Lógica de negocio (sin frameworks)
- **localStorage** - Persistencia de datos en navegador
- **Chart.js** - Gráficos estadísticos

## 📱 Compatibilidad

- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles (responsive)

## ⚠️ Limitaciones

Este es un proyecto educativo/demostrativo con las siguientes limitaciones:

1. **Sin backend:** Los datos solo existen en el navegador local
2. **localStorage:** Límite de ~5-10MB de almacenamiento
3. **Sin autenticación real:** Las contraseñas se almacenan en texto plano (en producción usar bcrypt o similar)
4. **No hay sincronización:** Los datos no se comparten entre dispositivos
5. **Validación solo cliente:** En producción se requiere validación en servidor

## 🔐 Notas de Seguridad

- Los datos en localStorage NO están encriptados
- Las contraseñas se almacenan en texto plano (SOLO para propósitos educativos)
- Cualquier persona con acceso a las DevTools puede ver/modificar los datos
- En producción, implementar un backend con autenticación real (JWT, OAuth)
- Usar hashing de contraseñas (bcrypt, argon2)
- No almacenar información sensible en localStorage

## 🚀 Próximos Pasos (Para Producción)

1. Implementar backend (Node.js, Python, etc.)
2. Migrar a base de datos real (PostgreSQL, MongoDB)
3. Añadir autenticación JWT o OAuth
4. Implementar validación del lado del servidor
5. Tests automatizados
6. PWA para uso offline
7. Exportación de reportes PDF/Excel
8. Notificaciones push

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado como proyecto educativo de gestión de inventario.

---

**¡Gracias por usar el Sistema de Gestión de Inventario!** 🎉

Para soporte o preguntas, revisa la documentación en el PDF adjunto.
