'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
  vUv = uv;
  float time = uTime * 5.;
  float waveFactor = uEnableWaves;
  vec3 transformed = position;

  transformed.x += sin(time + position.y) * 0.5 * waveFactor;
  transformed.y += cos(time + position.z) * 0.15 * waveFactor;
  transformed.z += sin(time + position.x) * waveFactor;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
  float time = uTime;
  vec2 pos = vUv;

  float move = sin(time + mouse) * 0.01;
  float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * 0.01).r;
  float g = texture2D(uTexture, pos + tan(time * 0.5 + pos.x - time) * 0.01).g;
  float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * 0.01).b;
  float a = texture2D(uTexture, pos).a;
  gl_FragColor = vec4(r, g, b, a);
}
`;

const mapValue = (n, start, stop, start2, stop2) =>
  ((n - start) / (stop - start)) * (stop2 - start2) + start2;

const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

class AsciiFilter {
  constructor(renderer, { fontSize = 12, fontFamily = "'Courier New', monospace", invert = true } = {}) {
    this.renderer = renderer;
    this.domElement = document.createElement('div');
    this.domElement.style.position = 'absolute';
    this.domElement.style.inset = '0';
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';

    this.pre = document.createElement('pre');
    this.domElement.appendChild(this.pre);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.domElement.appendChild(this.canvas);

    this.deg = 0;
    this.invert = invert;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.charset = " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
    this.center = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };

    if (this.context) {
      this.context.webkitImageSmoothingEnabled = false;
      this.context.mozImageSmoothingEnabled = false;
      this.context.imageSmoothingEnabled = false;
    }

    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();

    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  reset() {
    if (!this.context) return;

    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const charWidth = this.context.measureText('A').width || this.fontSize * 0.6;

    this.cols = Math.max(1, Math.floor(this.width / charWidth));
    this.rows = Math.max(1, Math.floor(this.height / this.fontSize));
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.pre.style.margin = '0';
    this.pre.style.padding = '0';
    this.pre.style.lineHeight = '1em';
    this.pre.style.position = 'absolute';
    this.pre.style.left = '0';
    this.pre.style.top = '0';
    this.pre.style.zIndex = '9';
    this.pre.style.backgroundAttachment = 'fixed';
    this.pre.style.mixBlendMode = 'normal';
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);

    const width = this.canvas.width;
    const height = this.canvas.height;
    if (!this.context || !width || !height) return;

    this.context.clearRect(0, 0, width, height);
    this.context.drawImage(this.renderer.domElement, 0, 0, width, height);
    this.asciify(this.context, width, height);
    this.hue();
  }

  onMouseMove(event) {
    this.mouse = { x: event.clientX * pixelRatio, y: event.clientY * pixelRatio };
  }

  hue() {
    const dx = this.mouse.x - this.center.x;
    const dy = this.mouse.y - this.center.y;
    const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    // Keep the glyph layer on-brand and readable while the mesh still responds to the pointer.
    this.domElement.style.filter = 'none';
  }

  asciify(context, width, height) {
    const pixels = context.getImageData(0, 0, width, height).data;
    let output = '';

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = x * 4 + y * 4 * width;
        const alpha = pixels[index + 3];

        if (alpha === 0) {
          output += ' ';
          continue;
        }

        const gray = (0.3 * pixels[index] + 0.6 * pixels[index + 1] + 0.1 * pixels[index + 2]) / 255;
        let characterIndex = Math.floor((1 - gray) * (this.charset.length - 1));
        if (this.invert) characterIndex = this.charset.length - characterIndex - 1;
        output += this.charset[characterIndex];
      }
      output += '\n';
    }

    this.pre.textContent = output;
  }

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}

class CanvasTxt {
  constructor(text, { fontSize = 200, fontFamily = 'Arial', color = '#fdf9f3' } = {}) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
  }

  resize() {
    if (!this.context) return;
    this.context.font = this.font;
    const metrics = this.context.measureText(this.text);
    const textWidth = Math.ceil(metrics.width) + 20;
    const textHeight = Math.ceil((metrics.actualBoundingBoxAscent || this.fontSize) + (metrics.actualBoundingBoxDescent || 0)) + 20;
    this.canvas.width = textWidth;
    this.canvas.height = textHeight;
  }

  render() {
    if (!this.context) return;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    const metrics = this.context.measureText(this.text);
    const y = 10 + (metrics.actualBoundingBoxAscent || this.fontSize);
    this.context.fillText(this.text, 10, y);
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get texture() {
    return this.canvas;
  }
}

class CanvAscii {
  constructor({ text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves }, container, width, height) {
    this.textString = text;
    this.asciiFontSize = asciiFontSize;
    this.textFontSize = textFontSize;
    this.textColor = textColor;
    this.planeBaseHeight = planeBaseHeight;
    this.container = container;
    this.width = width;
    this.height = height;
    this.enableWaves = enableWaves;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.z = 30;
    this.scene = new THREE.Scene();
    this.mouse = { x: width / 2, y: height / 2 };
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  async init() {
    try {
      await document.fonts.load('600 200px "IBM Plex Mono"');
      await document.fonts.load('500 12px "IBM Plex Mono"');
    } catch {
      // Keep the fallback font if the remote font cannot load.
    }
    await document.fonts.ready;
    this.setMesh();
    this.setRenderer();
  }

  setMesh() {
    this.textCanvas = new CanvasTxt(this.textString, {
      fontSize: this.textFontSize,
      fontFamily: 'IBM Plex Mono',
      color: this.textColor,
    });
    this.textCanvas.resize();
    this.textCanvas.render();

    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = THREE.NearestFilter;

    const textAspect = this.textCanvas.width / this.textCanvas.height;
    const planeHeight = this.planeBaseHeight;
    const planeWidth = planeHeight * textAspect;
    this.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 36, 36);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: 1 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.enableWaves ? 1 : 0 },
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: 'IBM Plex Mono',
      fontSize: this.asciiFontSize,
      invert: true,
    });
    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);
    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('touchmove', this.onMouseMove);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    if (this.filter) this.filter.setSize(width, height);
  }

  load() {
    this.animate();
  }

  onMouseMove(event) {
    const point = event.touches ? event.touches[0] : event;
    const bounds = this.container.getBoundingClientRect();
    this.mouse = { x: point.clientX - bounds.left, y: point.clientY - bounds.top };
  }

  animate() {
    const animateFrame = () => {
      this.animationFrameId = requestAnimationFrame(animateFrame);
      this.render();
    };
    animateFrame();
  }

  render() {
    if (!this.mesh || !this.filter) return;
    const time = Date.now() * 0.001;
    this.textCanvas.render();
    this.texture.needsUpdate = true;
    this.mesh.material.uniforms.uTime.value = Math.sin(time);
    this.updateRotation();
    this.filter.render(this.scene, this.camera);
  }

  updateRotation() {
    const x = mapValue(this.mouse.y, 0, this.height, 0.5, -0.5);
    const y = mapValue(this.mouse.x, 0, this.width, -0.5, 0.5);
    this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;
  }

  clear() {
    this.scene.traverse((object) => {
      if (!object.isMesh) return;
      object.geometry?.dispose?.();
      object.material?.dispose?.();
    });
    this.scene.clear();
  }

  dispose() {
    cancelAnimationFrame(this.animationFrameId);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('touchmove', this.onMouseMove);
    if (this.filter) {
      this.filter.dispose();
      this.filter.domElement.remove();
    }
    this.clear();
    this.renderer?.dispose?.();
    this.renderer?.forceContextLoss?.();
  }
}

export default function ASCIIText({
  text = 'Hello World!',
  enableWaves = true,
  asciiFontSize = 12,
  textFontSize = 200,
  textColor = '#fdf9f3',
  planeBaseHeight = 8,
}) {
  const containerRef = useRef(null);
  const asciiRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    let observer = null;
    let resizeObserver = null;

    const createAndInit = async (width, height) => {
      const instance = new CanvAscii(
        { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves },
        container,
        width,
        height,
      );
      await instance.init();
      return instance;
    };

    const setup = async () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) {
        observer = new IntersectionObserver(async ([entry]) => {
          if (cancelled || !entry.isIntersecting) return;
          const bounds = entry.boundingClientRect;
          if (bounds.width === 0 || bounds.height === 0) return;
          observer.disconnect();
          observer = null;
          try {
            asciiRef.current = await createAndInit(bounds.width, bounds.height);
            if (!cancelled) asciiRef.current.load();
          } catch {
            if (!cancelled) container.classList.add('ascii-text-fallback');
          }
        }, { threshold: 0.1 });
        observer.observe(container);
        return;
      }

      try {
        asciiRef.current = await createAndInit(width, height);
        if (cancelled) return;
        asciiRef.current.load();
        resizeObserver = new ResizeObserver(([entry]) => {
          if (!asciiRef.current) return;
          const bounds = entry.contentRect;
          if (bounds.width > 0 && bounds.height > 0) asciiRef.current.setSize(bounds.width, bounds.height);
        });
        resizeObserver.observe(container);
      } catch {
        if (!cancelled) container.classList.add('ascii-text-fallback');
      }
    };

    setup();

    return () => {
      cancelled = true;
      observer?.disconnect();
      resizeObserver?.disconnect();
      asciiRef.current?.dispose();
      asciiRef.current = null;
    };
  }, [text, enableWaves, asciiFontSize, textFontSize, textColor, planeBaseHeight]);

  return (
    <div
      ref={containerRef}
      className="ascii-text-container"
      data-text={text}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap');

        .ascii-text-container canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          image-rendering: pixelated;
        }

        .ascii-text-container pre {
          margin: 0;
          user-select: none;
          padding: 0;
          line-height: 1em;
          text-align: left;
          position: absolute;
          inset: 0;
          color: #f1be22;
          background: transparent;
          -webkit-text-fill-color: #f1be22;
          text-shadow: 0 0 3px rgba(241, 190, 34, 0.38);
          font-weight: 600;
          z-index: 9;
          mix-blend-mode: normal;
        }

        .ascii-text-fallback::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          color: #f1be22;
          font: 900 clamp(4.75rem, 18vw, 10rem)/0.86 Arial Black, Arial, sans-serif;
          letter-spacing: -0.075em;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
