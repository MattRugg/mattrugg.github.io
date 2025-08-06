import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Create a scene
const scene = new THREE.Scene();

// Create a vertices array
const vertices = new Float32Array([
    -1.0, -0.5, 0,
    0, 2, 0,
    1.0, -0.5, 0,
    0, 0, -0.5,
    0, -1, 0,
    0, 0, 0.5,
]);

// Create a faces array
const faces = new Uint32Array([
    0, 1, 3,
    1, 2, 3,
    0, 3, 4,
    3, 2, 4,
    1, 0, 5,
    2, 1, 5,
    5, 0, 4,
    2, 5, 4,
]);

// Create a BufferGeometry object and add attributes
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setIndex(new THREE.BufferAttribute(faces, 1));

// Create a mesh material
const material = new THREE.MeshPhongMaterial({
    color: 0x666666,
    flatShading:true,
    specular: 0x999999,
    shininess: 100
});

// Create a mesh with the geometry and the material
const triangleMesh = new THREE.Mesh(geometry, material);

// Create directional light
const light = new THREE.DirectionalLight( 0xffffff, 5 );
light.position.set( 0.5, 0, 1 );

// Add elements to the scene
scene.add( new THREE.AmbientLight( 0x999999 ) );
scene.add( light );
scene.add(triangleMesh);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);

const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
const glitchPass = new GlitchPass();
const outputPass = new OutputPass();

composer.addPass( renderPass );
composer.addPass( glitchPass );
composer.addPass( outputPass );

// Add the renderer to the DOM and listen to resize events
document.body.appendChild(renderer.domElement);
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    composer.render();
    
    triangleMesh.rotation.y += 0.05;
    //triangleMesh.rotation.x += 0.001;
}
animate();