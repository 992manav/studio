
"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { products } from '@/lib/products';
import { npcs as allNpcs } from '@/lib/npcs';
import type { Product, CartItem, Npc } from '@/lib/types';
import { useGame } from '@/contexts/GameContext';

function createAisle(length: number, shelves: number, height: number, width: number): THREE.Group {
  const group = new THREE.Group();
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.8 });
  const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.5, roughness: 0.5 });
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
  const numSupports = Math.floor(length / 6) + 2;
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
  const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true, transparent: true, opacity: 0.5 });

  // Basket (Wireframe part)
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

function createCharacter(materials: {
  skin: THREE.Material;
  hair: THREE.Material;
  shirt: THREE.Material;
  pants: THREE.Material;
  shoes: THREE.Material;
}, config: { isEmployee?: boolean } = {}): THREE.Group {
  const group = new THREE.Group();

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 32, 16),
    materials.skin
  );
  head.position.y = 1.6;
  group.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    materials.hair
  );
  hair.position.y = 1.6;
  group.add(hair);

  const eyeGeo = new THREE.SphereGeometry(0.02, 12, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  leftEye.position.set(-0.06, 1.62, 0.13);
  group.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  rightEye.position.set(0.06, 1.62, 0.13);
  group.add(rightEye);
  
  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), pupilMaterial);
  leftPupil.position.z = 0.015;
  leftEye.add(leftPupil);
  const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), pupilMaterial);
  rightPupil.position.z = 0.015;
  rightEye.add(rightPupil);

  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.1, 16),
    materials.skin
  );
  neck.position.y = 1.5;
  group.add(neck);

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.5, 0.2),
    materials.shirt
  );
  torso.name = "torso";
  torso.position.y = 1.2;
  group.add(torso);

  if (config.isEmployee) {
    const vestMaterial = new THREE.MeshStandardMaterial({ color: 0x0071ce, roughness: 0.7, metalness: 0.1 });
    const vestWidth = 0.37;
    const vestHeight = 0.52;
    const vestDepth = 0.02;
    const torsoDepth = 0.2;

    const backPanel = new THREE.Mesh(
        new THREE.BoxGeometry(vestWidth, vestHeight, vestDepth),
        vestMaterial
    );
    backPanel.position.set(0, 1.2, -torsoDepth / 2 - vestDepth/2);
    backPanel.castShadow = true;
    backPanel.receiveShadow = true;
    group.add(backPanel);
    
    const frontPanelWidth = vestWidth / 2 - 0.02; // Small gap in the middle
    
    const leftPanel = new THREE.Mesh(
        new THREE.BoxGeometry(frontPanelWidth, vestHeight, vestDepth),
        vestMaterial
    );
    leftPanel.position.set(-(vestWidth/4), 1.2, torsoDepth / 2 + vestDepth/2);
    leftPanel.castShadow = true;
    leftPanel.receiveShadow = true;
    group.add(leftPanel);
    
    const rightPanel = new THREE.Mesh(
        new THREE.BoxGeometry(frontPanelWidth, vestHeight, vestDepth),
        vestMaterial
    );
    rightPanel.position.set((vestWidth/4), 1.2, torsoDepth / 2 + vestDepth/2);
    rightPanel.castShadow = true;
    rightPanel.receiveShadow = true;
    group.add(rightPanel);
  }

  const hips = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.2, 0.2),
    materials.pants
  );
  hips.position.y = 0.9;
  group.add(hips);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
  const handGeo = new THREE.SphereGeometry(0.06, 8, 8);

  const leftArm = new THREE.Mesh(armGeo, materials.shirt);
  leftArm.name = "leftArm";
  leftArm.position.set(-0.225, 1.15, 0);
  leftArm.rotation.z = Math.PI / 12;
  group.add(leftArm);
  
  const leftHand = new THREE.Mesh(handGeo, materials.skin);
  leftHand.position.y = -0.25;
  leftArm.add(leftHand);

  const rightArm = new THREE.Mesh(armGeo, materials.shirt);
  rightArm.name = "rightArm";
  rightArm.position.set(0.225, 1.15, 0);
  rightArm.rotation.z = -Math.PI / 12;
  group.add(rightArm);
  
  const rightHand = new THREE.Mesh(handGeo, materials.skin);
  rightHand.position.y = -0.25;
  rightArm.add(rightHand);
  
  // Legs
  const legGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.8, 8);
  const shoeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.2);

  const leftLeg = new THREE.Mesh(legGeo, materials.pants);
  leftLeg.position.set(-0.1, 0.4, 0);
  group.add(leftLeg);
  
  const leftShoe = new THREE.Mesh(shoeGeo, materials.shoes);
  leftShoe.position.y = -0.45;
  leftShoe.position.z = 0.05;
  leftLeg.add(leftShoe);

  const rightLeg = new THREE.Mesh(legGeo, materials.pants);
  rightLeg.position.set(0.1, 0.4, 0);
  group.add(rightLeg);
  
  const rightShoe = new THREE.Mesh(shoeGeo, materials.shoes);
  rightShoe.position.y = -0.45;
  rightShoe.position.z = 0.05;
  rightLeg.add(rightShoe);


  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}

