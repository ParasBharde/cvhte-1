import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { NavBar } from './components/NavBar';
import { HeroSection } from './components/HeroSection';

const ElectricalBreakdowns = lazy(() => import('./components/ElectricalBreakdowns').then(m => ({ default: m.ElectricalBreakdowns })));
const SymptomsSection = lazy(() => import('./components/SymptomsSection').then(m => ({ default: m.SymptomsSection })));
const CurrentAbnormalities = lazy(() => import('./components/CurrentAbnormalities').then(m => ({ default: m.CurrentAbnormalities })));
const DesignCauses = lazy(() => import('./components/DesignCauses').then(m => ({ default: m.DesignCauses })));
const ProtectionWeaknesses = lazy(() => import('./components/ProtectionWeaknesses').then(m => ({ default: m.ProtectionWeaknesses })));
const DiagnosticApproach = lazy(() => import('./components/DiagnosticApproach').then(m => ({ default: m.DiagnosticApproach })));
const ProtectionCoordination = lazy(() => import('./components/ProtectionCoordination').then(m => ({ default: m.ProtectionCoordination })));
const ReductionSection = lazy(() => import('./components/ReductionSection').then(m => ({ default: m.ReductionSection })));
const ContactFooter = lazy(() => import('./components/ContactFooter').then(m => ({ default: m.ContactFooter })));


function SectionSkeleton() {
  return (
    <div style={{
      minHeight: '400px',
      background: 'linear-gradient(180deg, rgba(0,180,255,0.03) 0%, transparent 100%)',
      borderTop: '1px solid rgba(0,180,255,0.06)',
    }} />
  );
}

function ScrollEnergyFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    let scrollRatio = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRatio = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let rafId: number;
    let time = 0;

    class Spark {
      x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string;
      constructor(x: number, y: number, color: string, vx: number, vy: number) {
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.life = 0; this.maxLife = Math.random() * 20 + 20;
        this.color = color;
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.life++;
        this.vy += 0.2;
      }
      draw(c: CanvasRenderingContext2D) {
        c.fillStyle = this.color;
        c.globalAlpha = 1 - (this.life / this.maxLife);
        c.beginPath(); c.arc(this.x, this.y, 1.5 + Math.random(), 0, Math.PI * 2); c.fill();
        c.globalAlpha = 1.0;
      }
    }

    const sparks: Spark[] = [];

    const render = () => {
      rafId = requestAnimationFrame(render);
      time += 0.08;

      ctx.clearRect(0, 0, width, height);

      let color = '#00b4ff';
      let mode = 'flow';
      let amplitude = 4;

      if (scrollRatio < 0.15) {
        color = '#00b4ff';
        mode = 'flow';
      } else if (scrollRatio >= 0.15 && scrollRatio < 0.55) {
        color = '#ff3355';
        mode = 'short_circuit';
        amplitude = 8;
      } else if (scrollRatio >= 0.55 && scrollRatio < 0.75) {
        color = '#a855f7';
        mode = 'pulse';
        amplitude = 12;
      } else {
        color = '#00e98c';
        mode = 'perfect';
        amplitude = 2;
      }

      const drawLightning = (baseX: number, reversePhase: boolean) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = mode === 'short_circuit' ? 1 + Math.random() * 1 : 1;
        ctx.shadowColor = color;
        ctx.shadowBlur = mode === 'short_circuit' ? 20 : 12;

        let lastX = baseX;
        let lastY = 0;
        ctx.moveTo(lastX, lastY);

        const segments = Math.floor(height / 25);
        const segmentHeight = height / segments;

        for (let i = 1; i <= segments; i++) {
          let targetY = i * segmentHeight;
          let targetX = baseX;

          const phase = reversePhase ? -time : time;

          if (mode === 'short_circuit') {
            targetX += (Math.random() - 0.5) * amplitude * 1;

            if (Math.random() < 0.005) {
              sparks.push(new Spark(targetX, targetY, color, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4));
            }
          } else if (mode === 'pulse') {
            targetX += Math.sin(phase * 4 + i * 0.8) > 0 ? amplitude : -amplitude;
          } else if (mode === 'perfect') {
            targetX += Math.sin(phase * 8 + i * 0.4) * amplitude;
          } else {
            targetX += Math.sin(phase * 2 + i * 0.2) * amplitude;
          }

          ctx.lineTo(targetX, targetY);
          lastX = targetX;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      drawLightning(20, false);
      drawLightning(width - 20, true);


      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.update();
        s.draw(ctx);
        if (s.life >= s.maxLife) sparks.splice(i, 1);
      }
    };

    render();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100vw', height: '100vh',
        zIndex: 9999, pointerEvents: 'none',
      }}
    />
  );
}

function ArcBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const NODE_COUNT = 28;
    type Node = { x: number; y: number; vx: number; vy: number };
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    }));

    let scrollRatio = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRatio = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let rafId: number;
    let last = 0;
    const FPS = 24;
    const FRAME_MS = 1000 / FPS;

    const draw = (ts: number) => {
      rafId = requestAnimationFrame(draw);
      if (ts - last < FRAME_MS) return;
      last = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width, h = canvas.height;
      for (const n of nodes) {
        n.x += n.vx + scrollRatio * 0.3;
        n.y += n.vy + scrollRatio * 0.15;
        if (n.x < 0) n.x = w;
        if (n.x > w) n.x = 0;
        if (n.y < 0) n.y = h;
        if (n.y > h) n.y = 0;
      }

      const MAX_DIST = 260;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * 0.055;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,180,255,${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,180,255,0.18)';
        ctx.fill();
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100vw', height: '100vh',
        zIndex: 0, pointerEvents: 'none',
        opacity: 1,
      }}
    />
  );
}

export default function App() {
  return (
    <div style={{ background: '#020c1b', color: '#e8f4fd', overflowX: 'hidden' }}>
      <ScrollEnergyFlow />
      <ArcBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <NavBar />
        <HeroSection />
        <Suspense fallback={<SectionSkeleton />}>
          <ElectricalBreakdowns />
          <SymptomsSection />
          <CurrentAbnormalities />
          <DesignCauses />
          <ProtectionWeaknesses />
          <DiagnosticApproach />
          <ProtectionCoordination />
          <ReductionSection />
          <ContactFooter />
        </Suspense>
      </div>
    </div>
  );
}


