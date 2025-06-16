// Datos de productos de bolsos para mujer
const productosBolsos = [
    {
        id: 1,
        nombre: "Bandolera de Cuero",
        precio: 2499,
        imagen: "https://via.placeholder.com/300?text=Bandolera+Cuero",
        categoria: "bandolera",
        material: "Cuero genuino"
    },
    {
        id: 2,
        nombre: "Tote Grande",
        precio: 1899,
        imagen: "https://via.placeholder.com/300?text=Tote+Grande",
        categoria: "tote",
        material: "Lona"
    },
    {
        id: 3,
        nombre: "Clutch Elegante",
        precio: 1599,
        imagen: "https://via.placeholder.com/300?text=Clutch+Elegante",
        categoria: "clutch",
        material: "Sintético"
    },
    {
        id: 4,
        nombre: "Mochila de Moda",
        precio: 2199,
        imagen: "https://via.placeholder.com/300?text=Mochila+Moda",
        categoria: "mochila",
        material: "Cuero vegano"
    },
    {
        id: 5,
        nombre: "Bolso de Mano Clásico",
        precio: 2999,
        imagen: "https://via.placeholder.com/300?text=Bolso+Mano",
        categoria: "bolso de mano",
        material: "Cuero italiano"
    },
    {
        id: 6,
        nombre: "Mini Bandolera",
        precio: 1399,
        imagen: "https://via.placeholder.com/300?text=Mini+Bandolera",
        categoria: "bandolera",
        material: "Poliuretano"
    }
];

// Clase Producto adaptada para bolsos
class Bolso {
    constructor(id, nombre, precio, imagen, categoria, material) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria;
        this.material = material;
    }

    render() {
        return `
            <article class="product-card" data-category="${this.categoria}">
                <div class="product-card__image">
                    <img src="${this.imagen}" alt="${this.nombre}" class="product-card__img">
                </div>
                <div class="product-card__info">
                    <h3 class="product-card__name">${this.nombre}</h3>
                    <p class="product-card__material">${this.material}</p>
                    <p class="product-card__price">$${this.precio.toFixed(2)}</p>
                    <button class="product-card__btn" data-id="${this.id}">
                        Añadir al carrito
                    </button>
                </div>
            </article>
        `;
    }
}

// Clase BolsosController
class BolsosController {
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
        this.productsGrid.innerHTML = productosBolsos
            .filter(producto => this.currentFilter === 'todos' || producto.categoria === this.currentFilter)
            .map(producto => {
                const p = new Bolso(
                    producto.id,
                    producto.nombre,
                    producto.precio,
                    producto.imagen,
                    producto.categoria,
                    producto.material
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
                card.style.display = name.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }

    setupProductButtons() {
        document.querySelectorAll('.product-card__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const producto = productosBolsos.find(p => p.id === productId);
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
            title: '¡Bolso añadido!',
            text: mensaje,
            confirmButtonText: 'Continuar',
            timer: 2000,
            timerProgressBar: true,
            background: '#fff9f2',
            iconColor: '#e67e22'
        });
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const bolsosController = new BolsosController();
    bolsosController.init();
});