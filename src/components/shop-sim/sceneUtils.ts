import * as THREE from "three";

export function createAisle(
  length: number,
  shelves: number,
  height: number,
  width: number
): THREE.Group {
  const group = new THREE.Group();
  const shelfMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    metalness: 0.1,
    roughness: 0.8,
  });
  const supportMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.5,
    roughness: 0.5,
  });
  const backPanelMaterial = new THREE.MeshStandardMaterial({
    color: 0xbababa,
    roughness: 0.8,
  });

  const shelfThickness = 0.05;
  const supportWidth = 0.1;
  const supportDepth = 0.1;
  const backPanelDepth = 0.4;

  for (let i = 0; i < shelves; i++) {
    const y =
      (i * (height - shelfThickness)) / (shelves - 1) + shelfThickness / 2;
    const shelfGeo = new THREE.BoxGeometry(length, shelfThickness, width);
    const shelfMesh = new THREE.Mesh(shelfGeo, shelfMaterial);
    shelfMesh.position.y = y;
    shelfMesh.castShadow = true;
    shelfMesh.receiveShadow = true;
    group.add(shelfMesh);
  }

  const numSupports = Math.floor(length / 6) + 2;
  for (let i = 0; i < numSupports; i++) {
    const x = -length / 2 + i * (length / (numSupports - 1));
    const supportGeo = new THREE.BoxGeometry(
      supportWidth,
      height,
      supportDepth
    );
    const frontSupport = new THREE.Mesh(supportGeo, supportMaterial);
    frontSupport.position.set(x, height / 2, width / 2 - supportDepth / 2);
    frontSupport.castShadow = true;
    group.add(frontSupport);
    const backSupport = new THREE.Mesh(supportGeo, supportMaterial);
    backSupport.position.set(x, height / 2, -width / 2 + supportDepth / 2);
    backSupport.castShadow = true;
    group.add(backSupport);
  }

  const backPanelGeo = new THREE.BoxGeometry(length, height, backPanelDepth);
  const backPanel = new THREE.Mesh(backPanelGeo, backPanelMaterial);
  backPanel.position.y = height / 2;
  backPanel.position.z = -width / 2 + backPanelDepth / 2;
  backPanel.receiveShadow = true;
  group.add(backPanel);

  return group;
}

export function createShoppingCart(): THREE.Group {
  const cart = new THREE.Group();
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    wireframe: true,
  });
  const basketPoints = [
    new THREE.Vector3(-0.4, 0.5, -0.6),
    new THREE.Vector3(0.4, 0.5, -0.6),
    new THREE.Vector3(0.4, 0.5, 0.6),
    new THREE.Vector3(-0.4, 0.5, 0.6),
    new THREE.Vector3(-0.5, 1.0, -0.7),
    new THREE.Vector3(0.5, 1.0, -0.7),
    new THREE.Vector3(0.5, 1.0, 0.7),
    new THREE.Vector3(-0.5, 1.0, 0.7),
  ];
  const basketGeo = new THREE.BufferGeometry().setFromPoints(basketPoints);
  basketGeo.setIndex([
    0, 1, 2, 0, 2, 3, 0, 4, 5, 0, 5, 1, 3, 2, 6, 3, 6, 7, 0, 3, 7, 0, 7, 4, 1,
    5, 6, 1, 6, 2,
  ]);
  basketGeo.computeVertexNormals();
  const basketMesh = new THREE.Mesh(basketGeo, wireframeMaterial);
  cart.add(basketMesh);

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    metalness: 0.9,
    roughness: 0.3,
  });
  const handleBarGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.0, 8);
  const handleBar = new THREE.Mesh(handleBarGeo, frameMaterial);
  handleBar.rotation.z = Math.PI / 2;
  handleBar.position.set(0, 1.1, 0.8);
  cart.add(handleBar);

  const wheelGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
  wheelGeo.rotateX(Math.PI / 2);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const createWheel = (x: number, z: number) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMaterial);
    wheel.position.set(x, 0.1, z);
    cart.add(wheel);
  };
  createWheel(-0.35, -0.5);
  createWheel(0.35, -0.5);
  createWheel(-0.35, 0.5);
  createWheel(0.35, 0.5);

  cart.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return cart;
}
