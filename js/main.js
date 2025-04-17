// Configuración inicial

let hotspots = [];

// Configuración de Videos
const videoConfigs = {
    pantalla1: {
        src: 'video/Video1.mp4',
        element: null, // Se asignará en 'load'
        plane: null,   // Se asignará en 'load'
        playIcon: null, // Se asignará en 'load'
        scenes: {
            point4: { position: '1.23 -0.26 -2', rotation: '0 -25 0', width: 1.36, height: 0.8 }
            // Añadir más escenas si es necesario
        }
    },
    pantalla2: {
        src: 'video/Video2.mp4',
        element: null,
        plane: null,
        playIcon: null,
        scenes: {
         //   point3: { position: '-7 -.5 -2', rotation: '0 110 5', width: 2.25, height: 2.25 },
            point4: { position: '-2.55 -0.23 4', rotation: '0 155 0', width: 1.49, height: 0.85 }
            // Añadir más escenas si es necesario
        }
    }
};

window.addEventListener('load', () => {
    const assets = document.querySelector('#assets');
    [6, 3, 2, 4, 5].forEach(i => {
        if (document.getElementById(`point${i}`) == undefined) {
            const img = document.createElement('img');
            img.setAttribute('id', `point${i}`);
            img.setAttribute('src', `imagenes/point${i}.JPG`);
            assets.appendChild(img);
        }
    });

    // Hotspots
    hotspots = {
        point1: document.querySelector('#to-panorama1'),
        point2: document.querySelector('#to-panorama2'),
        point3: document.querySelector('#to-panorama3'),
        point4: document.querySelector('#to-panorama4'),
        point5: document.querySelector('#to-panorama5'),
        point6: document.querySelector('#to-panorama6')
    };

    // Inicializar Videos
    Object.keys(videoConfigs).forEach(id => {
        const config = videoConfigs[id];

        // Crear elemento de video
        const video = document.createElement('video');
        video.id = `video-${id}`;
        video.src = config.src;
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.autoplay = false;
        assets.appendChild(video); // Añadir a assets para precarga
        config.element = video;

        // --- Creación Dinámica del Plano y el Icono ---
        // Ya no buscamos en el DOM, creamos los elementos aquí

        // Crear el plano (a-plane)
        const plane = document.createElement('a-plane');
        plane.id = id; // Asignar el ID (e.g., 'pantalla1')
        plane.setAttribute('visible', false); // Empezar oculto (se hará visible en updateVideosForScene si aplica)
        plane.setAttribute('material', {
            shader: 'flat',
            src: `#${video.id}`, // Referencia al ID del elemento <video>
            transparent: true, // Necesario para la opacidad
            opacity: 0 // Empezar totalmente transparente
        });
        // Atributos como position, rotation, width, height se establecerán en updateVideosForScene

        // Crear el icono de play (a-image)
        const playIcon = document.createElement('a-image');
        playIcon.setAttribute('class', 'play-icon'); // Mantener clase útil
        playIcon.setAttribute('src', '#iconoPlay'); // Asegúrate que este ID existe en <a-assets>
        playIcon.setAttribute('width', '0.5');  // Ajusta el tamaño según necesites
        playIcon.setAttribute('height', '0.5'); // Ajusta el tamaño según necesites
        playIcon.setAttribute('position', '0 0 0.01'); // Ligeramente delante del plano
        playIcon.setAttribute('visible', true); // El icono es visible por defecto cuando el plano lo sea
        playIcon.classList.add('clickable'); // Hacer el icono clickable

        // Añadir icono como hijo del plano
        plane.appendChild(playIcon);

        // Guardar referencias en la configuración
        config.plane = plane;
        config.playIcon = playIcon;

        // Añadir el plano a la escena principal
        document.querySelector('a-scene').appendChild(plane);

        // --- Fin Creación Dinámica ---


        // Asignar video al material del plano (esto ya no es necesario aquí, se hizo al crear el plano)
        /* config.plane.setAttribute('material', {
            shader: 'flat',
            src: `#${video.id}`
        }); */

        // Evento para el icono de Play (Funciona igual con el elemento creado dinámicamente)
        config.playIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Evitar que el click llegue al plano
            // Salir si el icono no es visible (evita doble click rápido)
            if (!config.playIcon.getAttribute('visible')) return;

            // Hacer el plano opaco
            config.plane.setAttribute('material', 'opacity', 1);
            // Ocultar icono
            config.playIcon.setAttribute('visible', false);
            // Asegurar que el plano sea visible (aunque ya debería estarlo si el icono lo estaba)
            config.plane.setAttribute('visible', true);

            config.element.play();
            config.plane.classList.add('video-playing'); // Marcar para el evento del plano
            config.plane.classList.add('clickable'); // Hacer plano clickable para pausar
            config.playIcon.classList.remove('clickable'); // Icono ya no clickable

            // Forzar actualización del material después de que el video empiece a reproducirse
            config.plane.setAttribute('material', 'src', `#${config.element.id}`);
        });

        // Evento para el plano (pausar)
        config.plane.addEventListener('click', () => {
            if (!config.plane.getAttribute('visible') || !config.plane.classList.contains('video-playing')) return;

            config.element.pause();
            // Mostrar icono de play
            config.playIcon.setAttribute('visible', true);
            // Hacer el plano transparente de nuevo
            config.plane.setAttribute('material', 'opacity', 0);
            config.plane.classList.remove('video-playing');
            config.plane.classList.remove('clickable'); // Plano ya no clickable
            config.playIcon.classList.add('clickable'); // Icono clickable de nuevo
        });
    });

    // Inicializar hotspots
    Object.entries(hotspots).forEach(([key, el]) => {
        el.addEventListener('click', () => {
            if (el.getAttribute('visible')) {
                const panorama = key.replace('point', '');
                changeScene(panorama);
            }
        });

        const sky = document.querySelector('#sky');
        sky.addEventListener('materialtextureloaded', onChangeScene);
        // Inicialización

        mostrarHotspots();
        cambiarOpacidadHotspots(0);
    });

    document.querySelector("#btnEnter").addEventListener('click', () => {
        const panel = document.querySelector("#bienvenida");
        // Añadir animación de desvanecimiento
        panel.setAttribute('animation__fade', {
            property: 'scale',
            to: '0 0 0',
            dur: 500,
            easing: 'easeInOutCubic'
        });

        // Eliminar el panel después de la animación
        setTimeout(() => {
            panel.parentNode.removeChild(panel);
            // Activar los hotspots después de cerrar el panel de bienvenida
            onChangeScene();
        }, 600);
    });
});



