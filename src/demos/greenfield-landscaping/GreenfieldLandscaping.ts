import { getIcon } from "@utils/ui";
import { openDemoModalLazy } from "@utils/ui";
import type { DemoContainer } from "@demos/shared/types";

function bindGreenfieldLandscaping(container: DemoContainer): void {
  const handleSurveyCta = async (e?: Event) => {
    if (e) e.preventDefault();
    await openDemoModalLazy("Greenfield Landscaping");
  };

  container.querySelector("#greenfield-contact-form")?.addEventListener("submit", handleSurveyCta);
}

export function renderGreenfieldLandscaping(container: DemoContainer): void {
  const caseStudies = [
    {
      title: "Rural courtyard garden in Morpeth",
      scope: "Sandstone paving & dry-stone retainer",
      text: "The client contacted us to transform an uneven, damp clay yard behind their barn conversion. We began by excavating 12 tonnes of unstable topsoil, grading the slope, and compacting a deep limestone sub-base. We laid hand-dressed fossil mint sandstone paving flags, pointing them with weather-resistant polymer resin. To manage the slope, we constructed a small dry-stone retaining wall using locally quarried limestone, creating raised soil beds finished with dark organic mulch.",
      outcome:
        "A perfectly level, beautifully draining sandstone courtyard that blends seamlessly with the rural Northumberland landscape.",
    },
    {
      title: "Suburban family lawn in Gosforth, Newcastle",
      scope: "Lawn drainage & cedar privacy screens",
      text: "This suburban plot suffered from poor drainage and ancient, rotted perimeter fencing. We installed dual perforated land drainage pipes leading to a gravel soakaway, resolving the standing water issue. We sourced premium cultivated ryegrass turf and laid it over enriched sandy loam. Finally, we constructed contemporary horizontal slatted cedar privacy screens along the boundary, treating them with weather-proofing oils.",
      outcome:
        "A bright, kid-safe lawn with robust drainage and modern luxury fencing that offers long-term privacy and shelter.",
    },
    {
      title: "Victorian walled garden in Alnwick",
      scope: "Structured larch timber decking & borders",
      text: "A historical property featuring brick boundary walls required a low-maintenance social area. We framed a heavy-duty timber carcass using pressure-treated pine posts anchored deep in concrete. We capped this with a premium kiln-dried Siberian larch timber deck, leaving microscopic expansion gaps for joint breathing. We added brickwork borders using reclaimed Victorian bricks to match the existing boundary walls.",
      outcome:
        "A beautiful, premium timber terrace integrated with historical brickwork borders that resists rot and damp without heavy maintenance.",
    },
    {
      title: "Commercial patio lounge in Ponteland",
      scope: "Durable granite paving & heavy-gauge planters",
      text: "We were hired to create an outdoor seating area for a local service showroom. The project demanded heavy-traffic resistance and pristine aesthetics. We utilized thick silver-grey granite paving flags laid over a reinforced concrete slab to prevent any future sinking. We bordered the patio with custom-welded, heavy-gauge steel planters filled with structural evergreen grasses and modern architectural lighting.",
      outcome:
        "A striking, highly durable commercial-grade courtyard that remains beautiful and safe under heavy customer foot traffic and harsh winters.",
    },
  ];

  container.innerHTML = `
    <div id="greenfield-demo-root" class="bg-[#FAF9F5] min-h-screen overflow-x-hidden text-[#223322] font-sans antialiased text-left">
      <!-- Navigation header banner -->
      <nav class="bg-white border-b border-stone-200">
        <div class="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 xl:px-10 3xl:px-20 py-4 xl:py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center justify-center md:justify-start gap-2 w-full md:w-auto min-w-0">
            ${getIcon("Shrub", "w-5 h-5 3xl:w-6 3xl:h-6 text-[#2C5E3B]")}
            <span class="font-serif font-bold text-lg xl:text-xl 3xl:text-2xl text-stone-900 tracking-tight text-center md:text-left leading-tight wrap-break-word">
              Greenfield Landscaping <span class="text-stone-600 font-sans text-[0.8125rem] 3xl:text-sm font-normal">UK</span>
            </span>
          </div>

          <div class="flex w-full md:w-auto flex-wrap justify-center items-center gap-x-4 gap-y-2.5 md:gap-x-6 3xl:gap-x-8 text-[0.75rem] sm:text-[0.8125rem] xl:text-sm 3xl:text-base font-semibold uppercase tracking-widest text-[#223322]">
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
            <a
              href="#contact"
              class="bg-[#2C5E3B] hover:bg-[#1E4228] text-white px-4 py-2 xl:px-5 xl:py-2.5 rounded text-[0.75rem] xl:text-xs 3xl:text-sm uppercase font-bold tracking-widest transition-colors hover-button-polish border-none font-mono shrink-0 inline-block text-center no-underline"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative bg-stone-950 text-white overflow-hidden border-b border-[#2C5E3B]/10 min-h-[calc(100svh-6rem)] md:min-h-[calc(100svh-4.5rem)] flex flex-col justify-center">
        <div class="absolute inset-0 z-0">
          __GREENFIELD_HERO_IMAGE__
          <div class="absolute inset-0 bg-stone-950/65"></div>
        </div>

        <div class="relative z-10 w-full max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl 4xl:max-w-360 mx-auto px-4 sm:px-6 xl:px-10 3xl:px-20 py-10 md:py-12 xl:py-16 3xl:py-24 space-y-6 xl:space-y-8 3xl:space-y-10 text-left" data-reveal>
          <span class="text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-[0.25em] text-[#D9F5DE] font-black font-mono block">
            Custom Garden Design & Construction
          </span>
          <h1 class="font-serif text-3xl sm:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-extrabold leading-tight text-white max-w-2xl 3xl:max-w-3xl">
            Established garden design & landscaping across the North East.
          </h1>
          <p class="text-stone-200 text-sm sm:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl leading-relaxed max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl">
            We provide Greenfield Landscaping’s premium domestic and commercial design and build services across Morpeth, Newcastle, and Alnwick. From excavation to final timber detailing, we do the heavy work cleanly and properly.
          </p>

          <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 xl:gap-6 pt-3 xl:pt-6">
            <a
              href="#contact"
              class="w-full sm:w-auto bg-[#2C5E3B] hover:bg-[#1E4228] text-white font-bold text-[0.8125rem] xl:text-sm 3xl:text-base py-3.5 xl:py-4 3xl:py-5 px-6 xl:px-8 3xl:px-10 rounded transition-colors hover-button-polish border-none text-center inline-flex items-center justify-center"
            >
              Consult Our Team
            </a>
            <a 
              href="#portfolio"
              class="w-full sm:w-auto bg-stone-950/70 hover:border-white/40 hover:text-white hover:shadow-[0_0.85rem_2rem_rgba(15,23,42,0.12)] text-white border border-solid border-white/20 font-bold text-[0.8125rem] xl:text-sm 3xl:text-base py-3.5 xl:py-4 3xl:py-5 px-6 xl:px-8 3xl:px-10 rounded transition-all text-center inline-flex items-center justify-center"
            >
              View Completed Work
            </a>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 sm:gap-6 xl:gap-8 pt-4 xl:pt-6 text-[0.8125rem] xl:text-sm 3xl:text-base font-mono text-stone-300">
            <span class="flex items-center gap-1.5 3xl:gap-2">${getIcon("MapPin", "w-4 h-4 3xl:w-5 3xl:h-5 text-[#D9F5DE]")} Newcastle • Morpeth • Alnwick</span>
            <span class="flex items-center gap-1.5 3xl:gap-2">${getIcon("CheckCircle", "w-4 h-4 3xl:w-5 3xl:h-5 text-[#D9F5DE]")} 12+ Years Local Groundwork Experience</span>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" class="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-360 mx-auto px-6 xl:px-10 3xl:px-20 py-20 2xl:py-24 3xl:py-28 text-left">
        <div class="border-b border-stone-200 pb-6 3xl:pb-8 mb-12 3xl:mb-16" data-reveal>
          <span class="text-[0.75rem] xl:text-xs 3xl:text-sm uppercase font-mono tracking-widest text-[#2C5E3B] font-black block">What We Do</span>
          <h2 class="font-serif text-2xl md:text-3xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-extrabold text-[#223322]">Our Services</h2>
          <p class="text-[0.8125rem] xl:text-sm 3xl:text-base text-stone-500 font-serif italic mt-1 3xl:mt-3">Groundwork, woodwork, and brick installations completed to professional trade standards.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 3xl:gap-12">
          
          <div class="space-y-2.5 3xl:space-y-4 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="40">
            <div class="w-10 h-10 3xl:w-12 3xl:h-12 bg-[#2C5E3B]/10 text-[#2C5E3B] rounded flex items-center justify-center">
              ${getIcon("Compass", "w-5 h-5 3xl:w-6 3xl:h-6")}
            </div>
            <h3 class="font-serif font-black text-lg xl:text-xl 3xl:text-2xl text-stone-900">Complete Garden Design</h3>
            <p class="text-[0.8125rem] xl:text-sm 3xl:text-base text-stone-600 leading-relaxed font-sans">
              Systematic planning matching gradients, drainage levels, lighting layout, and botanical selection before digging. No shortcuts.
            </p>
          </div>

          <div class="space-y-2.5 3xl:space-y-4 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="80">
            <div class="w-10 h-10 3xl:w-12 3xl:h-12 bg-[#2C5E3B]/10 text-[#2C5E3B] rounded flex items-center justify-center">
              ${getIcon("CheckSquare", "w-5 h-5 3xl:w-6 3xl:h-6")}
            </div>
            <h3 class="font-serif font-black text-lg xl:text-xl 3xl:text-2xl text-stone-900">Natural & Sandstone Paving</h3>
            <p class="text-[0.8125rem] xl:text-sm 3xl:text-base text-stone-600 leading-relaxed font-sans">
              Precisely laid Fossil Mint, Indian Sandstone, and granite paths. Hand-dressed, laid on solid mortar beds with weather-proof pointing.
            </p>
          </div>

          <div class="space-y-2.5 3xl:space-y-4 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="120">
            <div class="w-10 h-10 3xl:w-12 3xl:h-12 bg-[#2C5E3B]/10 text-[#2C5E3B] rounded flex items-center justify-center">
              ${getIcon("Wrench", "w-5 h-5 3xl:w-6 3xl:h-6")}
            </div>
            <h3 class="font-serif font-black text-lg xl:text-xl 3xl:text-2xl text-stone-900">Timber Decking & Screens</h3>
            <p class="text-[0.8125rem] xl:text-sm 3xl:text-base text-stone-600 leading-relaxed font-sans">
              Heavy-duty pine sub-frames capped with premium larch or red cedar decking. Tailored solid wood privacy panels built to stay straight.
            </p>
          </div>

          <div class="space-y-2.5 3xl:space-y-4 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="160">
            <div class="w-10 h-10 3xl:w-12 3xl:h-12 bg-[#2C5E3B]/10 text-[#2C5E3B] rounded flex items-center justify-center">
              ${getIcon("Award", "w-5 h-5 3xl:w-6 3xl:h-6")}
            </div>
            <h3 class="font-serif font-black text-lg xl:text-xl 3xl:text-2xl text-stone-900">Premium Turf Installation</h3>
            <p class="text-[0.8125rem] xl:text-sm 3xl:text-base text-stone-600 leading-relaxed font-sans">
              Deep clay treatment, soil levelling, and laying premium weed-free cultivated ryegrass turf for a thick, resilient green surface.
            </p>
          </div>

          <div class="space-y-2.5 3xl:space-y-4 hover-lift transition-transform duration-300" data-reveal data-reveal-delay="200">
            <div class="w-10 h-10 3xl:w-12 3xl:h-12 bg-[#2C5E3B]/10 text-[#2C5E3B] rounded flex items-center justify-center">
              ${getIcon("ShieldCheck", "w-5 h-5 3xl:w-6 3xl:h-6")}
            </div>
            <h3 class="font-serif font-black text-lg xl:text-xl 3xl:text-2xl text-stone-900">Brickwork Borders</h3>
            <p class="text-[0.8125rem] xl:text-sm 3xl:text-base text-stone-600 leading-relaxed font-sans">
              Sturdy retainers, steps, and plant beds using traditional engineering bricks or local reclaimed brickwork to blend with old architectural borders.
            </p>
          </div>

          <div class="bg-[#FAF9F5] border border-stone-200 p-5 3xl:p-8 rounded space-y-2 3xl:space-y-3 flex flex-col justify-between hover-lift transition-transform duration-300" data-reveal data-reveal-delay="240">
            <div>
              <h4 class="text-[0.8125rem] xl:text-sm 3xl:text-base font-mono font-bold uppercase text-stone-500">Trade Promise</h4>
              <p class="text-[0.75rem] xl:text-sm 3xl:text-base text-stone-600 mt-1 3xl:mt-2 font-serif italic">
                “We never lay stones on soft sand, and we never use fragile prefabricated timber panels. We build to last years of heavy UK rain.”
              </p>
            </div>
            <span class="text-[0.6875rem] xl:text-xs 3xl:text-sm font-mono text-stone-400 font-bold">— Peter Greenfield, Founder</span>
          </div>

        </div>
      </section>

      <!-- Portfolio Section -->
      <section id="portfolio" class="bg-white border-y border-stone-200/60 py-20 2xl:py-24 3xl:py-28">
        <div class="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-360 mx-auto px-4 sm:px-6 xl:px-10 3xl:px-20 text-left">
          <div class="mb-12 3xl:mb-16" data-reveal>
            <span class="text-[0.75rem] xl:text-xs 3xl:text-sm uppercase font-mono tracking-widest text-[#2C5E3B] font-black">Our Portfolio</span>
            <h2 class="font-serif text-2xl md:text-3xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-extrabold text-[#223322]">Completed Transformations</h2>
            <p class="text-stone-500 text-[0.8125rem] xl:text-sm 3xl:text-base mt-1.5 3xl:mt-3 font-mono">Narrative logs documenting actual domestic projects</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 3xl:gap-12">
            ${caseStudies
              .map(
                (study) => `
              <div class="bg-[#FAF9F5] border border-stone-200 rounded p-6 2xl:p-8 3xl:p-10 shadow-xs flex flex-col justify-between space-y-4 3xl:space-y-6 hover-lift transition-transform duration-300 min-w-0" data-reveal>
                <div class="space-y-3 3xl:space-y-5">
                  <div class="border-b border-stone-200/65 pb-2 3xl:pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
                    <h3 class="font-serif font-black text-lg xl:text-xl 3xl:text-2xl text-[#223322] min-w-0">${study.title}</h3>
                    <span class="inline-flex w-fit max-w-full whitespace-normal leading-relaxed text-[0.6875rem] sm:text-[0.75rem] xl:text-xs 3xl:text-sm font-mono text-[#2C5E3B] bg-[#2C5E3B]/10 px-2 py-1 3xl:px-3 3xl:py-1.5 rounded font-black uppercase shrink-0">
                      ${study.scope}
                    </span>
                  </div>
                  <p class="text-[0.8125rem] xl:text-sm 3xl:text-base text-stone-600 leading-relaxed font-sans">
                    ${study.text}
                  </p>
                </div>
                <div class="bg-white border border-stone-200/40 p-3.5 3xl:p-5 rounded text-[0.8125rem] xl:text-sm 3xl:text-base italic font-serif text-stone-700">
                  <strong>Outcome:</strong> ${study.outcome}
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      <!-- Recent quick snaps -->
      <section class="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-360 mx-auto px-4 sm:px-6 xl:px-10 3xl:px-20 py-16 2xl:py-20 3xl:py-24 text-left">
        <h3 class="font-serif font-bold text-xl xl:text-2xl 3xl:text-3xl text-[#223322] mb-6 3xl:mb-10" data-reveal>Recent Work Snaps</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 3xl:gap-10">
          
          <div class="bg-stone-100 border border-stone-200 rounded overflow-hidden hover-lift transition-transform duration-300" data-reveal data-reveal-delay="60">
            <div class="aspect-video bg-stone-100">
              __GREENFIELD_PATIO_IMAGE__
            </div>
            <div class="bg-stone-100 p-4 3xl:p-6 text-[0.8125rem] xl:text-sm 3xl:text-base font-mono text-stone-500">
              # Patio stone steps and edging, Jesmond
            </div>
          </div>

          <div class="bg-stone-100 border border-stone-200 rounded overflow-hidden hover-lift transition-transform duration-300" data-reveal data-reveal-delay="110">
            <div class="aspect-video bg-stone-100">
              __GREENFIELD_RYEGRASS_IMAGE__
            </div>
            <div class="bg-stone-100 p-4 3xl:p-6 text-[0.8125rem] xl:text-sm 3xl:text-base font-mono text-stone-500">
              # Premium ryegrass finish, Alnwick
            </div>
          </div>

          <div class="bg-stone-100 border border-stone-200 rounded overflow-hidden hover-lift transition-transform duration-300" data-reveal data-reveal-delay="160">
            <div class="aspect-video bg-stone-100">
              __GREENFIELD_CEDAR_IMAGE__
            </div>
            <div class="bg-stone-100 p-4 3xl:p-6 text-[0.8125rem] xl:text-sm 3xl:text-base font-mono text-stone-500">
              # Cedar privacy fencing, Morpeth Croft
            </div>
          </div>

        </div>
      </section>

      <!-- Enquiry / Contact Us Form Section -->
      <section id="contact" class="bg-stone-100 border-t border-stone-200 py-16 2xl:py-20 3xl:py-24 text-center">
        <div class="max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl mx-auto px-4 sm:px-6 xl:px-10 3xl:px-20 space-y-6 xl:space-y-8 3xl:space-y-10" data-reveal>
          <h2 class="font-serif text-2xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-extrabold text-[#223322]">Request a Garden Transformation Survey</h2>
          <p class="text-[0.8125rem] md:text-sm xl:text-lg 2xl:text-xl 3xl:text-2xl text-stone-500 max-w-sm 2xl:max-w-xl 3xl:max-w-2xl mx-auto leading-relaxed">
            Our survey team visits sites across Northumberland regularly. Submit garden dimensions and describe what you are looking for.
          </p>

          <form id="greenfield-contact-form" class="space-y-3 xl:space-y-4 3xl:space-y-5 p-6 2xl:p-10 3xl:p-14 bg-white border border-stone-200 rounded-lg text-left shadow-xs hover-lift transition-transform duration-300">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 xl:gap-4 3xl:gap-5">
              <div>
                <label for="greenfield-name" class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1 3xl:mb-2">Your Full Name</label>
                <input id="greenfield-name" name="name" type="text" required placeholder="Alistair Graham" class="w-full border border-stone-200 p-2.5 xl:p-3.5 3xl:p-4 text-[0.8125rem] xl:text-sm 3xl:text-base focus:outline-none focus:border-[#2C5E3B]" />
              </div>
              <div>
                <label for="greenfield-postcode" class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1 3xl:mb-2">North East Postcode</label>
                <input id="greenfield-postcode" name="postcode" type="text" required placeholder="e.g. NE65 1AA" class="w-full border border-stone-200 p-2.5 xl:p-3.5 3xl:p-4 text-[0.8125rem] xl:text-sm 3xl:text-base focus:outline-none focus:border-[#2C5E3B]" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 xl:gap-4 3xl:gap-5">
              <div>
                <label for="greenfield-dimensions" class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1 3xl:mb-2">Garden Dimensions</label>
                <input id="greenfield-dimensions" name="dimensions" type="text" placeholder="e.g. 12m x 8m" class="w-full border border-stone-200 p-2.5 xl:p-3.5 3xl:p-4 text-[0.8125rem] xl:text-sm 3xl:text-base focus:outline-none focus:border-[#2C5E3B]" />
              </div>
              <div>
                <label for="greenfield-work-type" class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1 3xl:mb-2">Core Work Needed</label>
                <select id="greenfield-work-type" name="work-type" class="w-full border border-stone-200 p-2.5 xl:p-3.5 3xl:p-4 text-[0.8125rem] xl:text-sm 3xl:text-base text-stone-600 focus:outline-none bg-white">
                  <option>Sandstone paving installation</option>
                  <option>Timber decking or Cedar screens</option>
                  <option>Soil grading & Turf turf laying</option>
                  <option>Brickwork retaining walls</option>
                </select>
              </div>
            </div>

            <div>
              <label for="greenfield-details" class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1 3xl:mb-2">Transform details</label>
              <textarea id="greenfield-details" name="details" rows="4" 3xl:rows="5" placeholder="Tell us about moss issues, water pooling in corners, or required sandstone paving outlines..." class="w-full border border-stone-200 p-2.5 xl:p-3.5 3xl:p-4 text-[0.8125rem] xl:text-sm 3xl:text-base focus:outline-none focus:border-[#2C5E3B] resize-none font-sans"></textarea>
            </div>

            <div>
              <p class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1 3xl:mb-2">Upload Site Photo (garden_weeds.jpg)</p>
              <input id="greenfield-photo" name="photo" type="file" accept="image/*" class="sr-only" />
              <label for="greenfield-photo" class="cursor-default border border-dashed border-stone-300 rounded p-4 xl:p-6 3xl:p-8 text-center hover:border-[#2C5E3B]/40 hover:text-[#2C5E3B] hover:shadow-[0_0.85rem_2rem_rgba(15,23,42,0.06)] text-stone-600 flex flex-col items-center transition-all">
                ${getIcon("Upload", "w-5 h-5 3xl:w-6 3xl:h-6 mb-1 3xl:mb-2")}
                <span class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono">Select photographs of your current lawn</span>
              </label>
            </div>

            <button type="submit" class="cursor-default w-full bg-[#2C5E3B] hover:bg-[#1E4228] text-white font-bold py-3.5 xl:py-4.5 3xl:py-5 rounded text-[0.8125rem] xl:text-sm 3xl:text-base uppercase tracking-widest hover-button-polish font-mono border-none text-center">
              Submit Survey Request
            </button>
          </form>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-stone-200 bg-white py-8 text-center text-[0.8125rem] text-stone-600 font-mono">
        © 2026 Septen
      </footer>

    </div>
  `;

  bindGreenfieldLandscaping(container);
}

export function initGreenfieldLandscaping(container: DemoContainer): void {
  bindGreenfieldLandscaping(container);
}
