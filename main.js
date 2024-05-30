
import * as three from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import gsap from 'gsap';

// Object representing the size of the camera viewport and renderer.
const size = { width: window.innerWidth, height: window.innerHeight };

// Create a new scene
const scene = new three.Scene();

// Create a sphere with and add it to the scene
const sphere = new three.SphereGeometry(3, 64, 64);
const mat = new three.MeshStandardMaterial({ color: 0x00ff83 });
mat.roughness = 0.3
const mesh = new three.Mesh(sphere, mat);
scene.add(mesh);

// Create a directional light and add it to the scene
const light = new three.DirectionalLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
scene.add(light);

// Create a camera and add it to the scene
const camera = new three.PerspectiveCamera(45, size.width / size.height);
camera.position.z = 20;
scene.add(camera);

// Get the canvas element.
const canvas = document.querySelector('.canvas');

// Create a WebGL renderer
const renderer = new three.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(2);
renderer.setSize(size.width, size.height);

//Set up the orbit coontrols
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Event listener for window resize events.
// Adjusts the size of the viewport and camera aspect ratio accordingly.
window.addEventListener('resize', () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
});

const animate = () => {
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();

// gsap timeline
const timeline = gsap.timeline({defaults: {duration: 1}});

// tween mesh scale from 0 to 1
timeline.fromTo(mesh.scale,  {x:0, y:0, z:0}, {x:1, y:1, z:1});

// tween navbar position
timeline.fromTo('nav',  {y:'-100%'}, {y:'0%'});

// tween title opacity
timeline.fromTo('.title',  {opacity:'0'}, {opacity:'1'});


let mouseDown = false;
let rgb = [];


window.addEventListener('mousedown', ()=> mouseDown = true)
window.addEventListener('mouseup', ()=> mouseDown = false)
window.addEventListener('mousemove', (e)=> {
    if(mouseDown){

        // Calculate RGB values based on mouse position
        rgb = [
            Math.round((e.pageX / size.width) * 255),
            Math.round((e.pageY / size.height) * 255),
            150
        ]

        // Create a new Color object with the calculated RGB values
        let newColor = new  three.Color(`rgb(${rgb.join(',')})`)

        // Animate the sphere color to the new color using GSAP
        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b
        })
    }
})


