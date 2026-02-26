'use client';

import { useEffect, useRef } from 'react';

export default function OrbBackground({ children, orbX = 0.60, orbY = 0.58 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const ROWS = 80;
    const COLS = 80;
    const particles = [];

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        particles.push({ i, j });
      }
    }

    const getColor = (ny, nx, t) => {
      // ny va de -1 (bottom) a 1 (top)
      const norm = (ny + 1) / 2; // 0 (bottom) → 1 (top)

      // Bottom: azul/violeta → Mid: púrpura/magenta → Top: rosa/hot pink
      let r, g, b;
      if (norm < 0.35) {
        // Azul violeta → púrpura
        const t2 = norm / 0.35;
        r = Math.round(60 + t2 * 80);
        g = Math.round(0 + t2 * 5);
        b = Math.round(220 - t2 * 40);
      } else if (norm < 0.65) {
        // Púrpura → magenta
        const t2 = (norm - 0.35) / 0.3;
        r = Math.round(140 + t2 * 60);
        g = Math.round(5 + t2 * 10);
        b = Math.round(180 - t2 * 40);
      } else {
        // Magenta → hot pink
        const t2 = (norm - 0.65) / 0.35;
        r = Math.round(200 + t2 * 55);
        g = Math.round(15 + t2 * 40);
        b = Math.round(140 - t2 * 30);
      }

      // Variación sutil con tiempo para efecto vivo
      const shimmer = Math.sin(nx * 3 + t * 0.8) * 10;
      r = Math.min(255, Math.max(0, r + shimmer));

      return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width * orbX;
      const cy = canvas.height * orbY;
      const radius = Math.min(canvas.width, canvas.height) * 0.44;

      // Glow ambiental detrás del orbe
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.6);
      glowGrad.addColorStop(0, 'rgba(180, 50, 180, 0.08)');
      glowGrad.addColorStop(0.5, 'rgba(100, 20, 160, 0.04)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rotación lenta en Y + ligera inclinación en X
      const rotY = time * 0.12;
      const rotX = Math.sin(time * 0.08) * 0.3;
      const breathe = 1 + Math.sin(time * 0.15) * 0.06;
      const cosRY = Math.cos(rotY);
      const sinRY = Math.sin(rotY);
      const cosRX = Math.cos(rotX);
      const sinRX = Math.sin(rotX);

      for (const p of particles) {
        const phi = (p.i / (ROWS - 1)) * Math.PI;
        const theta = (p.j / (COLS - 1)) * 2 * Math.PI;

        // Distorsión orgánica más pronunciada
        const noiseA = Math.sin(phi * 3.5 + time * 0.6 + p.j * 0.12) * 0.22;
        const noiseB = Math.cos(theta * 2.5 + time * 0.4 + p.i * 0.10) * 0.20;
        const noiseC = Math.sin(phi * 2 + theta * 1.5 + time * 0.8) * 0.15;
        const noiseD = Math.cos(phi + theta * 3 + time * 0.3) * 0.08;

        const nx = Math.sin(phi + noiseA) * Math.cos(theta + noiseB);
        const ny = Math.cos(phi + noiseB + noiseD);
        const nz = Math.sin(phi + noiseC) * Math.sin(theta + noiseA);

        // Rotación Y
        let x3d = nx * cosRY - nz * sinRY;
        let z3d = nx * sinRY + nz * cosRY;
        let y3d = ny;

        // Rotación X (inclinación)
        const y3dRot = y3d * cosRX - z3d * sinRX;
        const z3dRot = y3d * sinRX + z3d * cosRX;
        y3d = y3dRot;
        z3d = z3dRot;

        const perspective = 1 / (1 + z3d * 0.35);
        const r = radius * breathe;
        const sx = cx + x3d * r * perspective;
        const sy = cy - y3d * r * perspective;

        // Profundidad
        const depth = (z3d + 1) / 2;
        const dotSize = (0.4 + depth * 1.0) * perspective;
        const alpha = 0.3 + depth * 0.7;

        const color = getColor(ny, nx, time);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      time += 0.01;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#000' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
