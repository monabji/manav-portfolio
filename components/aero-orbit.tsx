'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function AeroOrbit() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 7;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.65, 64, 64),
      new THREE.MeshPhysicalMaterial({ color: '#29a8ef', transmission: 0.34, transparent: true, opacity: 0.9, roughness: 0.12, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08 })
    );
    group.add(globe);

    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(1.7, 16, 10)),
      new THREE.LineBasicMaterial({ color: '#dffaff', transparent: true, opacity: 0.38 })
    );
    group.add(wire);

    const bubbles: THREE.Mesh[] = [];
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({ color: '#dffaff', transmission: 0.85, transparent: true, opacity: 0.55, roughness: 0, thickness: 0.2 });
    [[-2.3, 1.3, 0.2, .38], [2.2, 1.5, -0.3, .3], [2.5, -1.2, 0.1, .55], [-2.1, -1.5, -0.4, .24]].forEach(([x,y,z,s]) => {
      const bubble = new THREE.Mesh(new THREE.SphereGeometry(s, 24, 24), bubbleMaterial);
      bubble.position.set(x, y, z); group.add(bubble); bubbles.push(bubble);
    });

    scene.add(new THREE.HemisphereLight('#ffffff', '#267a32', 2.8));
    const key = new THREE.DirectionalLight('#ffffff', 4.5); key.position.set(-3, 4, 5); scene.add(key);

    let pointerX = 0;
    let pointerY = 0;
    const onPointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - .5) * .7;
      pointerY = ((event.clientY - rect.top) / rect.height - .5) * .5;
    };
    mount.addEventListener('pointermove', onPointer);

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
      group.rotation.y += (pointerX - group.rotation.y) * .035;
      group.rotation.x += (-pointerY - group.rotation.x) * .035;
      if (!reduceMotion) {
        wire.rotation.y = time * .00018;
        bubbles.forEach((bubble, index) => { bubble.position.y += Math.sin(time * .001 + index) * .0009; });
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame); window.removeEventListener('resize', resize); mount.removeEventListener('pointermove', onPointer);
      scene.traverse((object) => { if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) { object.geometry.dispose(); const material = object.material; if (Array.isArray(material)) material.forEach((item) => item.dispose()); else material.dispose(); } });
      renderer.dispose(); mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="aero-orbit" ref={mountRef} aria-hidden="true" />;
}
