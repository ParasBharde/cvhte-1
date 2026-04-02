import { useEffect, useRef, useState } from 'react';
import { Activity } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isDesktop = () => window.innerWidth >= 768;

const WAVEFORM_TYPES = [
  {
    id: 'normal',
    label: 'Normal Signal',
    shortLabel: 'NORMAL',
    color: '#00e98c',
    description: 'Ideal sinusoidal AC waveform — clean, symmetric, with uniform amplitude and frequency. This is the target state for all parameters.',
    risk: 0,
    draw: (x: number, t: number, w: number, _h: number) => {
      const norm = (x / w) * Math.PI * 6;
      return Math.sin(norm + t);
    },
  },
  {
    id: 'overcurrent',
    label: 'Overcurrent',
    shortLabel: 'OVERCURRENT',
    color: '#ff3355',
    description: 'Current exceeds the rated capacity of conductors and equipment. Causes insulation damage, overheating of cables, and tripping of protection devices.',
    risk: 90,
    draw: (x: number, t: number, w: number, _h: number) => {
      const norm = (x / w) * Math.PI * 6;
      const raw = Math.sin(norm + t) * 1.85;
      return Math.max(-1, Math.min(1, raw)); // clipped — represents saturation
    },
  },
  {
    id: 'harmonic',
    label: 'Harmonic Distortion',
    shortLabel: 'HARMONICS',
    color: '#ff9f0a',
    description: 'Non-linear loads inject 3rd, 5th, 7th harmonics into the supply. This distorts the waveform, causes transformer heating, neutral overloading, and metering errors.',
    risk: 75,
    draw: (x: number, t: number, w: number, _h: number) => {
      const norm = (x / w) * Math.PI * 6;
      return (
        0.6 * Math.sin(norm + t) +
        0.28 * Math.sin(3 * norm + t) +
        0.14 * Math.sin(5 * norm + t) +
        0.07 * Math.sin(7 * norm + t)
      );
    },
  },
  {
    id: 'imbalance',
    label: 'Phase Imbalance',
    shortLabel: 'IMBALANCE',
    color: '#a855f7',
    description: 'Unequal current or voltage across the three phases causes negative-sequence currents, additional heating in motors, and vibration in rotating equipment.',
    risk: 70,
    draw: (x: number, t: number, w: number, _h: number) => {
      const norm = (x / w) * Math.PI * 6;
      const phase = x / w;
      if (phase < 0.33) return Math.sin(norm + t);
      if (phase < 0.66) return Math.sin(norm + t + 2.094) * 0.55;
      return Math.sin(norm + t + 4.189) * 1.45;
    },
  },
  {
    id: 'leakage',
    label: 'Earth Leakage',
    shortLabel: 'LEAKAGE',
    color: '#fb923c',
    description: 'Stray current flowing to earth through degraded insulation, moisture ingress, or faulty equipment. Poses electric shock hazard and causes nuisance RCD tripping.',
    risk: 85,
    draw: (x: number, t: number, w: number, _h: number) => {
      const norm = (x / w) * Math.PI * 6;
      const noise = Math.sin(norm * 8.3 + t * 3.7) * 0.08;
      return Math.sin(norm + t) * 0.75 + 0.28 + noise;
    },
  },
];

