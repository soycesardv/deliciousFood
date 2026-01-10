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
        img.style.padding = '20px';
        img.style.backgroundColor = '#fff';
        img.onerror = null;
    };

    document.querySelectorAll('img').forEach(img => {
        img.onerror = () => ponerLogo(img);
        if (img.complete && img.naturalHeight === 0) ponerLogo(img);
    });

    // --- 3. MODAL DE PRODUCTO ---
    const modal = document.getElementById('product-modal');
    if (modal) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalPrice = document.getElementById('modal-price');
        const modalWs = document.getElementById('modal-whatsapp');
        const closeModalBtn = document.querySelector('.close-modal');
        const cards = document.querySelectorAll('.product-card');

        cards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if(e.target.closest('button') || e.target.closest('a')) return;

                const imgSrc = card.querySelector('img')?.src || 'img/logo.jpg';
                const title = card.querySelector('h3')?.textContent || 'Producto';
                const desc = card.querySelector('.desc')?.textContent || '';
                const price = card.querySelector('.price')?.textContent || '';

                if(modalImg) modalImg.src = imgSrc;
                if(modalTitle) modalTitle.textContent = title;
                if(modalDesc) modalDesc.textContent = desc;
                if(modalPrice) modalPrice.textContent = price;

                const mensaje = `Hola, me gustaría pedir: ${title}`;
                if(modalWs) modalWs.href = `https://wa.me/573027569197?text=${encodeURIComponent(mensaje)}`;

                modal.classList.add('active');
            });
        });

        const cerrarModal = () => modal.classList.remove('active');
        if(closeModalBtn) closeModalBtn.addEventListener('click', cerrarModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
    }
});