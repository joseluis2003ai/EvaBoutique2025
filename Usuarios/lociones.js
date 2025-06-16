// Datos de productos de lociones para mujer
const productosLociones = [
    {
        id: 1,
        nombre: "Fragancia Floral",
        precio: 1299,
        imagen: "https://via.placeholder.com/300?text=Fragancia+Floral",
        categoria: "florales",
        tamaño: "100ml",
        notas: "Rosas, jazmín y vainilla"
    },
    {
        id: 2,
        nombre: "Esencia Frutal",
        precio: 1199,
        imagen: "https://via.placeholder.com/300?text=Esencia+Frutal",
        categoria: "frutales",
        tamaño: "50ml",
        notas: "Pera, mango y bergamota"
    },
    {
        id: 3,
        nombre: "Aroma Oriental",
        precio: 1499,
        imagen: "https://via.placeholder.com/300?text=Aroma+Oriental",
        categoria: "oriental",
        tamaño: "100ml",
        notas: "Ámbar, sándalo y vainilla"
    },
    {
        id: 4,
        nombre: "Perfume Amaderado",
        precio: 1399,
        imagen: "https://via.placeholder.com/300?text=Perfume+Amaderado",
        categoria: "amaderadas",
        tamaño: "75ml",
        notas: "Pachulí, sándalo y musk"
    },
    {
        id: 5,
        nombre: "Bruma Corporal",
        precio: 899,
        imagen: "https://via.placeholder.com/300?text=Bruma+Corporal",
        categoria: "florales",
        tamaño: "200ml",
        notas: "Peonía y algodón de azúcar"
    },
    {
        id: 6,
        nombre: "Agua de Colonia",
        precio: 999,
        imagen: "https://via.placeholder.com/300?text=Agua+de+Colonia",
        categoria: "frutales",
        tamaño: "150ml",
        notas: "Limón, naranja y lavanda"
    }
];

// Clase Producto adaptada para lociones
class Locion {
    constructor(id, nombre, precio, imagen, categoria, tamaño, notas) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria;
        this.tamaño = tamaño;
        this.notas = notas;
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
                    <p class="product-card__price">$${this.precio.toFixed(2)}</p>
                    <button class="product-card__btn" data-id="${this.id}">
                        Añadir al carrito
                    </button>
                </div>
            </article>
        `;
    }
}

// Clase LocionesController
class LocionesController {
    constructor() {
        this.productsGrid = document.getElementById('productsGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'todas';
        this.carrito = [];
    }

    init() {
        this.renderProducts();
        this.setupEventListeners();
    }

    renderProducts() {
        this.productsGrid.innerHTML = productosLociones
            .filter(producto => this.currentFilter === 'todas' || producto.categoria === this.currentFilter)
            .map(producto => {
                const p = new Locion(
                    producto.id,
                    producto.nombre,
                    producto.precio,
                    producto.imagen,
                    producto.categoria,
                    producto.tamaño,
                    producto.notas
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
            const notes = card.querySelector('.product-card__notes').textContent.toLowerCase();
            card.style.display = (name.includes(searchTerm) || notes.includes(searchTerm)) ? 'block' : 'none';
            });
        });
    }

    setupProductButtons() {
        document.querySelectorAll('.product-card__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const producto = productosLociones.find(p => p.id === productId);
                this.agregarAlCarrito(producto);
            });
        });
    }

    agregarAlCarrito(producto) {
        this.carrito.push(producto);
        this.mostrarNotificacion(`¡${producto.nombre} añadida al carrito!`);
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
            background: '#f9f0ff',
            iconColor: '#9b59b6'
        });
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const locionesController = new LocionesController();
    locionesController.init();
});