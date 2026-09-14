'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function PeopleHero3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const texture = new THREE.TextureLoader().load('/crystal/people.png');
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const portrait = new THREE.Mesh(
      new THREE.PlaneGeometry(4.35, 4.35),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.03, side: THREE.DoubleSide })
    );
    portrait.position.z = 0.28;
    group.add(portrait);

    const halo = new THREE.Mesh(
      new THREE.CircleGeometry(2.12, 64),
      new THREE.MeshBasicMaterial({ color: '#dff8ff', transparent: true, opacity: 0.3 })
    );
    halo.position.z = -0.18;
    group.add(halo);

    const rim = new THREE.Mesh(
      new THREE.RingGeometry(2.18, 2.28, 64),
      new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.72, side: THREE.DoubleSide })
    );
    rim.position.z = -0.12;
    group.add(rim);

    const bubbles: THREE.Mesh[] = [];
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({
      color: '#dffaff', transmission: 0.8, transparent: true, opacity: 0.52, roughness: 0, thickness: 0.2,
    });
    [[-2.5, 1.45, -0.1, 0.32], [2.5, 1.2, -0.3, 0.24], [2.35, -1.45, -0.1, 0.42]].forEach(([x, y, z, size]) => {
      const bubble = new THREE.Mesh(new THREE.SphereGeometry(size, 24, 24), bubbleMaterial);
      bubble.position.set(x, y, z);
      group.add(bubble);
      bubbles.push(bubble);
    });

    let pointerX = 0;
    let pointerY = 0;
    const onPointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.26;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.2;
    };
    const onPointerLeave = () => { pointerX = 0; pointerY = 0; };
    mount.addEventListener('pointermove', onPointer);
    mount.addEventListener('pointerleave', onPointerLeave);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    resize();

    let frame = 0;
    const animate = (time: number) => {
      group.rotation.y += (pointerX - group.rotation.y) * 0.045;
      group.rotation.x += (-pointerY - group.rotation.x) * 0.045;
      group.position.y = reduceMotion ? 0 : Math.sin(time * 0.0012) * 0.09;
      if (!reduceMotion) {
        rim.scale.setScalar(1 + Math.sin(time * 0.0014) * 0.018);
        bubbles.forEach((bubble, index) => { bubble.position.y += Math.sin(time * 0.001 + index) * 0.0007; });
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      mount.removeEventListener('pointermove', onPointer);
      mount.removeEventListener('pointerleave', onPointerLeave);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
      texture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="aero-orbit people-hero" ref={mountRef} aria-hidden="true" />;
}
