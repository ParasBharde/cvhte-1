import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, TrendingDown, Zap, Activity } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isDesktop = () => window.innerWidth >= 768;

function AnimatedNumber({ target, duration = 1800, inView }: { target: number; duration?: number; inView: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const raf = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, target, duration]);
  return <>{val}</>;
}

const STATS = [
  { icon: AlertTriangle, value: 78,   unit: '%',  label: 'Preventable Failures',      color: '#ff9f0a', desc: 'Of all industrial electrical failures are preventable with proper monitoring' },
  { icon: TrendingDown,  value: 4200, unit: '₹Cr', label: 'Annual Industry Loss',      color: '#ff3355', desc: 'Economic losses annually across Indian industries due to electrical breakdowns' },
  { icon: Zap,           value: 6,    unit: 'hrs', label: 'Avg Downtime Per Incident', color: '#00b4ff', desc: 'Average unplanned downtime caused by a single electrical breakdown event' },
  { icon: Activity,      value: 40,   unit: '%',   label: 'Reduction Achievable',      color: '#00e98c', desc: 'Breakdown reduction achievable through CVHTE implementation and coordination' },
];

const BREAKDOWN_TYPES = [
  { label: 'Motor & Drive Failures',     pct: 35, color: '#ff3355' },
  { label: 'Transformer Breakdowns',     pct: 25, color: '#ff9f0a' },
  { label: 'Cable & Insulation Faults',  pct: 20, color: '#a855f7' },
  { label: 'Switchgear Failures',        pct: 15, color: '#00b4ff' },
  { label: 'Protection System Errors',   pct: 5,  color: '#00e98c' },
];

export function ElectricalBreakdowns() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);

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

  useEffect(() => {
    if (inView) { const t = setTimeout(() => setBarsVisible(true), 300); return () => clearTimeout(t); }
  }, [inView]);

  return (
    <section
      id="breakdowns"
      ref={ref}
      className="circuit-grid"
      style={{
        background: '#020c1b',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 100px)',
        position: 'relative',
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '70px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,51,85,0.08)', border: '1px solid rgba(255,51,85,0.2)',
          padding: '5px 14px', marginBottom: '20px',
        }}>
          <AlertTriangle size={12} color="#ff3355" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#ff3355', letterSpacing: '2px' }}>SYSTEM BREAKDOWN ANALYSIS</span>
        </div>
        <h2 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(24px, 4vw, 42px)',
          fontWeight: 800,
          color: '#e8f4fd',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          THE REAL COST OF<br />
          <span style={{ color: '#ff3355' }}>ELECTRICAL FAILURES</span>
        </h2>
        <p style={{
          maxWidth: '600px', margin: '0 auto',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(14px, 1.6vw, 16px)',
          color: '#7ba6c4', lineHeight: 1.7,
        }}>
          Industrial electrical breakdowns are not random events — they follow predictable patterns
          that can be detected, analysed, and prevented using the CVHTE monitoring framework.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '70px',
      }}>
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card-electric danger"
              style={{
                background: '#051a2e',
                border: '1px solid rgba(0,180,255,0.12)',
                padding: '32px 24px',
                transition: 'all 0.35s ease',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
                <div style={{
                  width: '40px', height: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${stat.color}30`,
                  background: `${stat.color}10`,
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={stat.color} />
                </div>
                <div>
                  <div style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: 'clamp(28px, 3.5vw, 38px)',
                    fontWeight: 800,
                    color: stat.color,
                    lineHeight: 1,
                    textShadow: `0 0 20px ${stat.color}60`,
                  }}>
                    <AnimatedNumber target={stat.value} inView={inView} />{stat.unit}
                  </div>
                  <div style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '11px',
                    color: '#7ba6c4',
                    letterSpacing: '1px',
                    marginTop: '6px',
                  }}>
                    {stat.label}
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#4a6a84', lineHeight: 1.6 }}>
                {stat.desc}
              </p>
              {/* Bottom accent line */}
              <div style={{
                height: '2px',
                background: `linear-gradient(90deg, ${stat.color}, transparent)`,
                marginTop: '24px',
                width: barsVisible ? '100%' : '0%',
                transition: 'width 1.2s ease',
                transitionDelay: `${i * 150 + 400}ms`,
              }} />
            </div>
          );
        })}
      </div>

      {/* Breakdown type distribution */}
      <div style={{
        background: '#051a2e',
        border: '1px solid rgba(0,180,255,0.1)',
        padding: '48px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
          <div style={{ width: '3px', height: '24px', background: '#00b4ff', boxShadow: '0 0 10px #00b4ff' }} />
          <h3 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: '#e8f4fd',
            letterSpacing: '2px',
          }}>
            BREAKDOWN DISTRIBUTION BY TYPE
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {BREAKDOWN_TYPES.map((item, i) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: '#a0bfd6' }}>
                  {item.label}
                </span>
                <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', color: item.color, fontWeight: 700 }}>
                  {item.pct}%
                </span>
              </div>
              {/* Track */}
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                {/* Fill */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                  boxShadow: `0 0 10px ${item.color}60`,
                  width: barsVisible ? `${item.pct}%` : '0%',
                  transition: `width 1.4s cubic-bezier(0.23,1,0.32,1)`,
                  transitionDelay: `${i * 150 + 200}ms`,
                }} />
                {/* Traveling pulse on bar */}
                {barsVisible && (
                  <div style={{
                    position: 'absolute', top: '-3px',
                    left: `${item.pct}%`,
                    width: '3px', height: '12px',
                    background: item.color,
                    boxShadow: `0 0 8px ${item.color}`,
                    transform: 'translateX(-50%)',
                    animation: 'electricPulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 200}ms`,
                  }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connector to next section */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '0', marginTop: '60px', paddingBottom: '0',
      }}>
        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, rgba(0,180,255,0.4), transparent)' }} />
      </div>
    </section>
  );
}
