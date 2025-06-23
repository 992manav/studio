"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useGame } from '@/contexts/GameContext';

interface ThreeSceneProps {
  onProductClick: (product: Product) => void;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ onProductClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { avatarConfig } = useGame();

  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const avatarRef = useRef<THREE.Mesh>();
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
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x4a5568 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Avatar
    const avatarGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 16);
    const avatarMaterial = new THREE.MeshStandardMaterial({ color: avatarConfig.color });
    const avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);
    avatar.position.set(0, 1, 15);
    avatar.castShadow = true;
    scene.add(avatar);
    avatarRef.current = avatar;
    camera.position.set(0, 4, 20);
    camera.lookAt(avatar.position);


    // Products
    productMeshes.current = products.map(product => {
      const productGeometry = new THREE.BoxGeometry(...product.size);
      const productMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(Math.random() * 0xffffff) });
      const productMesh = new THREE.Mesh(productGeometry, productMaterial);
      productMesh.position.fromArray(product.position);
      productMesh.userData = product;
      productMesh.castShadow = true;
      scene.add(productMesh);
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
      if (!avatarRef.current || !cameraRef.current || !rendererRef.current || !sceneRef.current) return;
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
    if (avatarRef.current) {
      (avatarRef.current.material as THREE.MeshStandardMaterial).color.set(avatarConfig.color);
    }
  }, [avatarConfig.color]);

  return <div ref={mountRef} className="w-full h-full cursor-pointer" />;
};
