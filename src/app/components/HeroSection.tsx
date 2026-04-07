import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronDown, Zap } from 'lucide-react';

const CVHET_ITEMS = [
  { letter: 'C', label: 'Current',    color: '#b9a15c' },
  { letter: 'V', label: 'Voltage',    color: '#0082b4' },
  { letter: 'H', label: 'Harmonics',  color: '#b9a15c' },
  { letter: 'E', label: 'Earthing',   color: '#0082b4' },
  { letter: 'T', label: 'Temperature',color: '#b9a15c' },
];

function useThreeScene(canvasRef: React.RefObject<HTMLCanvasElement | null>, enabled: boolean) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020c1b, 1);
    
    const PATH_COUNT = 6;
    const paths: THREE.CatmullRomCurve3[] = [];
    const pathLines: THREE.Line[] = [];

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x0082b4,
      transparent: true,
      opacity: 0.15,
      linewidth: 2,
    });

    for (let i = 0; i < PATH_COUNT; i++) {
       const yOffset = (i - PATH_COUNT / 2) * 2;
       const zOffset = (Math.random() - 0.5) * 8;
       const curve = new THREE.CatmullRomCurve3([
         new THREE.Vector3(-25, yOffset + Math.random() * 4 - 2, zOffset - 2),
         new THREE.Vector3(-12, yOffset + Math.random() * 3 - 1.5, zOffset + 2),
         new THREE.Vector3(0,   yOffset + Math.random() * 2 - 1, zOffset + 4),
         new THREE.Vector3(12,  yOffset + Math.random() * 3 - 1.5, zOffset + 2),
         new THREE.Vector3(25,  yOffset + Math.random() * 4 - 2, zOffset - 2),
       ]);
       paths.push(curve);

       const points = curve.getPoints(100);
       const geometry = new THREE.BufferGeometry().setFromPoints(points);
       const line = new THREE.Line(geometry, lineMat.clone());
       scene.add(line);
       pathLines.push(line);
    }

    const BURST_COUNT = 24;
    const TAIL_LENGTH = 30;
    const totalPoints = BURST_COUNT * TAIL_LENGTH;
    
    const travelPositions = new Float32Array(totalPoints * 3);
    const travelOpacities = new Float32Array(totalPoints);
    
    for(let i=0; i<totalPoints; i++) {
       const t = i % TAIL_LENGTH / TAIL_LENGTH;
       travelOpacities[i] = Math.pow(t, 2); 
    }

    const travelGeo = new THREE.BufferGeometry();
    travelGeo.setAttribute('position', new THREE.BufferAttribute(travelPositions, 3));
    travelGeo.setAttribute('alpha', new THREE.BufferAttribute(travelOpacities, 1));

    const travelMat = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(0x0082b4) } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (100.0 / -mvPosition.z) * (0.5 + vAlpha * 0.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          float intensity = smoothstep(0.5, 0.0, dist);
          gl_FragColor = vec4(color, vAlpha * intensity * 2.0);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    scene.add(new THREE.Points(travelGeo, travelMat));

    const travelers = Array.from({ length: BURST_COUNT }, () => {
      const isReverse = Math.random() > 0.7;
      return {
        pathIdx: Math.floor(Math.random() * PATH_COUNT),
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        direction: isReverse ? -1 : 1,
      };
    });

    const AMBIENT = 150;
    const ambPositions = new Float32Array(AMBIENT * 3);
    for (let i = 0; i < AMBIENT; i++) {
        ambPositions[i * 3]     = (Math.random() - 0.5) * 40;
        ambPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        ambPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPositions, 3));
    const ambMat = new THREE.PointsMaterial({
      color: 0x004488, size: 0.04, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const ambPoints = new THREE.Points(ambGeo, ambMat);
    scene.add(ambPoints);

    const EXPLOSION_MAX = 2;
    const SPARKS_PER_EXPLOSION = 8;
    const expPoints = EXPLOSION_MAX * SPARKS_PER_EXPLOSION;
    
    const expPositions = new Float32Array(expPoints * 3);
    const expOpacities = new Float32Array(expPoints);
    const expVelocities = new Float32Array(expPoints * 3);
    
    const expGeo = new THREE.BufferGeometry();
    expGeo.setAttribute('position', new THREE.BufferAttribute(expPositions, 3));
    expGeo.setAttribute('alpha', new THREE.BufferAttribute(expOpacities, 1));

    const expMat = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(0xff4422) } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (40.0 / -mvPosition.z) * vAlpha; 
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          gl_FragColor = vec4(color, vAlpha * smoothstep(0.5, 0.0, dist) * 1.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(expGeo, expMat));

    let activeExplosions: { pIndex: number, life: number }[] = [];

    const triggerSpark = (x: number, y: number, z: number) => {
      let block = -1;
      for (let i = 0; i < EXPLOSION_MAX; i++) {
        if (!activeExplosions.some(e => e.pIndex === i)) { block = i; break; }
      }
      if (block === -1) return;
      
      activeExplosions.push({ pIndex: block, life: 1.0 });
      
      for (let i = 0; i < SPARKS_PER_EXPLOSION; i++) {
        const idx = (block * SPARKS_PER_EXPLOSION) + i;
        expPositions[idx * 3]     = x;
        expPositions[idx * 3 + 1] = y;
        expPositions[idx * 3 + 2] = z;
        expOpacities[idx] = 0.8;
        
        expVelocities[idx * 3] = (Math.random() - 0.5) * 0.15;
        expVelocities[idx * 3 + 1] = (Math.random() - 0.5) * 0.15;
        expVelocities[idx * 3 + 2] = (Math.random() - 0.5) * 0.15;
      }
    };

    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      camera.position.x = Math.sin(t * 0.2) * 2;
      camera.position.y = Math.cos(t * 0.15) * 1;
      camera.lookAt(0, 0, 0);

      pathLines.forEach((line, i) => {
        (line.material as THREE.LineBasicMaterial).opacity = 0.1 + Math.sin(t * 1.5 + i) * 0.08;
      });

      travelers.forEach((state, burstIdx) => {
        state.progress += state.speed * state.direction;
        
        if (state.progress >= 1) {
          state.progress = 0; 
          state.pathIdx = Math.floor(Math.random() * PATH_COUNT);
        } else if (state.progress <= 0) {
          state.progress = 1;
          state.pathIdx = Math.floor(Math.random() * PATH_COUNT);
        }

        const path = paths[state.pathIdx];
        let headPt = new THREE.Vector3();
        
        for (let tailIdx = 0; tailIdx < TAIL_LENGTH; tailIdx++) {
           const idx = burstIdx * TAIL_LENGTH + tailIdx;
           
           const tailOffset = (tailIdx * 0.003) * state.direction;
           let p = state.progress - tailOffset;
           if (p < 0) p += 1;
           if (p > 1) p -= 1;
           
           const pt = path.getPointAt(p);
           if (tailIdx === 0) headPt.copy(pt);
           
           travelPositions[idx * 3]     = pt.x;
           travelPositions[idx * 3 + 1] = pt.y;
           travelPositions[idx * 3 + 2] = pt.z;
        }

        if (Math.random() < 0.0005) {
          triggerSpark(headPt.x, headPt.y, headPt.z);
        }
      });
      travelGeo.attributes.position.needsUpdate = true;

      activeExplosions = activeExplosions.filter(exp => {
        exp.life -= 0.02;
        const stillAlive = exp.life > 0;
        
        for (let i = 0; i < SPARKS_PER_EXPLOSION; i++) {
           const idx = (exp.pIndex * SPARKS_PER_EXPLOSION) + i;
           if (stillAlive) {
             expPositions[idx * 3]     += expVelocities[idx * 3];
             expPositions[idx * 3 + 1] += expVelocities[idx * 3 + 1];
             expPositions[idx * 3 + 2] += expVelocities[idx * 3 + 2];
             expVelocities[idx * 3 + 1] -= 0.006; 
             expOpacities[idx] = exp.life * 0.6;
           } else {
             expOpacities[idx] = 0; 
           }
        }
        return stillAlive;
      });
      if (activeExplosions.length > 0) {
         expGeo.attributes.position.needsUpdate = true;
         expGeo.attributes.alpha.needsUpdate = true;
      }

      ambPoints.rotation.y = t * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.clear();
    };
  }, [enabled]);
}

