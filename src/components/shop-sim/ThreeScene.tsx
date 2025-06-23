"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useGame } from '@/contexts/GameContext';

interface ThreeSceneProps {
  onProductClick: (product: Product) => void;
}

function createAisle(length: number, shelves: number, height: number, width: number): THREE.Group {
  const group = new THREE.Group();
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5, roughness: 0.5 });
  const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.5, roughness: 0.5 });
  const backPanelMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.8 });

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

export const ThreeScene: React.FC<ThreeSceneProps> = ({ onProductClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { avatarConfig } = useGame();

  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const avatarRef = useRef<THREE.Group>();
  const cartRef = useRef<THREE.Group>();
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const productMeshes = useRef<THREE.Mesh[]>([]);

  const onPointerClick = useCallback((event: MouseEvent) => {
    if (!mountRef.current || !cameraRef.current) return;
    
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / mountRef.current.clientWidth) * 2 - 1;
    pointer.y = - (event.clientY / mountRef.current.clientHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, cameraRef.current);

    const intersects = raycaster.intersectObjects(productMeshes.current);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const product = clickedObject.userData as Product;
      if (product) {
        onProductClick(product);
      }
    }
  }, [onProductClick]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827); // Dark background for the scene
    scene.fog = new THREE.Fog(0x111827, 40, 120);
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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(hemisphereLight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(150, 150);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Avatar
    const avatar = new THREE.Group();
    const avatarMaterial = new THREE.MeshStandardMaterial({ color: avatarConfig.color });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 16), avatarMaterial.clone());
    head.position.y = 1.65;
    
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.4), avatarMaterial.clone());
    torso.position.y = 1.0;

    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.0, 16);
    const leftLeg = new THREE.Mesh(legGeo, avatarMaterial.clone());
    leftLeg.position.set(-0.2, 0, 0);
    
    const rightLeg = new THREE.Mesh(legGeo, avatarMaterial.clone());
    rightLeg.position.set(0.2, 0, 0);

    const armGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.9, 16);
    const leftArm = new THREE.Mesh(armGeo, avatarMaterial.clone());
    leftArm.position.set(-0.45, 1.0, 0);
    leftArm.rotation.z = Math.PI / 12;

    const rightArm = new THREE.Mesh(armGeo, avatarMaterial.clone());
    rightArm.position.set(0.45, 1.0, 0);
    rightArm.rotation.z = -Math.PI / 12;

    const body = new THREE.Group();
    body.add(torso, leftLeg, rightLeg, leftArm, rightArm);
    body.position.y = 0.5;

    avatar.add(head, body);
    avatar.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
        }
    });

    avatar.position.set(0, 0, 25);
    scene.add(avatar);
    avatarRef.current = avatar;
    camera.position.set(0, 4, 31);
    camera.lookAt(avatar.position);

    // Shopping Cart
    const cart = createShoppingCart();
    const cartOffset = new THREE.Vector3(0, 0, 1.5);
    const worldOffset = cartOffset.applyQuaternion(avatar.quaternion);
    const cartPosition = avatar.position.clone().add(worldOffset);
    cartPosition.y = 0;
    cart.position.copy(cartPosition);
    cart.quaternion.copy(avatar.quaternion);
    scene.add(cart);
    cartRef.current = cart;


    // Aisles
    const aisleHeight = 3.5;
    const aisleWidth = 1.5;
    const aisleShelves = 5;
    const mainAisleLength = 40;
    const backAisleLength = 40;

    const mainAislePositions = [-16, -8, 8, 16];
    mainAislePositions.forEach(x => {
        const aisle = createAisle(mainAisleLength, aisleShelves, aisleHeight, aisleWidth);
        aisle.position.set(x, 0, 0);
        aisle.rotation.y = Math.PI / 2;
        scene.add(aisle);
    });
    
    const backAisle = createAisle(backAisleLength, aisleShelves, aisleHeight, aisleWidth);
    backAisle.position.set(0, 0, -22);
    scene.add(backAisle);

    // Products
    const textureLoader = new THREE.TextureLoader();
    productMeshes.current = products.map(product => {
      const productGeometry = new THREE.BoxGeometry(...product.size);
      const placeholderMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xffffff).multiplyScalar(Math.random() * 0.5 + 0.5) });
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

      const moveSpeed = 0.1;
      const rotateSpeed = 0.03;
      
      const forward = new THREE.Vector3();
      avatarRef.current.getWorldDirection(forward);

      if (keysPressed.current['w']) {
        avatarRef.current.position.addScaledVector(forward, moveSpeed);
      }
      if (keysPressed.current['s']) {
        avatarRef.current.position.addScaledVector(forward, -moveSpeed);
      }
      if (keysPressed.current['a']) {
        avatarRef.current.rotation.y += rotateSpeed;
      }
      if (keysPressed.current['d']) {
        avatarRef.current.rotation.y -= rotateSpeed;
      }

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
