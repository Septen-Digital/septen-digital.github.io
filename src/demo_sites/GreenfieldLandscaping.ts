import { getIcon } from '../utils/icons';
import { openDemoModalLazy } from '../utils/lazyDemoModal';
import { responsiveImageAttrs } from './responsiveImage';
import type { DemoContainer } from './types';

function bindGreenfieldLandscaping(container: DemoContainer): void {
  const handleSurveyCta = async (e?: Event) => {
    if (e) e.preventDefault();
    await openDemoModalLazy("Greenfield Landscaping");
  };

  container.querySelector('#greenfield-nav-cta')?.addEventListener('click', handleSurveyCta);
  container.querySelector('#greenfield-hero-cta')?.addEventListener('click', handleSurveyCta);
  container.querySelector('#greenfield-contact-form')?.addEventListener('submit', handleSurveyCta);
}

export function renderGreenfieldLandscaping(container: DemoContainer): void {
  const caseStudies = [
    {
      title: "Rural courtyard garden in Morpeth",
      scope: "Sandstone paving & dry-stone retainer",
      text: "The client contacted us to transform an uneven, damp clay yard behind their barn conversion. We began by excavating 12 tonnes of unstable topsoil, grading the slope, and compacting a deep limestone sub-base. We laid hand-dressed fossil mint sandstone paving flags, pointing them with weather-resistant polymer resin. To manage the slope, we constructed a small dry-stone retaining wall using locally quarried limestone, creating raised soil beds finished with dark organic mulch.",
      outcome: "A perfectly level, beautifully draining sandstone courtyard that blends seamlessly with the rural Northumberland landscape."
    },
    {
      title: "Suburban family lawn in Gosforth, Newcastle",
      scope: "Lawn drainage & cedar privacy screens",
      text: "This suburban plot suffered from poor drainage and ancient, rotted perimeter fencing. We installed dual perforated land drainage pipes leading to a gravel soakaway, resolving the standing water issue. We sourced premium cultivated ryegrass turf and laid it over enriched sandy loam. Finally, we constructed contemporary horizontal slatted cedar privacy screens along the boundary, treating them with weather-proofing oils.",
      outcome: "A bright, kid-safe lawn with robust drainage and modern luxury fencing that offers long-term privacy and shelter."
    },
    {
      title: "Victorian walled garden in Alnwick",
      scope: "Structured larch timber decking & borders",
      text: "A historical property featuring brick boundary walls required a low-maintenance social area. We framed a heavy-duty timber carcass using pressure-treated pine posts anchored deep in concrete. We capped this with a premium kiln-dried Siberian larch timber deck, leaving microscopic expansion gaps for joint breathing. We added brickwork borders using reclaimed Victorian bricks to match the existing boundary walls.",
      outcome: "A beautiful, premium timber terrace integrated with historical brickwork borders that resists rot and damp without heavy maintenance."
    },
    {
      title: "Commercial patio lounge in Ponteland",
      scope: "Durable granite paving & heavy-gauge planters",
      text: "We were hired to create an outdoor seating area for a local service showroom. The project demanded heavy-traffic resistance and pristine aesthetics. We utilized thick silver-grey granite paving flags laid over a reinforced concrete slab to prevent any future sinking. We bordered the patio with custom-welded, heavy-gauge steel planters filled with structural evergreen grasses and modern architectural lighting.",
      outcome: "A striking, highly durable commercial-grade courtyard that remains beautiful and safe under heavy customer foot traffic and harsh winters."
    }
  ];

  container.innerHTML = `
    <div class="bg-[#FAF9F5] min-h-screen overflow-x-hidden text-[#223322] font-sans antialiased text-left">
      
      <!-- Navigation header banner -->
      <nav class="bg-white border-b border-stone-200">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center justify-center md:justify-start gap-2 w-full md:w-auto min-w-0">
            ${getIcon('Shrub', 'w-5 h-5 text-[#2C5E3B]')}
            <span class="font-serif font-bold text-lg text-stone-900 tracking-tight text-center md:text-left leading-tight wrap-break-word">
              Greenfield Landscaping <span class="text-stone-400 font-sans text-xs font-normal">UK</span>
            </span>
          </div>

          <div class="flex w-full md:w-auto flex-wrap justify-center items-center gap-x-4 gap-y-2.5 md:gap-x-6 text-[0.6875rem] sm:text-xs font-semibold uppercase tracking-widest text-[#223322]">
            <a href="#services" class="hover:text-[#2C5E3B] transition-colors">Services</a>
            <a href="#portfolio" class="hover:text-[#2C5E3B] transition-colors">Portfolio</a>
            <a href="#contact" class="hover:text-[#2C5E3B] transition-colors">Contact Us</a>
            <button 
              id="greenfield-nav-cta"
              class="bg-[#2C5E3B] hover:bg-[#1E4228] text-white px-4 py-2 rounded text-[10px] uppercase font-bold tracking-widest transition-colors hover-button-polish cursor-pointer border-none font-mono shrink-0"
            >
              Get a Quote
            </button>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative bg-stone-950 text-white py-20 md:py-32 overflow-hidden border-b border-[#2C5E3B]/10 min-h-[22rem] md:min-h-[28rem]">
        <div class="absolute inset-0 z-0 min-h-full">
          <img 
            ${responsiveImageAttrs({
              src: '/demo-images/greenfield-landscaping/hero.webp',
              baseWidth: 1400,
              variantWidths: [480, 960],
              sizes: '100vw',
            })}
            alt="Completed garden landscape and sandstone paving sandstone flags" 
            loading="eager"
            fetchpriority="high"
            decoding="async"
            class="w-full h-full min-h-full object-cover opacity-55"
          />
          <div class="absolute inset-0 bg-stone-950/40"></div>
        </div>

        <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-6 text-left" data-reveal>
          <span class="text-[10px] uppercase tracking-[0.25em] text-[#A6D6AE] font-black font-mono block">
            Custom Garden Design & Construction
          </span>
          <h1 class="font-serif text-3xl sm:text-5xl font-extrabold leading-tight text-white max-w-2xl">
            Established garden design & landscaping across the North East.
          </h1>
          <p class="text-stone-200 text-sm sm:text-base leading-relaxed max-w-xl">
            We provide Greenfield Landscaping’s premium domestic and commercial design and build services across Morpeth, Newcastle, and Alnwick. From excavation to final timber detailing, we do the heavy work cleanly and properly.
          </p>

          <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 pt-3">
            <button 
              id="greenfield-hero-cta"
              class="w-full sm:w-auto bg-[#2C5E3B] hover:bg-[#1E4228] text-white font-bold text-xs py-3.5 px-6 rounded transition-colors hover-button-polish border-none cursor-pointer text-center"
            >
              Consult Our Team
            </button>
            <a 
              href="#portfolio"
              class="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-solid border-white/20 font-bold text-xs py-3.5 px-6 rounded transition-all text-center cursor-pointer"
            >
              View Completed Work
            </a>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 text-xs font-mono text-stone-300">
            <span class="flex items-center gap-1.5">${getIcon('MapPin', 'w-4 h-4 text-[#A6D6AE]')} Newcastle • Morpeth • Alnwick</span>
            <span class="flex items-center gap-1.5">${getIcon('CheckCircle', 'w-4 h-4 text-[#A6D6AE]')} 12+ Years Local Groundwork Experience</span>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" class="max-w-5xl mx-auto px-6 py-20 text-left">
        <div class="border-b border-stone-200 pb-6 mb-12" data-reveal>
          <span class="text-[10px] uppercase font-mono tracking-widest text-[#2C5E3B] font-black block">What We Do</span>
          <h2 class="font-serif text-2xl md:text-3xl font-extrabold text-[#223322]">Our Services</h2>
          <p class="text-xs text-stone-500 font-serif italic mt-1">Groundwork, woodwork, and brick installations completed to professional trade standards.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div class="space-y-2.5 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="40">
            <div class="w-10 h-10 bg-[#2C5E3B]/10 text-[#2C5E3B] rounded flex items-center justify-center">
              ${getIcon('Compass', 'w-5 h-5')}
            </div>
            <h3 class="font-serif font-black text-lg text-stone-900">Complete Garden Design</h3>
            <p class="text-xs text-stone-600 leading-relaxed font-sans">
              Systematic planning matching gradients, drainage levels, lighting layout, and botanical selection before digging. No shortcuts.
            </p>
          </div>

          <div class="space-y-2.5 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="80">
            <div class="w-10 h-10 bg-[#2C5E3B]/10 text-[#2C5E3B] rounded flex items-center justify-center font-bold font-mono">
              SP
            </div>
            <h3 class="font-serif font-black text-lg text-stone-900">Natural & Sandstone Paving</h3>
            <p class="text-xs text-stone-600 leading-relaxed font-sans">
              Precisely laid Fossil Mint, Indian Sandstone, and granite paths. Hand-dressed, laid on solid mortar beds with weather-proof pointing.
            </p>
          </div>

          <div class="space-y-2.5 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="120">
            <div class="w-10 h-10 bg-[#2C5E3B]/10 text-[#2C5E3B] rounded flex items-center justify-center">
              ${getIcon('Hammer', 'w-5 h-5')}
            </div>
            <h3 class="font-serif font-black text-lg text-stone-900">Timber Decking & Screens</h3>
            <p class="text-xs text-stone-600 leading-relaxed font-sans">
              Heavy-duty pine sub-frames capped with premium larch or red cedar decking. Tailored solid wood privacy panels built to stay straight.
            </p>
          </div>

          <div class="space-y-2.5 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="160">
            <div class="w-10 h-10 bg-[#2C5E3B]/10 text-[#2C5E3B] rounded flex items-center justify-center font-bold font-mono">
              PT
            </div>
            <h3 class="font-serif font-black text-lg text-stone-900">Premium Turf Installation</h3>
            <p class="text-xs text-stone-600 leading-relaxed font-sans">
              Deep clay treatment, soil leveling, and laying premium weed-free cultivated ryegrass turf for a thick, resilient green surface.
            </p>
          </div>

          <div class="space-y-2.5 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="200">
            <div class="w-10 h-10 bg-[#2C5E3B]/10 text-[#2C5E3B] rounded flex items-center justify-center font-bold font-mono">
              BB
            </div>
            <h3 class="font-serif font-black text-lg text-stone-900">Brickwork Borders</h3>
            <p class="text-xs text-stone-600 leading-relaxed font-sans">
              Sturdy retainers, steps, and plant beds using traditional engineering bricks or local reclaimed brickwork to blend with old architectural borders.
            </p>
          </div>

          <div class="bg-[#FAF9F5] border border-stone-200 p-5 rounded space-y-2 flex flex-col justify-between hover-lift transition-transform duration-300" data-reveal data-reveal-delay="240">
            <div>
              <h4 class="text-xs font-mono font-bold uppercase text-stone-500">Trade Promise</h4>
              <p class="text-[11px] text-stone-600 mt-1 font-serif italic">
                “We never lay stones on soft sand, and we never use fragile prefabricated timber panels. We build to last years of heavy UK rain.”
              </p>
            </div>
            <span class="text-[9px] font-mono text-stone-400 font-bold">— Peter Greenfield, Founder</span>
          </div>

        </div>
      </section>

      <!-- Portfolio Section -->
      <section id="portfolio" class="bg-white border-y border-stone-200/60 py-20">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 text-left">
          <div class="mb-12" data-reveal>
            <span class="text-[10px] uppercase font-mono tracking-widest text-[#2C5E3B] font-black">Our Portfolio</span>
            <h2 class="font-serif text-2xl md:text-3xl font-extrabold text-[#223322]">Completed Transformations</h2>
            <p class="text-stone-500 text-xs mt-1.5 font-mono">Narrative logs documenting actual domestic projects</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            ${caseStudies.map((study) => `
              <div class="bg-[#FAF9F5] border border-stone-200 rounded p-6 shadow-xs flex flex-col justify-between space-y-4 hover-lift transition-transform duration-300 min-w-0" data-reveal>
                <div class="space-y-3">
                  <div class="border-b border-stone-200/65 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
                    <h3 class="font-serif font-black text-lg text-[#223322] min-w-0">${study.title}</h3>
                    <span class="inline-flex w-fit max-w-full whitespace-normal leading-relaxed text-[8px] sm:text-[9px] font-mono text-[#2C5E3B] bg-[#2C5E3B]/10 px-2 py-1 rounded font-black uppercase shrink-0">
                      ${study.scope}
                    </span>
                  </div>
                  <p class="text-xs text-stone-600 leading-relaxed font-sans">
                    ${study.text}
                  </p>
                </div>
                <div class="bg-white border border-stone-200/40 p-3.5 rounded text-xs italic font-serif text-stone-700">
                  <strong>Outcome:</strong> ${study.outcome}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Recent quick snaps -->
      <section class="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-left">
        <h3 class="font-serif font-bold text-xl text-[#223322] mb-6" data-reveal>Recent Work Snaps</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div class="bg-stone-100 border border-stone-200 rounded overflow-hidden hover-lift transition-transform duration-300" data-reveal data-reveal-delay="60">
            <div class="aspect-video bg-stone-100">
              <img ${responsiveImageAttrs({
                src: '/demo-images/greenfield-landscaping/patio-steps.webp',
                baseWidth: 900,
                variantWidths: [320, 560],
                sizes: '(min-width: 64rem) 18rem, (min-width: 40rem) 50vw, 100vw',
              })} alt="Completed patio steps and stone edging" loading="lazy" fetchpriority="low" decoding="async" data-skeleton class="image-skeleton image-skeleton-flush w-full h-full object-cover" />
            </div>
            <div class="bg-stone-100 p-4 text-xs font-mono text-stone-500">
              # Patio stone steps and edging, Jesmond
            </div>
          </div>

          <div class="bg-stone-100 border border-stone-200 rounded overflow-hidden hover-lift transition-transform duration-300" data-reveal data-reveal-delay="110">
            <div class="aspect-video bg-stone-100">
              <img ${responsiveImageAttrs({
                src: '/demo-images/greenfield-landscaping/ryegrass.webp',
                baseWidth: 900,
                variantWidths: [320, 560],
                sizes: '(min-width: 64rem) 18rem, (min-width: 40rem) 50vw, 100vw',
              })} alt="Freshly laid cultivated ryegrass lawn" loading="lazy" fetchpriority="low" decoding="async" data-skeleton class="image-skeleton image-skeleton-flush w-full h-full object-cover" />
            </div>
            <div class="bg-stone-100 p-4 text-xs font-mono text-stone-500">
              # Premium ryegrass finish, Alnwick
            </div>
          </div>

          <div class="bg-stone-100 border border-stone-200 rounded overflow-hidden hover-lift transition-transform duration-300" data-reveal data-reveal-delay="160">
            <div class="aspect-video bg-stone-100">
              <img ${responsiveImageAttrs({
                src: '/demo-images/greenfield-landscaping/cedar-fencing.webp',
                baseWidth: 900,
                variantWidths: [320, 560],
                sizes: '(min-width: 64rem) 18rem, (min-width: 40rem) 50vw, 100vw',
              })} alt="Cedar fencing and privacy screens" loading="lazy" fetchpriority="low" decoding="async" data-skeleton class="image-skeleton image-skeleton-flush w-full h-full object-cover" />
            </div>
            <div class="bg-stone-100 p-4 text-xs font-mono text-stone-500">
              # Cedar privacy fencing, Morpeth Croft
            </div>
          </div>

        </div>
      </section>

      <!-- Enquiry / Contact Us Form Section -->
      <section id="contact" class="bg-stone-100 border-t border-stone-200 py-16 text-center">
        <div class="max-w-xl mx-auto px-4 sm:px-6 space-y-6" data-reveal>
          <h2 class="font-serif text-2xl font-extrabold text-[#223322]">Request a Garden Transformation Survey</h2>
          <p class="text-xs md:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
            Our survey team visits sites across Northumberland regularly. Submit garden dimensions and describe what you are looking for.
          </p>

          <form id="greenfield-contact-form" class="space-y-3 p-6 bg-white border border-stone-200 rounded-lg text-left shadow-xs hover-lift transition-transform duration-300">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1">Your Full Name</label>
                <input type="text" required placeholder="Alistair Graham" class="w-full border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-[#2C5E3B]" />
              </div>
              <div>
                <label class="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1">North East Postcode</label>
                <input type="text" required placeholder="e.g. NE65 1AA" class="w-full border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-[#2C5E3B]" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1">Garden Dimensions</label>
                <input type="text" placeholder="e.g. 12m x 8m" class="w-full border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-[#2C5E3B]" />
              </div>
              <div>
                <label class="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1">Core Work Needed</label>
                <select class="w-full border border-stone-200 p-2.5 text-xs text-stone-600 focus:outline-none bg-white">
                  <option>Sandstone paving installation</option>
                  <option>Timber decking or Cedar screens</option>
                  <option>Soil grading & Turf turf laying</option>
                  <option>Brickwork retaining walls</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1">Transform details</label>
              <textarea rows="4" placeholder="Tell us about moss issues, water pooling in corners, or required sandstone paving outlines..." class="w-full border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-[#2C5E3B] resize-none font-sans"></textarea>
            </div>

            <div>
              <label class="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1">Upload Site Photo (garden_weeds.jpg)</label>
              <div class="border border-dashed border-stone-300 rounded p-4 text-center cursor-pointer hover:bg-stone-50 text-stone-400 flex flex-col items-center">
                ${getIcon('Upload', 'w-5 h-5 mb-1')}
                <span class="text-[10px] font-mono">Select photographs of your current lawn</span>
              </div>
            </div>

            <button type="submit" class="w-full bg-[#2C5E3B] hover:bg-[#1E4228] text-white font-bold py-3.5 rounded text-xs uppercase tracking-widest hover-button-polish font-mono border-none cursor-pointer text-center">
              Submit Survey Request
            </button>
          </form>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-stone-200 bg-white py-8 text-center text-xs text-stone-400 font-mono">
        © 2026 Septen
      </footer>

    </div>
  `;

  bindGreenfieldLandscaping(container);
}

export function initGreenfieldLandscaping(container: DemoContainer): void {
  bindGreenfieldLandscaping(container);
}
