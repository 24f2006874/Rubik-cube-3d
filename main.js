import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// --- Configuration ---
const CUBE_SIZE = 1;
const SPACING = 0.02; 
const ANIMATION_SPEED = 300; 
const SHUFFLE_MOVES = 20;
const SHUFFLE_SPEED = 100; 

// Colors
const COLORS = {
    base: 0x111111,
    R: 0xb90000, 
    L: 0xff5900, 
    U: 0xffffff, 
    D: 0xffd500, 
    F: 0x009e60, 
    B: 0x0045ad  
};

let isAnimating = false;
let moveHistory = []; 
const cubies = []; 

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(5, 5, 7);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = true;
controls.minDistance = 3;
controls.maxDistance = 15;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-10, -10, -5);
    scene.add(fillLight);

function createStickerTexture(colorHex) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Draw base (black border)
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, size, size);

    // Bevel effect: draw shadow
    const pad = 28;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.moveTo(pad + 12, pad);
    ctx.lineTo(size - pad - 12, pad);
    ctx.quadraticCurveTo(size - pad, pad, size - pad, pad + 12);
    ctx.lineTo(size - pad, size - pad - 12);
    ctx.quadraticCurveTo(size - pad, size - pad, size - pad - 12, size - pad);
    ctx.lineTo(pad + 12, size - pad);
    ctx.quadraticCurveTo(pad, size - pad, pad, size - pad - 12);
    ctx.lineTo(pad, pad + 12);
    ctx.quadraticCurveTo(pad, pad, pad + 12, pad);
    ctx.closePath();
    ctx.fillStyle = '#' + new THREE.Color(colorHex).getHexString();
    ctx.fill();
    ctx.restore();

    // Bevel highlight (top left)
    const grad = ctx.createLinearGradient(pad, pad, pad + 60, pad + 60);
    grad.addColorStop(0, 'rgba(255,255,255,0.35)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.moveTo(pad + 12, pad);
    ctx.lineTo(size - pad - 12, pad);
    ctx.quadraticCurveTo(size - pad, pad, size - pad, pad + 12);
    ctx.lineTo(size - pad, size - pad - 12);
    ctx.quadraticCurveTo(size - pad, size - pad, size - pad - 12, size - pad);
    ctx.lineTo(pad + 12, size - pad);
    ctx.quadraticCurveTo(pad, size - pad, pad, size - pad - 12);
    ctx.lineTo(pad, pad + 12);
    ctx.quadraticCurveTo(pad, pad, pad + 12, pad);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Inner shadow (bottom right)
    const grad2 = ctx.createLinearGradient(size - pad, size - pad, pad, pad);
    grad2.addColorStop(0, 'rgba(0,0,0,0.18)');
    grad2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.moveTo(pad + 12, pad);
    ctx.lineTo(size - pad - 12, pad);
    ctx.quadraticCurveTo(size - pad, pad, size - pad, pad + 12);
    ctx.lineTo(size - pad, size - pad - 12);
    ctx.quadraticCurveTo(size - pad, size - pad, size - pad - 12, size - pad);
    ctx.lineTo(pad + 12, size - pad);
    ctx.quadraticCurveTo(pad, size - pad, pad, size - pad - 12);
    ctx.lineTo(pad, pad + 12);
    ctx.quadraticCurveTo(pad, pad, pad + 12, pad);
    ctx.closePath();
    ctx.fillStyle = grad2;
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

const materials = [
    new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.R), roughness: 0.2, metalness: 0.1 }), 
    new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.L), roughness: 0.2, metalness: 0.1 }), 
    new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.U), roughness: 0.2, metalness: 0.1 }), 
    new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.D), roughness: 0.2, metalness: 0.1 }), 
    new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.F), roughness: 0.2, metalness: 0.1 }), 
    new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.B), roughness: 0.2, metalness: 0.1 }), 
];

const geometry = new RoundedBoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 4, 0.1);

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            const materialsCopy = materials.map(m => m.clone());
            const mesh = new THREE.Mesh(geometry, materialsCopy);
            mesh.position.set(
                x * (CUBE_SIZE + SPACING),
                y * (CUBE_SIZE + SPACING),
                z * (CUBE_SIZE + SPACING)
            );
            mesh.userData = { initialX: x, initialY: y, initialZ: z };
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
            cubies.push(mesh);
        }
    }
}

const pivot = new THREE.Object3D();
pivot.rotation.order = 'XYZ';
scene.add(pivot);

