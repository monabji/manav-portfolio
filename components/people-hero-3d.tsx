'use client';

import { useEffect, useRef } from 'react';
import type { Material, Mesh } from 'three';

export function PeopleHero3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let inViewport = !('IntersectionObserver' in window);
    let loading = false;
    let updateRendering: (() => void) | undefined;
    let disposeScene: (() => void) | undefined;

    // Keep the large WebGL engine out of the navigation/hydration bundle.
    const initialize = async () => {
      if (loading || disposed || !inViewport || document.hidden) return;
      loading = true;
      try {
        const THREE = await import('three');
        if (disposed || !inViewport || document.hidden) {
          loading = false;
          return;
        }

        const motionPreference = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        );
        let reduceMotion = motionPreference.matches;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const texture = new THREE.TextureLoader().load(
          '/crystal/people.png',
          () => requestRender(),
        );
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const portrait = new THREE.Mesh(
          new THREE.PlaneGeometry(4.35, 4.35),
          new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.03,
            side: THREE.DoubleSide,
          }),
        );
        portrait.position.z = 0.28;
        group.add(portrait);

        const halo = new THREE.Mesh(
          new THREE.CircleGeometry(2.12, 64),
          new THREE.MeshBasicMaterial({
            color: '#dff8ff',
            transparent: true,
            opacity: 0.3,
          }),
        );
        halo.position.z = -0.18;
        group.add(halo);

        const rim = new THREE.Mesh(
          new THREE.RingGeometry(2.18, 2.28, 64),
          new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.72,
            side: THREE.DoubleSide,
          }),
        );
        rim.position.z = -0.12;
        group.add(rim);

        const bubbles: Mesh[] = [];
        const bubbleMaterial = new THREE.MeshPhysicalMaterial({
          color: '#dffaff',
          transmission: 0.8,
          transparent: true,
          opacity: 0.52,
          roughness: 0,
          thickness: 0.2,
        });
        [
          [-2.5, 1.45, -0.1, 0.32],
          [2.5, 1.2, -0.3, 0.24],
          [2.35, -1.45, -0.1, 0.42],
        ].forEach(([x, y, z, size]) => {
          const bubble = new THREE.Mesh(
            new THREE.SphereGeometry(size, 24, 24),
            bubbleMaterial,
          );
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
          requestRender();
        };
        const onPointerLeave = () => {
          pointerX = 0;
          pointerY = 0;
          requestRender();
        };
        mount.addEventListener('pointermove', onPointer);
        mount.addEventListener('pointerleave', onPointerLeave);

        let width = 0;
        let height = 0;
        const resize = () => {
          const rect = mount.getBoundingClientRect();
          if (rect.width === width && rect.height === height) return;
          width = rect.width;
          height = rect.height;
          renderer.setSize(width, height, false);
          camera.aspect = width / Math.max(height, 1);
          camera.updateProjectionMatrix();
          requestRender();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);

        let frame = 0;
        let contextLost = false;
        function requestRender() {
          if (
            !disposed &&
            inViewport &&
            !document.hidden &&
            !contextLost &&
            !frame
          ) {
            frame = requestAnimationFrame(animate);
          }
        }
        const animate = (time: number) => {
          frame = 0;
          if (disposed || !inViewport || document.hidden || contextLost) return;
          group.rotation.y += (pointerX - group.rotation.y) * 0.045;
          group.rotation.x += (-pointerY - group.rotation.x) * 0.045;
          group.position.y = reduceMotion ? 0 : Math.sin(time * 0.0012) * 0.09;
          if (!reduceMotion) {
            rim.scale.setScalar(1 + Math.sin(time * 0.0014) * 0.018);
            bubbles.forEach((bubble, index) => {
              bubble.position.y += Math.sin(time * 0.001 + index) * 0.0007;
            });
          }
          renderer.render(scene, camera);
          const pointerSettling =
            Math.abs(pointerX - group.rotation.y) > 0.0001 ||
            Math.abs(-pointerY - group.rotation.x) > 0.0001;
          if (!reduceMotion || pointerSettling) requestRender();
        };
        const onMotionChange = () => {
          reduceMotion = motionPreference.matches;
          requestRender();
        };
        const onContextLost = (event: Event) => {
          event.preventDefault();
          contextLost = true;
          cancelAnimationFrame(frame);
          frame = 0;
          renderer.domElement.style.visibility = 'hidden';
          showFallback();
        };
        const onContextRestored = () => {
          contextLost = false;
          renderer.domElement.style.visibility = '';
          mount.style.backgroundImage = '';
          requestRender();
        };
        renderer.domElement.addEventListener('webglcontextlost', onContextLost);
        renderer.domElement.addEventListener(
          'webglcontextrestored',
          onContextRestored,
        );
        motionPreference.addEventListener('change', onMotionChange);
        updateRendering = () => {
          if (!inViewport || document.hidden) {
            cancelAnimationFrame(frame);
            frame = 0;
          } else requestRender();
        };
        resize();

        disposeScene = () => {
          cancelAnimationFrame(frame);
          resizeObserver.disconnect();
          motionPreference.removeEventListener('change', onMotionChange);
          mount.removeEventListener('pointermove', onPointer);
          mount.removeEventListener('pointerleave', onPointerLeave);
          renderer.domElement.removeEventListener(
            'webglcontextlost',
            onContextLost,
          );
          renderer.domElement.removeEventListener(
            'webglcontextrestored',
            onContextRestored,
          );
          const materials = new Set<Material>();
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose();
              const material = object.material;
              if (Array.isArray(material))
                material.forEach((item) => materials.add(item));
              else materials.add(material);
            }
          });
          materials.forEach((material) => material.dispose());
          texture.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
          if (renderer.domElement.parentNode === mount)
            mount.removeChild(renderer.domElement);
        };
      } catch {
        if (!disposed) showFallback();
      }
    };

    function showFallback() {
      // Retain the portrait on devices where WebGL is unavailable or lost.
      mount!.style.backgroundImage = 'url("/crystal/people.png")';
      mount!.style.backgroundRepeat = 'no-repeat';
      mount!.style.backgroundPosition = 'center';
      mount!.style.backgroundSize = 'auto 106%';
    }

    const onVisibilityChange = () => {
      void initialize();
      updateRendering?.();
    };
    const visibilityObserver =
      'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => {
            inViewport = entry.isIntersecting;
            onVisibilityChange();
          })
        : undefined;
    visibilityObserver?.observe(mount);
    document.addEventListener('visibilitychange', onVisibilityChange);
    void initialize();

    return () => {
      disposed = true;
      visibilityObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      disposeScene?.();
    };
  }, []);

  return (
    <div className="aero-orbit people-hero" ref={mountRef} aria-hidden="true" />
  );
}
