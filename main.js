document.addEventListener('DOMContentLoaded', () => {
    // --- 1. LÓGICA DE NAVEGACIÓN (SCROLL SPY MEJORADO) ---
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    const navScrollContainer = document.querySelector('.nav-scroll');
    
    let lastId = '';

    const onScroll = () => {
        let current = '';
        const scrollPosition = window.scrollY + 180; // Ajuste para detectar la sección un poco antes

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
                    
                    // --- CORRECCIÓN DEL BUG ---
                    // En lugar de scrollIntoView (que salta la página), calculamos el centro manualmente
                    const containerWidth = navScrollContainer.offsetWidth;
                    const linkLeft = link.offsetLeft;
                    const linkWidth = link.offsetWidth;

                    // Matemáticas para centrar el botón suavemente
                    const scrollTarget = linkLeft - (containerWidth / 2) + (linkWidth / 2);
                    
                    navScrollContainer.scrollTo({
                        left: scrollTarget,
                        behavior: 'smooth'
                    });
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

    // --- 3. MODAL DE PRODUCTO MEJORADO ---
    const modal = document.getElementById('product-modal');
    if (modal) {
        // Elementos Generales
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const closeModalBtn = document.querySelector('.close-modal');
        
        // Elementos Standard (Hamburguesas, etc)
        const standardFooter = document.getElementById('modal-standard-footer');
        const modalPrice = document.getElementById('modal-price');
        const modalWs = document.getElementById('modal-whatsapp');

        // Elementos Pizza
        const pizzaOptions = document.getElementById('modal-pizza-options');
        const btnPersonal = document.getElementById('btn-personal');
        const btnGrande = document.getElementById('btn-grande');
        const btnFamiliar = document.getElementById('btn-familiar');

        // Selector inteligente
        const clickableItems = document.querySelectorAll('.product-card, .pizza-card, .drink-item, .flavor-tag');
        const PHONE_NUMBER = '573027569197'; // Tu número

        clickableItems.forEach(item => {
            item.style.cursor = 'pointer';

            item.addEventListener('click', (e) => {
                if(e.target.closest('button') || e.target.closest('a')) return;

                // 1. Datos Básicos
                let title = item.getAttribute('data-title') || item.querySelector('h3')?.textContent || item.innerText.split('\n')[0];
                let desc = item.getAttribute('data-desc') || item.querySelector('.desc')?.textContent || '';
                let imgSrc = item.querySelector('img')?.src || 'img/logo.jpg';

                // Llenar info básica del modal
                if(modalImg) modalImg.src = imgSrc;
                if(modalTitle) modalTitle.textContent = title;
                if(modalDesc) modalDesc.textContent = desc;

                // 2. DETECTAR OPCIONES
                let opciones = []; // Aquí guardaremos las opciones encontradas

                // CASO A: Es una PIZZA (Usa lógica Personal/Grande/Familiar)
                if (item.classList.contains('pizza-card')) {
                    const pPersonal = item.getAttribute('data-p-personal');
                    const pGrande = item.getAttribute('data-p-grande');
                    const pFamiliar = item.getAttribute('data-p-familiar');
                    
                    if(pPersonal) opciones.push({ label: 'Personal', price: pPersonal });
                    if(pGrande)   opciones.push({ label: 'Grande', price: pGrande });
                    if(pFamiliar) opciones.push({ label: 'Familiar', price: pFamiliar });
                }
                // CASO B: Es OTRO con opciones (Club House) - Busca data-label-X
                else if (item.hasAttribute('data-label-1')) {
                    // Buscamos hasta 3 opciones genéricas (puedes agregar más si quieres)
                    for (let i = 1; i <= 3; i++) {
                        let label = item.getAttribute(`data-label-${i}`);
                        let price = item.getAttribute(`data-price-${i}`);
                        if (label && price) {
                            opciones.push({ label: label, price: price });
                        }
                    }
                }

                // 3. RENDERIZAR MODAL
                const multiOptionsContainer = document.getElementById('modal-multi-options');
                const optionsWrapper = document.getElementById('options-container');
                const standardFooter = document.getElementById('modal-standard-footer');

                if (opciones.length > 0) {
                    // --- MODO OPCIONES MÚLTIPLES ---
                    standardFooter.style.display = 'none';       // Ocultar botón simple
                    multiOptionsContainer.style.display = 'block'; // Mostrar contenedor de opciones
                    optionsWrapper.innerHTML = '';               // Limpiar botones anteriores

                    // Crear un botón por cada opción
                    opciones.forEach(opt => {
                        const btn = document.createElement('a');
                        btn.className = 'size-btn'; // Usamos la misma clase de estilo que creamos antes
                        btn.href = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(`Hola, quiero pedir: ${title} - Opción: ${opt.label} (${opt.price})`)}`;
                        btn.target = '_blank';
                        btn.innerHTML = `
                            ${opt.label} 
                            <span class="btn-price">${opt.price}</span>
                        `;
                        optionsWrapper.appendChild(btn);
                    });

                } else {
                    // --- MODO NORMAL (Sin opciones) ---
                    multiOptionsContainer.style.display = 'none';
                    standardFooter.style.display = 'flex';

                    let price = item.getAttribute('data-price') || item.querySelector('.price')?.textContent || '';
                    if(modalPrice) modalPrice.textContent = price;

                    let mensaje = `Hola, me gustaría pedir: ${title}`;
                    if(modalWs) modalWs.href = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(mensaje)}`;
                }

                modal.classList.add('active');
            });
        });

        const cerrarModal = () => modal.classList.remove('active');
        if(closeModalBtn) closeModalBtn.addEventListener('click', cerrarModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
    }
});
