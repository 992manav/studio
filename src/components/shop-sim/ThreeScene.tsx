
"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { products } from '@/lib/products';
import { npcs as allNpcs } from '@/lib/npcs';
import type { Product, CartItem, Npc } from '@/lib/types';
import { useGame } from '@/contexts/GameContext';

interface ThreeSceneProps {
  onProductClick: (product: Product) => void;
  onNpcClick: (npc: Npc) => void;
  cart: CartItem[];
}

function createAisle(length: number, shelves: number, height: number, width: number, supportColor: THREE.ColorRepresentation): THREE.Group {
  const group = new THREE.Group();
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.8 });
  const supportMaterial = new THREE.MeshStandardMaterial({ color: supportColor, metalness: 0.5, roughness: 0.5 });
  const backPanelMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.8 });

  const shelfThickness = 0.05;
  const supportWidth = 0.1;
  const supportDepth = 0.1;

  // Shelves
  for (let i = 0; i < shelves; i++) {
    const y = (i * (height - shelfThickness)) / (shelves - 1) + shelfThickness / 2;
    const shelfGeo = new THREE.BoxGeometry(length, shelfThickness, width);
    const shelfMesh = new THREE.Mesh(shelfGeo, shelfMaterial);
    shelfMesh.position.y = y;
    shelfMesh.castShadow = true;
    shelfMesh.receiveShadow = true;
    group.add(shelfMesh);
  }

  // Supports
  const numSupports = Math.floor(length / 4) + 2;
  for (let i = 0; i < numSupports; i++) {
    const x = -length / 2 + i * (length / (numSupports - 1));
    const supportGeo = new THREE.BoxGeometry(supportWidth, height, supportDepth);
    
    const frontSupport = new THREE.Mesh(supportGeo, supportMaterial);
    frontSupport.position.set(x, height / 2, width / 2 - supportDepth / 2);
    frontSupport.castShadow = true;
    group.add(frontSupport);
    
    const backSupport = new THREE.Mesh(supportGeo, supportMaterial);
    backSupport.position.set(x, height / 2, -width / 2 + supportDepth / 2);
    backSupport.castShadow = true;
    group.add(backSupport);
  }

  // Back panel
  const backPanelGeo = new THREE.BoxGeometry(length, height, 0.02);
  const backPanel = new THREE.Mesh(backPanelGeo, backPanelMaterial);
  backPanel.position.y = height / 2;
  backPanel.position.z = 0; // Assuming shelf is symmetrical, back panel at center
  backPanel.receiveShadow = true;
  group.add(backPanel);

  return group;
}

function createShoppingCart(): THREE.Group {
  const cart = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 });
  const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true, transparent: true, opacity: 0.3 });

  // Basket
  const basketPoints = [
    new THREE.Vector3(-0.4, 0.5, -0.6), // bottom front left
    new THREE.Vector3(0.4, 0.5, -0.6),  // bottom front right
    new THREE.Vector3(0.4, 0.5, 0.6),   // bottom back right
    new THREE.Vector3(-0.4, 0.5, 0.6),  // bottom back left
    new THREE.Vector3(-0.5, 1.0, -0.7), // top front left
    new THREE.Vector3(0.5, 1.0, -0.7),  // top front right
    new THREE.Vector3(0.5, 1.0, 0.7),   // top back right
    new THREE.Vector3(-0.5, 1.0, 0.7),  // top back left
  ];

  const basketGeo = new THREE.BufferGeometry().setFromPoints(basketPoints);
  basketGeo.setIndex([
    // bottom
    0, 1, 2, 0, 2, 3,
    // top (not rendered)
    // front
    0, 4, 5, 0, 5, 1,
    // back
    3, 2, 6, 3, 6, 7,
    // left
    0, 3, 7, 0, 7, 4,
    // right
    1, 5, 6, 1, 6, 2
  ]);
  basketGeo.computeVertexNormals();

  const basketMesh = new THREE.Mesh(basketGeo, wireframeMaterial);
  cart.add(basketMesh);

  // Frame
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.3 });
  
  // Handle
  const handleBarGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.0, 8);
  const handleBar = new THREE.Mesh(handleBarGeo, frameMaterial);
  handleBar.rotation.z = Math.PI / 2;
  handleBar.position.set(0, 1.1, 0.8);
  cart.add(handleBar);

  // Wheels
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

  cart.traverse(child => {
      if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
      }
  });

  return cart;
}

