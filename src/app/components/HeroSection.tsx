import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronDown, Zap } from 'lucide-react';

const CVHTE_ITEMS = [
  { letter: 'C', label: 'Current',    color: '#00b4ff' },
  { letter: 'V', label: 'Voltage',    color: '#4dd8ff' },
  { letter: 'H', label: 'Harmonics',  color: '#ff9f0a' },
  { letter: 'T', label: 'Temperature',color: '#ff6b6b' },
  { letter: 'E', label: 'Earthing',   color: '#00e98c' },
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

    // ── Generate 3D Power Lines (Paths) ──────────────────────────────────────
    const PATH_COUNT = 6;
    const paths: THREE.CatmullRomCurve3[] = [];
    const pathLines: THREE.Line[] = [];

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x0055aa,
      transparent: true,
      opacity: 0.15,
      linewidth: 2,
    });

    for (let i = 0; i < PATH_COUNT; i++) {
       const yOffset = (i - PATH_COUNT / 2) * 2;
       const zOffset = (Math.random() - 0.5) * 8;
       // Create smooth flowing paths across the screen
       const curve = new THREE.CatmullRomCurve3([
         new THREE.Vector3(-25, yOffset + Math.random() * 4 - 2, zOffset - 2),
         new THREE.Vector3(-12, yOffset + Math.random() * 3 - 1.5, zOffset + 2),
         new THREE.Vector3(0,   yOffset + Math.random() * 2 - 1, zOffset + 4),
         new THREE.Vector3(12,  yOffset + Math.random() * 3 - 1.5, zOffset + 2),
         new THREE.Vector3(25,  yOffset + Math.random() * 4 - 2, zOffset - 2),
       ]);
       paths.push(curve);

       // Draw the actual wire slightly visible
       const points = curve.getPoints(100);
       const geometry = new THREE.BufferGeometry().setFromPoints(points);
       const line = new THREE.Line(geometry, lineMat.clone());
       scene.add(line);
       pathLines.push(line);
    }

    // ── Electrical Current Pulses (Flowing Energy) ───────────────────
    const BURST_COUNT = 24;
    const TAIL_LENGTH = 30; // Long thick tail
    const totalPoints = BURST_COUNT * TAIL_LENGTH;
    
    const travelPositions = new Float32Array(totalPoints * 3);
    const travelOpacities = new Float32Array(totalPoints);
    
    for(let i=0; i<totalPoints; i++) {
       // Exponential fade for realistic glowing tail
       const t = i % TAIL_LENGTH / TAIL_LENGTH;
       travelOpacities[i] = Math.pow(t, 2); 
    }

    const travelGeo = new THREE.BufferGeometry();
    travelGeo.setAttribute('position', new THREE.BufferAttribute(travelPositions, 3));
    travelGeo.setAttribute('alpha', new THREE.BufferAttribute(travelOpacities, 1));

    const travelMat = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(0x00ffff) } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // Perfectly sized electrical plasma (not too thin, not too thick)
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

    // Assign current bursts to travel along paths
    const travelers = Array.from({ length: BURST_COUNT }, () => {
      const isReverse = Math.random() > 0.7; // Most flow left-to-right
      return {
        pathIdx: Math.floor(Math.random() * PATH_COUNT),
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        direction: isReverse ? -1 : 1,
      };
    });

    // ── Environmental Ambience ──────────────────────────────────
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

    // ── Short Circuit / Arc Sparks System ──────────────────────
    const EXPLOSION_MAX = 5;
    const SPARKS_PER_EXPLOSION = 30; // More intense explosion
    const expPoints = EXPLOSION_MAX * SPARKS_PER_EXPLOSION;
    
    const expPositions = new Float32Array(expPoints * 3);
    const expOpacities = new Float32Array(expPoints);
    const expVelocities = new Float32Array(expPoints * 3);
    
    const expGeo = new THREE.BufferGeometry();
    expGeo.setAttribute('position', new THREE.BufferAttribute(expPositions, 3));
    expGeo.setAttribute('alpha', new THREE.BufferAttribute(expOpacities, 1));

    // Fast-burning bright spark material
    const expMat = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(0xffaa00) } }, // Yellow/Orange sparks
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // Scale drastically increased so sparks are fiercely visible
          gl_PointSize = (150.0 / -mvPosition.z) * vAlpha; 
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          gl_FragColor = vec4(color, vAlpha * smoothstep(0.5, 0.0, dist) * 3.0);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(expGeo, expMat));

    let activeExplosions: { pIndex: number, life: number }[] = [];

    // Trigger function to ignite a spark burst at a location
    const triggerSpark = (x: number, y: number, z: number) => {
      // Find a dead explosion block to use
      let block = -1;
      for (let i = 0; i < EXPLOSION_MAX; i++) {
        if (!activeExplosions.some(e => e.pIndex === i)) { block = i; break; }
      }
      if (block === -1) return; // All max sparks active
      
      activeExplosions.push({ pIndex: block, life: 1.0 });
      
      for (let i = 0; i < SPARKS_PER_EXPLOSION; i++) {
        const idx = (block * SPARKS_PER_EXPLOSION) + i;
        expPositions[idx * 3]     = x;
        expPositions[idx * 3 + 1] = y;
        expPositions[idx * 3 + 2] = z;
        expOpacities[idx] = 1.0;
        
        // Explosive outward velocity
        expVelocities[idx * 3] = (Math.random() - 0.5) * 0.4;
        expVelocities[idx * 3 + 1] = (Math.random() - 0.5) * 0.4;
        expVelocities[idx * 3 + 2] = (Math.random() - 0.5) * 0.4;
      }
    };

    // ── Animation Loop ────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Slow scene breathing
      camera.position.x = Math.sin(t * 0.2) * 2;
      camera.position.y = Math.cos(t * 0.15) * 1;
      camera.lookAt(0, 0, 0);

      // Pulse wire brightness dynamically
      pathLines.forEach((line, i) => {
        (line.material as THREE.LineBasicMaterial).opacity = 0.1 + Math.sin(t * 1.5 + i) * 0.08;
      });

      // Update flowing current pulses along designated paths
      travelers.forEach((state, burstIdx) => {
        state.progress += state.speed * state.direction;
        
        // Loop continuously around the wire
        if (state.progress >= 1) {
          state.progress = 0; 
          state.pathIdx = Math.floor(Math.random() * PATH_COUNT);
        } else if (state.progress <= 0) {
          state.progress = 1;
          state.pathIdx = Math.floor(Math.random() * PATH_COUNT);
        }

        const path = paths[state.pathIdx];
        let headPt = new THREE.Vector3();
        
        // Draw the intense head and fading tail tracing the curve perfectly
        for (let tailIdx = 0; tailIdx < TAIL_LENGTH; tailIdx++) {
           const idx = burstIdx * TAIL_LENGTH + tailIdx;
           
           const tailOffset = (tailIdx * 0.003) * state.direction;
           let p = state.progress - tailOffset;
           if (p < 0) p += 1;
           if (p > 1) p -= 1;
           
           const pt = path.getPointAt(p);
           if (tailIdx === 0) headPt.copy(pt); // Save head position for sparks
           
           travelPositions[idx * 3]     = pt.x;
           travelPositions[idx * 3 + 1] = pt.y;
           travelPositions[idx * 3 + 2] = pt.z;
        }

        // Randomly spark heavily while traveling (simulates short circuiting/arc flash)
        if (Math.random() < 0.005) {
          triggerSpark(headPt.x, headPt.y, headPt.z);
        }
      });
      travelGeo.attributes.position.needsUpdate = true;

      // Update Sparks Physics
      activeExplosions = activeExplosions.filter(exp => {
        exp.life -= 0.04; // Fast fade
        const stillAlive = exp.life > 0;
        
        for (let i = 0; i < SPARKS_PER_EXPLOSION; i++) {
           const idx = (exp.pIndex * SPARKS_PER_EXPLOSION) + i;
           if (stillAlive) {
             expPositions[idx * 3]     += expVelocities[idx * 3];
             expPositions[idx * 3 + 1] += expVelocities[idx * 3 + 1];
             expPositions[idx * 3 + 2] += expVelocities[idx * 3 + 2];
             expVelocities[idx * 3 + 1] -= 0.01; // Gravity pull down on sparks
             expOpacities[idx] = exp.life * Math.random(); // Flickering fade
           } else {
             expOpacities[idx] = 0; // Hide dead sparks
           }
        }
        return stillAlive;
      });
      if (activeExplosions.length > 0) {
         expGeo.attributes.position.needsUpdate = true;
         expGeo.attributes.alpha.needsUpdate = true;
      }

      // Rotate ambient particles
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
  const [cvhteIdx, setCvhteIdx] = useState(0);

  // Skip Three.js on mobile to save GPU/CPU for better Lighthouse scores
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  useThreeScene(canvasRef, isDesktop);

  // Parallax scroll — canvas drifts at 0.3×, content at 0.15×
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Cycle CVHTE highlight
  useEffect(() => {
    const id = setInterval(() => setCvhteIdx(prev => (prev + 1) % CVHTE_ITEMS.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      style={{ position: 'relative', height: '100vh', minHeight: '700px', overflow: 'hidden', background: '#020c1b' }}
    >
      {/* Three.js canvas – hidden on mobile (no WebGL work done) */}
      {isDesktop && (
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', contain: 'strict' }}
        />
      )}

      {/* Radial vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(2,12,27,0.2) 0%, rgba(2,12,27,0.75) 70%)',
        pointerEvents: 'none',
      }} />

      {/* Horizontal scan line (represents signal sweep) */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,180,255,0.4), transparent)',
        animation: 'scanDown 8s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Content overlay */}
      <div
        ref={contentRef}
        style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 24px', textAlign: 'center',
        opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
      }}>

        {/* Shield badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          border: '1px solid rgba(0,180,255,0.3)',
          padding: '6px 16px',
          marginBottom: '32px',
          background: 'rgba(0,180,255,0.06)',
          animation: 'pulseBorder 3s ease-in-out infinite',
        }}>
          <Zap size={12} color="#ff9f0a" fill="#ff9f0a" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#7ba6c4', letterSpacing: '3px' }}>
            ELECTRICAL SYSTEM INTELLIGENCE
          </span>
        </div>

        {/* Company name */}
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(28px, 5vw, 56px)',
          fontWeight: 900,
          letterSpacing: '4px',
          color: '#e8f4fd',
          textShadow: '0 0 40px rgba(0,180,255,0.3)',
          marginBottom: '8px',
          animation: 'flickerIn 0.8s ease-out forwards',
        }}>
          CVHTE INTELLIGENCE
        </div>

        {/* CVHTE system title */}
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(14px, 2.5vw, 22px)',
          fontWeight: 600,
          letterSpacing: '6px',
          color: '#00b4ff',
          marginBottom: '40px',
          textShadow: '0 0 20px rgba(0,180,255,0.6)',
        }}>
          ADVANCED SYSTEM DIAGNOSTICS
        </div>

        {/* CVHTE Acronym breakdown */}
        <div style={{ display: 'flex', gap: 'clamp(12px, 2vw, 32px)', marginBottom: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {CVHTE_ITEMS.map((item, i) => {
            const isActive = i === cvhteIdx;
            return (
              <div key={item.letter} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                transition: 'all 0.4s ease',
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
              }}>
                <div style={{
                  width: 'clamp(40px, 5vw, 56px)',
                  height: 'clamp(40px, 5vw, 56px)',
                  border: `1px solid ${isActive ? item.color : 'rgba(0,180,255,0.2)'}`,
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

        {/* Description */}
        <p style={{
          maxWidth: '600px',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(14px, 1.8vw, 17px)',
          color: '#7ba6c4',
          lineHeight: 1.7,
          marginBottom: '40px',
        }}>
          A comprehensive monitoring and protection coordination framework that diagnoses
          electrical system failures at their root — reducing industrial breakdowns by up to <strong style={{ color: '#00b4ff' }}>40%</strong>.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#breakdowns" style={{
            background: '#00b4ff',
            color: '#020c1b',
            padding: '14px 32px',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 0 30px rgba(0,180,255,0.4)',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(0,180,255,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(0,180,255,0.4)'; }}
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

        {/* Cool Scroll indicator */}
        <a href="#breakdowns" style={{
          position: 'absolute', bottom: '40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          color: '#00b4ff', textDecoration: 'none',
          animation: 'scanDown 3s linear infinite', /* Using existing animation for glow, will add bounce in CSS */
          cursor: 'pointer',
          zIndex: 20,
        }}
        className="hero-scroll-btn"
        >
          <div style={{
            width: '24px', height: '38px',
            border: '2px solid rgba(0,180,255,0.5)',
            borderRadius: '20px',
            display: 'flex', justifyContent: 'center',
            paddingTop: '6px',
            boxShadow: '0 0 15px rgba(0,180,255,0.2)',
            background: 'rgba(5, 26, 46, 0.5)',
          }}>
            <div style={{
              width: '3px', height: '8px',
              background: '#00e98c',
              borderRadius: '2px',
              animation: 'scrollWheel 1.5s infinite',
              boxShadow: '0 0 8px #00e98c'
            }} />
          </div>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', letterSpacing: '3px', color: '#7ba6c4' }}>DESCEND</span>
        </a>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to bottom, transparent, #020c1b)',
        pointerEvents: 'none',
      }} />
    </section>
  );
}
