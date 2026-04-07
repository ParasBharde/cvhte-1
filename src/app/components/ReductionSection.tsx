import { useEffect, useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingDown, Award, Clock, Wrench } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const isDesktop = () => window.innerWidth >= 768;

const CHART_DATA = [
  { month: 'Jan', before: 24, after: 14 },
  { month: 'Feb', before: 19, after: 11 },
  { month: 'Mar', before: 22, after: 13 },
  { month: 'Apr', before: 28, after: 16 },
  { month: 'May', before: 31, after: 18 },
  { month: 'Jun', before: 25, after: 15 },
  { month: 'Jul', before: 27, after: 14 },
  { month: 'Aug', before: 23, after: 13 },
  { month: 'Sep', before: 20, after: 12 },
  { month: 'Oct', before: 26, after: 15 },
  { month: 'Nov', before: 22, after: 13 },
  { month: 'Dec', before: 18, after: 11 },
];

const METRICS = [
  { icon: TrendingDown, value: 80,  unit: '%',  label: 'Reduction in Breakdowns',     color: '#00e98c', desc: 'Year-on-year decline in unplanned electrical failure events' },
  { icon: Clock,        value: 55,  unit: '%',  label: 'Less Unplanned Downtime',      color: '#00b4ff', desc: 'Reduction in production hours lost to electrical failures' },
  { icon: Award,        value: 3,   unit: '×',  label: 'Equipment Lifespan Extended',  color: '#ff9f0a', desc: 'Average extension in service life of protected assets' },
  { icon: Wrench,       value: 45,  unit: '%',  label: 'Maintenance Cost Reduced',     color: '#a855f7', desc: 'Shift from reactive to condition-based maintenance strategy' },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0a2540',
      border: '1px solid rgba(0,180,255,0.25)',
      padding: '12px 16px',
      fontFamily: 'Space Grotesk, sans-serif',
    }}>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', color: '#00b4ff', marginBottom: '8px' }}>
        {label}
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '8px', height: '8px', background: p.fill, borderRadius: '50%' }} />
          <span style={{ fontSize: '13px', color: '#a0bfd6' }}>
            {p.dataKey === 'before' ? 'Pre-CVHET' : 'Post-CVHET'}:
          </span>
          <span style={{ fontSize: '13px', color: p.fill, fontWeight: 600 }}>
            {p.value} breakdowns
          </span>
        </div>
      ))}
      {payload.length === 2 && (
        <div style={{
          borderTop: '1px solid rgba(0,180,255,0.1)',
          marginTop: '8px', paddingTop: '8px',
          fontFamily: 'Orbitron, sans-serif', fontSize: '11px',
          color: '#00e98c',
        }}>
          ↓ {Math.round((1 - payload[1].value / payload[0].value) * 100)}% reduction
        </div>
      )}
    </div>
  );
}

