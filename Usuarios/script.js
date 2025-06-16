document.addEventListener('DOMContentLoaded', function() {
    // Productos destacados
    const featuredProducts = [
        {
            name: "Vestido Floral",
            price: "$1,299",
            image: "https://via.placeholder.com/300x400"
        },
        {
            name: "Blusa de Seda",
            price: "$899",
            image: "https://via.placeholder.com/300x400"
        },
        {
            name: "Pantalón Elegante",
            price: "$1,099",
            image: "https://via.placeholder.com/300x400"
        },
        {
            name: "Abrigo Moderno",
            price: "$1,799",
            image: "https://via.placeholder.com/300x400"
        }
    ];

    // Renderizar productos destacados
    const productGrid = document.querySelector('.product-grid');
    
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
                <button class="add-to-cart">Añadir al carrito</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Funcionalidad del carrito
    let cart = [];
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.parentElement.querySelector('h3').textContent;
            const productPrice = this.parentElement.querySelector('.price').textContent;
            
            cart.push({
                name: productName,
                price: productPrice
            });
            
            updateCartCount();
            showNotification(`${productName} añadido al carrito`);
        });
    });
    
    function updateCartCount() {
        const cartBtn = document.querySelector('.cart-btn');
        cartBtn.textContent = `🛒 (${cart.length})`;
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Estilos para notificaciones (se añaden dinámicamente)
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #ff6b8b;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 1000;
        }
        
        .notification.show {
            opacity: 1;
        }
        
        .product-card {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
        }
        
        .product-card img {
            width: 100%;
            height: 300px;
            object-fit: cover;
        }
        
        .product-info {
            padding: 15px;
            text-align: center;
        }
        
        .product-info h3 {
            font-size: 16px;
            margin-bottom: 8px;
        }
        
        .price {
            font-weight: 600;
            color: #ff6b8b;
            margin-bottom: 12px;
        }
        
        .add-to-cart {
            background-color: #333;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .add-to-cart:hover {
            background-color: #ff6b8b;
        }
    `;
    document.head.appendChild(style);
});


// Añadir al archivo script.js
document.querySelectorAll('.men-collection .category-btn').forEach(button => {
    button.addEventListener('click', function() {
        const category = this.parentElement.querySelector('h3').textContent;
        
        // Mapear categorías a URLs
        const categoryUrls = {
            'ROPA': 'ropa-hombre.html',
            'CALZADO': 'calzado-hombre.html',
            'LOCIONES': 'lociones-hombre.html'
        };
        
        // Redireccionar (simulación)
        console.log(`Redirigiendo a ${categoryUrls[category]}`);
        // window.location.href = categoryUrls[category];
    });
});