export function HeroSection() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [visible,  setVisible]  = useState(false);
  const [cvhetIdx, setCvhteIdx] = useState(0);

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  useThreeScene(canvasRef, isDesktop);

  useEffect(() => {
    if (!isDesktop) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (canvasRef.current)  canvasRef.current.style.transform  = `translateY(${y * 0.3}px)`;
        if (contentRef.current) contentRef.current.style.transform = `translateY(${y * 0.15}px)`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDesktop]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCvhteIdx(prev => (prev + 1) % CVHET_ITEMS.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      style={{ position: 'relative', height: '100vh', minHeight: isDesktop ? '700px' : '620px', overflow: 'hidden', background: '#020c1b' }}
    >
      {isDesktop && (
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', contain: 'strict' }}
        />
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(2,12,27,0.2) 0%, rgba(2,12,27,0.75) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,180,255,0.4), transparent)',
        animation: 'scanDown 8s linear infinite',
        pointerEvents: 'none',
      }} />

      <div
        ref={contentRef}
        style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: isDesktop ? 'center' : 'flex-start',
        padding: isDesktop ? '0 24px' : '100px 24px 60px', textAlign: 'center',
        opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
      }}>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          border: '1px solid rgba(0, 130, 180, 0.3)',
          padding: '6px 16px',
          marginBottom: 'clamp(20px, 4vh, 32px)',
          background: 'rgba(0, 130, 180, 0.06)',
          animation: 'pulseBorder 3s ease-in-out infinite',
        }}>
          <Zap size={12} color="#b9a15c" fill="#b9a15c" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#7ba6c4', letterSpacing: '3px' }}>
            ELECTRICAL BREAKDOWN EXPERT
          </span>
        </div>

        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(24px, 5vw, 56px)',
          fontWeight: 900,
          letterSpacing: isDesktop ? '4px' : '2px',
          color: '#e8f4fd',
          textShadow: '0 0 40px rgba(0, 130, 180, 0.3)',
          marginBottom: '8px',
          animation: 'flickerIn 0.8s ease-out forwards',
        }}>
          {isDesktop ? 'CVHET ELECTRICAL BREAKDOWN EXPERT' : 'CVHET'}
        </div>

        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(12px, 2.5vw, 22px)',
          fontWeight: 600,
          letterSpacing: isDesktop ? '6px' : '3px',
          color: '#0082b4',
          marginBottom: 'clamp(24px, 5vh, 40px)',
          textShadow: '0 0 20px rgba(0, 130, 180, 0.6)',
        }}>
          ADVANCED SYSTEM DIAGNOSTICS
        </div>

        <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 32px)', marginBottom: 'clamp(32px, 6vh, 48px)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {CVHET_ITEMS.map((item, i) => {
            const isActive = i === cvhetIdx;
            return (
              <div key={item.letter} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                transition: 'all 0.4s ease',
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
              }}>
                <div style={{
                  width: 'clamp(40px, 5vw, 56px)',
                  height: 'clamp(40px, 5vw, 56px)',
                  border: `1px solid ${isActive ? item.color : 'rgba(0, 130, 180, 0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? `${item.color}18` : 'transparent',
                  boxShadow: isActive ? `0 0 20px ${item.color}40` : 'none',
                  transition: 'all 0.4s ease',
                }}>
                  <span style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: 'clamp(16px, 2.5vw, 24px)',
                    fontWeight: 800,
                    color: isActive ? item.color : '#7ba6c4',
                    transition: 'color 0.4s',
                  }}>
                    {item.letter}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(9px, 1.2vw, 11px)',
                  color: isActive ? item.color : 'rgba(123,166,196,0.6)',
                  letterSpacing: '1px',
                  transition: 'color 0.4s',
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <p style={{
          maxWidth: '600px',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(14px, 1.8vw, 17px)',
          color: '#7ba6c4',
          lineHeight: 1.7,
          marginBottom: 'clamp(24px, 4vh, 40px)',
        }}>
          A comprehensive monitoring and protection coordination framework that diagnoses
          electrical system failures at their root — reducing industrial breakdowns by up to <strong style={{ color: '#b9a15c', textShadow: '0 0 15px rgba(185,161,92,0.3)' }}>80%</strong>.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#breakdowns" style={{
            background: '#0082b4',
            color: '#020c1b',
            padding: '14px 32px',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 0 30px rgba(0, 130, 180, 0.4)',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(0, 130, 180, 0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(0, 130, 180, 0.4)'; }}
          >
            <Zap size={14} fill="currentColor" /> EXPLORE SYSTEM
          </a>
          <a href="#contact" style={{
            background: 'transparent',
            color: '#e8f4fd',
            padding: '14px 32px',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '2px',
            textDecoration: 'none',
            border: '1px solid rgba(232,244,253,0.25)',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,244,253,0.6)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,244,253,0.25)'; }}
          >
            REQUEST ANALYSIS
          </a>
        </div>

        <a href="#breakdowns" style={{
          position: 'absolute', bottom: '40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          color: '#0082b4', textDecoration: 'none',
          animation: 'scanDown 3s linear infinite', /* Using existing animation for glow, will add bounce in CSS */
          cursor: 'pointer',
          zIndex: 20,
        }}
        className="hero-scroll-btn"
        >
          <div style={{
            width: '24px', height: '38px',
            border: '2px solid rgba(0, 130, 180, 0.5)',
            borderRadius: '20px',
            display: 'flex', justifyContent: 'center',
            paddingTop: '6px',
            boxShadow: '0 0 15px rgba(0, 130, 180, 0.2)',
            background: 'rgba(5, 26, 46, 0.5)',
          }}>
            <div style={{
              width: '3px', height: '8px',
              background: '#b9a15c',
              borderRadius: '2px',
              animation: 'scrollWheel 1.5s infinite',
              boxShadow: '0 0 8px #b9a15c'
            }} />
          </div>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', letterSpacing: '3px', color: '#7ba6c4' }}>DESCEND</span>
        </a>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to bottom, transparent, #020c1b)',
        pointerEvents: 'none',
      }} />
    </section>
  );
}
