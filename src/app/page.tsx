'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAppPreferencesStore } from '../store/appPreferencesStore';
import OfflineBanner from '../components/offline-banner';
import InventoryGrid from '../components/inventory-grid';
import CartDrawer from '../components/cart-drawer';
import SyncToast from '../components/sync-toast';

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
        <div className="flex items-center space-x-3">
          {/* High-Fidelity Brand Logo Image */}
          <div className="w-8 h-8 rounded-full border border-[#d4af37]/30 overflow-hidden flex items-center justify-center bg-[#16161e] select-none">
            <img 
              src="https://api-hackathon.codedematrixtech.com/images/amina-stitches/logo.png"
              alt="Phasion Sense Logo" 
              className="w-full h-full object-cover filter grayscale contrast-125"
              onError={(e) => {
                // Defensively Safe Logo Fallback: Hides the broken image icon and mounts a golden monogram
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.fallback-monogram')) {
                  const span = document.createElement('span');
                  span.className = 'font-mono text-sm text-[#d4af37] font-bold fallback-monogram tracking-normal';
                  span.innerText = 'Φ';
                  parent.appendChild(span);
                }
              }}
            />
          </div>

          <div className="flex flex-col">
            <span className="font-sans font-light tracking-widest text-base md:text-xl uppercase">
              Phasion Sense <span className="text-[#d4af37] font-semibold">//</span> Studio
            </span>
            <span className="font-mono text-[9px] text-[#27272a] tracking-widest uppercase mt-0.5 hidden md:inline">
              Premium Contemporary Collection
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* ECO MODE INTERACTIVE ACTION TRIGGER BOX */}
          <button 
            onClick={toggleEcoMode}
            className={`font-mono text-[10px] tracking-widest uppercase py-2 px-3 border transition-all duration-300 rounded-sm ${isEcoMode ? 'bg-[#d4af37] text-[#09090b] border-[#d4af37] font-semibold' : 'border-[#272730] text-[#a1a1aa] hover:text-[#f4f4f5] hover:border-[#a1a1aa]'}`}
          >
            {isEcoMode ? '[ ECO MODE: ON ]' : '[ ECO MODE: OFF ]'}
          </button>

          <button 
            onClick={() => toggleDrawer(true)}
            className="font-mono text-xs tracking-widest uppercase py-2 px-4 border border-[#27272a] hover:border-[#f4f4f5] hover:text-[#d4af37] transition-all duration-300 relative flex items-center space-x-2"
          >
            <span>Shopping Bag</span>
            <span className="bg-[#16161e] text-[#d4af37] px-1.5 py-0.5 text-[10px] font-bold border border-[#27272a]">
              {cartCount}
            </span>
          </button>
        </div>
      </nav>

      {/* Interactive Catalog Grid Layout Module */}
      <div className="pb-24">
        <InventoryGrid />
      </div>

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
