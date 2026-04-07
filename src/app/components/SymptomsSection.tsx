import { useEffect, useRef, useState } from 'react';
import { Thermometer, Zap, TrendingUp, Volume2, Cpu, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isDesktop = () => window.innerWidth >= 768;

const SYMPTOMS = [
  {
    icon: Zap,
    title: 'Frequent MCB / MCCB Tripping',
    severity: 'HIGH',
    color: '#ff3355',
    description:
      'Circuit breakers trip repeatedly without apparent cause — a clear sign of overcurrent, earth faults, or improper relay coordination within the distribution system.',
    indicators: ['Nuisance tripping', 'Random outages', 'Protective relay mismatch'],
  },
  {
    icon: Thermometer,
    title: 'Cable & Equipment Overheating',
    severity: 'CRITICAL',
    color: '#ff6b6b',
    description:
      'Thermal degradation of insulation, joints, and switchgear due to sustained overcurrent, poor connections, or harmonic heating — a direct fire risk.',
    indicators: ['Hot spots on cables', 'Discoloured insulation', 'Elevated panel temperature'],
  },
  {
    icon: TrendingUp,
    title: 'Voltage Fluctuations & Sags',
    severity: 'HIGH',
    color: '#ff9f0a',
    description:
      'Sudden voltage drops, surges, or instability that cause equipment malfunction, PLC resets, and variable-frequency drive faults across the facility.',
    indicators: ['Flickering lights', 'Equipment restarts', 'VFD fault codes'],
  },
  {
    icon: TrendingUp,
    title: 'Abnormal Power Consumption',
    severity: 'MEDIUM',
    color: '#a855f7',
    description:
      'Unexplained increase in energy bills caused by poor power factor, harmonic currents distorting the supply waveform, or undetected leakage paths.',
    indicators: ['Rising energy bills', 'Low power factor', 'Reactive power penalty'],
  },
  {
    icon: Cpu,
    title: 'Equipment Malfunction & Failure',
    severity: 'CRITICAL',
    color: '#ff3355',
    description:
      'Premature failure of motors, transformers, and sensitive electronics caused by harmonic distortion, voltage unbalance, and inadequate protection discrimination.',
    indicators: ['Burnt motor windings', 'Transformer noise', 'Control panel errors'],
  },
  {
    icon: Volume2,
    title: 'Electrical Noise & Interference',
    severity: 'MEDIUM',
    color: '#0082b4',
    description:
      'Harmonic distortion and poor earthing introducing electromagnetic interference that disrupts communication networks, PLC signals, and instrumentation accuracy.',
    indicators: ['Instrumentation drift', 'Communication errors', 'PLC signal noise'],
  },
];

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#ff3355',
  HIGH:     '#ff9f0a',
  MEDIUM:   '#a855f7',
};

export function SymptomsSection() {
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
      id="symptoms"
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, #020c1b 0%, #051a2e 50%, #020c1b 100%)',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 100px)',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', left: '40px', top: 0, bottom: 0, width: '1px',
        background: 'linear-gradient(to bottom, transparent, rgba(255,51,85,0.3) 30%, rgba(255,51,85,0.3) 70%, transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', marginBottom: '70px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.2)',
          padding: '5px 14px', marginBottom: '20px',
        }}>
          <AlertCircle size={12} color="#ff9f0a" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#ff9f0a', letterSpacing: '2px' }}>SYSTEM WARNING INDICATORS</span>
        </div>
        <h2 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(24px, 4vw, 42px)',
          fontWeight: 800,
          color: '#e8f4fd',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          SYMPTOMS OF ELECTRICAL<br />
          <span style={{ color: '#ff9f0a' }}>SYSTEM DISTRESS</span>
        </h2>
        <p style={{
          maxWidth: '580px', margin: '0 auto',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(14px, 1.6vw, 16px)',
          color: '#7ba6c4', lineHeight: 1.7,
        }}>
          These observable symptoms are your electrical system's distress signals — each one
          pointing to an underlying abnormality that CVHET monitoring can precisely identify.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px', margin: '0 auto',
      }}>
        {SYMPTOMS.map((symptom, i) => {
          const Icon = symptom.icon;
          const isHovered = hovered === i;
          return (
            <div
              key={symptom.title}
              className={`card-electric ${symptom.severity === 'CRITICAL' || symptom.severity === 'HIGH' ? 'danger' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHovered ? '#0a2540' : '#051a2e',
                border: `1px solid ${isHovered ? symptom.color + '60' : 'rgba(0, 130, 180,0.1)'}`,
                padding: '28px',
                cursor: 'default',
                transition: 'all 0.35s ease',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${i * 100}ms`,
                boxShadow: isHovered ? `0 0 30px ${symptom.color}20` : 'none',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {isHovered && (
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: '60px', height: '60px',
                  background: `radial-gradient(circle at top right, ${symptom.color}20, transparent)`,
                  pointerEvents: 'none',
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${symptom.color}30`,
                  background: `${symptom.color}10`,
                  flexShrink: 0,
                  boxShadow: isHovered ? `0 0 16px ${symptom.color}40` : 'none',
                  transition: 'box-shadow 0.3s',
                }}>
                  <Icon size={20} color={symptom.color} />
                </div>
                <span style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '9px',
                  padding: '3px 8px',
                  background: `${SEVERITY_COLORS[symptom.severity]}18`,
                  border: `1px solid ${SEVERITY_COLORS[symptom.severity]}40`,
                  color: SEVERITY_COLORS[symptom.severity],
                  letterSpacing: '1.5px',
                }}>
                  {symptom.severity}
                </span>
              </div>

              <h3 style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 'clamp(13px, 1.5vw, 15px)',
                fontWeight: 700,
                color: '#e8f4fd',
                letterSpacing: '0.5px',
                marginBottom: '12px',
                lineHeight: 1.4,
              }}>
                {symptom.title}
              </h3>

              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '13px',
                color: '#7ba6c4',
                lineHeight: 1.65,
                marginBottom: '20px',
              }}>
                {symptom.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {symptom.indicators.map(ind => (
                  <span key={ind} style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '11px',
                    color: '#4a6a84',
                    background: 'rgba(0, 130, 180,0.05)',
                    border: '1px solid rgba(0, 130, 180,0.1)',
                    padding: '3px 8px',
                  }}>
                    {ind}
                  </span>
                ))}
              </div>

              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
                background: `linear-gradient(90deg, ${symptom.color}80, transparent)`,
                opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s',
              }} />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, rgba(255,159,10,0.4), transparent)' }} />
      </div>
    </section>
  );
}
