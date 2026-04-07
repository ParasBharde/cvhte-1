import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const NAV_LINKS = [
  { href: '/#breakdowns',  label: 'Breakdowns' },
  { href: '/#symptoms',    label: 'Symptoms' },
  { href: '/#abnormalities',label: 'Abnormalities' },
  { href: '/#diagnostic',  label: 'CVHET Diagnostic' },
  { href: '/#reduction',   label: 'Results' },
  { href: '/about',        label: 'About' },
  { href: '/services',     label: 'Services' },
  { href: '/#contact',     label: 'Contact' },
];



export function NavBar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeSection, setActive] = useState('');
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      
      // Only track scroll sections on home page
      if (location.pathname !== '/') return;

      const sections = NAV_LINKS.filter(l => l.href.includes('#')).map(l => l.href.split('#')[1]);
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
        padding: '0 clamp(16px, 4vw, 48px)',
        height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(2,12,27,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,180,255,0.1)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
        <div style={{
          background: 'rgba(5, 26, 46, 0.6)',
          backdropFilter: 'blur(8px)',
          padding: '6px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(0, 180, 255, 0.2)',
          boxShadow: '0 0 15px rgba(0, 180, 255, 0.1)',
          transition: 'all 0.3s ease',
          flexShrink: 0,
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 180, 255, 0.3)';
            e.currentTarget.style.borderColor = 'rgba(0, 180, 255, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 180, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(0, 180, 255, 0.2)';
          }}
        >
          <img
            src="/CVHET_Logo_1.png"
            alt="CVHET Logo"
            style={{
              height: '44px',
              width: '44px',
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 800, color: '#00b4ff', lineHeight: 1.1, letterSpacing: '3px' }}>
            CVHET
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#7ba6c4', letterSpacing: '1.5px', fontWeight: 600, textTransform: 'uppercase' }}>
            Electrical Breakdown Expert
          </div>
        </div>
      </Link>

      <div style={{ gap: '28px', alignItems: 'center' }} className="hidden md:flex">
        {NAV_LINKS.map(link => {
          const id = link.href.split('#')[1] || link.href;
          // check if active by route or by scroll
          const isActive = (location.pathname === link.href) || (activeSection === id && location.pathname === '/');
          return (
            <Link
              key={link.href}
              to={link.href}
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
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          to="/#contact"
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
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: '#7ba6c4', cursor: 'pointer' }}
          className="flex md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div style={{
          position: 'absolute', top: '70px', left: 0, right: 0,
          background: 'rgba(2,12,27,0.98)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,180,255,0.15)',
          padding: '24px 32px',
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ color: '#7ba6c4', textDecoration: 'none', fontSize: '15px', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}