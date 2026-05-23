'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAppPreferencesStore } from '../store/appPreferencesStore';
import OfflineBanner from '../components/offline-banner';
import InventoryGrid from '../components/inventory-grid';
import CartDrawer from '../components/cart-drawer';
import SyncToast from '../components/sync-toast';
import StylistChat from '../components/try-on/stylist-chat';

export default function Home() {
  const initCart = useCartStore((state) => state.initCart);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  const cartCount = useCartStore((state) => state.cart.reduce((acc, curr) => acc + curr.qty, 0));
  
  const { isEcoMode, toggleEcoMode } = useAppPreferencesStore();
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  useEffect(() => {
    // Hydrate cart memory from IndexedDB local storage disk snapshot on runtime startup
    initCart();
  }, [initCart]);

  return (
    <main className="min-h-screen bg-[#09090b] relative overflow-x-hidden">
      {/* Network Connectivity Guard Rail */}
      <OfflineBanner />

      {/* Modern Fashion Navigation Layout Header */}
      <nav className="border-b border-[#16161e] py-6 px-4 md:px-12 flex justify-between items-center text-[#f4f4f5] sticky top-0 bg-[#09090b]/90 backdrop-blur-md z-40">
        <div className="flex items-center space-x-3 group/brand cursor-pointer">
          {/* High-Fidelity Brand Logo Image with Gold Halo Spin */}
          <div className="relative w-9 h-9 flex items-center justify-center select-none">
            {/* Spinning Golden Dashed Halo */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#d4af37]/30 group-hover/brand:border-[#d4af37]/70 animate-spin-halo pointer-events-none transition-colors duration-500" />
            
            {/* Logo Inner Circle */}
            <div className="w-7 h-7 rounded-full border border-[#d4af37]/20 group-hover/brand:border-[#d4af37]/40 overflow-hidden flex items-center justify-center bg-[#16161e] relative z-10 transition-transform duration-500 group-hover/brand:scale-[1.02]">
              <img 
                src="/images/logo.png"
                alt="Phasion Sense Logo" 
                className="w-full h-full object-cover filter grayscale contrast-125 transition-all duration-700 group-hover/brand:grayscale-0 group-hover/brand:contrast-100"
                onError={(e) => {
                  // Defensively Safe Logo Fallback: Hides the broken image icon and mounts a golden monogram
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.fallback-monogram')) {
                    const span = document.createElement('span');
                    span.className = 'font-mono text-xs text-[#d4af37] font-bold fallback-monogram tracking-normal';
                    span.innerText = 'Φ';
                    parent.appendChild(span);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-sans font-light tracking-widest text-base md:text-xl uppercase group-hover/brand:text-[#d4af37] transition-colors duration-500">
              Phasion Sense <span className="text-[#d4af37] font-semibold">//</span> Studio
            </span>
            <span className="font-mono text-[9px] text-[#27272a] group-hover/brand:text-[#71717a] tracking-widest uppercase mt-0.5 hidden md:inline transition-colors duration-500">
              Premium Contemporary Collection
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* ECO MODE PREMIUM NEON GLOWING SLIDER SWITCH */}
          <div className="flex items-center space-x-3 bg-[#16161e] border border-[#272730] px-4 py-2.5 rounded-full relative select-none">
            <span className="font-mono text-[8px] text-[#a1a1aa] tracking-widest uppercase">
              Eco Mode
            </span>
            <button
              onClick={toggleEcoMode}
              className={`w-10 h-5 rounded-full p-0.5 transition-all duration-500 ease-out focus:outline-none relative flex items-center ${
                isEcoMode 
                  ? 'bg-[#1B4D3E] border border-[#d4af37]/40 animate-glow-pulse' 
                  : 'bg-[#09090b] border border-[#272730]'
              }`}
              title="Toggle Bandwidth Saver Mode"
            >
              {/* Slider Knob */}
              <div 
                className={`w-3.5 h-3.5 rounded-full transition-transform duration-500 ease-out shadow-md flex items-center justify-center ${
                  isEcoMode 
                    ? 'translate-x-5 bg-[#d4af37]' 
                    : 'translate-x-0.5 bg-[#27272a]'
                }`}
              >
                {/* Active Indicator dot */}
                {isEcoMode && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1b4d3e]" />
                )}
              </div>
            </button>
          </div>

          <button 
            onClick={() => {
              if (typeof window !== 'undefined') window.location.href = '/chat';
            }}
            className="font-mono text-xs tracking-widest uppercase py-2.5 px-4 border border-[#27272a] hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 relative"
          >
            AI Stylist
          </button>

          <button 
            onClick={() => toggleDrawer(true)}
            className="font-mono text-xs tracking-widest uppercase py-2.5 px-4 border border-[#27272a] hover:border-[#f4f4f5] hover:text-[#d4af37] transition-all duration-300 relative flex items-center space-x-2"
          >
            <span>Shopping Bag</span>
            <span className="bg-[#16161e] text-[#d4af37] px-1.5 py-0.5 text-[10px] font-bold border border-[#27272a]">
              {cartCount}
            </span>
          </button>
        </div>
      </nav>

      {/* Interactive Catalog Grid Layout Module */}
      <div className="pb-16">
        <InventoryGrid />
      </div>

      {/* Editorial AI Styling Lounge Section */}
      <section className="w-full bg-[#111116] border-t border-[#16161e] px-6 md:px-16 py-20 text-[#f4f4f5] pb-28">
        <div className="max-w-4xl mx-auto flex flex-col space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-sans text-2xl md:text-3xl font-extralight tracking-tight uppercase">
              The Digital Atelier Lounge
            </h2>
            <p className="font-mono text-[9px] text-[#d4af37] tracking-[0.25em] uppercase">
              Consult with our Resident AI Stylist
            </p>
          </div>
          
          <StylistChat />
        </div>
      </section>

      {/* Slide-out Persistent Drawer Context Panel */}
      <CartDrawer />

      {/* Background Persistence Synchronization Loop Visibility Monitor */}
      <SyncToast />

      {/* Editorial Luxury Footer */}
      <footer className="border-t border-[#16161e] py-12 px-4 md:px-12 bg-[#09090b] text-[#71717a] font-mono text-[10px] uppercase tracking-widest flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div>
          <span>© 2026 Phasion Sense // Amina Stitches. All rights reserved.</span>
        </div>
        <div className="flex space-x-6">
          <button 
            onClick={() => setIsTermsOpen(true)}
            className="hover:text-[#d4af37] transition-colors duration-300 cursor-pointer"
          >
            [ Terms & Conditions ]
          </button>
        </div>
      </footer>

      {/* Floating Luxury WhatsApp Chat Assistance Button */}
      <a 
        href="https://wa.me/233535186123?text=Hello%20Amina%20Stitches,%20I'm%20browsing%20the%20Phasion%20Sense%20capsule%20collection%20and%20would%20love%20to%20inquire%20about%20a%20garment%20fit!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-30 flex items-center space-x-3 bg-[#1B4D3E]/95 hover:bg-[#1B4D3E] text-[#f4f4f5] border border-[#d4af37]/40 hover:border-[#d4af37] px-5 py-3.5 shadow-2xl backdrop-blur-md rounded-full transition-all duration-500 ease-out hover:scale-[1.05] group"
        title="Consult with Lead Tailor on WhatsApp"
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          {/* Pulsing indicator ring */}
          <span className="absolute inset-0 rounded-full bg-[#d4af37]/30 animate-ping group-hover:bg-[#d4af37]/50" />
          <svg 
            viewBox="0 0 24 24" 
            className="w-4 h-4 fill-current text-[#d4af37] relative z-10 transition-transform duration-500 group-hover:rotate-12"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.417 9.863-9.864.001-2.639-1.026-5.122-2.892-6.991C16.576 1.884 14.1 .856 11.464.856c-5.44 0-9.866 4.418-9.869 9.866-.001 1.76.471 3.478 1.365 5.011L1.87 20.316l4.777-1.162zm10.963-6.84c-.266-.134-1.579-.78-1.823-.867-.243-.088-.419-.133-.596.134-.176.265-.681.866-.836 1.043-.154.177-.31.199-.576.065-.266-.134-1.12-.413-2.133-1.32-.788-.702-1.32-1.569-1.474-1.836-.155-.266-.017-.41.117-.543.12-.12.266-.31.399-.465.133-.155.177-.266.266-.443.089-.177.044-.332-.022-.465-.067-.133-.596-1.439-.817-1.97-.215-.518-.432-.447-.596-.456-.153-.008-.33-.009-.507-.009-.177 0-.465.067-.708.333-.243.265-.929.907-.929 2.21 0 1.305.95 2.56 1.08 2.73 1.127 1.484 2.115 2.459 3.513 2.946.883.308 1.547.337 2.132.25.653-.098 1.579-.646 1.8-.1.223-.548.223-1.018.156-1.107-.067-.089-.243-.133-.509-.267z"/>
          </svg>
        </div>
        <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[#d4af37] group-hover:text-[#f4f4f5] transition-colors duration-300">
          Tailor Chat
        </span>
      </a>

      {/* Terms & Conditions Modal Overlay */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in p-4">
          <div className="absolute inset-0" onClick={() => setIsTermsOpen(false)} />
          
          <div className="relative w-full max-w-2xl max-h-[80vh] bg-[#09090b] border border-[#d4af37]/30 p-8 flex flex-col shadow-2xl animate-scale-up text-[#f4f4f5] z-10 rounded-sm">
            <div className="flex justify-between items-center border-b border-[#16161e] pb-4 mb-6">
              <div className="flex flex-col">
                <h2 className="font-sans text-lg font-light tracking-widest uppercase text-[#d4af37]">Terms & Conditions</h2>
                <span className="font-mono text-[8px] text-[#71717a] tracking-widest uppercase mt-0.5">Coded AI Fashion Tech Hackathon</span>
              </div>
              <button 
                onClick={() => setIsTermsOpen(false)} 
                className="text-[10px] font-mono tracking-widest text-[#71717a] hover:text-[#d4af37] border border-[#272730] hover:border-[#d4af37]/30 px-3 py-1.5 transition-all duration-300"
              >
                [ CLOSE ]
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 font-mono text-[10px] text-[#a1a1aa] leading-relaxed uppercase tracking-wider custom-scrollbar">
              <h3 className="text-[#f4f4f5] font-semibold border-b border-[#16161e] pb-1">1. Acceptance of Terms</h3>
              <p>By registering for, accessing, or participating in the Hackathon (the "Event") organized by Coded (the "Organizer"), you (the "Participant") agree to be bound by these Official Terms and Conditions. If you do not agree to these terms, you may not participate in the Event.</p>

              <h3 className="text-[#f4f4f5] font-semibold border-b border-[#16161e] pb-1">2. Event Description and Consideration</h3>
              <p>The Event is a competition in which Participants will be provided with specific, proprietary problem statements, data, or challenges developed by Coded. In consideration for the Participant's opportunity to participate in the Event, access Coded's proprietary materials, utilize the provided platform/resources, and compete for the prizes offered, Participant agrees to the obligations set forth in these Terms, including the Intellectual Property assignment below.</p>

              <h3 className="text-[#f4f4f5] font-semibold border-b border-[#16161e] pb-1">3. Intellectual Property and Ownership</h3>
              <div className="pl-4 space-y-4">
                <p><strong>a. Organizer Materials:</strong> Coded retains all right, title, and interest in and to any materials, software, data, APIs, or problem statements provided to Participants during the Event ("Organizer Materials"). Participants are granted a limited, revocable, non-exclusive license to use these materials solely for the purpose of competing in the Event.</p>
                <p><strong>b. Assignment of Submissions:</strong> Participants acknowledge that the solutions, concepts, and code generated during the Event are derived from the proprietary challenges and resources provided by Coded. Therefore, Participants agree that all right, title, and interest in and to any work product, including but not limited to source code, algorithms, software, documentation, designs, and presentations (collectively, the "Submission") created, developed, or submitted during the Event shall be the sole and exclusive intellectual property of Coded.</p>
                <p><strong>c. Transfer of Rights:</strong> Participant hereby irrevocably assigns, transfers, and conveys to Coded all current and future worldwide rights, title, and interest in and to the Submission, including all copyrights, patents, trade secrets, and other intellectual property rights. Participant agrees to execute any further documents reasonably requested by Coded to perfect or record such assignment.</p>
                <p><strong>d. Pre-existing Intellectual Property:</strong> Participants shall not use any pre-existing, third-party, or open-source code in their Submission that would restrict Coded's ability to freely use, modify, or commercialize the Submission. If Participant incorporates any of their own pre-existing IP into the Submission, Participant hereby grants Coded a perpetual, irrevocable, worldwide, royalty-free license to use, modify, and distribute such pre-existing IP as part of the Submission.</p>
                <p><strong>e. Portfolio License:</strong> To support the career growth of our Participants, Coded grants the Participant a limited, non-exclusive, non-transferable license to display non-confidential snippets, high-level architectural descriptions, and screenshots of their Submission solely for inclusion in their personal professional portfolio or resume, provided it does not expose Coded's proprietary logic or confidential business information.</p>
              </div>

              <h3 className="text-[#f4f4f5] font-semibold border-b border-[#16161e] pb-1">4. Prizes</h3>
              <p>Prizes will be awarded at the sole discretion of the Organizer's judging panel based on the evaluation criteria provided during the Event. Prizes are non-transferable. The Organizer reserves the right to substitute a prize of equal or greater value. Winners are solely responsible for any taxes or fees associated with prize receipt.</p>

              <h3 className="text-[#f4f4f5] font-semibold border-b border-[#16161e] pb-1">5. Warranties and Representations</h3>
              <p>By submitting a project, Participant warrants that: The Submission is their original work, created solely during the Event. The Submission does not violate or infringe upon the intellectual property rights, privacy rights, or any other rights of any third party. They have the full legal right to assign the Intellectual Property as outlined in Section 3.</p>

              <h3 className="text-[#f4f4f5] font-semibold border-b border-[#16161e] pb-1">6. Confidentiality</h3>
              <p>Participants agree to maintain the confidentiality of Coded's proprietary information and future products, and not to disclose it to any third party or use it for any purpose other than participating in the Event.</p>

              <h3 className="text-[#f4f4f5] font-semibold border-b border-[#16161e] pb-1">7. Limitation of Liability</h3>
              <p>To the maximum extent permitted by law, Coded and its affiliates shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with participation in the Event or the use of any prize.</p>

              <h3 className="text-[#f4f4f5] font-semibold border-b border-[#16161e] pb-1">8. Governing Law</h3>
              <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of Ghana, without regard to its conflict of law provisions.</p>

              <h3 className="text-[#f4f4f5] font-semibold border-b border-[#16161e] pb-1">9. General</h3>
              <p>Coded reserves the right to modify these Terms and Conditions or cancel the Event at any time at its sole discretion. Any modifications will be communicated to registered Participants.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