function createFacadeSign(width: number, height: number): THREE.Mesh {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return new THREE.Mesh();

    const canvasWidth = 1024;
    const canvasHeight = Math.round((height / width) * canvasWidth);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Blue background with brick texture
    context.fillStyle = '#0071ce'; // Walmart Blue
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = 'rgba(0,0,0,0.1)';
    for(let i=0; i < 100; i++) {
        context.fillRect(Math.random() * canvasWidth, Math.random() * canvasHeight, 60, 2);
        context.fillRect(Math.random() * canvasWidth, Math.random() * canvasHeight, 2, 40);
    }


    // "ShopSim" Text
    context.font = `bold ${canvasHeight * 0.6}px Arial`;
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = 'rgba(0, 0, 0, 0.3)';
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;
    context.shadowBlur = 5;
    context.fillText('ShopSim', canvasWidth / 2 - (canvasWidth * 0.1), canvasHeight / 2);
    context.shadowColor = 'transparent';


    // Yellow Spark Logo
    context.strokeStyle = '#ffc220'; // Walmart Yellow
    context.lineWidth = canvasHeight * 0.08;
    context.lineCap = 'round';
    const sparkX = canvasWidth * 0.8;
    const sparkY = canvasHeight / 2;
    const sparkRadius = canvasHeight * 0.25;

    for (let i = 0; i < 6; i++) {
        const angle = (i * 60 * Math.PI) / 180;
        const startX = sparkX + Math.cos(angle) * (sparkRadius * 0.2);
        const startY = sparkY + Math.sin(angle) * (sparkRadius * 0.2);
        const endX = sparkX + Math.cos(angle) * sparkRadius;
        const endY = sparkY + Math.sin(angle) * sparkRadius;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.1, roughness: 0.8 });
    const geometry = new THREE.BoxGeometry(width, height, 0.3);
    const signMesh = new THREE.Mesh(geometry, material);
    signMesh.castShadow = true;
    return signMesh;
}

