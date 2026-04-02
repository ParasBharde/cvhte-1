import { useEffect, useRef, useState } from 'react';
import { Cpu } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isDesktop = () => window.innerWidth >= 768;

const CVHTE_STEPS = [
  {
    letter: 'C',
    parameter: 'Current',
    color: '#00b4ff',
    measurements: ['RMS current measurement per phase', 'Overcurrent detection (50/51)', 'Earth fault current monitoring (50N/51N)', 'Load unbalance quantification', 'CT ratio verification'],
    tools: 'Clamp meters, power analysers, current transformers',
    insight: 'Identifies overloading, phase asymmetry, and fault current magnitudes that dictate relay pickup settings.',
  },
  {
    letter: 'V',
    parameter: 'Voltage',
    color: '#4dd8ff',
    measurements: ['Phase-to-phase and phase-to-neutral voltage', 'Voltage unbalance percentage', 'Sag / swell event logging', 'Under / over voltage relay (27/59) settings', 'Power factor measurement'],
    tools: 'Power quality analysers, voltage transformers, smart meters',
    insight: 'Determines voltage stress on insulation and equipment, enabling accurate 27/59 relay coordination.',
  },
  {
    letter: 'H',
    parameter: 'Harmonics',
    color: '#ff9f0a',
    measurements: ['Total Harmonic Distortion (THD) — current & voltage', '3rd, 5th, 7th, 11th, 13th harmonic mapping', 'Harmonic spectrum analysis per feeder', 'Neutral current THD measurement', 'Power factor distortion (DPF vs TPF)'],
    tools: 'FFT-based power quality analysers, harmonic analysers',
    insight: 'Identifies harmonic injection sources and quantifies their impact on transformers, neutral conductors, and protective relays.',
  },
  {
    letter: 'T',
    parameter: 'Temperature',
    color: '#ff6b6b',
    measurements: ['Infrared thermal imaging of switchgear', 'Cable termination and joint temperature', 'Transformer winding temperature tracking', 'Motor bearing and stator thermal monitoring', 'Bus bar and connection hot spot detection'],
    tools: 'FLIR thermal cameras, PT100 sensors, thermocouple loggers',
    insight: 'Exposes thermal anomalies indicating loose connections, overloaded conductors, or impending insulation failure.',
  },
  {
    letter: 'E',
    parameter: 'Earthing',
    color: '#00e98c',
    measurements: ['Earth electrode resistance (target <1Ω)', 'Step and touch potential measurement', 'Equipotential bonding continuity', 'Earth fault loop impedance', 'Neutral-to-earth voltage (stray voltage)'],
    tools: 'Fall-of-potential method, earth testers, loop impedance testers',
    insight: 'Validates the earthing system integrity — the last line of defence against electric shock and equipment damage during fault conditions.',
  },
];

