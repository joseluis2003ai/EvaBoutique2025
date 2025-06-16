// Datos de productos (simulando respuesta de API)
const productos = [
    {
        id: 1,
        nombre: "Vestido Floral",
        precio: 1299,
        imagen: "IMAGNES/tamara-bellis-68csPWTnafo-unsplash (1).jpg",
        categoria: "vestidos"
    },
    {
        id: 2,
        nombre: "Blusa de Seda",
        precio: 899,
        imagen: "IMAGNES/marek-mucha-bx_epRVS9vg-unsplash.jpg",
        categoria: "camisas"
    },
    {
        id: 3,
        nombre: "Pantalón Elegante",
        precio: 1099,
        imagen: "IMAGNES/lance-reis-lEZ5hbm4YWE-unsplash.jpg",
        categoria: "pantalones"
    },
    {
        id: 4,
        nombre: "Abrigo Moderno",
        precio: 1799,
        imagen: "IMAGNES/bundo-kim-zkHv9pvrE9U-unsplash.jpg",
        categoria: "abrigos"
    }
];

// Clase Producto
class Producto {
    constructor(id, nombre, precio, imagen, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria;
    }

    render() {
        return `
            <article class="product-card" data-category="${this.categoria}">
                <div class="product-card__image">
                    <img src="${this.imagen}" alt="${this.nombre}" class="product-card__img">
                </div>
                <div class="product-card__info">
                    <h3 class="product-card__name">${this.nombre}</h3>
                    <p class="product-card__price">$${this.precio.toFixed(2)}</p>
                    <button class="product-card__btn" data-id="${this.id}">
                        Añadir al carrito
                    </button>
                </div>
            </article>
        `;
    }
}

// Clase ProductoController
class ProductoController {
    constructor() {
        this.productsGrid = document.getElementById('productsGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'todos';
        this.carrito = [];
    }

    init() {
        this.renderProducts();
        this.setupEventListeners();
    }

    renderProducts() {
        this.productsGrid.innerHTML = productos
            .filter(producto => this.currentFilter === 'todos' || producto.categoria === this.currentFilter)
            .map(producto => {
                const p = new Producto(
                    producto.id,
                    producto.nombre,
                    producto.precio,
                    producto.imagen,
                    producto.categoria
                );
                return p.render();
            })
            .join('');

        // Actualizar listeners de botones
        this.setupProductButtons();
    }

    setupEventListeners() {
        // Filtros
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
                btn.classList.add('filter-btn--active');
                this.currentFilter = btn.textContent.toLowerCase();
                this.renderProducts();
            });
        });

        // Búsqueda
        document.querySelector('.products-search__input').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('.product-card').forEach(card => {
                const name = card.querySelector('.product-card__name').textContent.toLowerCase();
                card.style.display = name.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }

    setupProductButtons() {
        document.querySelectorAll('.product-card__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const producto = productos.find(p => p.id === productId);
                this.agregarAlCarrito(producto);
            });
        });
    }

    agregarAlCarrito(producto) {
        this.carrito.push(producto);
        this.mostrarNotificacion(`${producto.nombre} añadido al carrito`);
        console.log('Carrito actual:', this.carrito);
    }

    mostrarNotificacion(mensaje) {
        alert(mensaje); // Puedes reemplazar esto con un toast notification
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const productoController = new ProductoController();
    productoController.init();
});