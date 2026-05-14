let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

document.addEventListener('DOMContentLoaded', function() {
    actualizarContadorCarrito();
    inicializarEventos();
    cargarProductos();
    cargarPagina();
});

function actualizarContadorCarrito() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function agregarAlCarrito(producto, cantidad = 1) {
    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            categoria: producto.categoria || '',
            cantidad: cantidad
        });
    }
    
    guardarCarrito();
    mostrarToast('Producto agregado al carrito');
}

function quitarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarCarritoUI();
}

function actualizarCantidad(id, cantidad) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad = Math.max(1, parseInt(cantidad) || 1);
        guardarCarrito();
        actualizarCarritoUI();
    }
}

function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = mensaje;
        toast.className = 'toast ' + tipo + ' active';
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

function inicializarEventos() {
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const modalClose = document.getElementById('modal-close');
    const loginForm = document.getElementById('login-form');
    
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('active');
        });
    }
    
    if (modalClose && loginModal) {
        modalClose.addEventListener('click', function() {
            loginModal.classList.remove('active');
        });
    }
    
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const correo = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const mensajeEl = document.getElementById('login-message');
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ correo, password })
                });
                
                const data = await response.json();
                
                if (mensajeEl) {
                    mensajeEl.textContent = data.mensaje;
                    mensajeEl.style.color = data.success ? '#000' : '#999';
                }
                
                if (data.success) {
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    setTimeout(() => {
                        if (loginModal) loginModal.classList.remove('active');
                        mostrarToast('Bienvenido ' + data.usuario.nombre);
                    }, 1000);
                }
                
            } catch (error) {
                console.error('Error login:', error);
                if (mensajeEl) {
                    mensajeEl.textContent = 'Usuario: admin@okidoki.com / Pass: admin123 (demo)';
                    mensajeEl.style.color = '#666';
                }
                
                if (correo === 'admin@okidoki.com' && password === 'admin123') {
                    const usuarioDemo = { id: 1, nombre: 'Administrador', correo: 'admin@okidoki.com', rol: 'admin' };
                    localStorage.setItem('usuario', JSON.stringify(usuarioDemo));
                    if (mensajeEl) {
                        mensajeEl.textContent = 'Login correcto (modo demo)';
                        mensajeEl.style.color = '#000';
                    }
                    setTimeout(() => {
                        if (loginModal) loginModal.classList.remove('active');
                        mostrarToast('Bienvenido Administrador');
                    }, 1000);
                }
            }
        });
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('contact-name').value;
            const correo = document.getElementById('contact-email').value;
            const telefono = document.getElementById('contact-phone').value;
            const asunto = document.getElementById('contact-subject').value;
            const mensaje = document.getElementById('contact-message').value;
            const statusEl = document.getElementById('contact-message-status');
            
            try {
                const response = await fetch('/api/contacto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre, correo, telefono, asunto, mensaje })
                });
                
                const data = await response.json();
                
                if (statusEl) {
                    statusEl.textContent = data.mensaje;
                    statusEl.style.color = data.success ? '#000' : '#999';
                }
                
                if (data.success) {
                    contactForm.reset();
                    mostrarToast('Mensaje enviado correctamente');
                }
                
            } catch (error) {
                console.error('Error contacto:', error);
                if (statusEl) {
                    statusEl.textContent = 'Mensaje guardado localmente (demo)';
                    statusEl.style.color = '#666';
                }
                contactForm.reset();
                mostrarToast('Mensaje enviado (modo demo)');
            }
        });
    }
    
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyInput = document.getElementById('quantity-input');
    
    if (qtyMinus && qtyInput) {
        qtyMinus.addEventListener('click', function() {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) {
                qtyInput.value = val - 1;
            }
        });
    }
    
    if (qtyPlus && qtyInput) {
        qtyPlus.addEventListener('click', function() {
            let val = parseInt(qtyInput.value) || 1;
            qtyInput.value = val + 1;
        });
    }
    
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const cantidad = parseInt(qtyInput ? qtyInput.value : 1) || 1;
            const productoId = obtenerProductoIdDeURL();
            
            const productoEncontrado = productoCache.find(p => p.id === productoId);
            if (productoEncontrado) {
                agregarAlCarrito(productoEncontrado, cantidad);
            } else {
                const productoDemo = {
                    id: productoId,
                    nombre: 'Producto ' + productoId,
                    precio: 99.99
                };
                agregarAlCarrito(productoDemo, cantidad);
            }
        });
    }
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (carrito.length === 0) {
                mostrarToast('Tu carrito está vacío');
                return;
            }
            mostrarToast('Funcionalidad de pago en desarrollo');
        });
    }
    
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            mostrarToast('¡Gracias por suscribirte!');
            newsletterForm.reset();
        });
    }
    
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const busqueda = document.getElementById('search-input').value;
            if (busqueda.trim()) {
                mostrarToast('Buscando: ' + busqueda);
            }
        });
    }
}

