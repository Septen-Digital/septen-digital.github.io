import { getIcon } from "@utils/ui";
import type { DemoContainer } from "@demos/shared/types";

function bindCarlsCoffee(container: DemoContainer): void {
  const specSelector = container.querySelector("#carls-spec-selector");
  if (!specSelector) {
    return;
  }

  const items = specSelector.querySelectorAll(".spec-item");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const isSelected =
        item.classList.contains("bg-[#29221E]") &&
        item.classList.contains("border-[#E29578]");

      items.forEach((other) => {
        other.classList.remove("bg-[#29221E]", "border-[#E29578]");
        other.classList.add("border-transparent", "bg-[#221A16]");
        other.querySelector(".roaster-note")?.classList.add("hidden");
      });

      if (!isSelected) {
        item.classList.remove("border-transparent", "bg-[#221A16]");
        item.classList.add("bg-[#29221E]", "border-[#E29578]");
        item.querySelector(".roaster-note")?.classList.remove("hidden");
      }
    });
  });
}

export function renderCarlsCoffee(container: DemoContainer): void {
  const getBusyWidthClass = (busy: string): string =>
    (
      {
        "25%": "w-1/4",
        "40%": "w-2/5",
        "60%": "w-3/5",
        "80%": "w-4/5",
        "95%": "w-[95%]",
      } as const
    )[busy] ?? "w-0";

  const busyData = [
    { hour: "8 AM", busy: "40%", label: "Quiet" },
    { hour: "10 AM", busy: "95%", label: "Peak Busy" },
    { hour: "12 PM", busy: "80%", label: "Steady" },
    { hour: "2 PM", busy: "60%", label: "Relaxed" },
    { hour: "4 PM", busy: "25%", label: "Quiet" },
  ];

  const signatures = [
    {
      id: "spec-1",
      name: "Carl’s House Roast",
      price: "£4.20",
      desc: "Hand-poured filter of our signature Colombian honey-process bean. Notes of red grape & brown sugar.",
    },
    {
      id: "spec-2",
      name: "Brown Sugar Latte",
      price: "£4.50",
      desc: "House double espresso, sweet slow-cooked molasses, organic oat milk, dusted with toasted spice.",
    },
    {
      id: "spec-3",
      name: "Iced Caramel Cold Brew",
      price: "£4.40",
      desc: "18-hour slow steeped cold brew poured over cracked ice, layered cleanly with homemade salted caramel foam.",
    },
  ];

  container.innerHTML = `
    <div class="bg-[#FAF6F0] min-h-screen text-[#4E342E] selection:bg-[#E3D5CA] text-left">
      <!-- Mini Top Banner -->
      <div class="bg-[#3E2723] text-[#FFF8E1] px-6 py-3 flex flex-col sm:flex-row justify-between items-center text-xs border-b border-[#4E342E]/10 font-sans gap-2 text-center">
        <span class="font-serif italic font-medium">Durham Artisan Coffee Roasters</span>
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Open until 4:00 PM</span>
        </div>
      </div>

      <!-- Chalkboard Menu Section -->
      <div class="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div class="text-center mb-12" data-reveal>
          <span class="font-mono text-xs tracking-widest text-[#E29578] uppercase">Est. 2018</span>
          <h1 class="font-serif text-4xl md:text-5xl font-bold mt-2 text-[#3E2723]">Carl’s Coffee</h1>
          <p class="font-sans text-sm text-[#8D6E63] mt-2 italic">A physical menu translated for digital visitors. Hand-roasted & baked at dawn.</p>
        </div>

        <!-- Chalkboard Menu Wrap -->
        <div class="bg-[#1C1714] text-[#F5EBE0] rounded-xl p-6 md:p-10 shadow-2xl border-4 border-[#3D312A] relative overflow-hidden hover-lift transition-transform duration-500" data-reveal>
          <div class="absolute inset-0 bg-radial-gradient from-transparent to-[#0E0B0A]/80 opacity-90 pointer-events-none"></div>
          
          <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#3D312A]/60">
            
            <!-- Left Column: Espresso & Craft Coffee -->
            <div class="space-y-6 md:pr-4">
              <h3 class="font-serif text-xl text-[#E29578] border-b border-[#E29578]/20 pb-2 flex items-center gap-2">
                ${getIcon("Coffee", "w-4 h-4 text-[#E29578]")} Standard Espresso
              </h3>
              
              <div class="space-y-5">
                <div class="group cursor-pointer">
                  <div class="flex justify-between font-serif font-semibold text-[#F5EBE0]">
                    <span class="group-hover:text-[#E29578] transition-colors">Espresso</span>
                    <span>£2.20</span>
                  </div>
                  <p class="text-xs text-[#8D6E63] mt-1">Double shot of our seasonal natural process Arabica house bean.</p>
                </div>

                <div class="group cursor-pointer">
                  <div class="flex justify-between font-serif font-semibold text-[#F5EBE0]">
                    <span class="group-hover:text-[#E29578] transition-colors">Americano</span>
                    <span>£2.80</span>
                  </div>
                  <p class="text-xs text-[#8D6E63] mt-1">Diluted house espresso. Rich depth of cocoa, stone fruit clean finish.</p>
                </div>

                <div class="group cursor-pointer">
                  <div class="flex justify-between font-serif font-semibold text-[#F5EBE0]">
                    <span class="group-hover:text-[#E29578] transition-colors">Flat White</span>
                    <span>£3.40</span>
                  </div>
                  <p class="text-xs text-[#8D6E63] mt-1">Double ristretto, velvety micro-foamed milk. Highly balanced & punchy.</p>
                </div>

                <div class="group cursor-pointer">
                  <div class="flex justify-between font-serif font-semibold text-[#F5EBE0]">
                    <span class="group-hover:text-[#E29578] transition-colors">Cappuccino</span>
                    <span>£3.20</span>
                  </div>
                  <p class="text-xs text-[#8D6E63] mt-1">Espresso, heavily aerated foam, shaved organic dark chocolate dusting.</p>
                </div>

                <div class="group cursor-pointer">
                  <div class="flex justify-between font-serif font-semibold text-[#F5EBE0]">
                    <span class="group-hover:text-[#E29578] transition-colors">Pour-over of the Week</span>
                    <span>£3.95</span>
                  </div>
                  <p class="text-xs text-[#8D6E63] mt-1">Slow drip filter extract. Rotating rare single-origins. Extremely clean.</p>
                </div>
              </div>
            </div>

            <!-- Center Column: Signature Brew Specials -->
            <div class="space-y-6 pt-6 md:pt-0 md:px-6">
              <h3 class="font-serif text-xl text-[#83C5BE] border-b border-[#83C5BE]/20 pb-2 flex items-center gap-2">
                ${getIcon("Sparkles", "w-4 h-4 text-[#83C5BE]")} Signature Specialties
              </h3>

              <div class="space-y-5" id="carls-spec-selector">
                ${signatures
                  .map(
                    (spec) => `
                  <div 
                    data-id="${spec.id}"
                    class="p-3 rounded-lg border border-transparent bg-[#221A16] hover:bg-[#29221E] transition-all duration-200 cursor-pointer text-left spec-item hover-lift"
                  >
                    <div class="flex justify-between font-serif font-semibold text-[#F5EBE0]">
                      <span class="text-[#83C5BE]">${spec.name}</span>
                      <span>${spec.price}</span>
                    </div>
                    <p class="text-xs text-[#8D6E63] mt-1">${spec.desc}</p>
                    <div class="roaster-note mt-2 text-[10px] text-[#E29578] bg-[#E29578]/10 px-2 py-1 rounded hidden font-mono">
                      ✨ Roaster Note: Highly recommended with oat milk!
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>

            <!-- Right Column: Bakery & Toasties -->
            <div class="space-y-6 pt-6 md:pt-0 md:pl-6">
              <h3 class="font-serif text-xl text-[#E29578] border-b border-[#E29578]/20 pb-2 flex items-center gap-2">
                ${getIcon("Coffee", "w-4 h-4 text-[#E29578]")} Handcrafted Food
              </h3>

              <div class="space-y-5">
                <div class="group cursor-pointer">
                  <div class="flex justify-between font-serif font-semibold text-[#F5EBE0]">
                    <span class="group-hover:text-[#E29578] transition-colors">Sourdough Croissants</span>
                    <span>£3.50</span>
                  </div>
                  <p class="text-xs text-[#8D6E63] mt-1">Flaky laminated butter pastry baked at sunrise using regional stone ground wheat.</p>
                </div>

                <div class="group cursor-pointer">
                  <div class="flex justify-between font-serif font-semibold text-[#F5EBE0]">
                    <span class="group-hover:text-[#E29578] transition-colors">Breakfast Toastie</span>
                    <span>£5.50</span>
                  </div>
                  <p class="text-xs text-[#8D6E63] mt-1">Crusty local sourdough, rich mature local dairy cheddar, wild garlic butter melt.</p>
                </div>

                <div class="group cursor-pointer">
                  <div class="flex justify-between font-serif font-semibold text-[#F5EBE0]">
                    <span class="group-hover:text-[#E29578] transition-colors">Cake of the Day</span>
                    <span>£4.00</span>
                  </div>
                  <p class="text-xs text-[#8D6E63] mt-1">Baked directly in-house. Rotating seasonal fruit sponges and vegan loaf cake slices.</p>
                </div>
              </div>

              <!-- Slate Note -->
              <div class="mt-4 p-3 bg-[#241E1B] text-xs text-[#8D6E63] rounded border border-[#3A2E28] font-mono leading-relaxed">
                📢 Allergen queries? Speak to one of our friendly baristas before ordering. Group booking bakes are available upon call ahead.
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Atmosphere Section -->
      <div class="bg-[#EFE8DE] border-y border-[#DCD3C7] py-16 px-4">
        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div class="md:col-span-7 space-y-4" data-reveal>
            <span class="font-mono text-xs text-[#E29578] font-bold tracking-widest uppercase">The Atmosphere</span>
            <blockquote class="font-serif text-2xl italic text-[#3E2723] leading-snug">
              “A local coffee house in the heart of the community, where time slows down and the beans are roasted just standard yards away.”
            </blockquote>
            <p class="text-sm text-[#70564F] leading-relaxed">
              We started in a medieval lane with a second-hand roaster and three wooden chairs. Here, we believe conversation should flow, screen brightness is turned down, and coffee should taste of its origin story—not sugar syrups.
            </p>
          </div>
          <div class="md:col-span-5 bg-white p-5 rounded-lg shadow-md border border-[#E3D6C5] rotate-1 space-y-4 hover-lift transition-transform duration-500" data-reveal data-reveal-delay="120">
            <div class="aspect-4/3 bg-[#3E2723]/5 rounded flex flex-col justify-center items-center text-center p-4 border border-[#3E2723]/10 relative">
              <span class="absolute top-3 left-3 text-[10px] font-mono bg-[#E29578]/10 text-[#E29578] px-2 py-0.5 rounded">Polaroid No. 12</span>
              ${getIcon("Coffee", "w-10 h-10 text-[#3E2723]/30 mb-2")}
              <p class="font-serif italic text-xs text-[#3E2723]/60">Our worn copper coffee bar seating looking over Bailey Street</p>
            </div>
            <div class="text-center font-mono text-xs text-[#8D6E63]">
              🕒 Open Daily from 8:00 AM - 4:00 PM
            </div>
          </div>
        </div>
      </div>

      <!-- Order Flow Strip -->
      <div class="bg-[#3E2723] text-[#FFF8E1] py-4 border-y border-[#3E2723]">
        <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-[#E29578] rounded-full"></span>
            <span>Walk-ins always welcome</span>
          </div>
          <div class="flex items-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#FFF8E1]/10 w-full sm:w-auto justify-center">
            ${getIcon("Phone", "w-3.5 h-3.5 text-[#E29578]")}
            <span>Call ahead orders: <strong>0191 386 2000</strong></span>
          </div>
          <div class="flex items-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#FFF8E1]/10 w-full sm:w-auto justify-center">
            ${getIcon("MapPin", "w-3.5 h-3.5 text-[#E29578]")}
            <span>Find us: <strong>12 Bailey Street, Durham</strong></span>
          </div>
        </div>
      </div>

      <!-- Standalone Location Section -->
      <div class="max-w-6xl mx-auto px-4 py-16">
        <h2 class="font-serif text-2xl font-bold mb-8 text-[#3E2723] flex items-center gap-2" data-reveal>
          ${getIcon("MapPin", "w-5 h-5 text-[#E29578]")} Local Coffee Reference & Map
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <!-- Left Side: Mock Map -->
          <div class="lg:col-span-7 bg-[#EFE8DE] rounded-xl border border-[#DCD3C7] p-2 flex flex-col min-h-[350px] hover-lift transition-transform duration-500" data-reveal data-reveal-delay="80">
            <div class="bg-[#FFFDF9] rounded-lg p-3 grow flex flex-col justify-between relative overflow-hidden">
              <div class="absolute inset-0 opacity-80">
                <svg class="w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="50" y1="0" x2="50" y2="300" stroke="#CBD5E0" stroke-width="12"></line>
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#CBD5E0" stroke-width="16"></line>
                  <line x1="180" y1="0" x2="180" y2="300" stroke="#CBD5E0" stroke-width="8"></line>
                  <line x1="0" y1="220" x2="400" y2="220" stroke="#CBD5E0" stroke-width="10"></line>
                  
                  <path d="M 0 50 Q 150 90 220 180 T 400 240" stroke="#006D77" stroke-width="24" stroke-opacity="0.2" fill="none"></path>
                  
                  <text x="12" y="35" fill="#4E342E" font-size="9" font-weight="bold" font-family="monospace">RIVER WEAR</text>
                  <text x="60" y="112" fill="#718096" font-size="7" font-family="sans-serif">Silver Street</text>
                  <text x="190" y="240" fill="#718096" font-size="7" font-family="sans-serif">Bailey Street</text>
                  <text x="235" y="145" fill="#4A3B32" font-size="9" font-weight="bold" font-family="serif">Durham Cathedral</text>

                  <circle cx="180" cy="180" r="10" fill="#E29578" opacity="0.3" class="animate-ping"></circle>
                  <circle cx="180" cy="180" r="5" fill="#3E2723"></circle>
                </svg>
              </div>

              <div class="relative z-10 self-start bg-[#3E2723]/95 text-[#FFF8E1] p-3 rounded-md shadow-md max-w-[200px] text-[10px] font-mono leading-normal">
                <p class="font-bold border-b border-[#FFFDF9]/10 pb-1 mb-1 text-xs">Carl’s Coffee Pin</p>
                <p>📍 12 Bailey Street, Durham, DH1 3EE</p>
                <p class="text-slate-400 mt-1">Near Durham Castle & River Banks</p>
              </div>

              <div class="relative z-10 self-end bg-white/95 text-[#3E2723] px-3 py-1.5 rounded border border-[#E3D6C5] shadow-sm text-[10px] font-mono">
                🗺️ Pure-styling local grid. Map Scale: 1 : 2,500
              </div>
            </div>
          </div>

          <!-- Right Side: Info + Busiest Times Interactive Slider/Chart -->
          <div class="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div class="bg-white p-6 rounded-xl border border-[#E3D6C5] space-y-4 hover-lift transition-transform duration-500" data-reveal data-reveal-delay="130">
              <h4 class="font-serif text-lg font-bold">Visiting & opening info</h4>
              
              <div class="space-y-2.5 text-sm">
                <div class="flex justify-between border-b border-stone-100 pb-1.5">
                  <span class="text-[#8D6E63] font-medium">Monday — Saturday</span>
                  <span class="font-mono">08:00 - 16:00</span>
                </div>
                <div class="flex justify-between border-b border-stone-100 pb-1.5">
                  <span class="text-[#8D6E63] font-medium">Sunday</span>
                  <span class="font-mono">09:30 - 15:00</span>
                </div>
                <div class="flex justify-between pb-1 flex-col">
                  <span class="text-[#8D6E63] font-medium">Contact Tel</span>
                  <a href="tel:01913862000" class="font-mono text-[#E29578] font-bold text-lg hover:underline mt-0.5">0191 386 2000</a>
                </div>
              </div>
            </div>

            <!-- Busiest Times Chart -->
            <div class="bg-[#FFFDF9] p-6 rounded-xl border border-[#E3D6C5] space-y-4 hover-lift transition-transform duration-500" data-reveal data-reveal-delay="180">
              <div class="flex justify-between items-center">
                <h4 class="font-serif text-sm font-bold flex items-center gap-1.5 text-[#3E2723]">
                  ${getIcon("Clock", "w-4 h-4 text-[#E29578]")} Daily Busiest Hours
                </h4>
                <span class="text-[10px] bg-[#E29578]/10 text-[#E29578] px-2 py-0.5 rounded font-mono font-bold">Live Reference</span>
              </div>
              
              <div class="space-y-3">
                ${busyData
                  .map(
                    (data) => `
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs font-mono">
                      <span>${data.hour}</span>
                      <span class="${data.label === "Peak Busy" ? "text-rose-600 font-bold" : "text-[#8D6E63]"}">
                        ${data.busy} (${data.label})
                      </span>
                    </div>
                    <div class="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        class="h-full rounded-full transition-all duration-500 ${
                          data.label === "Peak Busy"
                            ? "bg-rose-500"
                            : data.label === "Steady"
                              ? "bg-amber-500"
                              : "bg-[#006D77]"
                        } ${getBusyWidthClass(data.busy)}"
                      ></div>
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
              <p class="text-[10px] text-[#8D6E63] italic leading-tight pt-1">
                * Note: Saturday late-mornings see peak espresso volumes. For quiet, cozy reading sessions, we recommend Tuesdays and Wednesdays.
              </p>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer -->
      <footer class="border-t border-[#3E2723]/10 bg-[#FAF6F0] py-8 text-xs text-center text-[#8D6E63]">
        <div class="max-w-4xl mx-auto px-4 font-mono">
          <p>© 2026 Septen</p>
        </div>
      </footer>
    </div>
  `;

  bindCarlsCoffee(container);
}

export function initCarlsCoffee(container: DemoContainer): void {
  bindCarlsCoffee(container);
}
