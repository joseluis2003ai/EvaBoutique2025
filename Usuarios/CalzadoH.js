// Datos de productos de calzado para hombre
const productosCalzadoHombre = [
    {
        id: 1,
        nombre: "Zapatos Formales Negros",
        precio: 2299,
        imagen: "https://via.placeholder.com/300?text=Zapatos+Formales",
        categoria: "formales",
        talla: "42",
        tipo: "Oxford"
    },
    {
        id: 2,
        nombre: "Zapatillas Running",
        precio: 1899,
        imagen: "https://via.placeholder.com/300?text=Zapatillas+Running",
        categoria: "deportivos",
        talla: "44",
        tipo: "Running"
    },
    {
        id: 3,
        nombre: "Botas de Cuero",
        precio: 2599,
        imagen: "https://via.placeholder.com/300?text=Botas+Cuero",
        categoria: "botas",
        talla: "43",
        tipo: "Chelsea"
    },
    {
        id: 4,
        nombre: "Sneakers Urbanos",
        precio: 1799,
        imagen: "https://via.placeholder.com/300?text=Sneakers+Urbanos",
        categoria: "sneakers",
        talla: "41",
        tipo: "Casual"
    },
    {
        id: 5,
        nombre: "Mocasines Elegantes",
        precio: 1999,
        imagen: "https://via.placeholder.com/300?text=Mocasines",
        categoria: "formales",
        talla: "40",
        tipo: "Driver"
    },
    {
        id: 6,
        nombre: "Sandalias Trekking",
        precio: 1499,
        imagen: "https://via.placeholder.com/300?text=Sandalias+Trekking",
        categoria: "sandalias",
        talla: "45",
        tipo: "Aventura"
    }
];

// Clase Producto adaptada para calzado de hombre
class CalzadoHombre {
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
                    <span class="product-card__size">EU ${this.talla}</span>
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

// Clase CalzadoHombreController
class CalzadoHombreController {
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
        this.productsGrid.innerHTML = productosCalzadoHombre
            .filter(producto => this.currentFilter === 'todos' || producto.categoria === this.currentFilter)
            .map(producto => {
                const p = new CalzadoHombre(
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
 // Búsqueda corregida
    document.querySelector('.products-search__input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.product-card').forEach(card => {
            const name = card.querySelector('.product-card__name').textContent.toLowerCase();
            const notes = card.querySelector('.product-card__notes').textContent.toLowerCase();
            card.style.display = (name.includes(searchTerm) || notes.includes(searchTerm)) ? 'block' : 'none';
            });
        });
    }

    setupProductButtons() {
        document.querySelectorAll('.product-card__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const producto = productosCalzadoHombre.find(p => p.id === productId);
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
            title: '¡Calzado añadido!',
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
    const calzadoController = new CalzadoHombreController();
    calzadoController.init();
});