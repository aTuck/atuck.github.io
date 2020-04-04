const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x333333);
document.getElementById("three").appendChild(renderer.domElement);

const getRandom = (min, max) => Math.random() * (max - min) + min;

const shapes = {
  icoso: new THREE.IcosahedronGeometry(getRandom(0.3, 2), 1),
  tetra: new THREE.TetrahedronGeometry(getRandom(0.3, 2), 1),
};

function createShape(shapeType) {
  const geometry = shapes[shapeType];
  const material = new THREE.MeshPhongMaterial({
    color: 0x362f23,
    shading: THREE.FlatShading,
    shininess: 0,
  });
  const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    shading: THREE.FlatShading,
    wireframe: true,
    transparent: true,
  });

  const shape = new THREE.SceneUtils.createMultiMaterialObject(geometry, [
    material,
    wireframeMat,
  ]);

  return {
    shape,
    xPos: getRandom(0, 1),
    yPos: getRandom(0, 1),
    zPos: getRandom(0, 1),
    xRate: getRandom(-0.01, 0.01),
    yRate: getRandom(-0.01, 0.01),
    zRate: getRandom(-0.005, 0.005),
    xRadius: getRandom(-2, 2),
    yRadius: getRandom(-3, 3),
    zRadius: getRandom(-3, 3),
  };
}

function updateShape(shapeData) {
  const { shape } = shapeData;
  shapeData.shape.rotation.x += 0.01;
  shapeData.shape.rotation.y += 0.01;
  shapeData.shape.position.x = shapeData.xRadius * Math.cos(shapeData.xPos);
  shapeData.shape.position.y = shapeData.yRadius * Math.cos(shapeData.yPos);
  shapeData.shape.position.z = shapeData.zRadius * Math.cos(shapeData.zPos);
  shapeData.xPos += shapeData.xRate;
  shapeData.yPos += shapeData.yRate;
  shapeData.zPos += shapeData.zRate;
}

const light = new THREE.PointLight(0xffffff);
light.position.set(10, 0, 5);
scene.add(light);

camera.position.z = 5;

const shapeTypes = ["icoso", "tetra"];
const shapeArray = [];
for (let i = 0; i < 5; i++) {
  const shapeData = createShape(shapes[shapeTypes[i % 2]]);
  shapeData.zRadius = i * 2;
  shapeArray.push(shapeData);
  scene.add(shapeData.shape);
}

const render = () => {
  requestAnimationFrame(render);

  shapeArray.forEach(updateShape);

  renderer.render(scene, camera);
};

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

render();
