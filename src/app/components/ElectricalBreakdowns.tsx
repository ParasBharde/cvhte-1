import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, TrendingDown, Zap, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
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
  { icon: Zap,           value: 6,    unit: 'hrs', label: 'Avg Downtime Per Month', color: '#0082b4', desc: 'Average unplanned downtime caused by electrical breakdown events in a month' },
  { icon: Activity,      value: 80,   unit: '%',   label: 'Reduction Achievable',      color: '#b9a15c', desc: 'Breakdown reduction achievable through CVHET implementation and coordination' },
];

const BREAKDOWN_TYPES = [
  { label: 'Current (Overload/Shorts)',  pct: 30, color: '#0082b4' },
  { label: 'Voltage (Surges/Sags)',      pct: 25, color: '#4dd8ff' },
  { label: 'Harmonics (Distortion)',     pct: 20, color: '#ff9f0a' },
  { label: 'Earthing (Leakage/Ground)',  pct: 15, color: '#b9a15c' },
  { label: 'Temperature (Overheating)',  pct: 10, color: '#ff6b6b' },
];

export function ElectricalBreakdowns() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pieRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
      <g>
        <text x={cx} y={cy - 8} dy={8} textAnchor="middle" fill="#e8f4fd" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '32px', fontWeight: 800 }}>
          {value}%
        </text>
        <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill={fill} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {payload.label.substring(0, 15)}{payload.label.length > 15 ? '...' : ''}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ filter: `drop-shadow(0 0 12px ${fill}80)` }}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 14}
          fill={fill}
        />
      </g>
    );
  };

  useEffect(() => {
    if (!isDesktop()) {
      setInView(true);
      setScrollProgress(1);
      return;
    }
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      onEnter: () => setInView(true),
    });
    
    const pieSt = ScrollTrigger.create({
      trigger: '#breakdown-distribution',
      start: 'top 15%',
      end: '+=200px',
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => setScrollProgress(self.progress),
    });

    return () => {
      st.kill();
      pieSt.kill();
    };
  }, []);

  return (
    <section
      id="breakdowns"
      ref={ref}
      className="circuit-grid"
      style={{
        background: '#020c1b',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 100px) 0 clamp(24px, 6vw, 100px)',
        position: 'relative',
      }}
    >
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
          that can be detected, analysed, and prevented using the CVHET monitoring framework.
        </p>
      </div>

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
                border: '1px solid rgba(0, 130, 180,0.12)',
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
              <div style={{
                height: '2px',
                background: `linear-gradient(90deg, ${stat.color}, transparent)`,
                marginTop: '24px',
                width: scrollProgress > 0.05 ? '100%' : '0%',
                transition: 'width 1.2s ease',
                transitionDelay: `${i * 150}ms`,
              }} />
            </div>
          );
        })}
      </div>

      <div id="breakdown-distribution" style={{
        background: '#051a2e',
        border: '1px solid rgba(0, 130, 180,0.1)',
        padding: 'clamp(20px, 5vw, 48px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
          <div style={{ width: '3px', height: '24px', background: '#0082b4', boxShadow: '0 0 10px #0082b4' }} />
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

        <div id="breakdown-distribution-content" ref={pieRef} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'clamp(20px, 5vw, 40px)', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '380px', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  data={BREAKDOWN_TYPES}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={4}
                  startAngle={90}
                  endAngle={90 - Math.max(0.001, scrollProgress * 360)}
                  dataKey="pct"
                  stroke="none"
                  isAnimationActive={false}
                  cornerRadius={6}
                >
                  {BREAKDOWN_TYPES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} 
                      style={{ 
                        filter: activeIndex === index ? 'none' : `drop-shadow(0 0 4px ${entry.color}40)`,
                        opacity: activeIndex === index ? 1 : 0.6,
                        transition: 'all 0.3s'
                      }} 
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minWidth: '280px' }}>
            {BREAKDOWN_TYPES.map((item, i) => {
              const isActive = activeIndex === i;
              const isVisible = scrollProgress > (i * 0.12 + 0.1);
              return (
              <div 
                key={item.label} 
                onMouseEnter={() => setActiveIndex(i)}
                style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px',
                background: isActive ? `${item.color}25` : `${item.color}08`,
                border: `1px solid ${isActive ? item.color : item.color + '20'}`,
                boxShadow: isActive ? `0 0 20px ${item.color}30` : 'none',
                borderRadius: '4px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? (isActive ? 'translateX(-8px) scale(1.02)' : 'translateX(0) scale(1)') : 'translateY(20px)',
                transition: `all 0.3s cubic-bezier(0.23,1,0.32,1)`,
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: isActive ? '14px' : '10px', 
                    height: isActive ? '14px' : '10px', 
                    borderRadius: '50%', 
                    background: item.color, 
                    boxShadow: isActive ? `0 0 12px ${item.color}` : 'none',
                    transition: 'all 0.3s'
                  }} />
                  <span style={{ 
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', 
                    color: isActive ? '#e8f4fd' : '#8aaec9',
                    transition: 'color 0.3s'
                  }}>
                    {item.label}
                  </span>
                </div>
                <span style={{ 
                  fontFamily: 'Orbitron, sans-serif', fontSize: '15px', color: item.color, fontWeight: isActive ? 800 : 600,
                  transition: 'all 0.3s'
                }}>
                  {isVisible ? item.pct : 0}%
                </span>
              </div>
            )})}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '0', marginTop: '30px', paddingBottom: '0',
      }}>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(0,180,255,0.4), transparent)' }} />
      </div>
    </section>
  );
}
