import * as THREE from "three";

export function createCharacter(
  materials: {
    skin: THREE.Material;
    hair: THREE.Material;
    shirt: THREE.Material;
    pants: THREE.Material;
    shoes: THREE.Material;
  },
  config: { isEmployee?: boolean } = {}
): THREE.Group {
  const group = new THREE.Group();
  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 32, 16),
    materials.skin
  );
  head.position.y = 1.6;
  group.add(head);
  // Hair
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    materials.hair
  );
  hair.position.y = 1.6;
  group.add(hair);
  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.02, 12, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  leftEye.position.set(-0.06, 1.62, 0.13);
  group.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  rightEye.position.set(0.06, 1.62, 0.13);
  group.add(rightEye);
  const leftPupil = new THREE.Mesh(
    new THREE.SphereGeometry(0.01, 8, 8),
    pupilMaterial
  );
  leftPupil.position.z = 0.015;
  leftEye.add(leftPupil);
  const rightPupil = new THREE.Mesh(
    new THREE.SphereGeometry(0.01, 8, 8),
    pupilMaterial
  );
  rightPupil.position.z = 0.015;
  rightEye.add(rightPupil);
  // Neck
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.1, 16),
    materials.skin
  );
  neck.position.y = 1.5;
  group.add(neck);

  // Torso
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.16, 0.45, 24),
    materials.shirt
  );
  torso.position.y = 1.25;
  group.add(torso);

  // Arms
  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.38, 16),
    materials.skin
  );
  leftArm.position.set(-0.19, 1.32, 0);
  leftArm.rotation.z = Math.PI / 10;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.38, 16),
    materials.skin
  );
  rightArm.position.set(0.19, 1.32, 0);
  rightArm.rotation.z = -Math.PI / 10;
  group.add(rightArm);

  // Pants/Legs
  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.45, 16),
    materials.pants
  );
  leftLeg.position.set(-0.07, 0.8, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.45, 16),
    materials.pants
  );
  rightLeg.position.set(0.07, 0.8, 0);
  group.add(rightLeg);

  // Shoes
  const leftShoe = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.04, 0.18),
    materials.shoes
  );
  leftShoe.position.set(-0.07, 0.57, 0.04);
  group.add(leftShoe);

  const rightShoe = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.04, 0.18),
    materials.shoes
  );
  rightShoe.position.set(0.07, 0.57, 0.04);
  group.add(rightShoe);

  // Optional: Add a vest for employees
  if (config.isEmployee) {
    const vest = new THREE.Mesh(
      new THREE.CylinderGeometry(0.135, 0.155, 0.46, 24, 1, true, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x003366, roughness: 0.7 })
    );
    vest.position.y = 1.25;
    vest.rotation.y = Math.PI;
    group.add(vest);
  }

  return group;
}
