import { getIcon } from "@utils/ui";
import { openDemoModalLazy } from "@utils/ui";
import type { DemoContainer } from "@demos/shared/types";

function bindAlderPipePlumbing(container: DemoContainer): void {
  const handleCta = async (e?: Event) => {
    if (e) e.preventDefault();
    await openDemoModalLazy("Alder & Pipe Plumbing");
  };

  container.querySelector("#alder-pipe-enquiry-form")?.addEventListener("submit", handleCta);
}

export function renderAlderPipePlumbing(container: DemoContainer): void {
  const caseStudies = [
    {
      title: "Bathroom refurbishment in Gosforth",
      subtitle: "A modern walk-in shower conversion",
      story:
        "We were contacted to completely modernise a compact family bathroom in a period house in Gosforth. The project involved carefully stripping out outdated bath fittings, relocating internal pipe runs to optimize floor layout, and preparing the surfaces for plastering. We installed low-profile slate-effect tiling, a bespoke glass wetroom screen, and thermostatic rainfall brassware. By focusing on alignment, soundproofing backboards, and leakproof waterproofing membranes, we delivered a calm, spacious sanctuary designed to stand up to heavy daily family use.",
      result:
        "A quiet, watertight, and elegant bathroom that preserves the character of the house while introducing high-performance modern fixtures.",
    },
    {
      title: "Kitchen pipe replacement in Heaton",
      subtitle: "Full lead and iron pipework modernization",
      story:
        "While planning a kitchen extension, a homeowner in Heaton requested our assistance to inspect and modernize ageing under-floor plumbing. Upon survey, we found a mixture of historic lead supply pipes and oxidised steel drainage lines. We carefully routed new high-grade copper feed lines to the sink and appliances, replaced all waste outfalls with modern silent drainage seals, and installed a clean manifold system with individual shut-offs under the counter for easy future isolating.",
      result:
        "Improved flow pressure, clean incoming water lines, and total peace of mind before the new kitchen cabinetry was permanently fitted.",
    },
    {
      title: "Heating system overhaul in Jesmond",
      subtitle: "Boiler migration and copper radiator manifolds",
      story:
        "This Victorian property suffered from cold spots and unbalanced heating across three storeys. We migrated the boiler to an external wall casing, flushed the historic iron radiators to remove system sludge, and created structured branch loops with smart thermostatic valves. The pipework was meticulously hand-bent and left exposed in places as requested, matching the copper hardware of the interior styling.",
      result:
        "An exceptionally quiet system that heats up quickly and evenly on every floor, lowering weekly domestic heating bills.",
    },
  ];

  container.innerHTML = `
    <div class="bg-[#FAFBFB] min-h-screen text-[#334155] font-sans antialiased text-left">
      
      <!-- Navigation -->
      <nav class="bg-white border-b border-stone-200">
        <div class="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center justify-center md:justify-start gap-2.5 w-full md:w-auto">
            <div class="w-8 h-8 rounded bg-[#2C5282]/10 flex items-center justify-center text-[#2C5282] font-semibold text-sm shrink-0">
              A&P
            </div>
            <span class="font-serif font-bold text-xl tracking-tight text-[#1E293B]">
              Alder & Pipe <span class="text-slate-600 font-light font-sans text-sm">Plumbing</span>
            </span>
          </div>

          <div class="flex flex-wrap justify-center items-center gap-x-4 gap-y-2.5 md:gap-x-6 text-[0.8125rem] font-medium tracking-wider uppercase text-slate-500">
            <a href="#about" class="hover:text-[#2C5282] transition-colors">Our Approach</a>
            <a href="#services" class="hover:text-[#2C5282] transition-colors">Services</a>
            <a href="#examples" class="hover:text-[#2C5282] transition-colors">Work Examples</a>
            <a
              href="#contact"
              class="bg-[#2C5282] hover:bg-[#1A365D] text-white px-4 py-2 rounded text-[0.75rem] uppercase font-bold tracking-widest transition-colors hover-button-polish font-mono cursor-pointer border-none shrink-0"
            >
              Request a Consultation
            </a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="bg-[#FAFBFB] border-b border-slate-100 min-h-[calc(100svh-6rem)] md:min-h-[calc(100svh-4.5rem)] flex flex-col justify-center">
        <div class="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-360 4xl:max-w-[110rem] mx-auto px-6 xl:px-10 2xl:px-14 3xl:px-20 4xl:px-24 py-10 md:py-12 xl:py-16 3xl:py-24 grid grid-cols-1 md:grid-cols-12 gap-12 xl:gap-16 3xl:gap-20 4xl:gap-24 items-center">
          
          <div class="md:col-span-6 space-y-6 xl:space-y-8 3xl:space-y-10 text-left" data-reveal>
            <span class="text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-[#2C5282] font-extrabold font-mono block">
              Established North East Craft
            </span>
            <h1 class="font-serif text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-extrabold text-[#1E293B] leading-[1.12] max-w-2xl 3xl:max-w-3xl">
              Reliable home plumbing & maintenance.
            </h1>
            <p class="text-slate-600 text-[15px] xl:text-base 2xl:text-lg 3xl:text-xl leading-relaxed max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl">
              We provide deliberate, high-quality domestic plumbing and home system care for properties across the North East of England. By focusing on meticulous installation details, quiet pipes, and lasting domestic safety, we help local homeowners keep their spaces warm, dry, and trouble-free.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-3 xl:gap-4 pt-2 xl:pt-4">
              <a
                href="#contact"
                class="bg-[#2C5282] hover:bg-[#1A365D] text-white font-bold text-[0.8125rem] xl:text-sm 3xl:text-base py-3.5 xl:py-4 3xl:py-5 px-6 xl:px-8 3xl:px-10 rounded transition-colors hover-button-polish border-none cursor-pointer tracking-wider text-center inline-flex items-center justify-center"
              >
                Request Consultation
              </a>
              <a 
                href="#services"
                class="bg-transparent hover:border-[#2C5282] hover:text-[#1A365D] hover:shadow-[0_0.85rem_2rem_rgba(15,23,42,0.08)] text-[#2C5282] border-slate-300 border border-solid text-center font-bold text-[0.8125rem] xl:text-sm 3xl:text-base py-3.5 xl:py-4 3xl:py-5 px-6 xl:px-8 3xl:px-10 rounded transition-all cursor-pointer tracking-wider inline-flex items-center justify-center"
              >
                Explore Services
              </a>
            </div>

            <div class="flex gap-6 xl:gap-8 pt-2 xl:pt-4 text-[0.8125rem] xl:text-sm 3xl:text-base text-slate-500 font-mono">
              <span class="flex items-center gap-1.5">${getIcon("MapPin", "w-3.5 h-3.5 text-slate-400")} Newcastle & Surrounds</span>
              <span class="flex items-center gap-1.5">${getIcon("ShieldCheck", "w-3.5 h-3.5 text-slate-400")} Fully Insured & Registered</span>
            </div>
          </div>

          <div class="md:col-span-6" data-reveal data-reveal-delay="120">
            <div class="relative rounded-lg overflow-hidden shadow-sm aspect-video sm:aspect-4/3 bg-slate-100 hover-lift transition-transform duration-300">
              __ALDER_PIPE_HERO_IMAGE__
            </div>
          </div>

        </div>
      </section>

      <!-- About & Philosophy -->
      <section id="about" class="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-6 py-16 2xl:py-20 3xl:py-24 text-left">
        <div class="max-w-2xl 3xl:max-w-3xl space-y-4 3xl:space-y-6" data-reveal>
          <span class="text-[0.75rem] xl:text-xs 3xl:text-sm text-[#2C5282] font-black uppercase font-mono tracking-widest">Our Approach</span>
          <h2 class="font-serif text-2xl md:text-3xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-extrabold text-[#1E293B]">Why local reputation is our single focus</h2>
          <p class="text-sm xl:text-base 2xl:text-lg 3xl:text-xl text-slate-600 leading-relaxed">
            Plumbing is more than quickly stopping water. It is about understanding the fabric of domestic properties, using appropriate materials, and making sure that all joints, pressures, and water directions are locked in with surgical precision.
          </p>
          <p class="text-sm xl:text-base 2xl:text-lg 3xl:text-xl text-slate-600 leading-relaxed">
            We avoid rushed emergency dispatch setups and flashing booking grids. Instead, we run a deliberate residential workspace focused on high-trust, direct client advisory, and careful installations that prevent problems long before they can appear.
          </p>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" class="bg-white border-y border-stone-200/60 py-20 2xl:py-24 3xl:py-28">
        <div class="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-6 text-left">
          <div class="mb-12 3xl:mb-16" data-reveal>
            <span class="text-[0.75rem] xl:text-xs 3xl:text-sm uppercase font-mono tracking-widest text-[#2C5282] font-black">Domestic Care</span>
            <h2 class="font-serif text-2xl md:text-3xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-extrabold text-[#1E293B] mt-1">Our Services</h2>
            <div class="w-12 3xl:w-16 h-[1.5px] 3xl:h-0.5 bg-[#2C5282] mt-3 3xl:mt-5"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 3xl:gap-12">
            
            <div class="space-y-3 3xl:space-y-5 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="40">
              <h3 class="font-serif font-bold text-lg xl:text-xl 3xl:text-2xl text-[#1E293B]">Boiler Servicing</h3>
              <p class="text-[0.8125rem] md:text-sm xl:text-base 3xl:text-lg text-slate-600 leading-relaxed">
                Thorough diagnostics, systematic internal soot clearance, water pressure balancing, and compliance ventilation checks to maintain heat efficiency throughout cold seasons.
              </p>
            </div>

            <div class="space-y-3 3xl:space-y-5 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="80">
              <h3 class="font-serif font-bold text-lg xl:text-xl 3xl:text-2xl text-[#1E293B]">Bathroom Installations</h3>
              <p class="text-[0.8125rem] md:text-sm xl:text-base 3xl:text-lg text-slate-600 leading-relaxed">
                Complete design integration and sanitary ware placement. We manage wetroom brickwork levelling, waterproofing, tile alignments, and robust hot/cold copper supply arrays.
              </p>
            </div>

            <div class="space-y-3 3xl:space-y-5 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="120">
              <h3 class="font-serif font-bold text-lg xl:text-xl 3xl:text-2xl text-[#1E293B]">Leak Repairs</h3>
              <p class="text-[0.8125rem] md:text-sm xl:text-base 3xl:text-lg text-slate-600 leading-relaxed">
                Quiet, nondestructive moisture monitoring, pinpoint copper leak sealing, and modern rubber flange replacements inside floorboards or walls with minimum disruption.
              </p>
            </div>

            <div class="space-y-3 3xl:space-y-5 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="160">
              <h3 class="font-serif font-bold text-lg xl:text-xl 3xl:text-2xl text-[#1E293B]">Pipework Upgrades</h3>
              <p class="text-[0.8125rem] md:text-sm xl:text-base 3xl:text-lg text-slate-600 leading-relaxed">
                Relocation of rusty galvanized pipe networks, clean expansion loops, and copper pipe system replacement to guarantee clear flow capacity and prevent chemical oxidisation.
              </p>
            </div>

            <div class="space-y-3 3xl:space-y-5 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="200">
              <h3 class="font-serif font-bold text-lg xl:text-xl 3xl:text-2xl text-[#1E293B]">General Home Plumbing Care</h3>
              <p class="text-[0.8125rem] md:text-sm xl:text-base 3xl:text-lg text-slate-600 leading-relaxed">
                Replacement of worn shut-off main tap valves, dishwasher installations, cistern mechanism overhauls, high-flow water pump integrations, and attic cold-storage checks.
              </p>
            </div>

            <div class="space-y-3 3xl:space-y-5 bg-slate-50 p-6 3xl:p-10 rounded border border-slate-100 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="240">
              <h3 class="font-serif font-bold text-sm xl:text-base 3xl:text-xl text-[#2C5282]">Quality Statement</h3>
              <p class="text-[0.75rem] xl:text-xs 3xl:text-base text-slate-500 leading-relaxed">
                Every repair uses thick-gauge materials sourced exclusively from trade associations. No cheap, fragile plastic joints, and no shortcut measures. All work is fully tested for double expansion stresses before we consider our job finished.
              </p>
            </div>

          </div>
        </div>
      </section>

      <!-- Narrative Case Studies ("Work Examples") -->
      <section id="examples" class="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-360 mx-auto px-6 xl:px-10 3xl:px-20 py-20 2xl:py-24 3xl:py-28 text-left">
        <div class="mb-12 3xl:mb-16" data-reveal>
          <span class="text-[0.75rem] xl:text-xs 3xl:text-sm uppercase font-mono tracking-widest text-[#2C5282] font-black">Our Archive</span>
          <h2 class="font-serif text-2xl md:text-3xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-extrabold text-[#1E293B] mt-1">Work Examples</h2>
          <p class="text-[#334155]/70 text-[0.8125rem] xl:text-sm 3xl:text-base mt-1.5 3xl:mt-3 font-mono">Real-world stories from local domestic installations</p>
        </div>

        <div class="space-y-12 3xl:space-y-16">
          ${caseStudies
            .map(
              (study) => `
            <div class="bg-white rounded-lg p-6 md:p-8 3xl:p-12 border border-stone-200/70 shadow-sm space-y-4 3xl:space-y-6 hover-lift transition-transform duration-300" data-reveal>
              <div class="border-b border-slate-100 pb-3 3xl:pb-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 3xl:gap-3">
                <h3 class="font-serif font-extrabold text-xl xl:text-2xl 3xl:text-4xl text-[#1E293B]">${study.title}</h3>
                <span class="text-[0.8125rem] xl:text-sm 3xl:text-base text-slate-400 font-mono italic">${study.subtitle}</span>
              </div>
              <p class="text-sm md:text-base xl:text-lg 3xl:text-xl text-slate-600 leading-relaxed">${study.story}</p>
              <div class="bg-slate-50/70 p-4 3xl:p-6 rounded border-l-2 3xl:border-l-[3px] border-[#2C5282] text-[0.8125rem] xl:text-sm 3xl:text-lg text-slate-700 italic font-medium leading-relaxed">
                <strong>Result:</strong> ${study.result}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </section>

      <!-- Understated Trust Section -->
      <section class="bg-slate-950 text-slate-300 py-16 2xl:py-20 3xl:py-28 border-t border-slate-900">
        <div class="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-360 mx-auto px-6 xl:px-10 3xl:px-20 text-left space-y-8 3xl:space-y-12">
          <div data-reveal>
            <span class="text-[0.6875rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-[#82B0D2] font-black font-mono block">Workmanship Credentials</span>
            <h2 class="font-serif text-2xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold text-white mt-1">Our Standards</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 3xl:gap-12">
            <div class="space-y-2 3xl:space-y-4 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="60">
              <p class="text-white font-serif font-bold text-md xl:text-xl 3xl:text-3xl">Full Insurance Coverage</p>
              <p class="text-[0.8125rem] md:text-sm xl:text-base 3xl:text-lg text-slate-400 leading-relaxed">
                Alder & Pipe is fully protected by comprehensive £5,000,000 public trade liability insurance, safeguarding all building structures and household fixtures during our presence.
              </p>
            </div>
            <div class="space-y-2 3xl:space-y-4 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="120">
              <p class="text-white font-serif font-bold text-md xl:text-xl 3xl:text-3xl">Registered & Qualified</p>
              <p class="text-[0.8125rem] md:text-sm xl:text-base 3xl:text-lg text-slate-400 leading-relaxed">
                Our technicians are fully certified gas-installer professionals with advanced domestic level plumbing accreditation and full health compliance safety training.
              </p>
            </div>
            <div class="space-y-2 3xl:space-y-4 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="180">
              <p class="text-white font-serif font-bold text-md xl:text-xl 3xl:text-3xl">Twelve-Month Warranty</p>
              <p class="text-[0.8125rem] md:text-sm xl:text-base 3xl:text-lg text-slate-400 leading-relaxed">
                Every pipe alignment, rubber fitting, boiler seal, and copper compression nut we set is backed by our direct, straightforward 12-month domestic craftsmanship warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Understated Enquiry Block -->
      <section id="contact" class="bg-[#FAFBFB] py-16 2xl:py-20 3xl:py-24 border-t border-stone-200 text-center">
        <div class="max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl mx-auto px-6 xl:px-10 3xl:px-20 space-y-6 3xl:space-y-8" data-reveal>
          <h2 class="font-serif text-2xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-extrabold text-[#1E293B]">Discuss Your Plumbing Plans</h2>
          <p class="text-[0.8125rem] md:text-sm xl:text-base 3xl:text-lg text-slate-600 leading-relaxed">
            Whether planning a kitchen redesign, scheduling regular boiler system servicing, or looking to stabilize water pressure, our team is happy to schedule a quiet site visit.
          </p>

          <form id="alder-pipe-enquiry-form" class="space-y-3 3xl:space-y-5 max-w-sm 2xl:max-w-md 3xl:max-w-lg mx-auto text-left">
            <div>
              <label for="alder-pipe-name" class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-widest text-slate-500 font-bold block leading-4 mb-1.5 3xl:mb-2.5">Your Name</label>
              <input id="alder-pipe-name" name="name" type="text" required placeholder="William Armstrong" class="w-full bg-white border border-stone-200 rounded p-2.5 xl:p-3.5 3xl:p-4 text-[0.8125rem] xl:text-sm 3xl:text-base text-slate-800 focus:outline-none focus:border-[#2C5282]" />
            </div>
            <div>
              <label for="alder-pipe-postcode" class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-widest text-slate-500 font-bold block leading-4 mb-1.5 3xl:mb-2.5">Home Postcode</label>
              <input id="alder-pipe-postcode" name="postcode" type="text" required placeholder="e.g. NE3 1AA" class="w-full bg-white border border-stone-200 rounded p-2.5 xl:p-3.5 3xl:p-4 text-[0.8125rem] xl:text-sm 3xl:text-base text-slate-800 focus:outline-none focus:border-[#2C5282]" />
            </div>
            <div>
              <label for="alder-pipe-details" class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-widest text-slate-500 font-bold block leading-4 mb-1.5 3xl:mb-2.5">Request details</label>
              <textarea id="alder-pipe-details" name="details" rows="3" 3xl:rows="4" placeholder="Describe your domestic plumbing plans or maintenance requirements..." class="w-full bg-white border border-stone-200 rounded p-2.5 xl:p-3.5 3xl:p-4 text-[0.8125rem] xl:text-sm 3xl:text-base text-slate-800 focus:outline-none focus:border-[#2C5282] resize-none font-sans"></textarea>
            </div>
            <button type="submit" class="w-full bg-[#2C5282] hover:bg-[#1A365D] text-white font-bold p-3 xl:p-4 3xl:p-5 text-[0.8125rem] xl:text-sm 3xl:text-base uppercase tracking-widest hover-button-polish font-mono rounded border-none cursor-pointer">
              Schedule Discussion
            </button>
          </form>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-white border-t border-stone-200 py-8 text-center text-[0.8125rem] text-slate-600 font-mono">
        © 2026 Septen
      </footer>

    </div>
  `;

  bindAlderPipePlumbing(container);
}

export function initAlderPipePlumbing(container: DemoContainer): void {
  bindAlderPipePlumbing(container);
}
