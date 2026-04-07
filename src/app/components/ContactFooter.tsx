import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, Zap, Linkedin, Twitter, Globe } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isDesktop = () => window.innerWidth >= 768;

const NAV_FOOTER = [
  { label: 'Electrical Breakdowns', href: '#breakdowns' },
  { label: 'Symptoms & Signs',      href: '#symptoms' },
  { label: 'Current Abnormalities', href: '#abnormalities' },
  { label: 'Design Causes',         href: '#causes' },
  { label: 'CVHET Diagnostic',      href: '#diagnostic' },
  { label: '80% Reduction Results', href: '#reduction' },
];

export function ContactFooter() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

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

  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [sent, setSent]   = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#020c1b',
    border: '1px solid rgba(0, 130, 180, 0.15)',
    padding: '12px 16px',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: '14px',
    color: '#e8f4fd',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <>
      <section
        id="contact"
        ref={ref}
        style={{
          background: 'linear-gradient(180deg, #020c1b 0%, #031525 100%)',
          padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 100px)',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0, 130, 180, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 130, 180, 0.02) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }} />

        <div style={{ textAlign: 'center', marginBottom: '70px', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(185, 161, 92, 0.06)', border: '1px solid rgba(185, 161, 92, 0.2)',
            padding: '5px 14px', marginBottom: '20px',
          }}>
            <Zap size={12} color="#b9a15c" fill="#b9a15c" />
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#b9a15c', letterSpacing: '2px' }}>ENGAGE WITH CVHET</span>
          </div>
          <h2 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(24px, 4vw, 42px)',
            fontWeight: 800,
            color: '#e8f4fd',
            letterSpacing: '2px',
            marginBottom: '16px',
          }}>
            REQUEST A CVHET<br />
            <span style={{ color: '#0082b4' }}>SYSTEM ANALYSIS</span>
          </h2>
          <p style={{
            maxWidth: '520px', margin: '0 auto',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(14px, 1.6vw, 16px)',
            color: '#7ba6c4', lineHeight: 1.7,
          }}>
            Begin your electrical system diagnostic today. Our engineers will review your
            facility's CVHET parameters and provide a comprehensive breakdown risk report.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: '40px',
          maxWidth: '1100px', margin: '0 auto',
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}>

          <div style={{
            background: '#051a2e',
            border: '1px solid rgba(0, 130, 180,0.12)',
            padding: 'clamp(28px, 4vw, 48px)',
          }}>
            {sent ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '100%', minHeight: '300px', textAlign: 'center', gap: '20px',
              }}>
                <div style={{
                  width: '72px', height: '72px',
                  border: '2px solid #00e98c',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(0,233,140,0.4)',
                  animation: 'electricPulse 2s ease-in-out infinite',
                }}>
                  <Zap size={28} color="#00e98c" fill="#00e98c" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', color: '#00e98c', marginBottom: '12px' }}>
                    REQUEST TRANSMITTED
                  </div>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: '#7ba6c4', lineHeight: 1.7 }}>
                    Our engineering team will contact you within 24 hours to schedule your CVHET diagnostic session.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '13px', color: '#0082b4',
                  letterSpacing: '2px', marginBottom: '8px',
                }}>
                  ANALYSIS REQUEST FORM
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#4a6a84', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                      FULL NAME *
                    </label>
                    <input
                      name="name" required value={form.name} onChange={handleChange}
                      placeholder="Rajesh Kumar"
                      style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0, 130, 180,0.5)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 130, 180,0.15)')}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#4a6a84', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                      EMAIL ADDRESS *
                    </label>
                    <input
                      name="email" type="email" required value={form.email} onChange={handleChange}
                      placeholder="rajesh@company.com"
                      style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0, 130, 180,0.5)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 130, 180,0.15)')}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#4a6a84', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                    COMPANY / FACILITY
                  </label>
                  <input
                    name="company" value={form.company} onChange={handleChange}
                    placeholder="Industrial facility or company name"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0, 130, 180,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 130, 180,0.15)')}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#4a6a84', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                    SERVICE REQUIRED
                  </label>
                  <select
                    name="service" value={form.service} onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0, 130, 180,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 130, 180,0.15)')}
                  >
                    <option value="" style={{ background: '#051a2e' }}>Select a service...</option>
                    <option value="cvhet-audit" style={{ background: '#051a2e' }}>Full CVHET System Audit</option>
                    <option value="protection-study" style={{ background: '#051a2e' }}>Protection Coordination Study</option>
                    <option value="harmonic-analysis" style={{ background: '#051a2e' }}>Harmonic & Power Quality Analysis</option>
                    <option value="earth-testing" style={{ background: '#051a2e' }}>Earthing System Assessment</option>
                    <option value="thermal-imaging" style={{ background: '#051a2e' }}>Thermal Imaging & IR Survey</option>
                    <option value="breakdown-rca" style={{ background: '#051a2e' }}>Breakdown Root Cause Analysis</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#4a6a84', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                    DESCRIBE YOUR SITUATION
                  </label>
                  <textarea
                    name="message" rows={4} value={form.message} onChange={handleChange}
                    placeholder="Describe your current electrical challenges, number of breakdowns per month, installed capacity, etc."
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0, 130, 180,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 130, 180,0.15)')}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    background: '#0082b4',
                    color: '#020c1b',
                    border: 'none',
                    padding: '14px 32px',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '12px', fontWeight: 700,
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(0, 130, 180,0.4)',
                    transition: 'all 0.3s',
                    marginTop: '4px',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(0, 130, 180,0.7)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(0, 130, 180,0.4)'; }}
                >
                  <Send size={14} />
                  TRANSMIT REQUEST
                </button>
              </form>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {[
              { icon: Phone, label: 'CALL US', value: '+91 9823580555', sub: 'Mon–Sat, 9 AM – 6 PM IST', color: '#0082b4', href: 'tel:+919823580555' },
              { icon: Mail,  label: 'EMAIL',   value: 'ask@cvhet.com', sub: 'Response within 24 hours', color: '#4dd8ff', href: 'mailto:ask@cvhet.com' },
              { icon: MapPin,label: 'OFFICE',  value: 'Pune, Maharashtra, India', sub: 'Pan-India site visits available', color: '#00e98c' },
            ].map((c, ci) => {
              const Icon = c.icon;
              return (
                <div key={c.label} style={{
                  background: '#051a2e',
                  border: '1px solid rgba(0, 130, 180,0.1)',
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateX(0)' : 'translateX(30px)',
                  transition: `all 0.5s ease ${ci * 120}ms`,
                }}>
                  <div style={{
                    width: '44px', height: '44px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${c.color}30`,
                    background: `${c.color}10`,
                  }}>
                    <Icon size={20} color={c.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#4a6a84', letterSpacing: '1.5px', marginBottom: '4px' }}>
                      {c.label}
                    </div>
                    {c.href ? (
                      <a href={c.href} style={{
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: '#e8f4fd', fontWeight: 600,
                        textDecoration: 'none', transition: 'color 0.2s', display: 'inline-block', marginBottom: '4px'
                      }}
                        onMouseEnter={e => { (e.currentTarget.style.color = c.color); }}
                        onMouseLeave={e => { (e.currentTarget.style.color = '#e8f4fd'); }}
                      >
                        {c.value}
                      </a>
                    ) : (
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: '#e8f4fd', fontWeight: 600, marginBottom: '4px' }}>
                        {c.value}
                      </div>
                    )}
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#4a6a84' }}>
                      {c.sub}
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={{
              background: '#051a2e',
              border: '1px solid rgba(0, 130, 180,0.1)',
              padding: '24px',
              flex: 1,
            }}>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '11px', color: '#0082b4',
                letterSpacing: '2px', marginBottom: '16px',
              }}>
                OUR SERVICES
              </div>
              {[
                'CVHET Parameter Monitoring',
                'Protection Coordination Studies',
                'Power Quality & Harmonic Analysis',
                'Earthing System Design & Testing',
                'Thermal Imaging & IR Surveys',
                'Relay Setting & Commissioning',
                'Breakdown Root Cause Analysis',
              ].map((s, si) => (
                <div key={s} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 0',
                  borderBottom: si < 6 ? '1px solid rgba(0, 130, 180,0.05)' : 'none',
                }}>
                  <div style={{
                    width: '5px', height: '5px',
                    background: '#0082b4',
                    flexShrink: 0,
                    animation: `electricPulse ${1.5 + si * 0.2}s ease-in-out infinite`,
                  }} />
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#7ba6c4' }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer style={{
        background: '#010911',
        borderTop: '1px solid rgba(0, 130, 180,0.08)',
        padding: '40px clamp(24px, 6vw, 100px)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '32px',
          marginBottom: '32px',
        }}>
          <div>
            <div style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '18px', fontWeight: 800,
              color: '#0082b4', letterSpacing: '3px',
              marginBottom: '4px',
            }}>
              CVHET ELECTRICAL BREAKDOWN EXPERT
            </div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '12px', color: '#4a6a84',
            }}>
              CVHET System — Current · Voltage · Harmonics · Earthing · Temperature
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {[Linkedin, Twitter, Globe].map((Icon, i) => (
              <button key={i} style={{
                width: '36px', height: '36px',
                background: 'transparent',
                border: '1px solid rgba(0, 130, 180,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#4a6a84',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 130, 180,0.5)';
                  (e.currentTarget as HTMLElement).style.color = '#0082b4';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 130, 180,0.15)';
                  (e.currentTarget as HTMLElement).style.color = '#4a6a84';
                }}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '16px 32px',
          marginBottom: '32px',
          borderBottom: '1px solid rgba(0, 130, 180,0.06)',
          paddingBottom: '32px',
        }}>
          {NAV_FOOTER.map(l => (
            <a key={l.href} href={l.href} style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px', color: '#4a6a84',
              textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0082b4')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4a6a84')}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '12px', color: '#4b718e',
          }}>
            © 2026 CVHET Electrical Breakdown Expert. All rights reserved. CVHET is a proprietary electrical diagnostic system.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#0082b4',
              boxShadow: '0 0 8px #0082b4',
              animation: 'electricPulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#4b718e' }}>
              System Online
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}