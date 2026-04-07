import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Zap, Shield, Cpu, TrendingUp, Target, Eye, Globe, Users, Award, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const DATA_ANALYSIS = [
  { month: 'Jan', anomalies: 45, mitigated: 40 },
  { month: 'Feb', anomalies: 52, mitigated: 48 },
  { month: 'Mar', anomalies: 38, mitigated: 38 },
  { month: 'Apr', anomalies: 65, mitigated: 62 },
  { month: 'May', anomalies: 41, mitigated: 41 },
  { month: 'Jun', anomalies: 55, mitigated: 53 },
];

const MILESTONES = [
  { year: '2019', title: 'Project Inception', desc: 'Initial R&D phase targeting industrial electrical anomaly detection algorithms.' },
  { year: '2021', title: 'CVHET Framework Born', desc: 'First successful deployment of our 5-pillar diagnostic model in a live cement plant.' },
  { year: '2023', title: 'AI Integration', desc: 'Neural network implementation for instant, predictive anomaly categorization.' },
  { year: '2025', title: 'Global Scale', desc: 'Protecting over 150+ heavy industrial facilities, saving ₹400Cr+ in downtime.' },
];

function LocalSparkingCircuit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', resize);

    let rafId: number;
    let sparks: { x: number, y: number, vx: number, vy: number, life: number, maxLife: number, color: string }[] = [];

    const triggerSpark = () => {
      const startX = Math.random() * w;
      const startY = Math.random() * h;
      const colors = ['#0082b4', '#b9a15c', '#ffffff'];
      
      // Create a burst of sparks at a node
      for(let i=0; i< (Math.random() * 5 + 3); i++) {
        sparks.push({
          x: startX, y: startY,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 0, maxLife: Math.random() * 20 + 10,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      // Draw a short circuit flash
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      let lx = startX, ly = startY;
      for(let j=0; j<4; j++) {
        lx += (Math.random() - 0.5) * 100;
        ly += (Math.random() - 0.5) * 100;
        ctx.lineTo(lx, ly);
      }
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      ctx.fillStyle = 'rgba(2,12,27,0.15)'; // Fade effect
      ctx.fillRect(0, 0, w, h);

      if (Math.random() < 0.05) triggerSpark(); // 5% chance per frame

      // Draw active sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;

        ctx.globalAlpha = 1 - (s.life / s.maxLife);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
        }
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, mixBlendMode: 'screen', opacity: 0.6 }} />;
}