// Funciones
function getPanoramaName(src) {
    return src.substring(1);
}

function changeScene(panorama) {
    console.log(`[DEBUG] Attempting to change scene to: point${panorama}`); // Log para depuración
    const sky = document.querySelector('#sky');
    sky.setAttribute('src', `#point${panorama}`);

    // Llamar a onChangeScene directamente para asegurar la actualización de la UI
    // ya que 'materialtextureloaded' puede tener retrasos o no ser fiable en todos los casos.
    // La comprobación de 'bienvenida' dentro de onChangeScene evitará problemas.
    onChangeScene();
}

function mostrarHotspots(configs = []) {
    Object.entries(hotspots).forEach(([key, el]) => {
        const config = configs.find(cfg => cfg.id === key);
        const activo = !!config;

        el.setAttribute('visible', activo);
        el.classList.toggle('clickable', activo);

        if (activo) {
            if (config.position) {
                el.setAttribute('position', config.position);
            }
            if (config.rotation) {
                el.setAttribute('rotation', config.rotation);
            }
            if (Array.isArray(config.size) && config.size.length === 2) {
                el.setAttribute('geometry', {
                    width: config.size[0],
                    height: config.size[1]
                });
            }
        }
    });
}

function showVideos({ show = [], hide = [] }) {
    show.forEach(id => {
        const plane = document.getElementById(id);
        if (!plane) return;

        plane.setAttribute('visible', true);
        plane.classList.add('clickable');

        const video = videoMap[id];
    });

    hide.forEach(id => {
        const plane = document.getElementById(id);
        if (!plane) return;

        plane.setAttribute('visible', false);
        plane.classList.remove('clickable');

        const video = videoMap[id];
        if (video) {
            video.pause();
        }
    });
}

