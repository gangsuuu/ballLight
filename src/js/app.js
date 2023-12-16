import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { texutreURL  } from "./texture.js"
import GUI from 'lil-gui';
import { gsap } from 'gsap';




export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  }
  );
  renderer.setClearColor(0x000000, 1);
  renderer.shadowMap.enabled = true;


  const container = document.querySelector('#container');
  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };


  

  const clock = new THREE.Clock();
  // const textureLoader = new THREE.TextureLoader();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    canvasSize.width / canvasSize.height,
    1,
    100
  );

  /** library */
  //const gui = new GUI();
  
  /** light */
  function getSpotLight(color, intensity) {
    var light = new THREE.SpotLight(color, intensity);
    light.castShadow = true;

    light.shadow.mapSize.x = 4096;
    light.shadow.mapSize.y = 4096;

    return light;
  }
  
  var spotLight_01 = getSpotLight('rgb(145,200,255)', 1);
  var spotLight_02 = getSpotLight('rgb(255,220,180)', 1);
  scene.add(spotLight_01);
  scene.add(spotLight_02);
  
  /** Camera */
  camera.position.x = 4;
  camera.position.y = 8;
  camera.position.z = 11;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  spotLight_01.position.x = 6;
	spotLight_01.position.y = 8;
	spotLight_01.position.z = -20;
  
	spotLight_02.position.x = -12;
	spotLight_02.position.y = 6;
	spotLight_02.position.z = -10;



  /** Controls */
  const orbitControls = () => {
    const controls = new OrbitControls(camera, renderer.domElement);
    return controls;
  }

  /** texture */
  function getTexture(obj) {
    var url = texutreURL(obj)
    return url
  }


  var textureLoader = new THREE.TextureLoader();
  // var texture = textureLoader.load('public/assets/road1.avif');
  var texture = textureLoader.load(getTexture('plane'));
  var metalTexture = textureLoader.load(getTexture('shape'));
  var repetition = 6;
  var textures = ['map','bumpMap','roughnessMap']


  /** createObject */
  const createBall = (radius) => {
    var geometry = new THREE.SphereGeometry(radius, 24, 24);
    var material = new THREE.MeshStandardMaterial({
      color: 'gray',
      bumpMap : metalTexture,
      roughnessMap : metalTexture,
    });
    var sphere = new THREE.Mesh(geometry, material);
    var sphereMaterial = sphere.material;

    sphere.castShadow = true;
    sphere.position.y = sphere.geometry.parameters.radius;
    
    sphereMaterial.bumpScale = 0.01;
    sphereMaterial.roughness = 0.75;
    sphereMaterial.metalness = 0.25;

    return sphere;
  }



  const creatPlane = (w,h) => {
    var geo = new THREE.PlaneGeometry(w, h);
    var material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      map: texture,
      bumpMap : texture,
      roughnessMap : texture,
    });
    
    var mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    mesh.rotation.x = Math.PI/2;

    const planeMaterial = mesh.material;
    planeMaterial.roughness = 0.65;
    planeMaterial.metalness = 0.75;
    planeMaterial.bumpScale = 0.01

    textures.forEach((mapName) => {
      planeMaterial[mapName].wrapS = THREE.RepeatWrapping;
      planeMaterial[mapName].wrapT = THREE.RepeatWrapping;
      planeMaterial[mapName].repeat.set(repetition, repetition); 
    });

    


    return mesh;
  
  }

  /** create */
  const create = () => {
    var sphere = createBall(1);
    var plane = creatPlane(50, 50);
    scene.add(sphere, plane);
    return {
      sphere,
      plane
    };
  };

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };



  const addEvent = () => {
    window.addEventListener('resize', resize);
    window.addEventListener("scroll", () => {
    });
    window.addEventListener('mousedown', (e) => {
    })
    window.addEventListener('mouseup', (e) => {
    })
  
  };
  


  const draw = (obj, orbitControl) => {
    const { sphere, plane } = obj;

    spotLight_01.intensity += (Math.random() - 0.5) * 0.15;
    spotLight_01.intensity = Math.abs(spotLight_01.intensity);

    spotLight_02.intensity += (Math.random() - 0.5) * 0.05;
    spotLight_02.intensity = Math.abs(spotLight_02.intensity);


    // sphere.scale.x += 0.01;
    // sphere.scale.z += 0.01;


    orbitControl.update();
    renderer.render(scene, camera);

    requestAnimationFrame(() => {
      draw(obj, orbitControl);
    });
  };




  const initialize = () => {
    const obj = create();
    const orbitControl = orbitControls()
    addEvent();
    resize();
    draw(obj, orbitControl);
  };

  initialize();
}