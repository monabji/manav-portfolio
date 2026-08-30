'use client';

import { useEffect, useRef } from 'react';

const characters = ' .:-=+*#%@';

export default function AsciiWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const cellSize = 20;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.font = `600 ${cellSize}px "IBM Plex Mono", monospace`;
      context.textBaseline = 'top';
    };

    const draw = (time: number) => {
      const t = reducedMotion ? 0 : time * 0.00042;
      context.clearRect(0, 0, width, height);

      const columns = Math.ceil(width / cellSize) + 1;
      const rows = Math.ceil(height / cellSize) + 1;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * cellSize;
          const y = row * cellSize;
          const nx = column / columns;
          const ny = row / rows;

          const horizontalWave = Math.sin(column * 0.29 + t * 3.2);
          const diagonalWave = Math.sin((column + row * 0.72) * 0.16 - t * 2.1);
          const ripple = Math.sin(Math.hypot(column - columns * 0.74, row - rows * 0.7) * 0.36 - t * 4.4);
          const contour = horizontalWave * 0.42 + diagonalWave * 0.33 + ripple * 0.25;
          const depth = Math.pow((contour + 1) / 2, 2.35);
          const edgeFade = Math.min(1, Math.min(nx, 1 - nx, ny, 1 - ny) * 6);
          const strength = Math.max(0, depth * edgeFade - 0.18);

          if (strength < 0.04) continue;

          const glyph = characters[Math.min(characters.length - 1, Math.floor(strength * characters.length * 1.5))];
          context.fillStyle = `rgba(47, 128, 217, ${Math.min(0.95, strength * 1.35)})`;
          context.fillText(glyph, x, y);
        }
      }

      if (!reducedMotion) animationFrame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    animationFrame = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="ascii-wave-background" aria-hidden="true" />;
}
