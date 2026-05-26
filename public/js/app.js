// 🏪 OKI DOKI - APLICACIÓN PRINCIPAL

// Variables globales
let carrito = [];
let categoriasMap = {};

function formatCOP(amount) {
  return 'COP ' + Math.round(amount).toLocaleString('es-CO');
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🏪 OKI DOKI - Tienda de Calzado', 'font-size: 16px; font-weight: bold; color: #e67e22;');
    actualizarUISesion();
    cargarCategorias();
    cargarProductos();
    iniciarCarousel();
    configurarEventos();
    cargarCarritoDelLocalStorage();
    renderizarCarrito();
});

// ============================================
// CARGAR DATOS DEL API
// ============================================

// Cargar categorías
async function cargarCategorias() {
    try {
        const response = await fetch('/api/categorias');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
            data.data.forEach(cat => {
                categoriasMap[cat.id] = cat.nombre;
            });
            console.log('✓ Categorías cargadas');
        }
    } catch (error) {
        console.error('❌ Error cargando categorías:', error);
    }
}

// Cargar productos destacados
async function cargarProductos() {
    const container = document.getElementById('products-container');
    
    if (!container) return;

    try {
        container.innerHTML = '<div class="loading"><div class="spinner"></div>Cargando productos...</div>';
        
        const response = await fetch('/api/productos');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            mostrarProductos(data.data);
            console.log(`✓ ${data.data.length} productos cargados`);
        } else {
            container.innerHTML = '<div class="empty-state"><h3>No hay productos disponibles</h3><p>Vuelve más tarde</p></div>';
        }
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        container.innerHTML = '<div class="empty-state"><h3>Error al cargar productos</h3></div>';
    }
}

// ============================================
// CARRUSEL DE PRODUCTOS
// ============================================

async function iniciarCarousel() {
    const container = document.getElementById('carousel-container');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!container) return;

    try {
        const response = await fetch('/api/productos');
        const data = await response.json();
        if (!data.success || !data.data.length) return;

        const productos = data.data.sort(() => Math.random() - 0.5).slice(0, 5);

        let slidesHTML = '';
        let dotsHTML = '';
        productos.forEach((p, i) => {
            const img = p.imagen || '';
            const active = i === 0 ? 'active' : '';
            slidesHTML += `
                <div class="carousel-slide ${active}" style="background-image: url('${img}'); background-color: #333;" data-index="${i}">
                    <div class="hero-content">
                        <h2>${p.nombre}</h2>
                        <p>${formatCOP(p.precio)}</p>
                        <a href="/producto/${p.id}" class="btn">Ver Producto</a>
                    </div>
                </div>`;
            dotsHTML += `<span class="dot ${active}" data-index="${i}"></span>`;
        });

        container.innerHTML = slidesHTML;
        dotsContainer.innerHTML = dotsHTML;

        let current = 0;
        let interval;

        function goTo(index) {
            const slides = container.querySelectorAll('.carousel-slide');
            const dots = dotsContainer.querySelectorAll('.dot');
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            current = index;
        }

        document.querySelector('.carousel-control.prev').addEventListener('click', () => {
            const slides = container.querySelectorAll('.carousel-slide');
            goTo(current === 0 ? slides.length - 1 : current - 1);
            reiniciarAutoplay();
        });
        document.querySelector('.carousel-control.next').addEventListener('click', () => {
            const slides = container.querySelectorAll('.carousel-slide');
            goTo(current === slides.length - 1 ? 0 : current + 1);
            reiniciarAutoplay();
        });
        dotsContainer.querySelectorAll('.dot').forEach(d => {
            d.addEventListener('click', () => {
                goTo(parseInt(d.dataset.index));
                reiniciarAutoplay();
            });
        });

        function reiniciarAutoplay() {
            clearInterval(interval);
            const slides = container.querySelectorAll('.carousel-slide');
            interval = setInterval(() => {
                goTo(current === slides.length - 1 ? 0 : current + 1);
            }, 5000);
        }
        reiniciarAutoplay();
    } catch (error) {
        console.error('Error cargando carrusel:', error);
    }
}

// ============================================
// MOSTRAR PRODUCTOS
// ============================================