export function ReductionSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLDivElement>(null);
  const [count,     setCount]     = useState(0);
  const [inView,    setInView]    = useState(false);
  const [chartData, setChartData] = useState(CHART_DATA.map(d => ({ ...d, after: 0 })));

  useEffect(() => {
    const triggerInView = () => {
      setInView(true);
      const obj = { value: 0 };
      gsap.to(obj, {
        value: 80,
        duration: 2.2,
        ease: 'power3.out',
        onUpdate: () => setCount(Math.round(obj.value)),
      });
      setTimeout(() => {
        setChartData(CHART_DATA);
      }, 600);
    };

    if (!isDesktop()) {
      triggerInView();
      return;
    }
    
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      onEnter: () => triggerInView(),
    });

    return () => st.kill();
  }, []);

  return (
    <section
      id="reduction"
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, #020c1b 0%, #031822 50%, #020c1b 100%)',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 100px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 'clamp(200px, 30vw, 360px)',
        fontWeight: 900,
        color: 'rgba(0,233,140,0.025)',
        userSelect: 'none', pointerEvents: 'none',
        letterSpacing: '-20px',
        whiteSpace: 'nowrap',
      }}>
        80%
      </div>

      <div style={{ textAlign: 'center', marginBottom: '70px', position: 'relative' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,233,140,0.08)', border: '1px solid rgba(0,233,140,0.2)',
          padding: '5px 14px', marginBottom: '20px',
        }}>
          <TrendingDown size={12} color="#00e98c" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#00e98c', letterSpacing: '2px' }}>MEASURED RESULTS</span>
        </div>
        <h2 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(24px, 4vw, 42px)',
          fontWeight: 800,
          color: '#e8f4fd',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          <span style={{ color: '#00e98c', textShadow: '0 0 30px rgba(0,233,140,0.6)' }}>80% REDUCTION</span><br />
          IN ELECTRICAL BREAKDOWNS
        </h2>
        <p style={{
          maxWidth: '580px', margin: '0 auto',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(14px, 1.6vw, 16px)',
          color: '#7ba6c4', lineHeight: 1.7,
        }}>
          Measured across facilities where CVHET monitoring and protection coordination
          were implemented — tracked over 12 months before and after deployment.
        </p>
      </div>

      <div
        ref={counterRef}
        style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '80px', 
          position: 'relative',
          padding: '20px 0',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{
            display: 'flex', 
            alignItems: 'baseline',
            justifyContent: 'center',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 900,
            color: '#00e98c',
            textShadow: '0 0 60px rgba(0,233,140,0.5)',
            lineHeight: 1,
            position: 'relative',
            zIndex: 2,
          }}>
            <span style={{ fontSize: 'clamp(70px, 14vw, 150px)', letterSpacing: '0px' }}>{count}</span>
            <span style={{ fontSize: 'clamp(35px, 7vw, 75px)', marginLeft: '6px', opacity: 0.9 }}>%</span>
          </div>
          
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(10px, 1.2vw, 13px)',
            color: '#7ba6c4', 
            letterSpacing: '5px',
            marginTop: '0px',
            opacity: 0.8,
            textTransform: 'uppercase',
          }}>
            Total Reduction
          </div>

          <svg
            style={{ 
              position: 'absolute', 
              top: '45%', 
              left: '50%', 
              transform: 'translate(-50%, -55%)', 
              pointerEvents: 'none',
              width: 'clamp(280px, 48vw, 440px)',
              height: 'auto',
              zIndex: 1,
            }}
            viewBox="0 0 300 200"
          >
            <path
              d="M 20 170 A 130 130 0 0 1 280 170"
              fill="none"
              stroke="rgba(0,180,255,0.06)"
              strokeWidth="2.5"
            />
            <path
              d="M 20 170 A 130 130 0 0 1 280 170"
              fill="none"
              stroke="#00e98c"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="408"
              strokeDashoffset={inView ? 408 - (408 * count / 100) : 408}
              style={{ 
                transition: 'stroke-dashoffset 2.4s cubic-bezier(0.34, 1.56, 0.64, 1)', 
                filter: 'drop-shadow(0 0 15px rgba(0,233,140,0.7))' 
              }}
            />
          </svg>
        </div>
      </div>

      <div style={{
        background: '#051a2e',
        border: '1px solid rgba(0,180,255,0.1)',
        padding: 'clamp(20px, 4vw, 40px)',
        marginBottom: '60px',
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.8s ease 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '3px', height: '24px', background: '#00e98c', boxShadow: '0 0 10px #00e98c' }} />
            <h3 style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 'clamp(13px, 1.8vw, 16px)',
              fontWeight: 700,
              color: '#e8f4fd',
              letterSpacing: '1.5px',
            }}>
              MONTHLY BREAKDOWN FREQUENCY — 12 MONTH COMPARISON
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#ff3355', opacity: 0.8 }} />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#7ba6c4' }}>Pre-CVHET</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#00e98c', opacity: 0.8 }} />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#7ba6c4' }}>Post-CVHET</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barGap={4} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(0,180,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, fill: '#4a6a84' }}
              axisLine={{ stroke: 'rgba(0,180,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fill: '#4a6a84' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Breakdowns',
                angle: -90,
                position: 'insideLeft',
                style: { fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fill: '#4a6a84' },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={24}
              stroke="rgba(255,51,85,0.2)"
              strokeDasharray="4 4"
              label={{ value: 'Avg Before', position: 'right', style: { fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fill: '#ff3355' } }}
            />
            <ReferenceLine
              y={14}
              stroke="rgba(0,233,140,0.2)"
              strokeDasharray="4 4"
              label={{ value: 'Avg After', position: 'right', style: { fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fill: '#00e98c' } }}
            />
            <Bar
              dataKey="before"
              fill="#ff3355"
              opacity={0.75}
              radius={[2, 2, 0, 0]}
              isAnimationActive={true}
              animationBegin={inView ? 200 : 9999}
              animationDuration={1200}
            />
            <Bar
              dataKey="after"
              fill="#00e98c"
              opacity={0.85}
              radius={[2, 2, 0, 0]}
              isAnimationActive={true}
              animationBegin={inView ? 500 : 9999}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
      }}>
        {METRICS.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="card-electric"
              style={{
                background: '#051a2e',
                border: '1px solid rgba(0,180,255,0.1)',
                padding: '28px 24px',
                transition: 'all 0.35s ease',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 100 + 400}ms`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${m.color}30`,
                  background: `${m.color}10`,
                }}>
                  <Icon size={16} color={m.color} />
                </div>
                <div style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 'clamp(24px, 3.5vw, 32px)',
                  fontWeight: 800,
                  color: m.color,
                  textShadow: `0 0 16px ${m.color}60`,
                  lineHeight: 1,
                }}>
                  {m.value}{m.unit}
                </div>
              </div>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '11px', color: '#7ba6c4',
                letterSpacing: '0.5px', marginBottom: '8px',
              }}>
                {m.label}
              </div>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#4a6a84', lineHeight: 1.6 }}>
                {m.desc}
              </p>
              <div style={{
                height: '2px',
                background: `linear-gradient(90deg, ${m.color}, transparent)`,
                marginTop: '20px',
                width: inView ? '100%' : '0%',
                transition: 'width 1.5s ease',
                transitionDelay: `${i * 150 + 700}ms`,
              }} />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, rgba(0,233,140,0.4), transparent)' }} />
      </div>
    </section>
  );
}