async function rotateLayer(axis, index, direction, duration = ANIMATION_SPEED, record = true) {
    if (isAnimating) return;
    isAnimating = true;
    const epsilon = 0.1;
    const targetCubies = [];
    const coordinate = index * (CUBE_SIZE + SPACING);
    cubies.forEach(cube => {
        if (Math.abs(cube.position[axis] - coordinate) < epsilon) {
            targetCubies.push(cube);
        }
    });
    pivot.rotation.set(0, 0, 0);
    pivot.position.set(0, 0, 0);
    targetCubies.forEach(cube => {
        pivot.attach(cube);
    });
    const targetRotation = (Math.PI / 2) * direction * -1;
    const startRotation = 0;
    await new Promise(resolve => {
        const startTime = performance.now();
        function animate() {
            const now = performance.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            pivot.rotation[axis] = startRotation + (targetRotation * ease);
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        }
        animate();
    });
    pivot.updateMatrixWorld();
    targetCubies.forEach(cube => {
        scene.attach(cube);
        cube.position.x = Math.round(cube.position.x / (CUBE_SIZE + SPACING)) * (CUBE_SIZE + SPACING);
        cube.position.y = Math.round(cube.position.y / (CUBE_SIZE + SPACING)) * (CUBE_SIZE + SPACING);
        cube.position.z = Math.round(cube.position.z / (CUBE_SIZE + SPACING)) * (CUBE_SIZE + SPACING);
        cube.rotation.x = Math.round(cube.rotation.x / (Math.PI/2)) * (Math.PI/2);
        cube.rotation.y = Math.round(cube.rotation.y / (Math.PI/2)) * (Math.PI/2);
        cube.rotation.z = Math.round(cube.rotation.z / (Math.PI/2)) * (Math.PI/2);
        cube.updateMatrixWorld();
    });
    pivot.rotation.set(0,0,0);
    if (record) {
        moveHistory.push({ axis, index, direction });
    }
    isAnimating = false;
}

async function shuffleCube() {
    if (isAnimating) return;
    showToast("Shuffling...");
    moveHistory = []; 
    const axes = ['x', 'y', 'z'];
    const indices = [-1, 0, 1];
    const dirs = [1, -1];
    for (let i = 0; i < SHUFFLE_MOVES; i++) {
        const axis = axes[Math.floor(Math.random() * axes.length)];
        const index = indices[Math.floor(Math.random() * indices.length)];
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        await rotateLayer(axis, index, dir, SHUFFLE_SPEED, true);
    }
    showToast("Shuffled!");
}

async function solveCube() {
    if (isAnimating) return;
    if (moveHistory.length === 0) {
        showToast("Already Solved");
        return;
    }
    showToast("Solving...");
    while (moveHistory.length > 0) {
        const move = moveHistory.pop();
        await rotateLayer(move.axis, move.index, move.direction * -1, ANIMATION_SPEED, false);
    }
    showToast("Solved!");
}

document.querySelectorAll('.rotate-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const axis = btn.dataset.axis;
        const layer = parseInt(btn.dataset.layer);
        const dir = parseInt(btn.dataset.dir);

        // Remove previous highlight
        cubies.forEach(cube => {
            cube.material.forEach(mat => {
                mat.emissive = new THREE.Color(0x000000);
                mat.emissiveIntensity = 0;
            });
        });

        // Highlight affected cubies (static color)
        const coordinate = layer * (CUBE_SIZE + SPACING);
        const epsilon = 0.1;
        const affected = cubies.filter(cube => Math.abs(cube.position[axis] - coordinate) < epsilon);
        affected.forEach(cube => {
            cube.material.forEach(mat => {
                mat.emissive = new THREE.Color(0x00ffea);
                mat.emissiveIntensity = 0.5;
            });
        });

        await rotateLayer(axis, layer, dir);
    });
});

document.getElementById('btn-shuffle').addEventListener('click', shuffleCube);
document.getElementById('btn-solve').addEventListener('click', solveCube);


document.getElementById('zoom-in').addEventListener('click', () => {
    const before = camera.position.distanceTo(controls.target);
    controls.dollyIn(1.2);
    controls.update();
    const after = camera.position.distanceTo(controls.target);
    if (after <= controls.minDistance + 0.01) {
        showToast('Reached minimum zoom');
    }
});
document.getElementById('zoom-out').addEventListener('click', () => {
    const before = camera.position.distanceTo(controls.target);
    controls.dollyOut(1.2);
    controls.update();
    const after = camera.position.distanceTo(controls.target);
    if (after >= controls.maxDistance - 0.01) {
        showToast('Reached maximum zoom');
    }
});

function showToast(msg) {
    const toast = document.getElementById('status-toast');
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 2000);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