// Animated path connector between steps
function StepConnector({ color1, color2, active }: { color1: string; color2: string; active: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '100%', height: '32px', position: 'relative',
    }}>
      <svg width="80%" height="32" viewBox="0 0 300 32" fill="none">
        <path
          d="M 0 16 L 300 16"
          stroke={`url(#connGrad_${color1})`}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity={active ? 0.6 : 0.15}
          style={{ transition: 'opacity 0.5s' }}
        />
        <defs>
          <linearGradient id={`connGrad_${color1}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        {active && (
          <circle r="4" fill={color2} opacity="0.9">
            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 16 L 300 16" />
          </circle>
        )}
      </svg>
    </div>
  );
}

export function DiagnosticApproach() {
  const ref = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [cycleMode, setCycleMode] = useState(true);

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
        const idx = Math.floor(self.progress * CVHTE_STEPS.length);
        setActiveStep(Math.min(idx, CVHTE_STEPS.length - 1));
      }
    });
    return () => st.kill();
  }, []);

  // Cycle mode is now disabled permanently since scroll dictates the active step.
  // We keep the state signature intact if it's used elsewhere, but just mock the effect.

  const step = CVHTE_STEPS[activeStep];

  return (
    <section
      id="diagnostic"
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, #020c1b 0%, #031525 100%)',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 100px)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '70px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,233,140,0.08)', border: '1px solid rgba(0,233,140,0.2)',
          padding: '5px 14px', marginBottom: '20px',
        }}>
          <Cpu size={12} color="#00e98c" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#00e98c', letterSpacing: '2px' }}>ANALYTICAL METHODOLOGY</span>
        </div>
        <h2 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(24px, 4vw, 42px)',
          fontWeight: 800,
          color: '#e8f4fd',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          CVHTE DIAGNOSTIC<br />
          <span style={{ color: '#00e98c' }}>& ANALYTICAL APPROACH</span>
        </h2>
        <p style={{
          maxWidth: '580px', margin: '0 auto',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(14px, 1.6vw, 16px)',
          color: '#7ba6c4', lineHeight: 1.7,
        }}>
          A systematic five-parameter diagnostic framework that investigates every electrical
          parameter to build a complete picture of system health — from conductors to earth.
        </p>
      </div>

      <div ref={pinRef} style={{ width: '100%', position: 'relative' }}>
        {/* CVHTE Step Navigator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexWrap: 'wrap', gap: '0',
        marginBottom: '48px',
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        {CVHTE_STEPS.map((s, i) => {
          const isActive = activeStep === i;
          const isPast   = i < activeStep;
          return (
            <div key={s.letter} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Step node */}
              <button
                onClick={() => { setActiveStep(i); setCycleMode(false); }}
                style={{
                  width: 'clamp(52px, 6vw, 64px)',
                  height: 'clamp(52px, 6vw, 64px)',
                  borderRadius: '50%',
                  border: `2px solid ${isActive ? s.color : isPast ? s.color + '50' : 'rgba(0,180,255,0.15)'}`,
                  background: isActive ? `${s.color}18` : isPast ? `${s.color}06` : '#020c1b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: isActive ? `0 0 24px ${s.color}50, 0 0 6px ${s.color}` : 'none',
                  transition: 'all 0.4s ease',
                  flexShrink: 0,
                }}
              >
                <span style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 'clamp(18px, 2.5vw, 24px)',
                  fontWeight: 800,
                  color: isActive ? s.color : isPast ? s.color + '80' : '#4a6a84',
                  transition: 'color 0.4s',
                }}>
                  {s.letter}
                </span>
              </button>

              {/* Connector to next step */}
              {i < CVHTE_STEPS.length - 1 && (
                <div style={{
                  width: 'clamp(24px, 4vw, 60px)',
                  height: '2px',
                  background: i < activeStep
                    ? `linear-gradient(90deg, ${s.color}, ${CVHTE_STEPS[i + 1].color})`
                    : 'rgba(0,180,255,0.08)',
                  position: 'relative',
                  transition: 'background 0.4s',
                  overflow: 'visible',
                }}>
                  {i < activeStep && (
                    <div style={{
                      position: 'absolute', top: '-3px', right: 0,
                      width: '8px', height: '8px',
                      background: CVHTE_STEPS[i + 1].color,
                      borderRadius: '50%',
                      boxShadow: `0 0 8px ${CVHTE_STEPS[i + 1].color}`,
                      animation: 'electricPulse 1.5s ease-in-out infinite',
                    }} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step detail panel */}
      <div
        key={activeStep}
        style={{
          maxWidth: '1000px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)',
          gap: '24px',
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        {/* Left — parameter info */}
        <div style={{
          background: '#051a2e',
          border: `1px solid ${step.color}30`,
          padding: '36px',
          boxShadow: `0 0 40px ${step.color}15`,
        }}>
          {/* Letter large */}
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(64px, 8vw, 100px)',
            fontWeight: 900,
            color: step.color,
            lineHeight: 1,
            textShadow: `0 0 40px ${step.color}60`,
            marginBottom: '16px',
            animation: 'flickerIn 0.4s ease-out',
          }}>
            {step.letter}
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '20px', fontWeight: 700,
            color: '#e8f4fd', letterSpacing: '2px',
            marginBottom: '8px',
          }}>
            {step.parameter.toUpperCase()}
          </div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '14px', color: '#7ba6c4',
            lineHeight: 1.7, marginBottom: '24px',
          }}>
            {step.insight}
          </div>
          <div style={{
            background: `${step.color}08`,
            border: `1px solid ${step.color}20`,
            padding: '14px 16px',
          }}>
            <div style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '10px', color: step.color,
              letterSpacing: '2px', marginBottom: '8px',
            }}>
              INSTRUMENTS USED
            </div>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px', color: '#a0bfd6', lineHeight: 1.6,
            }}>
              {step.tools}
            </p>
          </div>
        </div>

        {/* Right — measurement list */}
        <div style={{
          background: '#051a2e',
          border: '1px solid rgba(0,180,255,0.1)',
          padding: '36px',
        }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '12px', color: '#4a6a84',
            letterSpacing: '2px', marginBottom: '24px',
          }}>
            MEASUREMENT POINTS & PARAMETERS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {step.measurements.map((m, mi) => (
              <div
                key={m}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '12px 16px',
                  background: '#020c1b',
                  border: `1px solid ${step.color}15`,
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateX(0)' : 'translateX(20px)',
                  transition: `all 0.4s ease ${mi * 80}ms`,
                }}
              >
                {/* Step number indicator */}
                <div style={{
                  flexShrink: 0,
                  width: '28px', height: '28px',
                  border: `1px solid ${step.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${step.color}08`,
                }}>
                  <span style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '11px', fontWeight: 700,
                    color: step.color,
                  }}>
                    {String(mi + 1).padStart(2, '0')}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px', color: '#a0bfd6', lineHeight: 1.5,
                }}>
                  {m}
                </span>
              </div>
            ))}
          </div>

          {/* Step indicator */}
          <div style={{
            marginTop: '24px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            {CVHTE_STEPS.map((_, si) => (
              <div
                key={si}
                style={{
                  flex: si === activeStep ? 3 : 1,
                  height: '3px',
                  background: si <= activeStep ? step.color : 'rgba(0,180,255,0.1)',
                  boxShadow: si === activeStep ? `0 0 8px ${step.color}` : 'none',
                  transition: 'all 0.4s ease',
                }}
              />
            ))}
            <span style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '11px', color: '#4a6a84', marginLeft: '4px',
              whiteSpace: 'nowrap',
            }}>
              {activeStep + 1} / {CVHTE_STEPS.length}
            </span>
          </div>
        </div>
      </div>
      </div>

      {/* Connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, rgba(0,233,140,0.4), transparent)' }} />
      </div>
    </section>
  );
}