export function AboutPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for the exit/enter framer-motion transition to finish (0.6s) before measuring and pinning
    const timer = setTimeout(() => {
      const st = ScrollTrigger.create({
        trigger: '#about-timeline-section',
        start: 'top 20%',
        end: '+=600px',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          if (progressLineRef.current) {
            progressLineRef.current.style.height = `${self.progress * 100}%`;
          }
          
          const nodes = gsap.utils.toArray<HTMLElement>('.timeline-node');
          nodes.forEach((node, i) => {
            const threshold = i / (nodes.length);
            if (self.progress > threshold - 0.05) {
              node.style.opacity = '1';
              node.style.transform = 'translateX(0)';
              node.style.filter = 'blur(0px)';
              
              const circle = node.querySelector('.timeline-circle') as HTMLElement;
              if (circle) {
                circle.style.background = 'rgba(185, 161, 92,0.15)';
                circle.style.borderColor = '#00e98c';
                circle.style.color = '#00e98c';
                circle.style.boxShadow = '0 0 20px rgba(185, 161, 92,0.5)';
                circle.style.transform = 'scale(1.1)';
              }
            } else {
              node.style.opacity = '0.3';
              node.style.transform = 'translateX(-30px)';
              node.style.filter = 'blur(2px)';
              
              const circle = node.querySelector('.timeline-circle') as HTMLElement;
              if (circle) {
                circle.style.background = '#051a2e';
                circle.style.borderColor = 'rgba(0, 130, 180,0.3)';
                circle.style.color = 'rgba(0, 130, 180,0.5)';
                circle.style.boxShadow = '0 0 15px rgba(0, 130, 180,0.1)';
                circle.style.transform = 'scale(1)';
              }
            }
          });
        }
      });
      return () => st.kill();
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        paddingTop: '120px',
        paddingBottom: '100px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 6vw, 60px)',
        paddingRight: 'clamp(24px, 6vw, 60px)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
        
        {/* Header Section */}
        <section style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(0, 180, 255, 0.08)', border: '1px solid rgba(0, 180, 255, 0.2)',
            padding: '5px 14px', marginBottom: '20px', borderRadius: '4px'
          }}>
            <Zap size={12} color="#b9a15c" />
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#b9a15c', letterSpacing: '2px' }}>
              ABOUT CVHET INTELLIGENCE
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            color: '#e8f4fd',
            letterSpacing: '2px',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}>
            PIONEERING ELECTRICAL <br />
            <span style={{ color: '#0082b4', textShadow: '0 0 20px rgba(0, 130, 180, 0.4)' }}>DIAGNOSTICS</span>
          </h1>
          <p style={{
            maxWidth: '700px', margin: '0 auto',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#7ba6c4', lineHeight: 1.7,
          }}>
            We are the industry leaders in preventative electrical analysis, specializing in identifying, analyzing, and mitigating 
            Current, Voltage, Harmonics, Earthing, and Temperature anomalies before they cause catastrophic operational failure.
          </p>
        </section>

        {/* Mission and Vision - Electrical Core Hubs */}
        <section style={{ 
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '40px', position: 'relative',
          padding: isMobile ? '0' : '20px'
        }}>
          {/* Animated Local Sparking Circuit Background */}
          <LocalSparkingCircuit />

          {/* Animated Connecting Energy Pulse Bridge (Desktop Only) */}
          <div className="hidden md:block" style={{ 
            position: 'absolute', top: '50%', left: '20%', right: '20%', 
            height: '1px', background: 'rgba(255,255,255,0.05)', zIndex: 0 
          }}>
            <motion.div 
              animate={{ x: ['0%', '400%'], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              style={{ width: '20%', height: '2px', background: 'linear-gradient(90deg, transparent, #0082b4, #b9a15c, transparent)', boxShadow: '0 0 15px #b9a15c' }}
            />
          </div>

          {[
            { icon: Target, title: 'MISSION', desc: 'To completely eradicate unplanned electrical breakdown downtime in critical industrial sectors by diagnosing the root cause before it occurs.', color: '#0082b4' },
            { icon: Eye, title: 'VISION', desc: 'To become the global standard in electrical systems intelligence, turning unpredictable power hazards into mathematically predictable, manageable data.', color: '#b9a15c' }
          ].map((item, i) => (
            <div key={i} style={{
              position: 'relative',
              padding: '50px 40px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              zIndex: 1,
            }}>
              {/* Animated Floating Electrical Spark Perimeter */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <rect x="0" y="0" width="100%" height="100%" rx="24" fill="rgba(2,12,27,0.7)" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <motion.rect 
                  x="0" y="0" width="100%" height="100%" rx="24" 
                  fill="none" stroke={item.color} strokeWidth="2"
                  strokeDasharray="100 1200"
                  animate={{ strokeDashoffset: [0, -1300] }}
                  transition={{ repeat: Infinity, duration: 4 + i * 1.5, ease: 'linear' }}
                  style={{ filter: `drop-shadow(0 0 12px ${item.color})` }}
                />
              </svg>

              {/* Holographic Glowing Icon Assembly */}
              <div style={{ position: 'relative', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px' }}>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                  style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px dashed ${item.color}`, opacity: 0.5, boxShadow: `0 0 20px ${item.color}33` }}
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
                  style={{ position: 'absolute', inset: '-10px', borderRadius: '50%', border: `1px solid rgba(255,255,255,0.1)`, borderTop: `2px solid ${item.color}`, opacity: 0.8 }}
                />
                <item.icon size={36} color={item.color} style={{ filter: `drop-shadow(0 0 15px ${item.color})` }} />
              </div>
              
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '32px', fontWeight: 900, color: 'transparent', WebkitTextStroke: `1px ${item.color}`, marginBottom: '24px', letterSpacing: '4px' }}>
                {item.title}
              </h3>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '10px', width: '20px', height: '2px', background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: '#e8f4fd', lineHeight: 1.8, background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Global Analysis Data Chart */}
        <section style={{
          background: 'rgba(5, 26, 46, 0.6)',
          border: '1px solid rgba(0, 180, 255, 0.15)',
          borderRadius: '12px',
          padding: isMobile ? '24px 16px' : '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.02)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '20px', color: '#e8f4fd', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity color="#a855f7" /> 
            GLOBAL SYSTEM ANOMALY RESOLUTION
          </h3>
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_ANALYSIS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3355" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff3355" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMitigated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0082b4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0082b4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#4a6a84" tick={{ fill: '#7ba6c4', fontSize: 12, fontFamily: 'Space Grotesk' }} />
                <YAxis stroke="#4a6a84" tick={{ fill: '#7ba6c4', fontSize: 12, fontFamily: 'Space Grotesk' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020c1b', border: '1px solid rgba(0, 130, 180,0.2)', borderRadius: '8px' }}
                  itemStyle={{ fontFamily: 'Orbitron, sans-serif' }}
                />
                <Area type="monotone" dataKey="anomalies" stroke="#ff3355" strokeWidth={2} fillOpacity={1} fill="url(#colorAnomalies)" />
                <Area type="monotone" dataKey="mitigated" stroke="#0082b4" strokeWidth={2} fillOpacity={1} fill="url(#colorMitigated)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Core Pillars */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[
            { icon: Shield, title: 'Proactive Protection', desc: 'Our algorithms detect micro-fluctuations in electrical signatures days before hardware gives out.', color: '#0082b4' },
            { icon: Cpu, title: 'AI-Driven Analysis', desc: 'Real-time telemetry and deep learning models continuously map the stability of your power grid.', color: '#b9a15c' },
            { icon: TrendingUp, title: 'Efficiency Maximization', desc: 'By eliminating harmonic distortion, we optimize energy consumption and hardware lifespan.', color: '#0082b4' }
          ].map((pillar, i) => (
            <div key={i} style={{
              background: 'rgba(5, 26, 46, 0.4)',
              border: `1px solid rgba(255,255,255,0.05)`,
              borderRadius: '8px',
              padding: '30px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(5, 26, 46, 0.8)';
              e.currentTarget.style.borderColor = pillar.color;
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(5, 26, 46, 0.4)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background: pillar.color, boxShadow: `0 0 15px ${pillar.color}`
              }} />
              <pillar.icon size={28} color={pillar.color} style={{ marginBottom: '20px' }} />
              <h4 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: '#e8f4fd', marginBottom: '12px' }}>
                {pillar.title}
              </h4>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: '#7ba6c4', lineHeight: 1.6 }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Impact Stats */}
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', padding: '40px 0', borderTop: '1px solid rgba(0, 130, 180,0.1)', borderBottom: '1px solid rgba(0, 130, 180,0.1)' }}>
          {[
            { metric: '150+', label: 'Facilities Protected', icon: Globe },
            { metric: '12,000+', label: 'Anomalies Detected', icon: Activity },
            { metric: '300,000+', label: 'Hours Saved', icon: Clock },
            { metric: '₹420Cr', label: 'Capital Protected', icon: Award },
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 200px' }}>
              <stat.icon size={32} color="#0082b4" style={{ opacity: 0.8 }} />
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '28px', fontWeight: 800, color: '#e8f4fd', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                  {stat.metric}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#7ba6c4', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Company Journey / Timeline */}
        <section id="about-timeline-section" ref={timelineRef} style={{ padding: '60px 0' }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '26px', color: '#e8f4fd', marginBottom: '60px', textAlign: 'center' }}>
            THE CVHET <span style={{ color: '#b9a15c' }}>JOURNEY</span>
          </h3>
          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '50px' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '30px', width: '2px', background: 'rgba(0, 130, 180,0.1)' }}>
               {/* Growing Progress Beam */}
               <div 
                 ref={progressLineRef}
                 style={{ 
                   position: 'absolute', top: 0, left: '-1px', width: '4px', height: '0%', 
                   background: 'linear-gradient(180deg, #0082b4, #b9a15c)', 
                   boxShadow: '0 0 15px #b9a15c', transition: 'height 0.1s ease-out'
                 }} 
               />
            </div>
            
            {MILESTONES.map((stone, i) => (
              <div key={i} className="timeline-node" style={{ display: 'flex', gap: isMobile ? '16px' : '30px', position: 'relative', zIndex: 1, opacity: 0.3, transform: 'translateX(-30px)', filter: 'blur(2px)', transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
                <div className="timeline-circle" style={{ 
                  width: isMobile ? '50px' : '60px', height: isMobile ? '50px' : '60px', borderRadius: '50%', background: '#051a2e', border: '2px solid rgba(0, 130, 180,0.3)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontFamily: 'Orbitron, sans-serif', fontSize: isMobile ? '12px' : '14px', fontWeight: 800, color: 'rgba(0, 130, 180,0.5)',
                  boxShadow: '0 0 15px rgba(0, 130, 180,0.1)', transition: 'all 0.4s ease'
                }}>
                  {stone.year}
                </div>
                <div style={{ background: 'rgba(5,26,46,0.3)', padding: isMobile ? '16px' : '24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', flex: 1, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                  <h4 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: '#e8f4fd', marginBottom: '8px' }}>
                    {stone.title}
                  </h4>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: '#7ba6c4', lineHeight: 1.6, margin: 0 }}>
                    {stone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </motion.div>
  );
}
