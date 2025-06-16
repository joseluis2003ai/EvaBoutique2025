// Datos de productos de lociones para hombre
const productosLocionesHombre = [
    {
        id: 1,
        nombre: "Eau de Toilette Clásica",
        precio: 1599,
        imagen: "https://via.placeholder.com/300?text=EDT+Clásica",
        categoria: "amaderadas",
        tamaño: "100ml",
        notas: "Sándalo, pachulí y bergamota",
        intensidad: "Eau de Toilette"
    },
    {
        id: 2,
        nombre: "Fragancia Cítrica",
        precio: 1399,
        imagen: "https://via.placeholder.com/300?text=Fragancia+Cítrica",
        categoria: "cítricas",
        tamaño: "75ml",
        notas: "Limón, mandarina y vetiver",
        intensidad: "Eau de Parfum"
    },
    {
        id: 3,
        nombre: "Perfume Aromático",
        precio: 1799,
        imagen: "https://via.placeholder.com/300?text=Perfume+Aromático",
        categoria: "aromáticas",
        tamaño: "50ml",
        notas: "Lavanda, romero y almizcle",
        intensidad: "Perfume"
    },
    {
        id: 4,
        nombre: "Colonia Ambarina",
        precio: 1499,
        imagen: "https://via.placeholder.com/300?text=Colonia+Ambarina",
        categoria: "ambarinas",
        tamaño: "125ml",
        notas: "Ámbar, vainilla y cuero",
        intensidad: "Eau de Cologne"
    },
    {
        id: 5,
        nombre: "After Shave Fresh",
        precio: 899,
        imagen: "https://via.placeholder.com/300?text=After+Shave",
        categoria: "cítricas",
        tamaño: "150ml",
        notas: "Menta, eucalipto y limón",
        intensidad: "After Shave"
    }
];

// Clase Producto adaptada para lociones hombre
class LocionHombre {
    constructor(id, nombre, precio, imagen, categoria, tamaño, notas, intensidad) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria;
        this.tamaño = tamaño;
        this.notas = notas;
        this.intensidad = intensidad;
    }

    render() {
        return `
            <article class="product-card" data-category="${this.categoria}">
                <div class="product-card__image">
                    <span class="product-card__size">${this.tamaño}</span>
                    <img src="${this.imagen}" alt="${this.nombre}" class="product-card__img">
                </div>
                <div class="product-card__info">
                    <h3 class="product-card__name">${this.nombre}</h3>
                    <p class="product-card__notes">${this.notas}</p>
                    <p class="product-card__intensity">${this.intensidad}</p>
                    <p class="product-card__price">$${this.precio.toFixed(2)}</p>
                    <button class="product-card__btn" data-id="${this.id}">
                        Añadir al carrito
                    </button>
                </div>
            </article>
        `;
    }
}

// Clase LocionesHombreController
class LocionesHombreController {
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
        this.productsGrid.innerHTML = productosLocionesHombre
            .filter(producto => this.currentFilter === 'todos' || producto.categoria === this.currentFilter)
            .map(producto => {
                const p = new LocionHombre(
                    producto.id,
                    producto.nombre,
                    producto.precio,
                    producto.imagen,
                    producto.categoria,
                    producto.tamaño,
                    producto.notas,
                    producto.intensidad
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
                const producto = productosLocionesHombre.find(p => p.id === productId);
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
            title: '¡Fragancia añadida!',
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
    const locionesController = new LocionesHombreController();
    locionesController.init();
});