// Datos de productos de ropa para hombre
const productosRopaHombre = [
    {
        id: 1,
        nombre: "Camisa Formal Azul",
        precio: 899,
        imagen: "https://via.placeholder.com/300?text=Camisa+Formal",
        categoria: "camisas",
        talla: "M",
        tipo: "Camisa manga larga"
    },
    {
        id: 2,
        nombre: "Pantalón Chino Beige",
        precio: 1099,
        imagen: "https://via.placeholder.com/300?text=Pantalon+Chino",
        categoria: "pantalones",
        talla: "32",
        tipo: "Pantalón casual"
    },
    {
        id: 3,
        nombre: "Camiseta Básica Blanca",
        precio: 499,
        imagen: "https://via.placeholder.com/300?text=Camiseta+Blanca",
        categoria: "camisetas",
        talla: "L",
        tipo: "Camiseta básica"
    },
    {
        id: 4,
        nombre: "Chaqueta Denim",
        precio: 1499,
        imagen: "https://via.placeholder.com/300?text=Chaqueta+Denim",
        categoria: "abrigos",
        talla: "XL",
        tipo: "Chaqueta de mezclilla"
    },
    {
        id: 5,
        nombre: "Jeans Slim Fit",
        precio: 1199,
        imagen: "https://via.placeholder.com/300?text=Jeans+Slim",
        categoria: "jeans",
        talla: "34",
        tipo: "Jeans ajustados"
    },
    {
        id: 6,
        nombre: "Suéter de Lana",
        precio: 1299,
        imagen: "https://via.placeholder.com/300?text=Sueter+Lana",
        categoria: "abrigos",
        talla: "M",
        tipo: "Suéter tejido"
    }
];

// Clase Producto adaptada para ropa de hombre
class PrendaHombre {
    constructor(id, nombre, precio, imagen, categoria, talla, tipo) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria;
        this.talla = talla;
        this.tipo = tipo;
    }

    render() {
        return `
            <article class="product-card" data-category="${this.categoria}">
                <div class="product-card__image">
                    <span class="product-card__size">Talla: ${this.talla}</span>
                    <img src="${this.imagen}" alt="${this.nombre}" class="product-card__img">
                </div>
                <div class="product-card__info">
                    <h3 class="product-card__name">${this.nombre}</h3>
                    <p class="product-card__type">${this.tipo}</p>
                    <p class="product-card__price">$${this.precio.toFixed(2)}</p>
                    <button class="product-card__btn" data-id="${this.id}">
                        Añadir al carrito
                    </button>
                </div>
            </article>
        `;
    }
}

// Clase RopaHombreController
class RopaHombreController {
    constructor() {
        this.productsGrid = document.getElementById('productsGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'todo';
        this.carrito = [];
    }

    init() {
        this.renderProducts();
        this.setupEventListeners();
    }

    renderProducts() {
        this.productsGrid.innerHTML = productosRopaHombre
            .filter(producto => this.currentFilter === 'todo' || producto.categoria === this.currentFilter)
            .map(producto => {
                const p = new PrendaHombre(
                    producto.id,
                    producto.nombre,
                    producto.precio,
                    producto.imagen,
                    producto.categoria,
                    producto.talla,
                    producto.tipo
                );
                return p.render();
            })
            .join('');

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
                const type = card.querySelector('.product-card__type').textContent.toLowerCase();
                card.style.display = (name.includes(searchTerm) || type.includes(searchTerm)) ? 'block' : 'none';
            });
        });
    }

    setupProductButtons() {
        document.querySelectorAll('.product-card__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const producto = productosRopaHombre.find(p => p.id === productId);
                this.agregarAlCarrito(producto);
            });
        });
    }

    agregarAlCarrito(producto) {
        this.carrito.push(producto);
        this.mostrarNotificacion(`¡${producto.nombre} añadido al carrito!`);
        console.log('Carrito actual:', this.carrito);
    }

    mostrarNotificacion(mensaje) {
        Swal.fire({
            icon: 'success',
            title: '¡Prenda añadida!',
            text: mensaje,
            confirmButtonText: 'Continuar',
            timer: 2000,
            timerProgressBar: true,
            background: '#f0f8ff',
            iconColor: '#3498db'
        });
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const ropaHombreController = new RopaHombreController();
    ropaHombreController.init();
});