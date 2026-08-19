import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import AboutSection from './sections/AboutSection'
import PracticeSection from './sections/PracticeSection'
import ProductsSection from './sections/ProductsSection'
import TrackRecordSection from './sections/TrackRecordSection'
import ContactSection from './sections/ContactSection'

export default function App() {
  return (
    <main className="bg-ink" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <PracticeSection />
      <ProductsSection />
      <TrackRecordSection />
      <ContactSection />
    </main>
  )
}