function createCharacter(): THREE.Group {
    const avatar = new THREE.Group();
    
    // --- Define proportions ---
    const legRadius = 0.1;
    const legLength = 0.7;
    const legCapsuleHeight = legLength + 2 * legRadius; 

    const torsoRadius = 0.2;
    const torsoLength = 0.2;
    const torsoCapsuleHeight = torsoLength + 2 * torsoRadius; 

    const neckHeight = 0.1;
    const neckRadius = 0.07;
    
    const headRadius = 0.15;

    const armRadius = 0.06;
    const armLength = 0.6;

    // --- Create body parts ---
    const legGeo = new THREE.CapsuleGeometry(legRadius, legLength, 4, 8);
    const torsoGeo = new THREE.CapsuleGeometry(torsoRadius, torsoLength, 4, 8);
    const armGeo = new THREE.CapsuleGeometry(armRadius, armLength, 4, 8);
    const headGeo = new THREE.SphereGeometry(headRadius, 32, 16);
    const neckGeo = new THREE.CylinderGeometry(neckRadius, neckRadius, neckHeight, 16);

    // --- Position body parts ---
    const legY = legCapsuleHeight / 2;
    const torsoY = legCapsuleHeight + torsoCapsuleHeight / 2;
    const neckY = legCapsuleHeight + torsoCapsuleHeight;
    const headY = neckY + neckHeight / 2 + headRadius * 0.8;
    const armY = torsoY + torsoLength / 2 - 0.1;

    const leftLeg = new THREE.Mesh(legGeo);
    leftLeg.position.set(-torsoRadius * 0.6, legY, 0);
    
    const rightLeg = new THREE.Mesh(legGeo);
    rightLeg.position.set(torsoRadius * 0.6, legY, 0);

    const torso = new THREE.Mesh(torsoGeo);
    torso.position.y = torsoY;

    const neck = new THREE.Mesh(neckGeo);
    neck.position.y = neckY;

    const head = new THREE.Mesh(headGeo);
    head.position.y = headY;
    
    const leftArm = new THREE.Mesh(armGeo);
    leftArm.position.set(-(torsoRadius + armRadius), armY, 0);
    leftArm.rotation.z = Math.PI / 12;

    const rightArm = new THREE.Mesh(armGeo);
    rightArm.position.set(torsoRadius + armRadius, armY, 0);
    rightArm.rotation.z = -Math.PI / 12;
    
    avatar.add(head, neck, torso, leftLeg, rightLeg, leftArm, rightArm);
    avatar.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
        }
    });
    return avatar;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ onProductClick, onNpcClick, cart }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { avatarConfig } = useGame();

  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const avatarRef = useRef<THREE.Group>();
  const cartRef = useRef<THREE.Group>();
  const cartItemsGroupRef = useRef<THREE.Group>();
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const productMeshes = useRef<THREE.Mesh[]>([]);
  const npcMeshes = useRef<THREE.Group[]>([]);
  const npcAnimationData = useRef<{
    model: THREE.Group;
    npcData: Npc;
    path: THREE.Vector3[];
    currentTargetIndex: number;
    speed: number;
    isPaused: boolean;
    pauseTimer: number;
  }[]>([]);
  const clock = useRef(new THREE.Clock());


  const onPointerClick = useCallback((event: MouseEvent) => {
    if (!mountRef.current || !cameraRef.current) return;
    
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / mountRef.current.clientWidth) * 2 - 1;
    pointer.y = - (event.clientY / mountRef.current.clientHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, cameraRef.current);
    
    // Check for NPC clicks first
    const npcIntersects = raycaster.intersectObjects(npcMeshes.current, true);
    if (npcIntersects.length > 0) {
      let clickedNpcGroup = npcIntersects[0].object;
      while (clickedNpcGroup.parent && !clickedNpcGroup.userData.id) {
          clickedNpcGroup = clickedNpcGroup.parent;
      }
      const npcId = clickedNpcGroup.userData.id;
      if (npcId) {
        const npcData = allNpcs.find(n => n.id === npcId);
        if (npcData) {
            onNpcClick(npcData);
            return;
        }
      }
    }

    // Then check for product clicks
    const productIntersects = raycaster.intersectObjects(productMeshes.current);
    if (productIntersects.length > 0) {
      const clickedObject = productIntersects[0].object;
      const product = clickedObject.userData as Product;
      if (product) {
        onProductClick(product);
      }
    }
  }, [onProductClick, onNpcClick]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    scene.fog = new THREE.Fog(0x1a1a1a, 70, 160);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const textureLoader = new THREE.TextureLoader();

    // Lighting
    scene.add(new THREE.AmbientLight(0xaaaaaa, 0.1));
    const hemisphereLight = new THREE.HemisphereLight(0xeeeeee, 0x444444, 0.1);
    scene.add(hemisphereLight);
    
    const directionalLight = new THREE.DirectionalLight(0xeeeeff, 0.05);
    directionalLight.position.set(-30, 40, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 150;
    directionalLight.shadow.camera.left = -80;
    directionalLight.shadow.camera.right = 80;
    directionalLight.shadow.camera.top = 80;
    directionalLight.shadow.camera.bottom = -80;
    directionalLight.shadow.bias = -0.0005;
    scene.add(directionalLight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(150, 150);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.1 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls & Ceiling
    const wallHeight = 20;
    const wallSize = 150;
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8 });

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(wallSize, wallHeight), wallMaterial);
    backWall.position.set(0, wallHeight / 2, -wallSize / 2);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(wallSize, wallHeight), wallMaterial.clone());
    leftWall.position.set(-wallSize / 2, wallHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(wallSize, wallHeight), wallMaterial.clone());
    rightWall.position.set(wallSize / 2, wallHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
    
    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(wallSize, wallHeight), wallMaterial.clone());
    frontWall.position.set(0, wallHeight / 2, wallSize / 2);
    frontWall.rotation.y = Math.PI;
    frontWall.receiveShadow = true;
    scene.add(frontWall);

    // Rainbow Stripe
    const stripeHeight = 1.5;
    const stripeY = wallHeight - 5;
    const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff }); // Placeholder, will be replaced
    const stripeGeoH = new THREE.PlaneGeometry(wallSize, stripeHeight);
    const stripeGeoV = new THREE.PlaneGeometry(wallSize, stripeHeight);

    const colors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0xee82ee];
    const stripeSegments = 70;

    const createStripe = (geometry: THREE.BufferGeometry, isVertical: boolean) => {
        const group = new THREE.Group();
        const segmentSize = (isVertical ? wallSize : wallSize) / stripeSegments;
        for (let i = 0; i < stripeSegments; i++) {
            const segmentGeo = new THREE.PlaneGeometry(isVertical ? stripeHeight : segmentSize, isVertical ? segmentSize : stripeHeight);
            const segmentMat = new THREE.MeshBasicMaterial({ color: colors[i % colors.length] });
            const segment = new THREE.Mesh(segmentGeo, segmentMat);
            if (isVertical) {
                segment.position.z = -wallSize/2 + i * segmentSize + segmentSize/2;
            } else {
                segment.position.x = -wallSize/2 + i * segmentSize + segmentSize/2;
            }
            group.add(segment);
        }
        return group;
    }
    
    const backStripe = createStripe(stripeGeoH, false);
    backStripe.position.set(0, stripeY, -wallSize / 2 + 0.01);
    scene.add(backStripe);

    const frontStripe = createStripe(stripeGeoH, false);
    frontStripe.position.set(0, stripeY, wallSize / 2 - 0.01);
    frontStripe.rotation.y = Math.PI;
    scene.add(frontStripe);

    const leftStripe = createStripe(stripeGeoV, true);
    leftStripe.position.set(-wallSize / 2 + 0.01, stripeY, 0);
    leftStripe.rotation.y = Math.PI / 2;
    scene.add(leftStripe);

    const rightStripe = createStripe(stripeGeoV, true);
    rightStripe.position.set(wallSize / 2 - 0.01, stripeY, 0);
    rightStripe.rotation.y = -Math.PI / 2;
    scene.add(rightStripe);

    
    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(150, 150);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = wallHeight;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Player Avatar
    const avatar = createCharacter();
    const avatarMaterial = new THREE.MeshStandardMaterial({ color: avatarConfig.color });
    avatar.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = avatarMaterial;
        }
    });
    avatar.position.set(0, 0, 25);
    scene.add(avatar);
    avatarRef.current = avatar;
    camera.position.set(0, 4, 31);
    camera.lookAt(avatar.position);

    // NPCs
    npcAnimationData.current = allNpcs.map(npcData => {
        const npcAvatar = createCharacter();
        const npcMaterial = new THREE.MeshStandardMaterial({ color: npcData.color });
        npcAvatar.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = npcMaterial;
            }
        });
        npcAvatar.position.fromArray(npcData.position);
        npcAvatar.userData = { id: npcData.id };
        scene.add(npcAvatar);
        
        const path = (npcData.path || []).map(p => new THREE.Vector3(...p));

        return {
            model: npcAvatar,
            npcData,
            path,
            currentTargetIndex: 0,
            speed: 1.0 + (Math.random() - 0.5) * 0.5, // units per second
            isPaused: false,
            pauseTimer: 0
        };
    });
    npcMeshes.current = npcAnimationData.current.map(data => data.model);


    // Shopping Cart
    const cartModel = createShoppingCart();
    const cartOffset = new THREE.Vector3(0, 0, 1.5);
    const worldOffset = cartOffset.applyQuaternion(avatar.quaternion);
    const cartPosition = avatar.position.clone().add(worldOffset);
    cartPosition.y = 0;
    cartModel.position.copy(cartPosition);
    cartModel.quaternion.copy(avatar.quaternion);
    scene.add(cartModel);
    cartRef.current = cartModel;

    // This group will hold the product meshes inside the cart.
    const itemsGroup = new THREE.Group();
    cartItemsGroupRef.current = itemsGroup;
    cartModel.add(itemsGroup);

    // Aisles
    const aisleHeight = 3.5;
    const aisleWidth = 1.5;
    const aisleShelves = 5;
    const mainAisleLength = 40;
    const backAisleLength = 40;
    const aisleColors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0xee82ee];

    const mainAislePositions = [-16, -8, 8, 16];
    mainAislePositions.forEach((x, index) => {
        const aisle = createAisle(mainAisleLength, aisleShelves, aisleHeight, aisleWidth, aisleColors[index % aisleColors.length]);
        aisle.position.set(x, 0, 0);
        aisle.rotation.y = Math.PI / 2;
        scene.add(aisle);
    });
    
    const backAisle = createAisle(backAisleLength, aisleShelves, aisleHeight, aisleWidth, aisleColors[5]);
    backAisle.position.set(0, 0, -22);
    scene.add(backAisle);

    // Light Fixtures
    const lightFixtureMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.1 });
    const lightFixtureGeometry = new THREE.BoxGeometry(mainAisleLength * 0.9, 0.2, 0.5);
    const lightY = wallHeight - 1;

    mainAislePositions.forEach(x => {
        const fixture = new THREE.Mesh(lightFixtureGeometry, lightFixtureMaterial);
        fixture.position.set(x, lightY, 0);
        fixture.rotation.y = Math.PI / 2;
        scene.add(fixture);

        const pointLight = new THREE.PointLight(0xfff8e7, 80, 50, 1.5);
        pointLight.position.set(x, lightY - 1, 0);
        scene.add(pointLight);
    });

    const backAisleFixture = new THREE.Mesh(new THREE.BoxGeometry(backAisleLength * 0.9, 0.2, 0.5), lightFixtureMaterial);
    backAisleFixture.position.set(0, lightY, -22);
    scene.add(backAisleFixture);
    const backAisleLight = new THREE.PointLight(0xfff8e7, 80, 50, 1.5);
    backAisleLight.position.set(0, lightY - 1, -22);
    scene.add(backAisleLight);


    // Products
    productMeshes.current = products.map(product => {
      const productGeometry = new THREE.BoxGeometry(...product.size);
      const placeholderMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xcccccc).multiplyScalar(Math.random() * 0.5 + 0.5) });
      const productMesh = new THREE.Mesh(productGeometry, placeholderMaterial);
      productMesh.position.fromArray(product.position);
      productMesh.userData = product;
      productMesh.castShadow = true;
      productMesh.receiveShadow = true;
      scene.add(productMesh);
      
      textureLoader.load(product.image, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        productMesh.material = new THREE.MeshStandardMaterial({ map: texture });
        (productMesh.material as THREE.Material).needsUpdate = true;
      });

      return productMesh;
    });

    // Event Listeners
    const handleKeyDown = (event: KeyboardEvent) => { keysPressed.current[event.key.toLowerCase()] = true; };
    const handleKeyUp = (event: KeyboardEvent) => { keysPressed.current[event.key.toLowerCase()] = false; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    mountRef.current.addEventListener('click', onPointerClick);

    // Animation loop
    const animate = () => {
      if (!avatarRef.current || !cameraRef.current || !rendererRef.current || !sceneRef.current || !cartRef.current) {
        requestAnimationFrame(animate);
        return;
      }
      requestAnimationFrame(animate);

      const delta = clock.current.getDelta();
      const moveSpeed = 5.0; // units per second
      const rotateSpeed = 2.0; // radians per second
      
      const forward = new THREE.Vector3();
      avatarRef.current.getWorldDirection(forward);

      if (keysPressed.current['w']) {
        avatarRef.current.position.addScaledVector(forward, moveSpeed * delta);
      }
      if (keysPressed.current['s']) {
        avatarRef.current.position.addScaledVector(forward, -moveSpeed * delta);
      }
      if (keysPressed.current['a']) {
        avatarRef.current.rotation.y += rotateSpeed * delta;
      }
      if (keysPressed.current['d']) {
        avatarRef.current.rotation.y -= rotateSpeed * delta;
      }

      // NPC Movement
      npcAnimationData.current.forEach(npc => {
        if (npc.isPaused) {
            npc.pauseTimer -= delta;
            if (npc.pauseTimer <= 0) {
                npc.isPaused = false;
                npc.currentTargetIndex = (npc.currentTargetIndex + 1) % npc.path.length;
            }
            return; // Don't move while paused
        }

        if (!npc.path || npc.path.length === 0) return;

        const targetPosition = npc.path[npc.currentTargetIndex];
        const currentPosition = npc.model.position;
        const distanceToTarget = currentPosition.distanceTo(targetPosition);

        if (distanceToTarget < 0.2) { // Reached waypoint
            if (Math.random() < 0.2) { // 20% chance to pause
                npc.isPaused = true;
                npc.pauseTimer = Math.random() * 5 + 3; // Pause for 3-8 seconds
            } else {
                npc.currentTargetIndex = (npc.currentTargetIndex + 1) % npc.path.length;
            }
        } else {
            // Move towards the target
            const direction = new THREE.Vector3().subVectors(targetPosition, currentPosition).normalize();
            const moveDistance = npc.speed * delta;
            npc.model.position.addScaledVector(direction, moveDistance);
            
            // Face the direction of movement
            const lookAtTarget = new THREE.Vector3().copy(currentPosition).add(direction);
            npc.model.lookAt(lookAtTarget.x, npc.model.position.y, lookAtTarget.z);
        }
      });

      // Cart follows avatar
      const cartOffset = new THREE.Vector3(0, 0, 1.5); // Pushed back from avatar
      const worldOffset = cartOffset.applyQuaternion(avatarRef.current.quaternion);
      const cartTargetPosition = avatarRef.current.position.clone().add(worldOffset);
      cartTargetPosition.y = 0; // Keep cart on the floor
      cartRef.current.position.lerp(cartTargetPosition, 0.15);
      cartRef.current.quaternion.slerp(avatarRef.current.quaternion, 0.15);

      const cameraOffset = new THREE.Vector3(0, 3, 6);
      const cameraPosition = cameraOffset.applyMatrix4(avatarRef.current.matrixWorld);
      cameraRef.current.position.lerp(cameraPosition, 0.1);
      
      const lookAtPosition = avatarRef.current.position.clone().add(new THREE.Vector3(0,1,0));
      cameraRef.current.lookAt(lookAtPosition);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !mountRef.current) return;
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      mountRef.current?.removeEventListener('click', onPointerClick);
      if (rendererRef.current) {
        mountRef.current?.removeChild(renderer.domElement);
      }
    };
  }, [onPointerClick]);

  useEffect(() => {
    if (!cartItemsGroupRef.current) return;

    const group = cartItemsGroupRef.current;
    const textureLoader = new THREE.TextureLoader();

    // Clear existing items from the 3D cart
    while (group.children.length > 0) {
        const child = group.children[0] as THREE.Mesh;
        group.remove(child);
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
        } else {
            child.material.dispose();
        }
    }

    // Add current cart items to the 3D cart
    cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            const productGeometry = new THREE.BoxGeometry(...item.size);
            const placeholderMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
            const productMesh = new THREE.Mesh(productGeometry, placeholderMaterial);

            // Position items randomly inside the basket area
            productMesh.position.set(
                (Math.random() - 0.5) * 0.7, // x-axis
                0.6 + (Math.random() * 0.3),  // y-axis (stacked)
                (Math.random() - 0.5) * 1.1   // z-axis
            );

            // Random rotation for a more natural look
            productMesh.rotation.set(
                Math.random() * 0.5,
                Math.random() * Math.PI * 2,
                Math.random() * 0.5
            );
            
            productMesh.castShadow = true;
            
            textureLoader.load(item.image, (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                productMesh.material = new THREE.MeshStandardMaterial({ map: texture });
                (productMesh.material as THREE.Material).needsUpdate = true;
            });

            group.add(productMesh);
        }
    });
  }, [cart]);

  useEffect(() => {
    if (!avatarRef.current) return;

    if (avatarConfig.texture) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(avatarConfig.texture, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const newMaterial = new THREE.MeshStandardMaterial({ map: texture });
        avatarRef.current?.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = newMaterial;
          }
        });
      });
    } else {
      const newMaterial = new THREE.MeshStandardMaterial({ color: avatarConfig.color });
      avatarRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = newMaterial;
        }
      });
    }
  }, [avatarConfig.texture, avatarConfig.color]);

  return <div ref={mountRef} className="w-full h-full cursor-pointer" />;
};
