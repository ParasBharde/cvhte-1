import { useEffect, useRef, useState } from 'react';
import { Shield, Clock, Zap, Flame, BarChart2, Wrench } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isDesktop = () => window.innerWidth >= 768;

const BENEFITS = [
  {
    icon: Shield,
    title: 'Selective Fault Isolation',
    desc: 'Only the faulted circuit is de-energised. Adjacent feeders and healthy equipment continue operating without interruption — minimising production impact.',
    metric: '95%',
    metricLabel: 'Fault containment rate',
    color: '#00b4ff',
  },
  {
    icon: Clock,
    title: '60% Faster Fault Detection',
    desc: 'Real-time CVHTE parameter monitoring detects pre-fault conditions and triggers alarms before the fault develops — cutting mean-time-to-repair significantly.',
    metric: '60%',
    metricLabel: 'Reduction in MTTR',
    color: '#4dd8ff',
  },
  {
    icon: Zap,
    title: 'Equipment Life Extension',
    desc: 'Eliminating overcurrent, harmonics, and thermal stress through coordinated protection extends transformer, motor, and cable service life by 2–3×.',
    metric: '3×',
    metricLabel: 'Equipment lifespan gain',
    color: '#00e98c',
  },
  {
    icon: Flame,
    title: 'Reduced Electrical Fire Risk',
    desc: 'Accurate earth fault detection, thermal monitoring, and coordinated overcurrent protection remove the primary ignition pathways for electrical fires.',
    metric: '70%',
    metricLabel: 'Fire risk reduction',
    color: '#ff9f0a',
  },
  {
    icon: BarChart2,
    title: 'Improved Power Quality',
    desc: 'Harmonic analysis and reactive power monitoring enable targeted filter installation and power factor correction — reducing energy waste and utility penalties.',
    metric: '₹Cr',
    metricLabel: 'Annual savings potential',
    color: '#a855f7',
  },
  {
    icon: Wrench,
    title: 'Reduced Maintenance Costs',
    desc: 'Condition-based maintenance informed by CVHTE data replaces costly time-based schedules — directing resources only where and when they are needed.',
    metric: '45%',
    metricLabel: 'Maintenance cost reduction',
    color: '#fb923c',
  },
];

// Simple animated shield with radial glow
function ShieldGlow({ color }: { color: string }) {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id={`sg_${color}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#sg_${color})`} />
      <path
        d="M50 8 L84 22 L84 52 Q84 78 50 90 Q16 78 16 52 L16 22 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
      />
      <path
        d="M50 16 L76 27 L76 51 Q76 72 50 82 Q24 72 24 51 L24 27 Z"
        fill={`${color}08`}
        stroke={color}
        strokeWidth="0.8"
        opacity="0.4"
      />
      {/* Lightning bolt */}
      <path d="M54 24 L46 42 L52 42 L44 58 L58 40 L52 40 Z" fill={color} opacity="0.7" />
    </svg>
  );
}

export function ProtectionCoordination() {
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
      id="coordination"
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, #020c1b 0%, #051a2e 60%, #020c1b 100%)',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 100px)',
        position: 'relative',
      }}
    >
      {/* Radial glow background */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(0,180,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '70px', position: 'relative' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.2)',
          padding: '5px 14px', marginBottom: '20px',
        }}>
          <Shield size={12} color="#00b4ff" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#00b4ff', letterSpacing: '2px' }}>SYSTEM IMPROVEMENT OUTCOMES</span>
        </div>
        <h2 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(24px, 4vw, 42px)',
          fontWeight: 800,
          color: '#e8f4fd',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          PROTECTION COORDINATION<br />
          <span style={{ color: '#00b4ff' }}>BENEFITS</span>
        </h2>
        <p style={{
          maxWidth: '580px', margin: '0 auto',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(14px, 1.6vw, 16px)',
          color: '#7ba6c4', lineHeight: 1.7,
        }}>
          When CVHTE data informs a proper protection coordination study, every layer of the
          electrical system improves simultaneously — from safety to economics.
        </p>
      </div>

      {/* Central shield visual */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        marginBottom: '56px',
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}>
        <div style={{ position: 'relative', animation: 'electricPulse 3s ease-in-out infinite' }}>
          <ShieldGlow color="#00b4ff" />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            paddingTop: '8px',
          }}>
            <div style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '11px', fontWeight: 700,
              color: '#00b4ff', letterSpacing: '1px', textAlign: 'center',
            }}>
              CVHTE<br />
              <span style={{ fontSize: '9px', color: '#4dd8ff' }}>PROTECTED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1100px', margin: '0 auto',
      }}>
        {BENEFITS.map((b, i) => {
          const Icon = b.icon;
          const isHov = hovered === i;
          return (
            <div
              key={b.title}
              className="card-electric"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHov ? '#0a2540' : '#051a2e',
                border: `1px solid ${isHov ? b.color + '50' : 'rgba(0,180,255,0.1)'}`,
                padding: '28px',
                display: 'flex', gap: '20px', alignItems: 'flex-start',
                transition: 'all 0.35s ease',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 100}ms`,
                boxShadow: isHov ? `0 0 28px ${b.color}15` : 'none',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Icon */}
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${b.color}30`,
                  background: `${b.color}10`,
                  boxShadow: isHov ? `0 0 14px ${b.color}40` : 'none',
                  transition: 'box-shadow 0.3s',
                }}>
                  <Icon size={20} color={b.color} />
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <h3 style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: 'clamp(12px, 1.4vw, 14px)',
                    fontWeight: 700, color: '#e8f4fd',
                    letterSpacing: '0.5px', lineHeight: 1.4,
                  }}>
                    {b.title}
                  </h3>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: 'clamp(18px, 2.2vw, 22px)',
                      fontWeight: 800,
                      color: b.color,
                      textShadow: `0 0 14px ${b.color}60`,
                      lineHeight: 1,
                    }}>
                      {b.metric}
                    </div>
                    <div style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '10px', color: '#4a6a84',
                      maxWidth: '80px', textAlign: 'right',
                    }}>
                      {b.metricLabel}
                    </div>
                  </div>
                </div>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px', color: '#7ba6c4', lineHeight: 1.6,
                }}>
                  {b.desc}
                </p>
              </div>

              {/* Left accent bar */}
              <div style={{
                position: 'absolute', left: 0, top: '15%', bottom: '15%', width: '2px',
                background: `linear-gradient(to bottom, transparent, ${b.color}, transparent)`,
                opacity: isHov ? 1 : 0,
                transition: 'opacity 0.3s',
                boxShadow: `0 0 8px ${b.color}`,
              }} />
            </div>
          );
        })}
      </div>

      {/* Connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, rgba(0,180,255,0.4), transparent)' }} />
      </div>
    </section>
  );
}
