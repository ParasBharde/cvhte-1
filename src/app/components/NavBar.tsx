import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';

const NAV_LINKS = [
  { href: '#breakdowns',   label: 'Breakdowns' },
  { href: '#symptoms',     label: 'Symptoms' },
  { href: '#abnormalities',label: 'Abnormalities' },
  { href: '#diagnostic',   label: 'CVHTE Diagnostic' },
  { href: '#reduction',    label: 'Results' },
  { href: '#contact',      label: 'Contact' },
];



export function NavBar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeSection, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      // Update active section
      const sections = NAV_LINKS.map(l => l.href.replace('#', ''));
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 48px',
        height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(2,12,27,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,180,255,0.1)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Logo */}
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <img
          src="/malghe-logo.png"
          alt="Malghe Electricals and Engineers logo"
          style={{
            height: '44px',
            width: '44px',
            objectFit: 'contain',
            borderRadius: '50%',
            filter: 'drop-shadow(0 0 6px rgba(41,171,226,0.35))',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 700, color: '#00b4ff', lineHeight: 1.1, letterSpacing: '2px' }}>
            MALGHE
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#7ba6c4', letterSpacing: '2px', fontWeight: 500 }}>
            ELECTRICALS &amp; ENGINEERS
          </div>
        </div>
      </a>

      {/* Desktop Nav */}
      <div style={{ gap: '28px', alignItems: 'center' }} className="hidden md:flex">
        {NAV_LINKS.map(link => {
          const id = link.href.replace('#', '');
          const isActive = activeSection === id;
          return (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: isActive ? '#00b4ff' : '#7ba6c4',
                textDecoration: 'none',
                fontSize: '13px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 500,
                letterSpacing: '0.5px',
                transition: 'color 0.2s',
                position: 'relative',
                paddingBottom: '2px',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00b4ff')}
              onMouseLeave={e => (e.currentTarget.style.color = isActive ? '#00b4ff' : '#7ba6c4')}
            >
              {link.label}
              {isActive && (
                <span style={{
                  position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '1px',
                  background: '#00b4ff', boxShadow: '0 0 6px #00b4ff',
                }} />
              )}
            </a>
          );
        })}
      </div>

      {/* CTA + Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a
          href="#contact"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'transparent',
            border: '1px solid #00b4ff',
            color: '#00b4ff',
            padding: '8px 18px',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '1.5px',
            transition: 'all 0.3s',
            textDecoration: 'none',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(0,180,255,0.1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0,180,255,0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <Zap size={12} fill="currentColor" />
          ANALYSE
        </a>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: '#7ba6c4', cursor: 'pointer' }}
          className="flex md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '70px', left: 0, right: 0,
          background: 'rgba(2,12,27,0.98)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,180,255,0.15)',
          padding: '24px 32px',
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ color: '#7ba6c4', textDecoration: 'none', fontSize: '15px', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}