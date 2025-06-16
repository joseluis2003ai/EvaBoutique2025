// Datos de productos de skin care para mujer
const productosSkincare = [
    {
        id: 1,
        nombre: "Limpiador Facial",
        precio: 899,
        imagen: "https://via.placeholder.com/300?text=Limpiador+Facial",
        categoria: "limpieza",
        tipoPiel: "Todos",
        ingredientes: "Ácido hialurónico, té verde",
        beneficios: "Limpia profundamente sin resecar"
    },
    {
        id: 2,
        nombre: "Crema Hidratante",
        precio: 1299,
        imagen: "https://via.placeholder.com/300?text=Crema+Hidratante",
        categoria: "hidratación",
        tipoPiel: "Seca",
        ingredientes: "Ácido hialurónico, manteca de karité",
        beneficios: "Hidratación 24h, piel suave"
    },
    {
        id: 3,
        nombre: "Serum Anti-edad",
        precio: 1599,
        imagen: "https://via.placeholder.com/300?text=Serum+Anti-edad",
        categoria: "anti-edad",
        tipoPiel: "Madura",
        ingredientes: "Retinol, vitamina C",
        beneficios: "Reduce arrugas, uniformiza tono"
    },
    {
        id: 4,
        nombre: "Protector Solar",
        precio: 999,
        imagen: "https://via.placeholder.com/300?text=Protector+Solar",
        categoria: "protección",
        tipoPiel: "Todos",
        ingredientes: "SPF 50+, antioxidantes",
        beneficios: "Protección UVA/UVB, hidratación"
    },
    {
        id: 5,
        nombre: "Mascarilla de Arcilla",
        precio: 799,
        imagen: "https://via.placeholder.com/300?text=Mascarilla+Arcilla",
        categoria: "mascarillas",
        tipoPiel: "Grasa",
        ingredientes: "Arcilla verde, zinc",
        beneficios: "Purifica, controla brillos"
    },
    {
        id: 6,
        nombre: "Contorno de Ojos",
        precio: 1199,
        imagen: "https://via.placeholder.com/300?text=Contorno+Ojos",
        categoria: "anti-edad",
        tipoPiel: "Sensible",
        ingredientes: "Cafeína, péptidos",
        beneficios: "Reduce ojeras, desinflama"
    }
];

// Clase Producto adaptada para skin care
class SkincareProduct {
    constructor(id, nombre, precio, imagen, categoria, tipoPiel, ingredientes, beneficios) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria;
        this.tipoPiel = tipoPiel;
        this.ingredientes = ingredientes;
        this.beneficios = beneficios;
    }

    render() {
        return `
            <article class="product-card" data-category="${this.categoria}">
                <div class="product-card__image">
                    <span class="product-card__skin-type">${this.tipoPiel}</span>
                    <img src="${this.imagen}" alt="${this.nombre}" class="product-card__img">
                </div>
                <div class="product-card__info">
                    <h3 class="product-card__name">${this.nombre}</h3>
                    <p class="product-card__ingredients">${this.ingredientes}</p>
                    <p class="product-card__benefits">${this.beneficios}</p>
                    <p class="product-card__price">$${this.precio.toFixed(2)}</p>
                    <button class="product-card__btn" data-id="${this.id}">
                        Añadir al carrito
                    </button>
                </div>
            </article>
        `;
    }
}

// Clase SkincareController
class SkincareController {
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
        this.productsGrid.innerHTML = productosSkincare
            .filter(producto => this.currentFilter === 'todos' || producto.categoria === this.currentFilter)
            .map(producto => {
                const p = new SkincareProduct(
                    producto.id,
                    producto.nombre,
                    producto.precio,
                    producto.imagen,
                    producto.categoria,
                    producto.tipoPiel,
                    producto.ingredientes,
                    producto.beneficios
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
                const ingredients = card.querySelector('.product-card__ingredients').textContent.toLowerCase();
                const benefits = card.querySelector('.product-card__benefits').textContent.toLowerCase();
                card.style.display = (name.includes(searchTerm) || ingredients.includes(searchTerm) || benefits.includes(searchTerm)) ? 'block' : 'none';
            });
        });
    }

    setupProductButtons() {
        document.querySelectorAll('.product-card__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const producto = productosSkincare.find(p => p.id === productId);
                this.agregarAlCarrito(producto);
            });
        });
    }

    agregarAlCarrito(producto) {
        this.carrito.push(producto);
        this.mostrarNotificacion(`¡${producto.nombre} añadido a tu rutina de cuidado!`);
        console.log('Carrito actual:', this.carrito);
    }

    mostrarNotificacion(mensaje) {
        Swal.fire({
            icon: 'success',
            title: '¡Producto añadido!',
            text: mensaje,
            confirmButtonText: 'Continuar',
            timer: 2000,
            timerProgressBar: true,
            background: '#e8f5e9',
            iconColor: '#27ae60'
        });
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const skincareController = new SkincareController();
    skincareController.init();
});