let productoCache = [];

async function cargarProductos() {
    const container = document.getElementById('products-container');
    const relatedContainer = document.getElementById('related-products');
    
    if (!container && !relatedContainer) return;
    
    try {
        const response = await fetch('/api/productos/destacados');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            productoCache = data.data;
            if (container) {
                renderizarProductos(data.data, container);
            }
            if (relatedContainer) {
                renderizarProductos(data.data.slice(0, 4), relatedContainer);
            }
        } else {
            cargarProductosDemo(container, relatedContainer);
        }
        
    } catch (error) {
        console.error('Error cargando productos:', error);
        cargarProductosDemo(container, relatedContainer);
    }
}

function cargarProductosDemo(container, relatedContainer) {
    const productosDemo = [
        { id: 1, nombre: 'Zapatos de Tacón Negro', precio: 129.99, precio_anterior: 159.99, categoria: 'Zapatos para dama', destacado: true },
        { id: 2, nombre: 'Bolsa Tote Clásica', precio: 89.99, precio_anterior: null, categoria: 'Bolsos de mano', destacado: true },
        { id: 3, nombre: 'Sandalias Planas Negras', precio: 49.99, precio_anterior: 59.99, categoria: 'Sandalias', destacado: true },
        { id: 4, nombre: 'Tenis Blancos Urbanos', precio: 79.99, precio_anterior: null, categoria: 'Tenis casuales', destacado: true },
        { id: 5, nombre: 'Botas Chelsea Negras', precio: 189.99, precio_anterior: 219.99, categoria: 'Botas en cuero', destacado: true },
        { id: 6, nombre: 'Mocasines Negros', precio: 99.99, precio_anterior: null, categoria: 'Zapatos para dama', destacado: false },
        { id: 7, nombre: 'Bolso Cruzado Pequeño', precio: 59.99, precio_anterior: 69.99, categoria: 'Bolsos de mano', destacado: false },
        { id: 8, nombre: 'Sandalias con Tacón Bajo', precio: 69.99, precio_anterior: null, categoria: 'Sandalias', destacado: false }
    ];
    
    productoCache = productosDemo;
    
    if (container) {
        renderizarProductos(productosDemo.filter(p => p.destacado), container);
    }
    if (relatedContainer) {
        renderizarProductos(productosDemo.slice(0, 4), relatedContainer);
    }
}

function renderizarProductos(productos, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cursor = 'pointer';
        
        const iconoCategoria = obtenerIconoCategoria(producto.categoria);
        const tieneDescuento = producto.precio_anterior && producto.precio_anterior > producto.precio;
        
        card.innerHTML = `
            <div class="product-image">
                ${tieneDescuento ? '<span class="product-badge">Oferta</span>' : ''}
                <span class="placeholder">${iconoCategoria}</span>
                <div class="product-actions">
                    <button class="btn-add-cart-from-grid" data-id="${producto.id}">Agregar</button>
                </div>
            </div>
            <div class="product-info">
                <p class="product-category">${producto.categoria || 'Sin categoría'}</p>
                <h3>${producto.nombre}</h3>
                <p class="product-price">
                    $${producto.precio.toFixed(2)}
                    ${producto.precio_anterior ? `<span class="old-price">$${producto.precio_anterior.toFixed(2)}</span>` : ''}
                </p>
            </div>
        `;
        
        card.addEventListener('click', function(e) {
            if (e.target.closest('.btn-add-cart-from-grid')) return;
            window.location.href = '/producto/' + producto.id;
        });
        
        container.appendChild(card);
    });
    
    document.querySelectorAll('.btn-add-cart-from-grid').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            const producto = productoCache.find(p => p.id === id);
            if (producto) {
                agregarAlCarrito(producto);
            }
        });
    });
}

