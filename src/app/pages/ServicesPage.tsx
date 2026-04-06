import { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Shield, Waves, Thermometer, Radio } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    id: 'predictive-telemetry',
    icon: Radio,
    title: 'REAL-TIME TELEMETRY',
    short: 'AI-driven grid monitoring.',
    desc: 'We utilize deep learning algorithms to continuously analyze current and voltage waveforms in real-time, detecting micro-fluctuations before they ripple into critical hardware failure.',
    color: '#00b4ff',
    features: ['24/7 Live Dashboard', 'Sub-millisecond Data Polling', 'Automated Anomaly Alerts']
  },
  {
    id: 'harmonic-mitigation',
    icon: Waves,
    title: 'HARMONIC MITIGATION',
    short: 'Eliminate toxic wave distortion.',
    desc: 'Harmonics slowly destroy transformers and motors through extreme overheating. We implement active filtration protocols to flatten your sine waves to absolute perfection.',
    color: '#a855f7',
    features: ['Active Power Filtration', 'THD Profiling', 'Transformer Lifecycle Extension']
  },
  {
    id: 'thermal-analysis',
    icon: Thermometer,
    title: 'THERMAL SIGNATURE ANALYSIS',
    short: 'Infrared predictive maintenance.',
    desc: 'Electrical resistance generates invisible heat. We deploy advanced thermal scanning and continuous temperature array mapping to isolate failing connections and degrading insulation safely.',
    color: '#ff3355',
    features: ['Contactless Diagnostics', 'IR Spectrum Mapping', 'Load Imbalance Detection']
  },
  {
    id: 'earthing-audits',
    icon: Shield,
    title: 'EARTHING AUDITS',
    short: 'Defend against ground faults.',
    desc: 'A weak earthing system is a lethal single point of failure. We perform comprehensive soil resistivity mapping and equipotential bonding analysis to mathematically bulletproof your facility.',
    color: '#00e98c',
    features: ['Soil Resistivity Testing', 'Short-Circuit Defense', 'Human Safety Compliance']
  },
  {
    id: 'emergency-triage',
    icon: Zap,
    title: 'EMERGENCY FAULT TRIAGE',
    short: 'Immediate post-failure recovery.',
    desc: 'When an unpredictable catastrophic event occurs, our rapid-response diagnostic team dissects the fault architecture. We track the trajectory of the short circuit to rebuild your system faster.',
    color: '#ffaa00',
    features: ['Rapid Response Engineering', 'Post-Mortem Analytics', 'System Re-synchronization']
  },
];

export function ServicesPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const contents = gsap.utils.toArray<HTMLElement>('.service-content');
      const visuals = gsap.utils.toArray<HTMLElement>('.service-visual');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#services-pin-section',
          start: 'top top',
          end: '+=5000px',
          pin: true,
          scrub: 1.5, // Added inertia for buttery smooth scroll
        }
      });

      for(let i = 0; i < SERVICES.length - 1; i++) {
        // Outgoing slide fades up and out
        tl.to(contents[i], { opacity: 0, y: -50, duration: 1.2, ease: 'power2.inOut' }, `step${i}`)
          .to(visuals[i], { opacity: 0, scale: 0.6, filter: 'blur(20px)', duration: 1.2, ease: 'power2.inOut' }, `step${i}`);

        // Incoming slide fades up and in (overlaps slightly with the exit)
        tl.to(contents[i+1], { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, `step${i}+=0.6`)
          .to(visuals[i+1], { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' }, `step${i}+=0.6`);

        // Hold frame before next transition so user actually has time to read
        tl.to({}, { duration: 1.5 });
      }

      return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      };
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ overflow: 'hidden' }}
    >
      <section id="services-pin-section" style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Fixed Title Header within Pin */}
        <div style={{ width: '100%', textAlign: 'center', marginTop: '120px', zIndex: 10 }}>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(28px, 4vw, 42px)', color: '#e8f4fd', letterSpacing: '4px', margin: 0 }}>
            INDUSTRIAL <span style={{ color: '#00b4ff', textShadow: '0 0 20px rgba(0,180,255,0.4)' }}>DEFENSE</span> PROTOCOLS
          </h1>
        </div>

        <div style={{ flex: 1, display: 'flex', width: '100%', maxWidth: '1200px', margin: '0 auto', gap: '30px', padding: '0 clamp(20px, 5vw, 60px)', alignItems: 'center', alignContent: 'center', flexWrap: 'wrap' }}>
          
          {/* Left Text HUD Area */}
          <div style={{ flex: '1 1 400px', position: 'relative', height: '400px' }}>
            {SERVICES.map((srv, i) => (
              <div key={srv.id} className="service-content" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'translateY(0)' : 'translateY(50px)', pointerEvents: i === 0 ? 'auto' : 'none', willChange: 'opacity, transform' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(48px, 6vw, 80px)', color: 'transparent', WebkitTextStroke: `2px ${srv.color}`, opacity: 0.5, fontWeight: 900, lineHeight: 0.8 }}>
                    0{i+1}
                  </div>
                  <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(24px, 3vw, 36px)', color: srv.color, WebkitTextStroke: `0.5px ${srv.color}`, lineHeight: 1.1, margin: 0 }}>
                    {srv.title}
                  </h2>
                </div>
                
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(18px, 2vw, 22px)', color: '#e8f4fd', marginBottom: '24px', letterSpacing: '1px' }}>
                  {srv.short}
                </h3>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: '#7ba6c4', lineHeight: 1.8, marginBottom: '40px', maxWidth: '500px' }}>
                  {srv.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {srv.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'Orbitron, sans-serif', fontSize: '13px', color: '#a0c4db', letterSpacing: '1px' }}>
                      <div style={{ width: '80px', height: '1px', background: srv.color, boxShadow: `0 0 15px ${srv.color}` }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Holographic Icon Area */}
          <div style={{ flex: '1 1 400px', position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {SERVICES.map((srv, i) => (
              <div key={srv.id} className="service-visual" style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'scale(1)' : 'scale(0.6)', filter: i === 0 ? 'blur(0px)' : 'blur(20px)', willChange: 'opacity, transform, filter' }}>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                  style={{ position: 'absolute', width: '380px', height: '380px', border: `2px dashed ${srv.color}`, borderRadius: '50%', opacity: 0.15 }}
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
                  style={{ position: 'absolute', width: '280px', height: '280px', border: `1px solid rgba(255,255,255,0.05)`, borderRight: `3px solid ${srv.color}`, borderRadius: '50%', opacity: 0.4 }}
                />
                <motion.div 
                   animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                   transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                >
                   <srv.icon size={180} color={srv.color} style={{ filter: `drop-shadow(0 0 50px ${srv.color}) drop-shadow(0 0 100px ${srv.color}66)` }} />
                </motion.div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </motion.div>
  );
}
