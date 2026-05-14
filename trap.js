(function() {
    // Evitar que se ejecute doble si ya existe
    if (window.trapInitialized) return;
    window.trapInitialized = true;

    // Inject the CSS required for the popups
    const style = document.createElement('style');
    style.innerHTML = `
        /* FALSO POP-UP WINDOWS / INVASIVO */
        .invasive-popup {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%);
            width: 320px;
            background: #ece9d8;
            border: 2px outset #fff;
            box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.8);
            z-index: 99999 !important;
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            animation: popIn 0.05s;
        }

        @keyframes popIn {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .popup-header {
            background: linear-gradient(90deg, #0a246a, #a6caf0);
            color: white;
            padding: 3px 5px;
            font-weight: bold;
            font-size: 0.8rem;
            display: flex;
            justify-content: space-between;
        }

        .popup-header-x {
            background: #d4d0c8;
            color: black;
            border: 1px outset #fff;
            width: 15px;
            text-align: center;
            line-height: 12px;
            cursor: pointer;
            font-family: sans-serif;
            font-size: 10px;
        }

        .popup-content {
            padding: 10px;
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 2px inset #fff;
            margin: 5px;
        }

        .popup-content img {
            width: 100%;
            height: auto;
            border: 1px solid #333;
            margin-bottom: 5px;
        }

        .popup-content strong {
            color: red;
            font-size: 1rem;
            text-transform: uppercase;
        }

        .popup-content p {
            font-size: 0.75rem;
            text-align: center;
            margin-top: 5px;
            color: #111;
        }
    `;
    document.head.appendChild(style);

    const pageWrapper = document.getElementById('main-wrapper');

    const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';

    // TRAMPA DEL BOTÓN DE RETROCESO (HISTORY HIJACK)
    if (isMainPage) {
        window.history.pushState(null, "", window.location.href);
        window.addEventListener('popstate', function () {
            window.history.pushState(null, "", window.location.href);
            if (typeof startInvasion === 'function') startInvasion();
        });
    }

    // Flag for internal navigation
    window.isInternalNavigation = false;
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link) {
            // Un enlace es "interno" si no tiene target="_blank" y su destino está en el mismo host que el sitio
            const isTargetBlank = link.target === '_blank';
            const isSameHost = link.host === window.location.host;
            // O si es una ancla interna
            const isAnchor = link.getAttribute('href') && link.getAttribute('href').startsWith('#');
            
            if (!isTargetBlank && (isSameHost || isAnchor)) {
                window.isInternalNavigation = true;
                // Pequeño timeout por si la navegación es interrumpida
                setTimeout(() => {
                    window.isInternalNavigation = false;
                }, 1000);
            }
        }
    }, true); // Capturarlo durante la fase de captura para asegurar que lo registremos antes de que otros scripts puedan detener el evento

    // ANIMACIÓN DE TRANSICIÓN PARA LOS ENLACES OCULTOS
    document.querySelectorAll('.hidden-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.href;
            if (pageWrapper) pageWrapper.style.filter = `invert(100%) blur(2px)`;
            else document.body.style.filter = `invert(100%) blur(2px)`;
            setTimeout(() => {
                window.location.href = target;
            }, 200);
        });
    });

    // MECÁNICA INVASIVA: POP-UPS IN-PAGE
    window.invasionTriggered = false;
    let spamInterval;

    window.startInvasion = function() {
        if (window.invasionTriggered) return;
        window.invasionTriggered = true;

        document.body.style.overflow = 'hidden';

        if (pageWrapper) {
            pageWrapper.style.filter = `grayscale(100%)`;
            pageWrapper.style.pointerEvents = `none`;
        }
        
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.filter = `grayscale(100%)`;
            footer.style.pointerEvents = `none`;
        }
        
        if (!pageWrapper && !footer) {
            document.body.style.filter = `grayscale(100%)`;
            document.body.style.pointerEvents = `none`;
        }

        spamInterval = setInterval(createInvasivePopup, 200);
    };

    // O SI INTENTAN IRSE DE LA PÁGINA (Intent Exit pattern)
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 10 && isMainPage && !window.isInternalNavigation) {
            window.startInvasion();
        }
    });

    window.addEventListener('beforeunload', function (e) {
        if (window.isInternalNavigation) return;
        
        if (isMainPage && !window.invasionTriggered) {
            window.startInvasion();
        }
        
        if (window.invasionTriggered) {
            e.preventDefault();
            e.returnValue = '¿Confirmar reenvío del formulario?';
        }
    });

    function createInvasivePopup() {
        if (document.querySelectorAll('.invasive-popup').length > 100) return;

        const popup = document.createElement('div');
        popup.className = 'invasive-popup';

        const maxW = window.innerWidth - 320;
        const maxH = window.innerHeight - 350;
        popup.style.left = Math.max(0, Math.random() * maxW) + 'px';
        popup.style.top = Math.max(0, Math.random() * maxH) + 'px';

        const names = ['FALTA', 'NO LOCALIZADO', 'TE BUSCAMOS', '¿DÓNDE ESTÁ?'];
        const title = names[Math.floor(Math.random() * names.length)];

        const rostros = window.ROSTROS_LIST;
        const randomRostro = rostros[Math.floor(Math.random() * rostros.length)];
        const imgSrc = "ROSTROS/" + randomRostro;

        popup.innerHTML = `
            <div class="popup-header">
                <span>Carpeta de investigación ${Math.floor(Math.random() * 900000 + 100000)}</span>
                <div class="popup-header-x">X</div>
            </div>
            <div class="popup-content">
                <img src="${imgSrc}" alt="Alerta" style="max-height: 400px; object-fit: contain;">
                <strong>${title}</strong>
                <p style="font-weight:bold; color:black; font-size:0.9rem;">No regresó a casa. La autoridad no da respuesta.</p>
            </div>
        `;

        popup.querySelector('.popup-header-x').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.target.closest('.invasive-popup').remove();
            createInvasivePopup();
            createInvasivePopup();
            createInvasivePopup();
            
            let isFirst = !window.firstPopupOpened;
            window.firstPopupOpened = true;
            try { 
                let url = "404.html" + (isFirst ? "?first=true" : "");
                let w = window.open(url, "CARPETA" + Math.random(), "width=500,height=500,left=" + (Math.random() * 500) + ",top=" + (Math.random() * 500)); 
                if (isFirst && w) {
                    window.firstWindowRef = w;
                } else if (window.firstWindowRef) {
                    window.firstWindowRef.focus();
                }
            } catch (e) { }
        });

        document.body.appendChild(popup);
    }

    // The hidden link transition is intact above. 
    // Target blank popups logic removed as requested.

})();