function WaveformCanvas({ typeId, color, draw }: {
  typeId: string;
  color: string;
  draw: (x: number, t: number, w: number, h: number) => number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let t = 0;

    const render = () => {
      rafRef.current = requestAnimationFrame(render);
      t += 0.04;

      // Clear
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#020c1b';
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = 'rgba(0,180,255,0.06)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= W; gx += W / 8) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy <= H; gy += H / 4) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }

      // Centre line
      ctx.strokeStyle = 'rgba(0,180,255,0.15)';
      ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
      ctx.setLineDash([]);

      // Glow shadow
      ctx.shadowBlur  = 14;
      ctx.shadowColor = color;

      // Waveform path
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      for (let px = 0; px < W; px++) {
        const y     = draw(px, t, W, H);
        const canY  = H / 2 - y * (H * 0.36);
        if (px === 0) ctx.moveTo(px, canY);
        else ctx.lineTo(px, canY);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Ghost trail (faint previous cycle)
      ctx.strokeStyle = color + '28';
      ctx.lineWidth   = 1.2;
      ctx.beginPath();
      for (let px = 0; px < W; px++) {
        const y    = draw(px, t - 0.35, W, H);
        const canY = H / 2 - y * (H * 0.36);
        if (px === 0) ctx.moveTo(px, canY);
        else ctx.lineTo(px, canY);
      }
      ctx.stroke();

      // Moving cursor (represents measurement probe)
      const cursorX = ((t * 30) % W);
      ctx.fillStyle = color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.beginPath();
      const curY = draw(cursorX, t, W, H);
      ctx.arc(cursorX, H / 2 - curY * (H * 0.36), 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    render();
    return () => cancelAnimationFrame(rafRef.current);
  }, [typeId, color, draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

function RiskMeter({ risk, color }: { risk: number; color: string }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDisplayed(risk), 200);
    return () => clearTimeout(t);
  }, [risk]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#7ba6c4', whiteSpace: 'nowrap' }}>
        Risk Level
      </span>
      <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          background: `linear-gradient(90deg, #00e98c, ${color})`,
          boxShadow: `0 0 8px ${color}80`,
          width: `${displayed}%`,
          transition: 'width 1s ease',
        }} />
      </div>
      <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', color, fontWeight: 700, minWidth: '36px' }}>
        {risk}%
      </span>
    </div>
  );
}