function mostrarProductos(productos) {
    const container = document.getElementById('products-container');
    
    if (!productos || productos.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No se encontraron productos</h3></div>';
        return;
    }

    container.innerHTML = productos.map(producto => {
        const precioAnterior = producto.precio_anterior ? `<span class="original-price">${formatCOP(producto.precio_anterior)}</span>` : '';
        const imagenUrl = producto.imagen && producto.imagen.trim() ? producto.imagen : null;
        
        let imageHTML;
        if (imagenUrl) {
            imageHTML = `<img src="${imagenUrl}" alt="${producto.nombre}" onerror="this.style.display='none'; this.parentElement.style.backgroundColor='#f0f0f0'; this.parentElement.innerHTML += '<span style=\\'position: absolute; color: #999;\\'>Imagen no disponible</span>'">`;
        } else {
            imageHTML = '<span style="color: #999; font-weight: 600;">Sin imagen</span>';
        }
        
        const categoria = categoriasMap[producto.categoria_id] || 'Producto';
        const enStock = producto.stock > 0;
        const stockColor = enStock ? 'var(--accent-color)' : '#e74c3c';
        const stockTexto = enStock ? `${producto.stock} en stock` : 'Agotado';

        return `
            <div class="product-card">
                <div class="product-image ${imagenUrl ? '' : 'no-image'}">
                    ${imageHTML}
                    ${producto.destacado ? '<span class="product-badge">⭐ Destacado</span>' : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${categoria}</div>
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-description">${producto.descripcion || 'Calzado en cuero'}</p>
                    <div class="product-price">
                        ${precioAnterior}
                        <span class="current-price">${formatCOP(producto.precio)}</span>
                    </div>
                    <div class="product-stock" style="color: ${stockColor};">
                        ${stockTexto}
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="agregarAlCarrito(event, ${producto.id}, '${producto.nombre}', ${producto.precio})" ${!enStock ? 'disabled' : ''}>
                            🛒 Agregar
                        </button>
                        <button class="btn-whatsapp-buy" onclick="comprarPorWhatsApp(event, '${producto.nombre}', ${producto.precio})">
                            💬 Comprar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// CARRITO
// ============================================

function agregarAlCarrito(event, id, nombre, precio) {
    event.stopPropagation();
    
    const item = carrito.find(p => p.id === id);
    
    if (item) {
        item.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
    mostrarToast(`✓ ${nombre} agregado`);
}

function actualizarContadorCarrito() {
    const cartCount = document.getElementById('cart-count');
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    cartCount.textContent = total;
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito_oki_doki', JSON.stringify(carrito));
}

function cargarCarritoDelLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito_oki_doki');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

function renderizarCarrito() {
    const cartList = document.getElementById('cart-items-list');
    const cartEmpty = document.getElementById('cart-empty');
    const cartContainer = document.getElementById('cart-items-container');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryTotal = document.getElementById('summary-total');

    if (!cartList) return;

    if (!carrito || carrito.length === 0) {
        cartEmpty.style.display = 'block';
        cartContainer.style.display = 'none';
        if (summarySubtotal) summarySubtotal.textContent = 'COP 0';
        if (summaryShipping) summaryShipping.textContent = 'COP 0';
        if (summaryTotal) summaryTotal.textContent = 'COP 0';
        return;
    }

    cartEmpty.style.display = 'none';
    cartContainer.style.display = 'block';

    cartList.innerHTML = carrito.map((item, index) => {
        const subtotal = item.precio * item.cantidad;
        return `
            <div class="cart-item">
                <div class="cart-product">
                    <div class="cart-product-image">👟</div>
                    <div class="cart-product-info">
                        <h3>${item.nombre}</h3>
                        <div class="category">Producto</div>
                    </div>
                </div>
                <div class="cart-price">${formatCOP(item.precio)}</div>
                <div class="cart-quantity">
                    <div class="quantity-controls">
                        <button type="button" class="qty-cart-btn" onclick="cambiarCantidadCarrito(${item.id}, -1)">-</button>
                        <input type="number" value="${item.cantidad}" min="1" readonly style="width:50px;text-align:center;border:none;">
                        <button type="button" class="qty-cart-btn" onclick="cambiarCantidadCarrito(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-subtotal">${formatCOP(subtotal)}</div>
                <button class="cart-remove" onclick="eliminarDelCarrito(${item.id})">×</button>
            </div>
        `;
    }).join('');

    const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const envio = subtotal >= 250000 ? 0 : 15000;
    const total = subtotal + envio;

    if (summarySubtotal) summarySubtotal.textContent = `${formatCOP(subtotal)}`;
    if (summaryShipping) summaryShipping.textContent = envio === 0 ? 'Gratis' : `${formatCOP(envio)}`;
    if (summaryTotal) summaryTotal.textContent = `${formatCOP(total)}`;
}

function cambiarCantidadCarrito(id, delta) {
    const item = carrito.find(p => p.id === id);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== id);
    }
    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
    renderizarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
    renderizarCarrito();
    mostrarToast('Producto eliminado del carrito');
}

// ============================================
// WHATSAPP
// ============================================

const WHATSAPP_NUMBER = '573043223100';

function comprarPorWhatsApp(event, nombre, precio) {
    event.stopPropagation();
    const mensaje = encodeURIComponent(`Hola! Me interesa comprar: ${nombre} - ${formatCOP(precio)}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank');
}

function comprarCarritoPorWhatsApp() {
    if (!carrito || carrito.length === 0) {
        mostrarToast('El carrito está vacío');
        return;
    }

    let mensaje = 'Hola! Quiero comprar los siguientes productos:\n\n';
    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `${index + 1}. ${item.nombre} x${item.cantidad} = ${formatCOP(subtotal)}\n`;
    });

    mensaje += `\nTotal: ${formatCOP(total)}`;
    mensaje += '\n\nPor favor, indíqueme formas de pago y envío. ¡Gracias!';

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// ============================================
// NAVEGACIÓN
// ============================================

function verDetalleProducto(event, id) {
    event.stopPropagation();
    window.location.href = `/producto/${id}`;
}

function filtrarPorCategoria(categoria) {
    document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// NOTIFICACIONES
// ============================================

function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ============================================
// SESIÓN
// ============================================

function getSesion() {
    const data = localStorage.getItem('oki_user');
    return data ? JSON.parse(data) : null;
}

function guardarSesion(usuario) {
    localStorage.setItem('oki_user', JSON.stringify(usuario));
}

function cerrarSesion() {
    localStorage.removeItem('oki_user');
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>`;
        loginBtn.href = '#';
        loginBtn.title = 'Iniciar sesión';
    }
    mostrarToast('✓ Sesión cerrada');
    location.reload();
}

function actualizarUISesion() {
    const usuario = getSesion();
    const loginBtn = document.getElementById('login-btn');
    if (!loginBtn) return;

    if (usuario) {
        loginBtn.innerHTML = `<span style="font-size: 13px; font-weight: 600; color: #e67e22;">${usuario.nombre}</span>`;
        loginBtn.href = '#';
        loginBtn.title = 'Cerrar sesión';
        loginBtn.removeEventListener('click', cerrarSesion);
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Cerrar sesión?')) cerrarSesion();
        });
    } else {
        loginBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>`;
        loginBtn.href = '#';
        loginBtn.title = 'Iniciar sesión';
    }
}

// ============================================
// EVENTOS
// ============================================

function configurarEventos() {
    // Modal de login
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const modalClose = document.getElementById('modal-close');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginMessage = document.getElementById('login-message');

    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginContainer = document.getElementById('login-form-container');
    const registerContainer = document.getElementById('register-form-container');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const usuario = getSesion();
            if (usuario) return;
            loginModal.classList.add('active');
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }

    // Toggle login / register
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.style.display = 'none';
            registerContainer.style.display = 'block';
            loginMessage.textContent = '';
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerContainer.style.display = 'none';
            loginContainer.style.display = 'block';
            loginMessage.textContent = '';
        });
    }

    // LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            loginMessage.textContent = 'Ingresando...';
            loginMessage.style.color = '#666';

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo: email, password })
                });
                const data = await response.json();

                if (data.success) {
                    guardarSesion(data.usuario);
                    mostrarToast(`✓ Bienvenido, ${data.usuario.nombre}`);
                    loginModal.classList.remove('active');
                    actualizarUISesion();
                    loginForm.reset();
                    loginMessage.textContent = '';

                    if (data.usuario.rol === 'admin') {
                        setTimeout(() => {
                            window.location.href = '/admin';
                        }, 600);
                    }
                } else {
                    loginMessage.textContent = '❌ ' + (data.mensaje || 'Credenciales incorrectas');
                    loginMessage.style.color = '#e74c3c';
                }
            } catch (error) {
                console.error('Error login:', error);
                loginMessage.textContent = '❌ Error de conexión';
                loginMessage.style.color = '#e74c3c';
            }
        });
    }

    // REGISTER
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('register-nombre').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            loginMessage.textContent = 'Registrando...';
            loginMessage.style.color = '#666';

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, correo: email, password })
                });
                const data = await response.json();

                if (data.success) {
                    guardarSesion(data.usuario);
                    mostrarToast(`✓ Cuenta creada. ¡Bienvenido, ${data.usuario.nombre}!`);
                    loginModal.classList.remove('active');
                    actualizarUISesion();
                    registerForm.reset();
                    loginMessage.textContent = '';
                } else {
                    loginMessage.textContent = '❌ ' + (data.mensaje || 'Error al registrarse');
                    loginMessage.style.color = '#e74c3c';
                }
            } catch (error) {
                console.error('Error register:', error);
                loginMessage.textContent = '❌ Error de conexión';
                loginMessage.style.color = '#e74c3c';
            }
        });
    }

    // Newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            mostrarToast('✓ Suscripción exitosa');
            newsletterForm.reset();
        });
    }
}

console.log('%c✓ App iniciada correctamente', 'color: #27ae60; font-weight: bold;');