function onChangeScene() {
    console.log("[DEBUG] onChangeScene called"); // Log para depuración
    const bienvenidaPanel = document.querySelector("#bienvenida");
    if (bienvenidaPanel) {
        console.log("[DEBUG] onChangeScene aborted: bienvenida panel visible."); // Log para depuración
        return; // No hacer nada si la bienvenida está activa
    }

    const sky = document.querySelector('#sky');
    const src = sky.getAttribute('src');
    const panorama = getPanoramaName(src);
    console.log(`[DEBUG] onChangeScene processing for: ${panorama}`); // Log para depuración

    // Actualizar videos para la nueva escena
    updateVideosForScene(panorama);

    // Lógica para mostrar/ocultar hotspots
    let hotspotConfigs = [];
    switch (panorama) {
        case 'point1':
            hotspotConfigs = [
                { id: 'point2', position: '-1 0 -3', rotation: '0 0 0' },
                { id: 'point3', position: '0 0.1 -2', rotation: '0 0 0' },
                { id: 'point6', position: '3 0 -5', rotation: '0 -20 0', size: [3, 2] }
            ];
            break;
        case 'point2':
            hotspotConfigs = [
                { id: 'point1', position: '-1.3 0 2', rotation: '0 -60 0', size: [1.5, 2] },
                { id: 'point3', position: '0.3 0.1 -0.5', rotation: '0 -50 0', size: [0.4, 0.5] },
                { id: 'point6', position: '17 0 -4', rotation: '0 -70 0', size: [12, 8] }
            ];
            break;
        case 'point3':
            hotspotConfigs = [
                { id: 'point1', position: '-1.2 -0.8 8', rotation: '0 -30 0', size: [3.2, 2.5] },
                { id: 'point2', position: '-0.8 -0.8 1.8', rotation: '0 -30 0', size: [1, 1] },
                { id: 'point4', position: '0.6 0 -3', rotation: '0 0 0', size: [3, 3] },
                { id: 'point6', position: '9 -0.7 0', rotation: '0 -60 0', size: [5, 6] }
            ];
            break;
        case 'point4':
            hotspotConfigs = [
                { id: 'point2', position: '-0.5 -0.6 3.5', rotation: '0 -10 0', size: [1.5, 1] },
                { id: 'point3', position: '0.6 0 2', rotation: '0 -10 0', size: [1.5, 1] },
                { id: 'point6', position: '15 -2 1.5', rotation: '0 90 0', size: [12, 12] }
            ];
            break;
        case 'point5':
            hotspotConfigs = ['point6']; // Simplificado, ajustar si es necesario
            break;
        case 'point6':
            hotspotConfigs = [
                { id: 'point4', position: '3 0.5 2', rotation: '0 70 0', size: [4, 3] },
                { id: 'point1', position: '1.3 0 -5', rotation: '0 -5 0', size: [2, 3] },
                { id: 'point2', position: '2 -0.5 -3.5', rotation: '0 0 0', size: [0.8, 1] },
                { id: 'point3', position: '3 0 -3', rotation: '0 -20 0', size: [1, 2] }
            ];
            break;
        default:
            hotspotConfigs = [];
    }
    mostrarHotspots(hotspotConfigs);

}

function updateVideosForScene(panorama) {
    Object.keys(videoConfigs).forEach(id => {
        const config = videoConfigs[id];
        const sceneConfig = config.scenes[panorama];

        if (sceneConfig) {
            // Configurar posición, rotación y tamaño del plano
            config.plane.setAttribute('position', sceneConfig.position);
            config.plane.setAttribute('rotation', sceneConfig.rotation);
            config.plane.setAttribute('width', sceneConfig.width);
            config.plane.setAttribute('height', sceneConfig.height);

            // Hacer el plano visible pero transparente, y el icono visible
            config.plane.setAttribute('visible', true);
            config.plane.setAttribute('material', 'opacity', 0);
            config.playIcon.setAttribute('visible', true);

            // Pausar video si se estaba reproduciendo
            if (!config.element.paused) {
                config.element.pause();
            }
            config.plane.classList.remove('video-playing');
            config.playIcon.classList.add('clickable'); // Icono clickable
            config.plane.classList.remove('clickable'); // Plano no clickable inicialmente

        } else {
            // Ocultar completamente plano e icono si no pertenecen a esta escena
            config.plane.setAttribute('visible', false);
            config.playIcon.setAttribute('visible', false);
            if (!config.element.paused) {
                config.element.pause();
            }
            config.playIcon.classList.remove('clickable');
            config.plane.classList.remove('clickable');
            config.plane.classList.remove('video-playing');
        }
    });
}

function cambiarOpacidadHotspots(valorOpacidad) {
    Object.values(hotspots).forEach(el => {
        el.setAttribute('material', {
            opacity: valorOpacidad,
            transparent: true
        });
    });
}