export function CurrentAbnormalities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [inView,   setInView]   = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!isDesktop()) {
      setInView(true);
      return;
    }
    const st = ScrollTrigger.create({
      trigger: pinRef.current,
      start: 'top 100px',
      end: '+=150%',
      pin: pinRef.current,
      scrub: 1,
      onEnter: () => setInView(true),
      onUpdate: (self) => {
        const idx = Math.floor(self.progress * WAVEFORM_TYPES.length);
        setSelected(Math.min(idx, WAVEFORM_TYPES.length - 1));
      }
    });
    return () => st.kill();
  }, []);

  const active = WAVEFORM_TYPES[selected];

  return (
    <section
      id="abnormalities"
      ref={sectionRef}
      style={{
        background: '#020c1b',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 100px)',
        position: 'relative',
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.2)',
          padding: '5px 14px', marginBottom: '20px',
        }}>
          <Activity size={12} color="#00b4ff" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#00b4ff', letterSpacing: '2px' }}>LIVE SIGNAL ANALYSIS</span>
        </div>
        <h2 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(24px, 4vw, 42px)',
          fontWeight: 800,
          color: '#e8f4fd',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          CURRENT ABNORMALITIES<br />
          <span style={{ color: '#00b4ff' }}>THREATENING YOUR SYSTEM</span>
        </h2>
        <p style={{
          maxWidth: '580px', margin: '0 auto',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(14px, 1.6vw, 16px)',
          color: '#7ba6c4', lineHeight: 1.7,
        }}>
          Each abnormality leaves a unique signature on the electrical waveform.
          CVHTE monitoring detects these patterns in real time before they escalate to failures.
        </p>
      </div>

      <div ref={pinRef} style={{ width: '100%', position: 'relative' }}>
        {/* Tab selector */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center',
          marginBottom: '40px',
        }}>
        {WAVEFORM_TYPES.map((wt, i) => {
          const isSel = selected === i;
          return (
            <button
              key={wt.id}
              onClick={() => setSelected(i)}
              style={{
                background:   isSel ? `${wt.color}18` : 'transparent',
                border:       `1px solid ${isSel ? wt.color : 'rgba(0,180,255,0.15)'}`,
                color:        isSel ? wt.color : '#7ba6c4',
                padding:      '8px 20px',
                fontFamily:   'Orbitron, sans-serif',
                fontSize:     '11px',
                fontWeight:   600,
                letterSpacing:'1.5px',
                cursor:       'pointer',
                transition:   'all 0.25s ease',
                boxShadow:    isSel ? `0 0 14px ${wt.color}30` : 'none',
              }}
            >
              {wt.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Waveform display + info */}
      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr]" style={{
        gap: '24px',
        maxWidth: '1200px', margin: '0 auto',
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>

        {/* Canvas display */}
        <div style={{
          background: '#051a2e',
          border: `1px solid ${active.color}30`,
          boxShadow: `0 0 30px ${active.color}12`,
          padding: '24px',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}>
          {/* Canvas label */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: active.color,
                boxShadow: `0 0 8px ${active.color}`,
                animation: 'electricPulse 1.5s ease-in-out infinite',
              }} />
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', color: active.color, letterSpacing: '1.5px' }}>
                {active.label.toUpperCase()}
              </span>
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#4a6a84' }}>
              50Hz AC / Real-time simulation
            </span>
          </div>

          {/* The canvas */}
          <div style={{ height: '220px', position: 'relative' }}>
            <WaveformCanvas
              key={active.id}
              typeId={active.id}
              color={active.color}
              draw={active.draw}
            />
          </div>

          {/* Risk meter */}
          <div style={{ marginTop: '20px' }}>
            <RiskMeter key={active.id} risk={active.risk} color={active.color} />
          </div>
        </div>

        {/* Info panel */}
        <div style={{
          background: '#051a2e',
          border: '1px solid rgba(0,180,255,0.1)',
          padding: '32px',
          display: 'flex', flexDirection: 'column', gap: '24px',
        }}>
          <div>
            <div style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '11px',
              color: '#4a6a84', letterSpacing: '2px', marginBottom: '10px',
            }}>
              WHAT IS IT?
            </div>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '15px', color: '#a0bfd6', lineHeight: 1.7,
            }}>
              {active.description}
            </p>
          </div>

          {/* CVHTE parameter that catches this */}
          <div style={{ borderTop: '1px solid rgba(0,180,255,0.08)', paddingTop: '24px' }}>
            <div style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '11px',
              color: '#4a6a84', letterSpacing: '2px', marginBottom: '14px',
            }}>
              CVHTE DETECTION PARAMETER
            </div>
            {['C – Current', 'V – Voltage', 'H – Harmonics', 'T – Temperature', 'E – Earthing'].map((param, pi) => {
              const relevance =
                active.id === 'overcurrent'  ? [1, 0, 0, 1, 0] :
                active.id === 'harmonic'     ? [1, 1, 1, 1, 0] :
                active.id === 'imbalance'    ? [1, 1, 0, 1, 0] :
                active.id === 'leakage'      ? [1, 0, 0, 0, 1] :
                [1, 1, 1, 1, 1]; // normal — all monitored
              const isRelevant = relevance[pi] === 1;
              return (
                <div key={param} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px',
                  marginBottom: '6px',
                  background: isRelevant ? `${active.color}10` : 'transparent',
                  border: `1px solid ${isRelevant ? active.color + '30' : 'transparent'}`,
                  transition: 'all 0.3s',
                }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: isRelevant ? active.color : '#1a3a5a',
                    boxShadow: isRelevant ? `0 0 6px ${active.color}` : 'none',
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '13px',
                    color: isRelevant ? active.color : '#2a4a64',
                    fontWeight: isRelevant ? 600 : 400,
                  }}>
                    {param}
                  </span>
                  {isRelevant && (
                    <span style={{
                      marginLeft: 'auto',
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '9px',
                      color: active.color,
                      letterSpacing: '1px',
                    }}>
                      ACTIVE
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      {/* Connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, rgba(0,180,255,0.4), transparent)' }} />
      </div>
    </section>
  );
}