function createHangingSign(
  config: {
    header?: string;
    items?: string[];
    largeText?: string;
    icon?: 'shirt' | 'arrow-right';
  },
  size: { width: number; height: number }
): THREE.Group {
  const group = new THREE.Group();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return group;

  const canvasWidth = 512;
  const canvasHeight = (size.height / size.width) * canvasWidth;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // If we have items, it's an aisle sign (blue header, white body)
  if (config.items) {
    // Blue Header
    ctx.fillStyle = '#0071ce';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.3);

    // Header Text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${canvasHeight * 0.15}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.header || '', canvasWidth / 2, canvasHeight * 0.15);

    // White Body
    ctx.fillStyle = 'white';
    ctx.fillRect(0, canvasHeight * 0.3, canvasWidth, canvasHeight * 0.7);

    // Items Text
    ctx.fillStyle = '#333333';
    ctx.font = `500 ${canvasHeight * 0.1}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const itemStartY = canvasHeight * 0.35;
    const itemLineHeight = canvasHeight * 0.15;
    config.items.forEach((item, index) => {
      ctx.fillText(item, canvasWidth * 0.1, itemStartY + index * itemLineHeight);
    });
  } else {
    // Otherwise, it's a category sign (all blue)
    ctx.fillStyle = '#0071ce';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (config.icon === 'shirt') {
      ctx.font = `bold ${canvasHeight * 0.25}px Arial`;
      ctx.fillText(config.largeText || '', canvasWidth / 2, canvasHeight * 0.65);
      
      // Draw a simple T-shirt icon
      ctx.strokeStyle = 'white';
      ctx.lineWidth = canvasHeight * 0.04;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      // Body
      ctx.moveTo(canvasWidth * 0.35, canvasHeight * 0.3);
      ctx.lineTo(canvasWidth * 0.65, canvasHeight * 0.3);
      ctx.lineTo(canvasWidth * 0.65, canvasHeight * 0.5);
      ctx.lineTo(canvasWidth * 0.35, canvasHeight * 0.5);
      ctx.closePath();
      // Sleeves
      ctx.moveTo(canvasWidth * 0.35, canvasHeight * 0.3);
      ctx.lineTo(canvasWidth * 0.25, canvasHeight * 0.2);
      ctx.moveTo(canvasWidth * 0.65, canvasHeight * 0.3);
      ctx.lineTo(canvasWidth * 0.75, canvasHeight * 0.2);
      // Neck
      ctx.moveTo(canvasWidth * 0.45, canvasHeight * 0.3);
      ctx.quadraticCurveTo(canvasWidth * 0.5, canvasHeight * 0.2, canvasWidth * 0.55, canvasHeight * 0.3);
      ctx.stroke();

    } else if (config.icon === 'arrow-right') {
        ctx.font = `bold ${canvasHeight * 0.3}px Arial`;
        ctx.fillText(config.largeText || '', canvasWidth / 2, canvasHeight * 0.4);

        // Draw arrow
        ctx.beginPath();
        ctx.moveTo(canvasWidth * 0.7, canvasHeight * 0.65);
        ctx.lineTo(canvasWidth * 0.7, canvasHeight * 0.85);
        ctx.lineTo(canvasWidth * 0.85, canvasHeight * 0.75);
        ctx.closePath();
        ctx.fill();
    } else {
       ctx.font = `bold ${canvasHeight * 0.4}px Arial`;
       ctx.fillText(config.largeText || '', canvasWidth / 2, canvasHeight / 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  const geometry = new THREE.PlaneGeometry(size.width, size.height);
  const signMesh = new THREE.Mesh(geometry, material);
  group.add(signMesh);

  const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 15, 8);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
  
  const pole1 = new THREE.Mesh(poleGeo, poleMat);
  pole1.position.set(-size.width / 2 + 0.2, size.height / 2, 0);
  group.add(pole1);

  const pole2 = new THREE.Mesh(poleGeo, poleMat);
  pole2.position.set(size.width / 2 - 0.2, size.height / 2, 0);
  group.add(pole2);

  return group;
}

function createSecurityGate(): THREE.Group {
  const gate = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.9,
    roughness: 0.1,
  });

  // Base
  const baseGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.1, 24);
  const base = new THREE.Mesh(baseGeo, material);
  base.position.y = 0.05;
  gate.add(base);

  // Post
  const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
  const post = new THREE.Mesh(postGeo, material);
  post.position.y = 0.1 + 0.6;
  gate.add(post);
  
  // Sensor box on top
  const boxGeo = new THREE.BoxGeometry(0.3, 0.15, 0.2);
  const box = new THREE.Mesh(boxGeo, material);
  box.position.y = 1.3;
  gate.add(box);

  // Swinging Arm
  const arm = new THREE.Group();
  arm.name = 'gateArm';
  arm.position.y = 0.9;
  gate.add(arm);

  const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.5, 12);
  const armBar = new THREE.Mesh(armGeo, material);
  armBar.rotation.z = Math.PI / 2;
  armBar.position.x = 3.5 / 2;
  arm.add(armBar);

  gate.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return gate;
}

function createCar(color: THREE.ColorRepresentation): THREE.Group {
  const car = new THREE.Group();
  const mainMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.4 });
  const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.2, transparent: true, opacity: 0.8 });
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

  // Body
  const bodyGeo = new THREE.BoxGeometry(2, 0.8, 4.5);
  const body = new THREE.Mesh(bodyGeo, mainMaterial);
  body.position.y = 0.6;
  car.add(body);

  // Roof
  const roofGeo = new THREE.BoxGeometry(1.8, 0.7, 3);
  const roof = new THREE.Mesh(roofGeo, mainMaterial);
  roof.position.y = 1.3;
  roof.position.z = -0.2;
  car.add(roof);

  // Windows
  const sideWindowGeo = new THREE.PlaneGeometry(2.8, 0.5);
  const leftWindow = new THREE.Mesh(sideWindowGeo, windowMaterial);
  leftWindow.position.set(-0.91, 1.3, -0.2);
  leftWindow.rotation.y = -Math.PI / 2;
  car.add(leftWindow);
  const rightWindow = new THREE.Mesh(sideWindowGeo, windowMaterial);
  rightWindow.position.set(0.91, 1.3, -0.2);
  rightWindow.rotation.y = Math.PI / 2;
  car.add(rightWindow);

  const frontWindowGeo = new THREE.PlaneGeometry(1.7, 0.6);
  const frontWindow = new THREE.Mesh(frontWindowGeo, windowMaterial);
  frontWindow.position.set(0, 1.3, -1.7);
  frontWindow.rotation.x = -Math.PI / 9;
  car.add(frontWindow);

  const backWindowGeo = new THREE.PlaneGeometry(1.7, 0.6);
  const backWindow = new THREE.Mesh(backWindowGeo, windowMaterial);
  backWindow.position.set(0, 1.3, 1.3);
  backWindow.rotation.x = Math.PI / 9;
  car.add(backWindow);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
  wheelGeo.rotateZ(Math.PI / 2);

  const createWheel = (x: number, z: number) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMaterial);
    wheel.position.set(x, 0.35, z);
    car.add(wheel);
  };
  createWheel(-1, 1.5);
  createWheel(1, 1.5);
  createWheel(-1, -1.6);
  createWheel(1, -1.6);

  car.traverse(child => {
      if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
      }
  });

  return car;
}


function createProduceBin(width: number, depth: number, height: number): THREE.Mesh {
  const material = new THREE.MeshStandardMaterial({ color: 0x966F33, roughness: 0.8, metalness: 0 }); // "Wood" color
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const bin = new THREE.Mesh(geometry, material);
  bin.castShadow = true;
  bin.receiveShadow = true;
  return bin;
}


export const ThreeScene: React.FC<ThreeSceneProps> = ({ onProductClick, onNpcClick, cart }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { avatarConfig } = useGame();
  const [hasCart, setHasCart] = useState(false);
  const hasCartRef = useRef(hasCart);
  hasCartRef.current = hasCart;
  const [hintMessage, setHintMessage] = useState('');

  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const avatarRef = useRef<THREE.Group>();
  const cartRef = useRef<THREE.Group>();
  const cartItemsGroupRef = useRef<THREE.Group>();
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const productMeshesRef = useRef<THREE.Mesh[]>([]);
  const npcMeshesRef = useRef<THREE.Group[]>([]);
  const collectibleCartsRef = useRef<THREE.Group[]>([]);
  const hintMessageRef = useRef('');
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
  const animationLoopId = useRef<number>();

  const takeCart = useCallback((cartToTake: THREE.Group) => {
    if (!sceneRef.current || !avatarRef.current || !cartItemsGroupRef.current) return;

    setHasCart(true);

    // Remove static cart from scene and refs
    sceneRef.current.remove(cartToTake);
    collectibleCartsRef.current = collectibleCartsRef.current.filter(c => c !== cartToTake);

    // Create and attach player cart
    const playerCart = createShoppingCart();
    cartRef.current = playerCart;
    playerCart.add(cartItemsGroupRef.current);
    sceneRef.current.add(playerCart);
    
    // Position it correctly right away
    const cartOffset = new THREE.Vector3(0, 0, -2.0);
    const worldOffset = cartOffset.applyQuaternion(avatarRef.current.quaternion);
    const cartPosition = avatarRef.current.position.clone().add(worldOffset);
    cartPosition.y = 0;
    playerCart.position.copy(cartPosition);
    playerCart.quaternion.copy(avatarRef.current.quaternion);
  }, [setHasCart]);

  const onPointerClick = useCallback((event: MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current || !avatarRef.current) return;
    
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / mountRef.current.clientWidth) * 2 - 1;
    pointer.y = - (event.clientY / mountRef.current.clientHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, cameraRef.current);

    // Check for collectible cart click
    if (!hasCartRef.current) {
        const cartIntersects = raycaster.intersectObjects(collectibleCartsRef.current, true);
        if (cartIntersects.length > 0) {
            let clickedCartGroup = cartIntersects[0].object;
            while(clickedCartGroup.parent && !clickedCartGroup.userData.isCollectibleCart) {
                clickedCartGroup = clickedCartGroup.parent;
            }

            if (clickedCartGroup.userData.isCollectibleCart) {
                const distance = avatarRef.current.position.distanceTo(clickedCartGroup.position);
                if (distance < 4) { // Interaction distance
                    takeCart(clickedCartGroup as THREE.Group);
                    return; // Stop further processing this click
                }
            }
        }
    }
    
    // Check for NPC clicks
    const npcIntersects = raycaster.intersectObjects(npcMeshesRef.current, true);
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
    const productIntersects = raycaster.intersectObjects(productMeshesRef.current);
    if (productIntersects.length > 0) {
      const clickedObject = productIntersects[0].object;
      const product = clickedObject.userData as Product;
      if (product) {
        onProductClick(product);
      }
    }
  }, [onProductClick, onNpcClick, takeCart]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    scene.fog = new THREE.Fog(0xeeeeee, 50, 250);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const textureLoader = new THREE.TextureLoader();

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-50, 60, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.bias = -0.001;
    scene.add(directionalLight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(150, 150);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4, metalness: 0.1 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls & Ceiling
    const wallHeight = 20;
    const wallSize = 150;
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.9 });

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
    
    // Exterior Facade
    const doorWidth = 20;
    const doorHeight = 6;
    const facadeDepth = 1.0;

    const wallShape = new THREE.Shape();
    wallShape.moveTo(-wallSize / 2, 0);
    wallShape.lineTo(wallSize / 2, 0);
    wallShape.lineTo(wallSize / 2, wallHeight);
    wallShape.lineTo(-wallSize / 2, wallHeight);
    wallShape.lineTo(-wallSize / 2, 0);

    const doorPath = new THREE.Path();
    doorPath.moveTo(-doorWidth / 2, 0);
    doorPath.lineTo(doorWidth / 2, 0);
    doorPath.lineTo(doorWidth / 2, doorHeight);
    doorPath.lineTo(-doorWidth / 2, doorHeight);
    doorPath.lineTo(-doorWidth / 2, 0);
    wallShape.holes.push(doorPath);

    const extrudeSettings = { depth: facadeDepth, bevelEnabled: false };
    const facadeGeometry = new THREE.ExtrudeGeometry(wallShape, extrudeSettings);
    const facadeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9, metalness: 0.2 });
    const frontFacade = new THREE.Mesh(facadeGeometry, facadeMaterial);
    frontFacade.position.set(0, 0, wallSize / 2 - facadeDepth);
    frontFacade.receiveShadow = true;
    frontFacade.castShadow = true;
    scene.add(frontFacade);

    // Glass doors
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x333333,
      transmission: 0.9,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.8,
    });
    const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, 0.2);
    const glassDoors = new THREE.Mesh(doorGeometry, glassMaterial);
    glassDoors.position.set(0, doorHeight / 2, wallSize / 2 - facadeDepth/2);
    scene.add(glassDoors);

    // Entrance Gates
    const gateLeft = createSecurityGate();
    gateLeft.position.set(-4, 0, 72);
    const leftArm = gateLeft.getObjectByName('gateArm');
    if (leftArm) leftArm.rotation.y = -Math.PI / 8; // Slightly open
    scene.add(gateLeft);

    const gateRight = createSecurityGate();
    gateRight.position.set(4, 0, 72);
    const rightArm = gateRight.getObjectByName('gateArm');
    if (rightArm) rightArm.rotation.y = Math.PI + Math.PI / 8; // Slightly open
    scene.add(gateRight);

    // Facade Sign
    const signWidth = 60;
    const signHeight = 10;
    const facadeSign = createFacadeSign(signWidth, signHeight);
    facadeSign.position.set(0, wallHeight - 10, wallSize / 2 + 0.1);
    scene.add(facadeSign);

    // Exterior Ground & Parking Lot
    const sidewalkGeometry = new THREE.PlaneGeometry(wallSize, 12);
    const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.6 });
    const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    sidewalk.rotation.x = -Math.PI / 2;
    sidewalk.position.set(0, 0.01, wallSize/2 + 6);
    sidewalk.receiveShadow = true;
    scene.add(sidewalk);
    
    const parkingLotDepth = 80;
    const parkingLotGeometry = new THREE.PlaneGeometry(wallSize, parkingLotDepth);
    const parkingLotMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8 });
    const parkingLot = new THREE.Mesh(parkingLotGeometry, parkingLotMaterial);
    parkingLot.rotation.x = -Math.PI / 2;
    parkingLot.position.set(0, 0.01, wallSize/2 + 12 + parkingLotDepth / 2);
    parkingLot.receiveShadow = true;
    scene.add(parkingLot);

    // Parking Lines & Cars
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lineLength = 5.0;
    const lineGeo = new THREE.BoxGeometry(0.1, 0.03, lineLength);
    const parkingSpaceWidth = 3.5;
    
    const carColors = [0xd4d4d4, 0xeeeeee, 0x4c4c4c, 0x1f4e8c, 0x8c1f1f, 0x2b2b2b];

    const createParkingRow = (zPos: number, direction: number) => {
        for (let i = -10; i <= 10; i++) {
            const line = new THREE.Mesh(lineGeo, lineMaterial);
            line.position.set(i * parkingSpaceWidth, 0.02, zPos);
            scene.add(line);

            if (i < 10 && Math.random() > 0.7) { // 30% chance of car
                const car = createCar(new THREE.Color(carColors[Math.floor(Math.random() * carColors.length)]));
                const xPos = i * parkingSpaceWidth + parkingSpaceWidth / 2;
                car.position.set(xPos, 0, zPos + direction * (lineLength / 2 + 1.2));
                car.rotation.y = Math.PI/2 * direction + (Math.random() - 0.5) * 0.1;
                scene.add(car);
            }
        }
    };
    
    const firstRowZ = wallSize / 2 + 12 + 8;
    const secondRowZ = firstRowZ + 18;
    const thirdRowZ = secondRowZ + 18;

    createParkingRow(firstRowZ, 1);
    createParkingRow(secondRowZ, -1);
    createParkingRow(thirdRowZ, 1);
    
    // Scattered shopping carts in parking lot
    for(let i=0; i<3; i++) {
      const cartModel = createShoppingCart();
      const x = (Math.random() - 0.5) * 120;
      const z = wallSize/2 + 15 + Math.random() * 50;
      cartModel.position.set(x, 0, z);
      cartModel.rotation.y = Math.random() * Math.PI * 2;
      scene.add(cartModel);
    }


    // Bollards
    const bollardGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const bollardMat = new THREE.MeshStandardMaterial({ color: '#0071ce', metalness: 0.4, roughness: 0.6 });
    for(let i=0; i<4; i++) {
        const bollard = new THREE.Mesh(bollardGeo, bollardMat);
        bollard.position.set(-15 + i * 10, 1.5/2, wallSize/2 + 2);
        bollard.castShadow = true;
        scene.add(bollard);
    }
    
    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(150, 150);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = wallHeight;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Produce Bins
    const produceBin1 = createProduceBin(8, 4, 1);
    produceBin1.position.set(-12, 0.5, 30);
    scene.add(produceBin1);

    const produceBin2 = createProduceBin(8, 4, 1);
    produceBin2.position.set(0, 0.5, 30);
    scene.add(produceBin2);

    const produceBin3 = createProduceBin(8, 4, 1);
    produceBin3.position.set(12, 0.5, 30);
    scene.add(produceBin3);

    // Player Avatar
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      'https://models.readyplayer.me/685dc0f835fff2860286b6eb.glb',
      (gltf) => {
        const avatar = gltf.scene;
        avatar.scale.set(1.2, 1.2, 1.2); // Make it a bit bigger
        avatar.position.set(0, 0, 80);
        avatar.rotation.y = Math.PI; // Face into the store

        avatar.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(avatar);
        avatarRef.current = avatar;
        
        if (gltf.animations && gltf.animations.length) {
          const mixer = new THREE.AnimationMixer(avatar);
          const idleClip = gltf.animations.find(clip => clip.name.toLowerCase().includes('idle')) || gltf.animations[0];
          if (idleClip) {
            const action = mixer.clipAction(idleClip);
            action.play();
          }
          mixerRef.current = mixer;
        }
        
        // Set initial camera position to be behind the avatar
        const cameraOffset = new THREE.Vector3(0, 2.2, -4.5);
        avatar.updateMatrixWorld(); // Ensure matrix is updated
        const cameraPosition = cameraOffset.applyMatrix4(avatar.matrixWorld);
        camera.position.copy(cameraPosition);

        const lookAtPosition = avatar.position.clone().add(new THREE.Vector3(0, 1.6, 0));
        camera.lookAt(lookAtPosition);
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the avatar model:', error);
      }
    );

    // NPCs
    npcAnimationData.current = allNpcs.map(npcData => {
        let shirtColor;
        if (npcData.isEmployee) {
          shirtColor = new THREE.Color(0xdddddd); // Neutral shirt for employees
        } else {
          shirtColor = new THREE.Color(npcData.color);
        }
        const pantsColor = new THREE.Color(npcData.color).multiplyScalar(0.5);
        const hairColors = [0x222222, 0xaf8f6d, 0x553311, 0xdbb888, 0xcc4444, 0x666666];

        const materials = {
            skin: new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.8 }),
            hair: new THREE.MeshStandardMaterial({ color: hairColors[npcData.id % hairColors.length], roughness: 0.8 }),
            shirt: new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.8 }),
            pants: new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.8 }),
            shoes: new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 }),
        };
        const npcAvatar = createCharacter(materials, { isEmployee: !!npcData.isEmployee });
        
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
    npcMeshesRef.current = npcAnimationData.current.map(data => data.model);


    // Cart Corral
    const collectibleCarts: THREE.Group[] = [];
    const corralX = -15;
    const corralZ = 78;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        const cartModel = createShoppingCart();
        cartModel.position.set(corralX + i * 1.5, 0, corralZ + j * 2.5);
        cartModel.rotation.y = Math.PI / 2;
        cartModel.userData = { isCollectibleCart: true };
        scene.add(cartModel);
        collectibleCarts.push(cartModel);
      }
    }
    collectibleCartsRef.current = collectibleCarts;


    // This group will hold the product meshes inside the cart.
    cartItemsGroupRef.current = new THREE.Group();

    // Aisles
    const aisleHeight = 3.5;
    const aisleWidth = 1.5;
    const aisleShelves = 4;
    const mainAisleLength = 40;
    const backAisleLength = 40;

    const mainAislePositions = [-16, -8, 8, 16];
    mainAislePositions.forEach((x, index) => {
        const aisle = createAisle(mainAisleLength, aisleShelves, aisleHeight, aisleWidth);
        aisle.position.set(x, 0, 0);
        aisle.rotation.y = Math.PI / 2;
        scene.add(aisle);
    });
    
    const backAisle = createAisle(backAisleLength, aisleShelves, aisleHeight, aisleWidth);
    backAisle.position.set(0, 0, -22);
    scene.add(backAisle);

    // Light Fixtures
    const lightFixtureMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.1 });
    const lightFixtureGeometry = new THREE.BoxGeometry(mainAisleLength, 0.2, 0.5);
    const lightY = wallHeight - 1;

    mainAislePositions.forEach(x => {
        const fixture = new THREE.Mesh(lightFixtureGeometry, lightFixtureMaterial);
        fixture.position.set(x, lightY, 0);
        fixture.rotation.y = Math.PI / 2;
        scene.add(fixture);

        const pointLight = new THREE.PointLight(0xfff8e7, 40, 50, 1.2);
        pointLight.position.set(x, lightY - 1, 0);
        scene.add(pointLight);
    });

    const backAisleFixture = new THREE.Mesh(new THREE.BoxGeometry(backAisleLength, 0.2, 0.5), lightFixtureMaterial);
    backAisleFixture.position.set(0, lightY, -22);
    scene.add(backAisleFixture);
    const backAisleLight = new THREE.PointLight(0xfff8e7, 40, 50, 1.2);
    backAisleLight.position.set(0, lightY - 1, -22);
    scene.add(backAisleLight);


    // Products
    productMeshesRef.current = products.map(product => {
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

    // Aisle Signage
    const signY = 10;
    const aisleSignSize = { width: 6, height: 8 };
    const categorySignSize = { width: 10, height: 6 };

    const checkoutSign = createHangingSign({ largeText: 'CHECKOUT' }, { width: 12, height: 4});
    checkoutSign.position.set(0, signY, 40);
    scene.add(checkoutSign);

    const groceryAisleSign = createHangingSign({
        header: 'A1 / A2',
        items: ['Cereal', 'Snacks', 'Pasta', 'Soup'],
    }, aisleSignSize);
    groceryAisleSign.position.set(-16, signY, 22);
    scene.add(groceryAisleSign);

    const drinksAisleSign = createHangingSign({
        header: 'A3',
        items: ['Soda', 'Juice', 'Water', 'Energy Drinks'],
    }, aisleSignSize);
    drinksAisleSign.position.set(-8, signY, 22);
    scene.add(drinksAisleSign);

    const homeGoodsAisleSign = createHangingSign({
        header: 'B1 / B2',
        items: ['Kitchen', 'Bath', 'Cleaning', 'Paper Goods'],
    }, aisleSignSize);
    homeGoodsAisleSign.position.set(8, signY, 22);
    scene.add(homeGoodsAisleSign);

    const apparelAisleSign = createHangingSign({
        largeText: 'Apparel',
        icon: 'shirt',
    }, categorySignSize);
    apparelAisleSign.position.set(16, signY, 22);
    scene.add(apparelAisleSign);

    const electronicsAisleSign = createHangingSign({
        header: 'C1 / C2',
        items: ['TVs', 'Gaming', 'Audio', 'Toys'],
    }, aisleSignSize);
    electronicsAisleSign.position.set(0, signY, -18);
    electronicsAisleSign.rotation.y = Math.PI / 2;
    scene.add(electronicsAisleSign);


    // Event Listeners
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.key) return;
      const key = event.key.toLowerCase();
      keysPressed.current[key] = true;

      if (key === 'e' && !hasCartRef.current) {
        if (!avatarRef.current || collectibleCartsRef.current.length === 0) return;

        let closestCart: THREE.Group | null = null;
        let minDistance = Infinity;

        collectibleCartsRef.current.forEach(cart => {
          const distance = avatarRef.current!.position.distanceTo(cart.position);
          if (distance < minDistance) {
            minDistance = distance;
            closestCart = cart;
          }
        });

        if (closestCart && minDistance < 4) { // Interaction distance
          takeCart(closestCart);
        }
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.key) return;
      keysPressed.current[event.key.toLowerCase()] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    mountRef.current?.addEventListener('click', onPointerClick);

    // Animation loop
    const animate = () => {
      animationLoopId.current = requestAnimationFrame(animate);

      const delta = clock.current.getDelta();

      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }
      
      if (!avatarRef.current || !cameraRef.current || !rendererRef.current || !sceneRef.current) {
        return;
      }

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

      // Check for cart interaction hint
      if (!hasCartRef.current && avatarRef.current) {
        const closestCart = collectibleCartsRef.current.reduce(
          (closest, cart) => {
            const distance = avatarRef.current!.position.distanceTo(cart.position);
            if (distance < (closest?.distance ?? Infinity)) {
              return { cart, distance };
            }
            return closest;
          },
          null as { cart: THREE.Group; distance: number } | null
        );

        let newHint = '';
        if (closestCart && closestCart.distance < 4) {
          newHint = "Press 'E' to take cart";
        }
        
        if (newHint !== hintMessageRef.current) {
          hintMessageRef.current = newHint;
          setHintMessage(newHint);
        }
      } else {
        if (hintMessageRef.current !== '') {
          hintMessageRef.current = '';
          setHintMessage('');
        }
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
      if (hasCartRef.current && cartRef.current) {
        const cartOffset = new THREE.Vector3(0, 0, -2.0); // Pushed in front of avatar
        const worldOffset = cartOffset.applyQuaternion(avatarRef.current.quaternion);
        const cartTargetPosition = avatarRef.current.position.clone().add(worldOffset);
        cartTargetPosition.y = 0; // Keep cart on the floor
        cartRef.current.position.lerp(cartTargetPosition, 0.15);
        cartRef.current.quaternion.slerp(avatarRef.current.quaternion, 0.15);
      }

      const cameraOffset = new THREE.Vector3(0, 2.2, -4.5);
      const cameraPosition = cameraOffset.applyMatrix4(avatarRef.current.matrixWorld);
      cameraRef.current.position.lerp(cameraPosition, 0.1);
      
      const lookAtPosition = avatarRef.current.position.clone().add(new THREE.Vector3(0,1.6,0));
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
      if (animationLoopId.current) {
        cancelAnimationFrame(animationLoopId.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      mountRef.current?.removeEventListener('click', onPointerClick);
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, [onPointerClick, onNpcClick, avatarConfig, takeCart]);

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
    // This effect is now only for custom texture application,
    // which won't apply to the GLB model unless we specifically find and replace its materials.
    // For now, we'll leave this so the AI texture generation doesn't break.
    // A more advanced implementation could apply the texture to the GLB model's shirt material.
  }, [avatarConfig.texture, avatarConfig.color]);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full cursor-pointer" />
      {hintMessage && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-lg bg-background/80 p-4 text-foreground shadow-lg border animate-in fade-in-0">
          <p className="font-semibold text-lg">
            Press <kbd className="rounded-md border bg-muted px-2 py-1.5 text-lg font-mono">E</kbd> to take cart
          </p>
        </div>
      )}
    </div>
  );
};
interface ThreeSceneProps {
  onProductClick: (product: Product | number) => void;
  onNpcClick: (npc: Npc) => void;
  cart: CartItem[];
}


    

    

    




    