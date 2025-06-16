// Datos de productos de calzado para mujer
const productosCalzado = [
    {
        id: 1,
        nombre: "Tacones Altos Nude",
        precio: 1599,
        imagen: "https://via.placeholder.com/300?text=Tacones+Nude",
        categoria: "tacones"
    },
    {
        id: 2,
        nombre: "Zapatillas Deportivas",
        precio: 1299,
        imagen: "https://via.placeholder.com/300?text=Zapatillas+Deportivas",
        categoria: "deportivos"
    },
    {
        id: 3,
        nombre: "Sandalias Plateadas",
        precio: 899,
        imagen: "https://via.placeholder.com/300?text=Sandalias+Plateadas",
        categoria: "sandalias"
    },
    {
        id: 4,
        nombre: "Botas de Cuero",
        precio: 1999,
        imagen: "https://via.placeholder.com/300?text=Botas+Cuero",
        categoria: "botas"
    },
    {
        id: 5,
        nombre: "Mocasines Elegantes",
        precio: 1199,
        imagen: "https://via.placeholder.com/300?text=Mocasines",
        categoria: "todos"
    },
    {
        id: 6,
        nombre: "Tacones Rojos",
        precio: 1399,
        imagen: "https://via.placeholder.com/300?text=Tacones+Rojos",
        categoria: "tacones"
    }
];

// Clase Producto (igual que antes)
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

// Clase ProductoController (con ajustes para calzado)
class CalzadoController {
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
        this.productsGrid.innerHTML = productosCalzado
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
                const producto = productosCalzado.find(p => p.id === productId);
                this.agregarAlCarrito(producto);
            });
        });
    }

    agregarAlCarrito(producto) {
        this.carrito.push(producto);
        this.mostrarNotificacion(`¡${producto.nombre} añadidas al carrito!`);
        console.log('Carrito actual:', this.carrito);
    }

    mostrarNotificacion(mensaje) {
        // Mejorado: Usando SweetAlert o similar en producción
        Swal.fire({
            icon: 'success',
            title: 'Producto añadido',
            text: mensaje,
            confirmButtonText: 'Continuar',
            timer: 2000,
            timerProgressBar: true
        });
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const calzadoController = new CalzadoController();
    calzadoController.init();
});