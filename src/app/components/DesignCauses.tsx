import { useEffect, useRef, useState } from 'react';
import { Settings, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isDesktop = () => window.innerWidth >= 768;

const CAUSES = [
  {
    number: '01',
    title: 'Improper Relay Settings & Coordination',
    detail: 'Protective relays configured with incorrect current/time settings fail to discriminate between downstream faults, causing upstream breakers to trip and widening the outage zone unnecessarily.',
    severity: 95,
    severityLabel: 'CRITICAL',
    color: '#ff3355',
    tags: ['Relay Miscoordination', 'Nuisance Tripping', 'Wide Outage Zone'],
  },
  {
    number: '02',
    title: 'Undersized Conductors & Protection Devices',
    detail: 'Conductors and overcurrent protection devices selected without proper load flow analysis result in thermal overloading, accelerated insulation aging, and eventual cable failure under peak demand.',
    severity: 85,
    severityLabel: 'HIGH',
    color: '#ff9f0a',
    tags: ['Thermal Overload', 'Insulation Aging', 'Under-rating'],
  },
  {
    number: '03',
    title: 'Absence of Harmonic Filtering',
    detail: 'Variable-frequency drives, UPS systems, and switched-mode power supplies inject harmonic currents without adequate filtering, causing transformer overheating, neutral conductor overloading, and metering inaccuracies.',
    severity: 78,
    severityLabel: 'HIGH',
    color: '#ff9f0a',
    tags: ['THD Excess', 'Neutral Overload', 'Transformer Heating'],
  },
  {
    number: '04',
    title: 'Poor Earthing System Design',
    detail: 'Inadequate earthing resistance, improper electrode placement, or absence of equipotential bonding creates dangerous touch voltages, step potentials, and stray earth currents during fault conditions.',
    severity: 88,
    severityLabel: 'CRITICAL',
    color: '#ff3355',
    tags: ['High Earth Resistance', 'Touch Voltage', 'Stray Currents'],
  },
  {
    number: '05',
    title: 'Incorrect Protection Curve Selection',
    detail: 'Using standard inverse-time curves where extremely inverse or definite-time characteristics are required creates time-grading gaps, allowing faults to persist longer than necessary before isolation.',
    severity: 72,
    severityLabel: 'HIGH',
    color: '#ff9f0a',
    tags: ['Curve Mismatch', 'Grading Gap', 'Delayed Isolation'],
  },
  {
    number: '06',
    title: 'No Load Growth or Harmonic Load Analysis',
    detail: 'Systems designed without accounting for future load growth or harmonic-generating equipment additions become overloaded within years, negating the protection design intent from the outset.',
    severity: 65,
    severityLabel: 'MEDIUM',
    color: '#a855f7',
    tags: ['Load Growth', 'Capacity Gap', 'Design Shortfall'],
  },
];

export function DesignCauses() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    if (!isDesktop()) {
      setInView(true);
      return;
    }
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 10%',
      end: 'bottom 30%',
      scrub: true,
      onEnter: () => setInView(true),
      onUpdate: (self) => {
        const idx = Math.floor(self.progress * CAUSES.length);
        setActiveCard(Math.min(idx, CAUSES.length - 1));
      }
    });
    return () => st.kill();
  }, []);

  return (
    <section
      id="causes"
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, #020c1b 0%, #03101f 100%)',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 100px)',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', right: '40px', top: 0, bottom: 0, width: '1px',
        background: 'linear-gradient(to bottom, transparent, rgba(255,159,10,0.2) 30%, rgba(255,159,10,0.2) 70%, transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', marginBottom: '70px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)',
          padding: '5px 14px', marginBottom: '20px',
        }}>
          <Settings size={12} color="#a855f7" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#a855f7', letterSpacing: '2px' }}>ROOT CAUSE ANALYSIS</span>
        </div>
        <h2 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(24px, 4vw, 42px)',
          fontWeight: 800,
          color: '#e8f4fd',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          DESIGN CAUSES BEHIND<br />
          <span style={{ color: '#a855f7' }}>ELECTRICAL FAILURES</span>
        </h2>
        <p style={{
          maxWidth: '580px', margin: '0 auto',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(14px, 1.6vw, 16px)',
          color: '#7ba6c4', lineHeight: 1.7,
        }}>
          Most electrical breakdowns are not operational accidents — they are engineered in during the
          design phase through oversights that CVHET analysis systematically exposes.
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>

        <div style={{
          position: 'absolute', left: '32px', top: '20px', bottom: '20px', width: '2px',
          background: 'linear-gradient(to bottom, rgba(0,180,255,0.4), rgba(168,85,247,0.3))',
        }} className="hidden md:block" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {CAUSES.map((cause, i) => {
            const isActive = activeCard === i;
            const isInView = inView;
            return (
              <div
                key={cause.number}
                onClick={() => setActiveCard(activeCard === i ? null : i)}
                className="flex flex-col md:flex-row gap-6 items-start"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'translateX(0)' : 'translateX(-40px)',
                  transition: `all 0.5s ease ${i * 100}ms`,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  flexShrink: 0,
                  width: '64px', height: '64px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${isActive ? cause.color : 'rgba(0,180,255,0.2)'}`,
                  background: isActive ? `${cause.color}10` : '#020c1b',
                  boxShadow: isActive ? `0 0 20px ${cause.color}30` : 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative', zIndex: 1,
                }}>
                  <span style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '18px', fontWeight: 800,
                    color: isActive ? cause.color : '#4a6a84',
                    transition: 'color 0.3s',
                  }}>
                    {cause.number}
                  </span>
                </div>

                <div style={{
                  flex: 1,
                  background: isActive ? '#0a2540' : '#051a2e',
                  border: `1px solid ${isActive ? cause.color + '40' : 'rgba(0,180,255,0.1)'}`,
                  padding: '20px 24px',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 0 24px ${cause.color}15` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: isActive ? '16px' : '0' }}>
                    <h3 style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: 'clamp(13px, 1.5vw, 15px)',
                      fontWeight: 700,
                      color: '#e8f4fd',
                      letterSpacing: '0.5px',
                      lineHeight: 1.4,
                    }}>
                      {cause.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                      <span style={{
                        fontFamily: 'Orbitron, sans-serif', fontSize: '9px',
                        padding: '3px 8px',
                        background: `${cause.color}15`,
                        border: `1px solid ${cause.color}40`,
                        color: cause.color,
                        letterSpacing: '1px',
                      }}>
                        {cause.severityLabel}
                      </span>
                      <AlertTriangle size={14} color={cause.color} style={{ opacity: 0.6 }} />
                    </div>
                  </div>

                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.04)', marginBottom: isActive ? '16px' : '0', marginTop: '12px' }}>
                    <div style={{
                      height: '100%',
                      width: inView ? `${cause.severity}%` : '0%',
                      background: `linear-gradient(90deg, ${cause.color}60, ${cause.color})`,
                      boxShadow: `0 0 8px ${cause.color}60`,
                      transition: `width 1.2s ease ${i * 120}ms`,
                    }} />
                  </div>

                  <div style={{
                    overflow: 'hidden',
                    maxHeight: isActive ? '200px' : '0',
                    transition: 'max-height 0.4s ease',
                  }}>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '14px', color: '#7ba6c4', lineHeight: 1.7,
                      marginBottom: '14px', paddingTop: '4px',
                    }}>
                      {cause.detail}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {cause.tags.map(tag => (
                        <span key={tag} style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '11px', color: cause.color,
                          background: `${cause.color}10`,
                          border: `1px solid ${cause.color}30`,
                          padding: '3px 10px',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, rgba(168,85,247,0.4), transparent)' }} />
      </div>
    </section>
  );
}