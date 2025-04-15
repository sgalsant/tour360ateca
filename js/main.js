// Configuración inicial

let hotspots = [];

window.addEventListener('load', () => {
    const assets = document.querySelector('#assets');
    Array.from({ length: 6 }, (_, i) => i + 1).forEach(i => {
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

// Inicializar hotspots
Object.entries(hotspots).forEach(([key, el]) => {
    el.addEventListener('click', () => {
        if (el.getAttribute('visible')) {
            const panorama = key.replace('point', '');
            changeScene(panorama);
        }
    });

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
    const sky = document.querySelector('#sky');
    sky.setAttribute('src', `#point${panorama}`);
 //   onChangeScene();
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
    if (document.querySelector("#bienvenida") != undefined) return;

    const sky = document.querySelector('#sky');
    const src = sky.getAttribute('src');
    const panorama = getPanoramaName(src);

    switch (panorama) {
        case 'point1':
            mostrarHotspots([
                { id: 'point2', position: '-1 0 -3', rotation: '0 0 0' },
                { id: 'point3', position: '0 0.1 -2', rotation: '0 0 0' },
                { id: 'point6', position: '3 0 -5', rotation: '0 -20 0', size: [3,2] }
            ]);
            showVideos({
                hide: ['pantalla1', 'pantalla2']
            });
            break;
        case 'point2':
            mostrarHotspots([
                { id: 'point1', position: '-1.3 0 2', rotation:'0 -60 0', size:[1.5,2] },
                { id: 'point3', position: '0.3 0.1 -0.5', rotation:'0 -50 0', size:[0.4,0.5] },
                { id: 'point6', position: '17 0 -4', rotation:'0 -70 0', size:[12,8] }
            ]);
            showVideos({
                hide: ['pantalla1', 'pantalla2']
            });
            break;
        case 'point3':
            mostrarHotspots([
                { id: 'point1', position: '-1.2 -0.8 8', rotation: '0 -30 0', size:[3.2,2.5] },
                { id: 'point2', position: '-0.8 -0.8 1.8', rotation: '0 -30 0', size:[1,1] },
                { id: 'point4', position: '0.6 0 -3', rotation: '0 0 0', size:[3,3] },
                { id: 'point6', position: '9 -0.7 0', rotation: '0 -60 0', size:[5,6] }
            ]);
            showVideos({
                hide: ['pantalla1', 'pantalla2']
            });
            break;
        case 'point4':
            mostrarHotspots([
                { id: 'point2', position: '-0.5 -0.6 3.5', rotation: '0 -10 0', size: [1.5, 1] },
                { id: 'point3', position: '0.6 0 2', rotation: '0 -10 0', size: [1.5, 1] },
                { id: 'point6', position: '15 -2 1.5', rotation: '0 90 0', size: [12, 12] }
            ]);
            showVideos({
                show: ['pantalla1', 'pantalla2']
            });
            break;
        case 'point5':
            mostrarHotspots(['point6']);
            break;
        case 'point6':
            mostrarHotspots([
                { id: 'point4', position: '3 0.5 2', rotation: '0 70 0', size: [4, 3] },
                { id: 'point1', position: '1.3 0 -5', rotation: '0 -5 0', size: [2, 3] },
                { id: 'point2', position: '2 -0.5 -3.5', rotation: '0 0 0', size: [0.8, 1] },
                { id: 'point3', position: '3 0 -3', rotation: '0 -20 0', size: [1, 2] }
            ]);
            showVideos({
                hide: ['pantalla1', 'pantalla2']
            });
            break;
        default:
            mostrarHotspots([]);
    }
}

const sky = document.querySelector('#sky');
sky.addEventListener('materialtextureloaded', onChangeScene);

function cambiarOpacidadHotspots(valorOpacidad) {
    Object.values(hotspots).forEach(el => {
        el.setAttribute('material', {
            opacity: valorOpacidad,
            transparent: true
        });
    });
}

// Configuración de videos
const videoConfig = [
    { id: 'pantalla1', src: 'video/Video1.mp4' },
    { id: 'pantalla2', src: 'video/Video2.mp4' }
];

const videoMap = {};

videoConfig.forEach(({ id, src }) => {
    const video = document.createElement('video');
    video.id = id;
    video.src = src;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.autoplay = false;

    videoMap[id] = video;

    const plane = document.getElementById(id);
    plane.setAttribute('material', {
        shader: 'flat',
        src: video
    });

    plane.addEventListener('click', () => {
        if (!plane.getAttribute('visible')) return;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
});





