document.addEventListener('DOMContentLoaded', () => {
    const preloadImages = () => {
        const images = document.querySelectorAll('.product-card img');
        images.forEach(img => {
            const preloader = new Image();
            preloader.src = img.src;
        });
    };
    preloadImages(); // Ejecutar inmediatamente

    // --- 4. CAMBIO DINÁMICO DE COLOR DE BARRA DE ESTADO (NUEVO) ---
    // --- 4. CAMBIO DINÁMICO DE COLOR DE BARRA DE ESTADO (OPTIMIZADO IPHONE) ---
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    // Definimos los colores
    const colorNegro = '#000000'; 
    const colorFondo = '#f4f4f4'; 

    const updateStatusBar = () => {
        // Evitamos errores si la etiqueta no existe
        if (!metaThemeColor) return;

        const heroHeight = window.innerHeight; 
        
        // Ajustamos a -100 para que el cambio sea más fluido en móviles
        if (window.scrollY > (heroHeight - 100)) {
            // Solo cambiamos si es diferente para no sobrecargar el navegador
            if (metaThemeColor.getAttribute('content') !== colorFondo) {
                metaThemeColor.setAttribute('content', colorFondo);
            }
        } else {
            if (metaThemeColor.getAttribute('content') !== colorNegro) {
                metaThemeColor.setAttribute('content', colorNegro);
            }
        }
    };

    window.addEventListener('scroll', updateStatusBar);
    // Ejecutar una vez al inicio para asegurar el color correcto al cargar
    updateStatusBar();

    // --- 1. LÓGICA DE NAVEGACIÓN (SCROLL SPY) ---
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    const navScrollContainer = document.querySelector('.nav-scroll');
    let lastId = '';

    const onScroll = () => {
        let current = '';
        const scrollPosition = window.scrollY + 180;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (current !== lastId) {
            lastId = current;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    const containerWidth = navScrollContainer.offsetWidth;
                    const linkLeft = link.offsetLeft;
                    const linkWidth = link.offsetWidth;
                    const scrollTarget = linkLeft - (containerWidth / 2) + (linkWidth / 2);
                    navScrollContainer.scrollTo({ left: scrollTarget, behavior: 'smooth' });
                }
            });
        }
    };
    window.addEventListener('scroll', onScroll);

    // --- 2. MANEJO DE IMÁGENES ROTAS ---
    const ponerLogo = (img) => {
        img.src = 'img/logo.jpg'; 
        img.style.objectFit = 'contain';
        img.style.padding = '8px';
        img.style.backgroundColor = '#fff';
        img.onerror = null;
    };
    document.querySelectorAll('img').forEach(img => {
        img.onerror = () => ponerLogo(img);
        if (img.complete && img.naturalHeight === 0) ponerLogo(img);
    });

    // --- 3. MODAL DE PRODUCTO (SISTEMA INSTANTÁNEO) ---
    const modal = document.getElementById('product-modal');
    if (modal) {
        const clickableItems = document.querySelectorAll('.product-card, .pizza-card, .drink-item, .flavor-tag, .mini-card, .reference-card');
        
        clickableItems.forEach(item => {
            item.style.cursor = 'pointer';

            item.addEventListener('click', (e) => {
                if(e.target.closest('button') || e.target.closest('a')) return;

                // Elementos del Modal
                const modalImg = document.getElementById('modal-img');
                const modalIcon = document.getElementById('modal-icon');
                const modalTitle = document.getElementById('modal-title');
                const modalDesc = document.getElementById('modal-desc');

                // --- GESTIÓN DE IMAGEN INSTANTÁNEA ---
                // Al tener las imágenes pre-cargadas, el cambio de .src es inmediato.
                // Usamos un pequeño truco: Ocultar todo 1 milisegundo para resetear visualmente.
                
                if (item.classList.contains('drink-item')) {
                    // MODO BEBIDA (Íconos)
                    if(modalImg) modalImg.style.display = 'none';
                    if(modalIcon) {
                        modalIcon.style.display = 'flex';
                        modalIcon.className = item.querySelector('i')?.className || 'fas fa-cocktail';
                    }
                } else {
                    // MODO COMIDA (Fotos)
                    if(modalIcon) modalIcon.style.display = 'none';
                    if(modalImg) {
                        modalImg.style.display = 'block';
                        // Tomamos la fuente directamente de la tarjeta. Como ya está en caché, es instantáneo.
                        const imgInCard = item.querySelector('img');
                        modalImg.src = imgInCard ? imgInCard.src : 'img/logo.jpg';
                    }
                }

                // Datos de Texto
                let title = item.getAttribute('data-title') || item.querySelector('h3')?.textContent || item.innerText.split('\n')[0].trim();
                let desc = item.getAttribute('data-desc') || item.querySelector('.desc')?.textContent || '';
                
                if(modalTitle) modalTitle.textContent = title;
                if(modalDesc) modalDesc.textContent = desc;

                // --- LÓGICA DE BOTONES (PIZZAS / CLUB HOUSE / NORMAL) ---
                let opciones = [];
                const PHONE_NUMBER = '573027569197'; 

                // Detectar si es Pizza
                if (item.classList.contains('pizza-card')) {
                    const pPersonal = item.getAttribute('data-p-personal');
                    const pGrande = item.getAttribute('data-p-grande');
                    const pFamiliar = item.getAttribute('data-p-familiar');
                    if(pPersonal) opciones.push({ label: 'Personal', price: pPersonal });
                    if(pGrande)   opciones.push({ label: 'Grande', price: pGrande });
                    if(pFamiliar) opciones.push({ label: 'Familiar', price: pFamiliar });
                }
                // Detectar si es Club House u otro especial
                else if (item.hasAttribute('data-label-1')) {
                    for (let i = 1; i <= 3; i++) {
                        let label = item.getAttribute(`data-label-${i}`);
                        let price = item.getAttribute(`data-price-${i}`);
                        if (label && price) opciones.push({ label: label, price: price });
                    }
                }

                // Renderizar Botones
                const multiOptionsContainer = document.getElementById('modal-multi-options');
                const optionsWrapper = document.getElementById('options-container');
                const standardFooter = document.getElementById('modal-standard-footer');
                const modalPrice = document.getElementById('modal-price');
                const modalWs = document.getElementById('modal-whatsapp');

                if (opciones.length > 0) {
                    standardFooter.style.display = 'none';
                    multiOptionsContainer.style.display = 'block';
                    optionsWrapper.innerHTML = '';
                    opciones.forEach(opt => {
                        const btn = document.createElement('a');
                        btn.className = 'size-btn';
                        btn.href = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(`Hola, quiero pedir: ${title} - Opción: ${opt.label} (${opt.price})`)}`;
                        btn.target = '_blank';
                        btn.innerHTML = `${opt.label} <span class="btn-price">${opt.price}</span>`;
                        optionsWrapper.appendChild(btn);
                    });
                } else {
                    multiOptionsContainer.style.display = 'none';
                    standardFooter.style.display = 'flex';
                    let price = item.getAttribute('data-price') || item.querySelector('.price')?.textContent || 'Consultar';
                    if(modalPrice) modalPrice.textContent = price;
                    let mensaje = `Hola, me gustaría pedir: ${title}`;
                    if(modalWs) modalWs.href = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(mensaje)}`;
                }

                modal.classList.add('active');
            });
        });

        const closeModalBtn = document.querySelector('.close-modal');
        const cerrarModal = () => modal.classList.remove('active');
        if(closeModalBtn) closeModalBtn.addEventListener('click', cerrarModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
    }
});