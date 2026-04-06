import { Suspense, lazy, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeroSection } from '../components/HeroSection';

const ElectricalBreakdowns = lazy(() => import('../components/ElectricalBreakdowns').then(m => ({ default: m.ElectricalBreakdowns })));
const SymptomsSection = lazy(() => import('../components/SymptomsSection').then(m => ({ default: m.SymptomsSection })));
const CurrentAbnormalities = lazy(() => import('../components/CurrentAbnormalities').then(m => ({ default: m.CurrentAbnormalities })));
const DesignCauses = lazy(() => import('../components/DesignCauses').then(m => ({ default: m.DesignCauses })));
const ProtectionWeaknesses = lazy(() => import('../components/ProtectionWeaknesses').then(m => ({ default: m.ProtectionWeaknesses })));
const DiagnosticApproach = lazy(() => import('../components/DiagnosticApproach').then(m => ({ default: m.DiagnosticApproach })));
const ProtectionCoordination = lazy(() => import('../components/ProtectionCoordination').then(m => ({ default: m.ProtectionCoordination })));
const ReductionSection = lazy(() => import('../components/ReductionSection').then(m => ({ default: m.ReductionSection })));
const ContactFooter = lazy(() => import('../components/ContactFooter').then(m => ({ default: m.ContactFooter })));

function SectionSkeleton() {
  return (
    <div style={{
      minHeight: '400px',
      background: 'linear-gradient(180deg, rgba(0,180,255,0.03) 0%, transparent 100%)',
      borderTop: '1px solid rgba(0,180,255,0.06)',
    }} />
  );
}

export function LandingPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <HeroSection />
      <Suspense fallback={<SectionSkeleton />}>
        <ElectricalBreakdowns />
        <SymptomsSection />
        <CurrentAbnormalities />
        <DesignCauses />
        <ProtectionWeaknesses />
        <DiagnosticApproach />
        <ProtectionCoordination />
        <ReductionSection />
        <ContactFooter />
      </Suspense>
    </motion.div>
  );
}