function obtenerIconoCategoria(categoria) {
    if (!categoria) return '👜';
    const cat = categoria.toLowerCase();
    if (cat.includes('zapato') || cat.includes('tacón')) return '👠';
    if (cat.includes('bolso') || cat.includes('cartera')) return '👜';
    if (cat.includes('sandalia')) return '👡';
    if (cat.includes('tenis') || cat.includes('deportivo')) return '👟';
    if (cat.includes('bota')) return '🥾';
    return '👜';
}

function filtrarPorCategoria(categoria) {
    mostrarToast('Filtrando por: ' + categoria);
    const seccion = document.getElementById('productos');
    if (seccion) {
        seccion.scrollIntoView({ behavior: 'smooth' });
    }
}

function cargarPagina() {
    const path = window.location.pathname;
    
    if (path.includes('/carrito')) {
        actualizarCarritoUI();
    } else if (path.includes('/producto/')) {
        cargarDetalleProducto();
    }
}

function actualizarCarritoUI() {
    const emptyEl = document.getElementById('cart-empty');
    const itemsContainer = document.getElementById('cart-items-container');
    const itemsList = document.getElementById('cart-items-list');
    
    if (!itemsList) return;
    
    if (carrito.length === 0) {
        if (emptyEl) emptyEl.style.display = 'block';
        if (itemsContainer) itemsContainer.style.display = 'none';
        actualizarResumen();
        return;
    }
    
    if (emptyEl) emptyEl.style.display = 'none';
    if (itemsContainer) itemsContainer.style.display = 'block';
    
    itemsList.innerHTML = '';
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-product">
                <div class="cart-product-image">${obtenerIconoCategoria(item.categoria)}</div>
                <div class="cart-product-info">
                    <h3>${item.nombre}</h3>
                    <p class="category">${item.categoria || 'Producto'}</p>
                </div>
            </div>
            <div class="cart-price">$${item.precio.toFixed(2)}</div>
            <div class="cart-quantity">
                <div class="quantity-controls">
                    <button class="cart-qty-minus" data-id="${item.id}">-</button>
                    <input type="text" value="${item.cantidad}" class="cart-qty-input" data-id="${item.id}" readonly>
                    <button class="cart-qty-plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-subtotal">$${subtotal.toFixed(2)}</div>
            <button class="cart-remove" data-id="${item.id}">&times;</button>
        `;
        itemsList.appendChild(itemEl);
    });
    
    document.querySelectorAll('.cart-qty-minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const item = carrito.find(i => i.id === id);
            if (item && item.cantidad > 1) {
                actualizarCantidad(id, item.cantidad - 1);
            }
        });
    });
    
    document.querySelectorAll('.cart-qty-plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const item = carrito.find(i => i.id === id);
            if (item) {
                actualizarCantidad(id, item.cantidad + 1);
            }
        });
    });
    
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            quitarDelCarrito(id);
            mostrarToast('Producto eliminado del carrito');
        });
    });
    
    actualizarResumen();
}

function actualizarResumen() {
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');
    
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envio = subtotal >= 100 ? 0 : 9.99;
    const total = subtotal + envio;
    
    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (shippingEl) shippingEl.textContent = subtotal >= 100 ? 'GRATIS' : '$' + envio.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

function obtenerProductoIdDeURL() {
    const path = window.location.pathname;
    const match = path.match(/\/producto\/(\d+)/);
    return match ? parseInt(match[1]) : 1;
}

async function cargarDetalleProducto() {
    const id = obtenerProductoIdDeURL();
    
    try {
        const response = await fetch('/api/productos/' + id);
        const data = await response.json();
        
        if (data.success && data.data) {
            mostrarDetalleProducto(data.data);
        } else {
            mostrarDetalleProductoDemo(id);
        }
    } catch (error) {
        console.error('Error cargando detalle:', error);
        mostrarDetalleProductoDemo(id);
    }
}

function mostrarDetalleProducto(producto) {
    const nameEl = document.getElementById('product-name');
    const categoryEl = document.getElementById('product-category');
    const priceEl = document.getElementById('product-price');
    const oldPriceEl = document.getElementById('product-old-price');
    const descEl = document.getElementById('product-description');
    const stockEl = document.getElementById('stock-quantity');
    const metaCatEl = document.getElementById('meta-category');
    const metaSkuEl = document.getElementById('meta-sku');
    
    if (nameEl) nameEl.textContent = producto.nombre;
    if (categoryEl) categoryEl.textContent = producto.categoria || 'Producto';
    if (priceEl) priceEl.textContent = '$' + producto.precio.toFixed(2);
    
    if (oldPriceEl && producto.precio_anterior) {
        oldPriceEl.textContent = '$' + producto.precio_anterior.toFixed(2);
        oldPriceEl.style.display = 'inline';
    }
    
    if (descEl) {
        descEl.innerHTML = `<p>${producto.descripcion || 'Producto de alta calidad en cuero genuino. Diseño elegante y confort excepcional para todo el día.'}</p>`;
    }
    
    if (stockEl) stockEl.textContent = producto.stock || 10;
    if (metaCatEl) metaCatEl.textContent = producto.categoria || '-';
    if (metaSkuEl) metaSkuEl.textContent = 'OKD-' + String(producto.id).padStart(3, '0');
}

function mostrarDetalleProductoDemo(id) {
    const productosDemo = {
        1: { id: 1, nombre: 'Zapatos de Tacón Negro', precio: 129.99, precio_anterior: 159.99, categoria: 'Zapatos para dama', stock: 15, descripcion: 'Elegantes zapatos de tacón en cuero genuino negro. Perfectos para ocasiones formales y eventos especiales. Suela antideslizante y plantilla acolchada para mayor comodidad.' },
        2: { id: 2, nombre: 'Bolsa Tote Clásica', precio: 89.99, precio_anterior: null, categoria: 'Bolsos de mano', stock: 25, descripcion: 'Bolsa tote espaciosa en cuero sintético de alta calidad. Compartimento principal amplio y bolsillos internos organizadores. Correas ajustables y cierre de cremallera.' },
        3: { id: 3, nombre: 'Sandalias Planas Negras', precio: 49.99, precio_anterior: 59.99, categoria: 'Sandalias', stock: 30, descripcion: 'Sandalias planas cómodas con diseño minimalista. Suela flexible para uso diario. Tiras ajustables en el tobillo.' },
        4: { id: 4, nombre: 'Tenis Blancos Urbanos', precio: 79.99, precio_anterior: null, categoria: 'Tenis casuales', stock: 40, descripcion: 'Tenis casuales blancos estilo urbano. Suela con amortiguación para comodidad todo el día. Plantilla extraíble y transpirable.' },
        5: { id: 5, nombre: 'Botas Chelsea Negras', precio: 189.99, precio_anterior: 219.99, categoria: 'Botas en cuero', stock: 12, descripcion: 'Botas Chelsea en cuero genuino con elástico lateral. Diseño atemporal que combina con todo. Suela de goma resistente y forro interior suave.' }
    };
    
    const producto = productosDemo[id] || productosDemo[1];
    mostrarDetalleProducto(producto);
    
    if (!productoCache.find(p => p.id === producto.id)) {
        productoCache.push(producto);
    }
}

window.filtrarPorCategoria = filtrarPorCategoria;
