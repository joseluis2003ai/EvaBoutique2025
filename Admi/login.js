document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let currentSection = 'dashboard';
    let products = [];
    let categories = ['Ropa', 'Accesorios', 'Calzado', 'Belleza'];
    
    // Elementos del DOM
    const dashboardSection = document.querySelector('.dashboard-section');
    const productsSection = document.getElementById('products-section');
    const productFormSection = document.getElementById('product-form-section');
    const productsTable = document.getElementById('products-table').querySelector('tbody');
    const productForm = document.getElementById('product-form');
    const categoryFilter = document.getElementById('category-filter');
    const searchProductInput = document.getElementById('search-product');
    const filterBtn = document.getElementById('filter-btn');
    const addProductBtn = document.getElementById('add-product-btn');
    const backToListBtn = document.getElementById('back-to-list');
    const cancelFormBtn = document.getElementById('cancel-form');
    const formTitle = document.getElementById('form-title');
    const productIdInput = document.getElementById('product-id');
    
    // Contadores del dashboard
    const ordersCount = document.getElementById('orders-count');
    const productsCount = document.getElementById('products-count');
    const customersCount = document.getElementById('customers-count');
    const lowStockCount = document.getElementById('low-stock-count');
    
    // Inicialización
    initCategories();
    loadSampleProducts();
    updateDashboardCounts();
    
    // Event Listeners
    document.querySelectorAll('.menu li a').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            
            if (target === 'agregar-producto') {
                showProductForm();
            } else if (target === 'lista-productos') {
                showProductsList();
            } else {
                // Para otras secciones (simulación)
                currentSection = target;
                updateUI();
                alert(`Sección ${target} será implementada próximamente`);
            }
        });
    });
    
    addProductBtn.addEventListener('click', showProductForm);
    backToListBtn.addEventListener('click', showProductsList);
    cancelFormBtn.addEventListener('click', showProductsList);
    
    filterBtn.addEventListener('click', filterProducts);
    searchProductInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') filterProducts();
    });
    
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
    
    // Funciones
    function initCategories() {
        // Llenar filtro de categorías
        categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
        categories.forEach(cat => {
            categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
        
        // Llenar selector de categorías en el formulario
        const productCategory = document.getElementById('product-category');
        productCategory.innerHTML = '<option value="">Seleccione una categoría</option>';
        categories.forEach(cat => {
            productCategory.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
    }
    
    function loadSampleProducts() {
        // Datos de ejemplo (serán reemplazados por tus datos reales)
        products = [
            {id: 1, nombre: 'Vestido Floral', categoria: 'Ropa', precio: 59.99, stock: 15, imagen: '', descripcion: 'Vestido de verano con estampado floral', activo: true},
            {id: 2, nombre: 'Bolso de Mano', categoria: 'Accesorios', precio: 39.99, stock: 8, imagen: '', descripcion: 'Bolso elegante para ocasiones especiales', activo: true},
            {id: 3, nombre: 'Zapatos de Tacón', categoria: 'Calzado', precio: 79.99, stock: 5, imagen: '', descripcion: 'Zapatos cómodos para todo el día', activo: true},
            {id: 4, nombre: 'Crema Hidratante', categoria: 'Belleza', precio: 24.99, stock: 2, imagen: '', descripcion: 'Hidratación profunda para la piel', activo: false}
        ];
        
        renderProductsTable();
    }
    
    function renderProductsTable() {
        productsTable.innerHTML = '';
        
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.id}</td>
                <td>${product.nombre}</td>
                <td>${product.categoria}</td>
                <td>$${product.precio.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td class="${product.activo ? 'status-active' : 'status-inactive'}">
                    ${product.activo ? 'Activo' : 'Inactivo'}
                </td>
                <td>
                    <button class="btn btn-secondary edit-product" data-id="${product.id}">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="btn btn-danger delete-product" data-id="${product.id}">
                        <span class="material-icons">delete</span>
                    </button>
                </td>
            `;
            productsTable.appendChild(tr);
        });
        
        // Agregar event listeners a los botones de editar y eliminar
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                editProduct(productId);
            });
        });
        
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                deleteProduct(productId);
            });
        });
    }
    
    function filterProducts() {
        const category = categoryFilter.value;
        const searchTerm = searchProductInput.value.toLowerCase();
        
        const filteredProducts = products.filter(product => {
            const matchesCategory = category === '' || product.categoria === category;
            const matchesSearch = product.nombre.toLowerCase().includes(searchTerm) || 
                                 product.descripcion.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        
        // Actualizar la tabla con los productos filtrados
        productsTable.innerHTML = '';
        
        filteredProducts.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.id}</td>
                <td>${product.nombre}</td>
                <td>${product.categoria}</td>
                <td>$${product.precio.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td class="${product.activo ? 'status-active' : 'status-inactive'}">
                    ${product.activo ? 'Activo' : 'Inactivo'}
                </td>
                <td>
                    <button class="btn btn-secondary edit-product" data-id="${product.id}">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="btn btn-danger delete-product" data-id="${product.id}">
                        <span class="material-icons">delete</span>
                    </button>
                </td>
            `;
            productsTable.appendChild(tr);
        });
        
        // Agregar event listeners a los botones de editar y eliminar
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                editProduct(productId);
            });
        });
        
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                deleteProduct(productId);
            });
        });
    }
    
    function showProductForm(product = null) {
        if (product) {
            // Modo edición
            formTitle.textContent = 'Editar Producto';
            productIdInput.value = product.id;
            document.getElementById('product-name').value = product.nombre;
            document.getElementById('product-category').value = product.categoria;
            document.getElementById('product-price').value = product.precio;
            document.getElementById('product-stock').value = product.stock;
            document.getElementById('product-status').value = product.activo ? '1' : '0';
            document.getElementById('product-image').value = product.imagen;
            document.getElementById('product-description').value = product.descripcion;
            
            // Mostrar vista previa de la imagen si existe
            const imagePreview = document.getElementById('image-preview');
            if (product.imagen) {
                imagePreview.innerHTML = `<img src="${product.imagen}" alt="Preview">`;
                imagePreview.classList.remove('hidden');
            } else {
                imagePreview.classList.add('hidden');
            }
        } else {
            // Modo nuevo producto
            formTitle.textContent = 'Agregar Nuevo Producto';
            productForm.reset();
            productIdInput.value = '';
            document.getElementById('image-preview').classList.add('hidden');
        }
        
        // Mostrar formulario y ocultar otras secciones
        currentSection = 'product-form';
        updateUI();
    }
    
    function showProductsList() {
        currentSection = 'products-list';
        updateUI();
        renderProductsTable();
    }
    
    function editProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            showProductForm(product);
        }
    }
    
    function deleteProduct(productId) {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            products = products.filter(p => p.id !== productId);
            renderProductsTable();
            updateDashboardCounts();
            alert('Producto eliminado correctamente');
        }
    }
    
    function saveProduct() {
        const id = productIdInput.value ? parseInt(productIdInput.value) : generateNewId();
        const nombre = document.getElementById('product-name').value;
        const categoria = document.getElementById('product-category').value;
        const precio = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const activo = document.getElementById('product-status').value === '1';
        const imagen = document.getElementById('product-image').value;
        const descripcion = document.getElementById('product-description').value;
        
        const productData = {
            id,
            nombre,
            categoria,
            precio,
            stock,
            activo,
            imagen,
            descripcion
        };
        
        if (productIdInput.value) {
            // Editar producto existente
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = productData;
            }
        } else {
            // Agregar nuevo producto
            products.push(productData);
        }
        
        showProductsList();
        updateDashboardCounts();
        alert('Producto guardado correctamente');
    }
    
    function generateNewId() {
        const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
        return maxId + 1;
    }
    
    function updateDashboardCounts() {
        // Actualizar contadores (simulados)
        ordersCount.textContent = Math.floor(Math.random() * 50);
        productsCount.textContent = products.length;
        customersCount.textContent = Math.floor(Math.random() * 100);
        
        // Contar productos con stock bajo (menos de 5 unidades)
        const lowStockProducts = products.filter(p => p.stock < 5);
        lowStockCount.textContent = lowStockProducts.length;
    }
    
    function updateUI() {
        // Ocultar todas las secciones
        dashboardSection.classList.add('hidden');
        productsSection.classList.add('hidden');
        productFormSection.classList.add('hidden');
        
        // Mostrar la sección actual
        if (currentSection === 'dashboard') {
            dashboardSection.classList.remove('hidden');
        } else if (currentSection === 'products-list') {
            productsSection.classList.remove('hidden');
        } else if (currentSection === 'product-form') {
            productFormSection.classList.remove('hidden');
        }
        
        // Actualizar menú activo
        document.querySelectorAll('.menu li').forEach(item => {
            item.classList.remove('active');
        });
        
        if (currentSection === 'products-list' || currentSection === 'product-form') {
            document.querySelector('.menu li:nth-child(2)').classList.add('active');
        }
    }
    
    // Event listener para vista previa de imagen
    document.getElementById('product-image').addEventListener('input', function() {
        const imageUrl = this.value;
        const imagePreview = document.getElementById('image-preview');
        
        if (imageUrl) {
            imagePreview.innerHTML = `<img src="${imageUrl}" alt="Preview" onerror="this.parentElement.classList.add('hidden')">`;
            imagePreview.classList.remove('hidden');
        } else {
            imagePreview.classList.add('hidden');
        }
    });
});