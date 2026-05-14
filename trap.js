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

    // TRAMPA DEL BOTÓN DE RETROCESO (HISTORY HIJACK)
    window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', function () {
        window.history.pushState(null, "", window.location.href);
        if (typeof invasionTriggered !== 'undefined' && invasionTriggered) {
            window.location.replace("404.html");
        } else {
            if (typeof startInvasion === 'function') startInvasion();
        }
    });

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

        if (pageWrapper) pageWrapper.style.filter = `contrast(1.5) sepia(80%) hue-rotate(-50deg)`;
        else document.body.style.filter = `contrast(1.5) sepia(80%) hue-rotate(-50deg)`;

        spamInterval = setInterval(createInvasivePopup, 200);

        for (let i = 0; i < 7; i++) {
            setTimeout(() => {
                try { window.open("404.html", "_blank"); } catch (e) { }
            }, i * 300);
        }

        
    };

    // O SI INTENTAN IRSE DE LA PÁGINA (Intent Exit pattern)
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 10) {
            window.startInvasion();
        }
    });

    window.addEventListener('beforeunload', function (e) {
        if (window.invasionTriggered) {
            window.startInvasion();
            e.preventDefault();
            e.returnValue = 'La autoridad no responde. ¿Seguro que quieres ignorarlo?';
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
                <span>ALERTA_SISTEMA_${Math.floor(Math.random() * 9999)}</span>
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
            try { window.open("404.html", "ALERTA" + Math.random(), "width=400,height=400,left=" + (Math.random() * 500) + ",top=" + (Math.random() * 500)); } catch (e) { }
        });

        document.body.appendChild(popup);
    }

    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.href;
            
            // Primero asaltar la ventana deseada para que el navegador sí valide el click
            try { window.open(target, "_blank"); } catch (err) {}
            
            // Luego, invadir retrospectivamente con los errores falsos
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    try { window.open("404.html", "_blank"); } catch (err) {}
                }, i * 200 + 100);
            }
        });
    });

})();
