import { useEffect, useRef, useState } from 'react';
import { ShieldOff, Clock, Radio, Layers } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isDesktop = () => window.innerWidth >= 768;

function CrackedShield({ color }: { color: string }) {
  return (
    <svg width="56" height="60" viewBox="0 0 56 60" fill="none">
      <path
        d="M28 3 L50 13 L50 35 Q50 52 28 57 Q6 52 6 35 L6 13 Z"
        fill={`${color}08`}
        stroke={color}
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path d="M28 15 L24 25 L30 28 L26 40" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M35 20 L32 28" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M22 30 L18 36" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

const WEAKNESSES = [
  {
    icon: ShieldOff,
    title: 'No Selective Coordination',
    subtitle: 'Single-zone protection failure',
    color: '#ff3355',
    description:
      'Without protection discrimination analysis, a downstream fault trips the entire feeder or bus — amplifying the impact of a localised fault into a facility-wide shutdown.',
    impact: 'Entire system shuts down on minor fault',
    metric: '10×',
    metricLabel: 'Wider outage than necessary',
    problems: [
      'No time-grading between device levels',
      'Missing selectivity study',
      'Breaker cascade failures',
    ],
  },
  {
    icon: Clock,
    title: 'Manual Detection Delays',
    subtitle: 'Slow fault response cycle',
    color: '#ff9f0a',
    description:
      'Reliance on operator rounds for fault detection means abnormalities go undetected for hours or days. By the time a fault is identified, secondary damage has already occurred.',
    impact: 'Average 4–6 hrs delay before detection',
    metric: '4hrs',
    metricLabel: 'Average fault-to-detection gap',
    problems: [
      'No real-time alarms',
      'Periodic manual inspection only',
      'Secondary damage during delay',
    ],
  },
  {
    icon: Radio,
    title: 'Missing Real-Time Monitoring',
    subtitle: 'Invisible parameter deviations',
    color: '#a855f7',
    description:
      'Without continuous CVHET monitoring, sub-threshold degradation in current, voltage, harmonics, temperature, and earthing resistance goes undetected until equipment fails catastrophically.',
    impact: 'Faults develop over weeks undetected',
    metric: '80%',
    metricLabel: 'Of faults give pre-failure signals',
    problems: [
      'No harmonic spectrum recording',
      'No temperature trending',
      'Earthing resistance untested',
    ],
  },
  {
    icon: Layers,
    title: 'Single-Level Protection Only',
    subtitle: 'Flat protection hierarchy',
    color: '#0082b4',
    description:
      'Systems with only main breaker protection have no redundancy. A single relay failure or misoperation results in unprotected operation, risking catastrophic equipment damage and fire.',
    impact: 'Zero redundancy on protection failure',
    metric: '0×',
    metricLabel: 'Backup protection layers',
    problems: [
      'No backup relay scheme',
      'Missing end-to-end protection',
      'No zone interlocking',
    ],
  },
];

export function ProtectionWeaknesses() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (!isDesktop()) {
      setInView(true);
      return;
    }
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      onEnter: () => setInView(true),
    });
    return () => st.kill();
  }, []);

  return (
    <section
      id="weaknesses"
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, #020c1b 0%, #050d1a 100%)',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 100px)',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,51,85,0.02) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', marginBottom: '70px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,51,85,0.08)', border: '1px solid rgba(255,51,85,0.2)',
          padding: '5px 14px', marginBottom: '20px',
        }}>
          <ShieldOff size={12} color="#ff3355" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#ff3355', letterSpacing: '2px' }}>PROTECTION VULNERABILITY ASSESSMENT</span>
        </div>
        <h2 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(24px, 4vw, 42px)',
          fontWeight: 800,
          color: '#e8f4fd',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          WEAKNESSES IN CURRENT<br />
          <span style={{ color: '#ff3355' }}>PROTECTION SYSTEMS</span>
        </h2>
        <p style={{
          maxWidth: '580px', margin: '0 auto',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(14px, 1.6vw, 16px)',
          color: '#7ba6c4', lineHeight: 1.7,
        }}>
          Most industrial electrical systems operate with critical gaps in their protection infrastructure —
          gaps that remain hidden until the next major failure exposes them.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        maxWidth: '1200px', margin: '0 auto',
      }}>
        {WEAKNESSES.map((w, i) => {
          const Icon = w.icon;
          const isHov = hovered === i;
          return (
            <div
              key={w.title}
              className="card-electric"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHov ? '#0a1a2e' : '#051a2e',
                border: `1px solid ${isHov ? w.color + '50' : 'rgba(255,51,85,0.1)'}`,
                padding: '32px 28px',
                transition: 'all 0.4s ease',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${i * 120}ms`,
                boxShadow: isHov ? `0 0 40px ${w.color}18` : 'none',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: '16px', right: '16px', opacity: isHov ? 0.4 : 0.15,
                transition: 'opacity 0.4s',
              }}>
                <CrackedShield color={w.color} />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{
                  width: '48px', height: '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${w.color}30`,
                  background: `${w.color}10`,
                  boxShadow: isHov ? `0 0 16px ${w.color}40` : 'none',
                  transition: 'box-shadow 0.4s',
                }}>
                  <Icon size={22} color={w.color} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: 'clamp(22px, 3vw, 28px)',
                    fontWeight: 800,
                    color: w.color,
                    textShadow: `0 0 16px ${w.color}60`,
                    lineHeight: 1,
                  }}>
                    {w.metric}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#4a6a84', marginTop: '4px', maxWidth: '120px', textAlign: 'right' }}>
                    {w.metricLabel}
                  </div>
                </div>
              </div>

              <h3 style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 'clamp(13px, 1.5vw, 15px)',
                fontWeight: 700, color: '#e8f4fd',
                letterSpacing: '0.5px', marginBottom: '6px',
                lineHeight: 1.4,
              }}>
                {w.title}
              </h3>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '12px', color: w.color, opacity: 0.7,
                letterSpacing: '0.5px', marginBottom: '14px',
              }}>
                {w.subtitle}
              </p>

              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '13px', color: '#7ba6c4', lineHeight: 1.65,
                marginBottom: '20px',
              }}>
                {w.description}
              </p>

              <div style={{
                background: `${w.color}10`,
                border: `1px solid ${w.color}25`,
                padding: '8px 12px',
                marginBottom: '20px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '12px', color: w.color,
              }}>
                ⚡ {w.impact}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {w.problems.map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', background: w.color, flexShrink: 0, opacity: 0.7 }} />
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#4a6a84' }}>{p}</span>
                  </div>
                ))}
              </div>

              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
                background: `linear-gradient(90deg, ${w.color}, transparent)`,
                opacity: isHov ? 1 : 0.3,
                transition: 'opacity 0.4s',
              }} />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, rgba(0, 130, 180,0.4), transparent)' }} />
      </div>
    </section>
  );
}
