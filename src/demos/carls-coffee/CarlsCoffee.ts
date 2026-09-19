import { getIcon } from "@utils/ui";
import { openDemoModalLazy } from "@utils/ui";
import type { DemoContainer } from "@demos/shared/types";

function bindCarlsCoffee(container: DemoContainer): void {
  const specSelector = container.querySelector("#carls-spec-selector");
  if (specSelector) {
    const items = specSelector.querySelectorAll(".spec-item");
    items.forEach((item) => {
      item.addEventListener("click", () => {
        const isSelected =
          item.classList.contains("bg-[var(--carls-chalk-selected)]") &&
          item.classList.contains("border-[var(--carls-accent-terracotta)]");

        items.forEach((other) => {
          other.classList.remove(
            "bg-[var(--carls-chalk-selected)]",
            "border-[var(--carls-accent-terracotta)]",
          );
          other.classList.add("border-transparent", "bg-[var(--carls-chalk-item-bg)]");
          other.querySelector(".roaster-note")?.classList.add("hidden");
        });

        if (!isSelected) {
          item.classList.remove("border-transparent", "bg-[var(--carls-chalk-item-bg)]");
          item.classList.add(
            "bg-[var(--carls-chalk-selected)]",
            "border-[var(--carls-accent-terracotta)]",
          );
          item.querySelector(".roaster-note")?.classList.remove("hidden");
        }
      });
    });
  }

  const handleBookingsCta = async (e?: Event) => {
    if (e) e.preventDefault();
    await openDemoModalLazy("Carl's Coffee");
  };

  container.querySelector("#carls-booking-form")?.addEventListener("submit", handleBookingsCta);
}

export function renderCarlsCoffee(container: DemoContainer): void {
  const getBusyWidthClass = (busy: string): string =>
    (
      ({
        "25%": "w-1/4",
        "30%": "w-[30%]",
        "40%": "w-2/5",
        "55%": "w-[55%]",
        "60%": "w-3/5",
        "70%": "w-[70%]",
        "80%": "w-4/5",
        "90%": "w-[90%]",
        "95%": "w-[95%]",
      }) as const
    )[busy] ?? "w-0";

  const weekdayFootfall = [
    { hour: "8 AM", busy: "40%", label: "Quiet" },
    { hour: "10 AM", busy: "95%", label: "Peak Busy" },
    { hour: "12 PM", busy: "80%", label: "Steady" },
    { hour: "2 PM", busy: "60%", label: "Relaxed" },
    { hour: "4 PM", busy: "25%", label: "Quiet" },
  ];

  const saturdayFootfall = [
    { hour: "9 AM", busy: "55%", label: "Gentle" },
    { hour: "11 AM", busy: "95%", label: "Peak Busy" },
    { hour: "1 PM", busy: "90%", label: "Peak Busy" },
    { hour: "3 PM", busy: "70%", label: "Steady" },
    { hour: "5 PM", busy: "30%", label: "Quiet" },
  ];

  const espressoMenu = [
    {
      name: "Espresso",
      price: "£2.20",
      desc: "Double shot of our seasonal natural process Arabica house bean.",
    },
    {
      name: "Americano",
      price: "£2.80",
      desc: "Diluted house espresso. Rich depth of cocoa, stone fruit clean finish.",
    },
    {
      name: "Flat White",
      price: "£3.40",
      desc: "Double ristretto, velvety micro-foamed milk. Highly balanced & punchy.",
    },
    {
      name: "Cappuccino",
      price: "£3.20",
      desc: "Espresso, heavily aerated foam, shaved organic dark chocolate dusting.",
    },
    {
      name: "Pour-over of the Week",
      price: "£3.95",
      desc: "Slow drip filter extract. Rotating rare single-origins. Extremely clean.",
    },
  ];

  const signatures = [
    {
      id: "spec-1",
      name: "Carl's House Roast",
      price: "£4.20",
      desc: "Hand-poured filter of our signature Colombian honey-process bean. Notes of red grape & brown sugar.",
      roasterNote:
        "Colombian Finca La Esperanza · 200m anaerobic honey · red grape, panela brown sugar, cacao nib finish · brewed 92C, 1:16",
    },
    {
      id: "spec-2",
      name: "Brown Sugar Latte",
      price: "£4.50",
      desc: "House double espresso, sweet slow-cooked molasses, organic oat milk, dusted with toasted spice.",
      roasterNote:
        "Oat milk pairs perfectly · double ristretto pulled at 28 sec; house molasses syrup steeped with star anise",
    },
    {
      id: "spec-3",
      name: "Iced Caramel Cold Brew",
      price: "£4.40",
      desc: "18-hour slow steeped cold brew poured over cracked ice, layered cleanly with homemade salted caramel foam.",
      roasterNote:
        "18 hr slow-steep @ 4C · cracked river ice, not cubed · salted caramel foam uses sea salt from Staithes",
    },
  ];

  const kitchenMenu = [
    {
      name: "Sourdough Croissants",
      price: "£3.50",
      desc: "Flaky laminated butter pastry baked at sunrise using regional stone ground wheat.",
    },
    {
      name: "Breakfast Toastie",
      price: "£5.50",
      desc: "Crusty local sourdough, rich mature local dairy cheddar, wild garlic butter melt.",
    },
    {
      name: "Cake of the Day",
      price: "£4.00",
      desc: "Baked directly in-house. Rotating seasonal fruit sponges and vegan loaf cake slices.",
    },
  ];

  const beanStoryCards = [
    {
      eyebrow: "How we buy",
      kicker: "Small-farm green buying",
    },
    {
      eyebrow: "How we roast",
      kicker: "5kg Probat · Bailey Street back room",
    },
    {
      eyebrow: "Our house coffee",
      kicker: "Bailey Street Espresso Blend",
      body: "60% Colombian Supremo, 25% Guatemalan Antigua, 15% Sumatran Mandheling. Medium-dark, 21-minute roast curve. Pulled as a double on our La Marzocco Linea at 9 bars, 28 seconds, 18g in → 36g out. Notes of cocoa nib, roasted hazelnut, a clean malty finish.",
    },
    {
      eyebrow: "Decaf & retail",
      kicker: "Swiss Water · 250g tins",
    },
  ];

  const customerTestimonials = [
    {
      name: "Hannah",
      context: "Remote Worker · Tuesday Routine",
      quote:
        "I come in every Tuesday with my laptop. The 92C pour-over station is the best-working coffee I have found anywhere in the city. Consistent, quiet, friendly.",
    },
    {
      name: "Joe",
      context: "Pre-Parkrun Cappuccino · Saturday",
      quote:
        "Stop in at 8am sharp before the 9am riverside parkrun. Flat white, double ristretto, never burnt. Staff know my order before I reach the counter.",
    },
    {
      name: "Sarah",
      context: "Saturday Cupping Club",
      quote:
        "Joined their monthly Saturday cupping session. Really welcoming, Carl walked us through three micro-lots side-by-side. Have bought two retail bags since.",
    },
  ];

  const durhamLandmarks = [
    { name: "Baileys Steps", time: "30 sec" },
    { name: "Market Square", time: "2 min" },
    { name: "Durham Castle", time: "3 min" },
    { name: "Durham Cathedral", time: "8 min" },
    { name: "Railway Station", time: "14 min" },
  ];

  const bookingGuestOptions = [
    { value: "1-2", label: "1 - 2 guests" },
    { value: "3-5", label: "3 - 5 guests" },
    { value: "6-8", label: "6 - 8 guests" },
    { value: "9", label: "9 or more (enquire)" },
  ];

  container.innerHTML = `
    <div data-carls-scroll-root class="bg-(--carls-brew-espresso) min-h-screen text-(--carls-text-cocoa) selection:bg-(--carls-accent-terracotta)/15 text-left">
      <!-- Top Banner Section -->
      <div data-carls-sticky-banner class="sticky top-0 z-60 bg-(--carls-brew-espresso) text-(--carls-banner-cream) px-6 py-3 flex flex-col sm:flex-row justify-between items-center text-[0.8125rem] border-b border-white/10 font-sans gap-2 text-center shadow-[0_1px_0_rgba(255,255,255,0.04),0_6px_22px_rgba(0,0,0,0.25)]">
        <span class="font-serif italic font-medium">Durham Artisan Coffee Roasters</span>
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Open until 4:00 PM</span>
        </div>
      </div>

      <!-- Photo Hero Section -->
      <section id="hero" class="relative bg-(--carls-dark-brown) overflow-hidden border-b border-white/10 min-h-[calc(100svh-6rem)] md:min-h-[calc(100svh-4.5rem)] flex flex-col justify-center rounded-none">
        <div class="absolute inset-0 z-0 rounded-none overflow-hidden">
          __CARLS_DURHAM_RIVER_IMAGE__
          <div class="absolute inset-0 bg-linear-to-t from-(--carls-brew-espresso) via-(--carls-brew-espresso)/78 to-transparent opacity-90"></div>
        </div>

        <div class="relative z-10 w-full max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-360 mx-auto px-5 sm:px-6 xl:px-10 2xl:px-14 3xl:px-20 py-10 md:py-12 xl:py-16 3xl:py-24 space-y-5 md:space-y-6 xl:space-y-8 3xl:space-y-10 text-left" data-reveal>
          <span class="text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-[0.25em] text-(--carls-accent-terracotta) font-extrabold font-mono block">
            Riverside · Bailey Street · Durham
          </span>
          <h1 class="font-serif text-3xl sm:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold tracking-tight text-(--carls-chalk-text) max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl leading-tight">
            Carl's Coffee · small-batch roasting on the River Wear since 2018.
          </h1>
          <p class="text-(--carls-banner-cream) text-sm sm:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl leading-relaxed max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl">
            A hand-built roastery and coffee house tucked into a medieval lane. We cup every Thursday, roast every Wednesday, and pull every espresso with a 28-second target.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-6 pt-3 xl:pt-6 max-w-xl 2xl:max-w-2xl">
            <a
              href="#menu"
              class="flex items-center justify-center bg-(--carls-dark-brown) hover:bg-(--carls-brew-espresso) text-white font-black text-[0.8125rem] xl:text-sm 3xl:text-base py-3.5 xl:py-4 3xl:py-5 px-6 xl:px-8 3xl:px-10 rounded-xl transition-colors uppercase tracking-wider text-center border-none shadow-[0_10px_40px_rgba(0,0,0,0.22)] cursor-default"
            >
              View The Chalkboard Menu
            </a>
            <a
              href="#contact"
              class="flex items-center justify-center bg-(--carls-dark-brown) hover:bg-(--carls-brew-espresso) text-white font-black text-[0.8125rem] xl:text-sm 3xl:text-base py-3.5 xl:py-4 3xl:py-5 px-6 xl:px-8 3xl:px-10 rounded-xl transition-colors uppercase tracking-wider text-center border-none shadow-[0_10px_40px_rgba(0,0,0,0.22)] cursor-default"
            >
              Contact Us
            </a>
          </div>

          <div class="flex flex-wrap gap-4 xl:gap-6 pt-4 xl:pt-6 text-[0.8125rem] xl:text-sm 3xl:text-base font-mono text-(--carls-banner-cream)">
            <span class="flex items-center gap-1.5 border border-(--carls-accent-terracotta) px-3 py-1.5 rounded-md bg-(--carls-brew-espresso)">${getIcon("Coffee", "w-4 h-4 text-(--carls-accent-terracotta)")} 5kg Probat roaster on-site</span>
            <span class="flex items-center gap-1.5 border border-(--carls-accent-terracotta) px-3 py-1.5 rounded-md bg-(--carls-brew-espresso)">${getIcon("Sparkles", "w-4 h-4 text-(--carls-accent-terracotta)")} 92C precision kettles</span>
          </div>
        </div>
      </section>

      <!-- Chalkboard Menu Section -->
      <section class="max-w-6xl 2xl:max-w-7xl 3xl:max-w-360 4xl:max-w-[110rem] mx-auto px-4 py-12 md:py-16 2xl:py-20 3xl:py-24 relative">
        <div class="text-center mb-10 md:mb-12 3xl:mb-20 relative" data-reveal>
          <p class="font-serif italic text-sm md:text-base xl:text-lg 3xl:text-xl text-(--carls-accent-terracotta) tracking-wide mb-1.5 3xl:mb-3">Est. 2018 · Durham Riverside</p>
          <h2 class="font-serif text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold text-white tracking-tight">The Chalkboard</h2>
          <p class="font-serif italic text-sm md:text-base xl:text-lg 3xl:text-xl text-white/80 mt-3 3xl:mt-5">A physical menu translated for digital visitors. Hand-roasted &amp; baked at dawn.</p>
        </div>

        <!-- Chalkboard Menu Wrap -->
        <div id="menu" class="bg-(--carls-chalk-bg) text-(--carls-chalk-text) rounded-xl p-6 md:p-10 2xl:p-14 3xl:p-16 shadow-[0_10px_40px_rgba(0,0,0,0.28)] border-4 border-(--carls-chalk-border) relative overflow-hidden hover-lift transition-transform duration-500" data-reveal>
          <div class="absolute inset-0 bg-(--carls-chalk-bg) pointer-events-none opacity-45"></div>

          <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 3xl:gap-12 divide-y md:divide-y-0 md:divide-x divide-(--carls-chalk-border)/60">

            <!-- Left Column: Espresso & Craft Coffee -->
            <div class="space-y-6 md:pr-4 3xl:pr-6 3xl:space-y-8">
              <h3 class="font-serif text-xl xl:text-2xl 3xl:text-3xl text-(--carls-accent-terracotta) border-b border-(--carls-accent-terracotta)/20 pb-2 3xl:pb-3">
                <span class="italic tracking-wide">Espresso Bar</span>
              </h3>

              <div class="space-y-5 3xl:space-y-7">
                ${espressoMenu
                  .map(
                    (item) => `
                  <div class="group cursor-default">
                    <div class="flex justify-between font-serif font-semibold text-(--carls-chalk-text) text-sm sm:text-base xl:text-lg 3xl:text-xl">
                      <span class="group-hover:text-(--carls-accent-terracotta) transition-colors">${item.name}</span>
                      <span>${item.price}</span>
                    </div>
                    <p class="text-[0.8125rem] xl:text-sm 3xl:text-base text-(--carls-text-cocoa-soft) mt-1 3xl:mt-2">${item.desc}</p>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>

            <!-- Center Column: Signature Brew Specials -->
            <div class="space-y-6 pt-7 md:pt-0 md:px-6 3xl:space-y-8">
              <h3 class="font-serif text-xl xl:text-2xl 3xl:text-3xl text-(--carls-accent-terracotta) border-b border-(--carls-accent-terracotta)/20 pb-2 3xl:pb-3">
                <span class="italic tracking-wide">House Signatures</span>
              </h3>

              <div class="space-y-5 3xl:space-y-7" id="carls-spec-selector">
                ${signatures
                  .map(
                    (spec) => `
                  <div
                    data-id="${spec.id}"
                    data-selected="false"
                    class="p-3 xl:p-4 3xl:p-5 rounded-xl border border-transparent bg-(--carls-chalk-item-bg) hover:bg-(--carls-chalk-selected) transition-all duration-200 cursor-default text-left spec-item hover-lift"
                  >
                    <div class="flex justify-between font-serif font-semibold text-(--carls-chalk-text) text-sm sm:text-base xl:text-lg 3xl:text-xl">
                      <span class="group-hover:text-(--carls-accent-terracotta) transition-colors">${spec.name}</span>
                      <span>${spec.price}</span>
                    </div>
                    <p class="text-[0.8125rem] xl:text-sm 3xl:text-base text-(--carls-text-cocoa-soft) mt-1 3xl:mt-2">${spec.desc}</p>
                    <div class="roaster-note mt-2 3xl:mt-3 text-[0.75rem] xl:text-xs 3xl:text-sm text-(--carls-accent-terracotta) bg-(--carls-accent-terracotta)/10 px-2 py-1 3xl:px-3 3xl:py-1.5 rounded hidden font-mono leading-relaxed"> 
                      ✨ Roaster Note: ${spec.roasterNote}
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>

            <!-- Right Column: Bakery & Toasties -->
            <div class="space-y-6 3xl:space-y-8 pt-7 md:pt-0 md:pl-6 3xl:md:pl-8">
              <h3 class="font-serif text-xl xl:text-2xl 3xl:text-3xl text-(--carls-accent-terracotta) border-b border-(--carls-accent-terracotta)/20 pb-2 3xl:pb-3">
                <span class="italic tracking-wide">Bakery & Kitchen</span>
              </h3>

              <div class="space-y-5 3xl:space-y-7">
                ${kitchenMenu
                  .map(
                    (item) => `
                  <div class="group cursor-default">
                    <div class="flex justify-between font-serif font-semibold text-(--carls-chalk-text) text-sm sm:text-base xl:text-lg 3xl:text-xl">
                      <span class="group-hover:text-(--carls-accent-terracotta) transition-colors">${item.name}</span>
                      <span>${item.price}</span>
                    </div>
                    <p class="text-[0.8125rem] xl:text-sm 3xl:text-base text-(--carls-text-cocoa-soft) mt-1 3xl:mt-2">${item.desc}</p>
                  </div>
                `,
                  )
                  .join("")}
              </div>

              <!-- Slate Note -->
              <div class="mt-4 3xl:mt-6 p-3 3xl:p-5 bg-(--carls-slate-note) border border-(--carls-chalk-border)/60 text-[0.8125rem] xl:text-sm 3xl:text-base text-white rounded-xl font-mono leading-relaxed">
                📢 Allergen queries? Speak to one of our friendly baristas before ordering. Group booking bakes are available upon call ahead.
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Our Coffee Story Section -->
      <section id="story" class="relative border-y border-white/10 py-16 2xl:py-20 3xl:py-28 px-4 xl:px-10 3xl:px-20 overflow-hidden bg-(--carls-brew-espresso)">
        <div class="absolute inset-0 z-0 opacity-55">
          __CARLS_COFFEE_BEANS_IMAGE__
        </div>
        <div class="relative z-10 max-w-6xl 2xl:max-w-7xl 3xl:max-w-[100rem] 4xl:max-w-[120rem] mx-auto space-y-10 md:space-y-14 3xl:space-y-20">

          <header class="grid grid-cols-1 md:grid-cols-12 gap-6 3xl:gap-8 items-end" data-reveal>
            <div class="md:col-span-8">
              <p class="font-serif text-(--carls-accent-terracotta) tracking-wide italic text-sm md:text-base xl:text-lg 3xl:text-xl">The Roastery</p>
              <h2 class="font-serif text-3xl md:text-[2.6rem] xl:text-5xl 2xl:text-6xl 3xl:text-7xl leading-[1.05] text-white font-bold mt-2 3xl:mt-4 tracking-tight">
                From green sacks on the floor <br class="hidden md:block" />
                to the espresso you drink today.
              </h2>
            </div>
            <p class="md:col-span-4 text-sm md:text-[15px] xl:text-base 2xl:text-lg 3xl:text-xl text-white leading-relaxed border-l border-(--carls-chalk-border)/60 pl-5 3xl:pl-8">
              We are a tiny-volume roaster · two 5kg batches a day, three days a week. Nothing is ever bought-in roasted. Everything in the cup started as green coffee in a hessian sack on the floor of our back room, and was cupped, logged, and bagged on-site by two people.
            </p>
          </header>

          <div class="relative space-y-6 md:space-y-8 3xl:space-y-12" data-reveal>
            <div class="relative grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 3xl:gap-10 items-stretch">
              <div class="md:col-span-7 relative bg-(--carls-slate-note) border border-(--carls-chalk-border) rounded-xl p-6 md:p-8 2xl:p-10 3xl:p-14 space-y-5 3xl:space-y-7">
                <div class="flex items-center justify-between gap-3 pb-3 3xl:pb-5 border-b border-(--carls-chalk-border)/60">
                  <div class="flex items-center gap-3 3xl:gap-5">
                    <div class="flex items-center justify-center w-9 h-9 2xl:w-11 2xl:h-11 3xl:w-14 3xl:h-14 rounded-full bg-(--carls-accent-terracotta)/15 border border-(--carls-accent-terracotta)/40 text-(--carls-accent-terracotta) font-black font-serif text-base 3xl:text-2xl">1</div>
                    <div>
                      <p class="font-mono text-[0.75rem] md:text-[0.8125rem] xl:text-xs 3xl:text-sm uppercase tracking-[0.22em] text-white/60">${beanStoryCards[0].eyebrow}</p>
                      <h3 class="font-serif text-xl md:text-[1.5rem] xl:text-2xl 2xl:text-3xl 3xl:text-4xl leading-tight text-white mt-0.5 3xl:mt-1">${beanStoryCards[0].kicker}</h3>
                    </div>
                  </div>
                </div>
                <div class="space-y-3 3xl:space-y-5 text-[14px] md:text-[14.5px] xl:text-base 2xl:text-lg 3xl:text-xl leading-[1.75] text-white">
                  <div class="flex gap-3 3xl:gap-5">
                    <span class="shrink-0 font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-(--carls-accent-terracotta) pt-1 3xl:pt-1.5">Origin trip</span>
                    <p>Carl travels to origin most winters, usually in the lull after Christmas before the spring green coffees arrive.</p>
                  </div>
                  <div class="flex gap-3 3xl:gap-5">
                    <span class="shrink-0 font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-(--carls-accent-terracotta) pt-1 3xl:pt-1.5">Farmer ties</span>
                    <p>Buys from the same farmers he has been working with for the last seven years · not spot market, not importer shortlists.</p>
                  </div>
                  <div class="flex gap-3 3xl:gap-5">
                    <span class="shrink-0 font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-(--carls-accent-terracotta) pt-1 3xl:pt-1.5">Cupping</span>
                    <p>Nothing lands in the Probat without a Thursday cupping table pass · every new lot cupped against the previous month's stock.</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 3xl:gap-3 pt-2 3xl:pt-4">
                  <div class="border border-(--carls-chalk-border)/60 rounded-lg px-2.5 py-2 3xl:px-4 3xl:py-3 text-center">
                    <p class="font-serif text-[12px] md:text-[12.5px] xl:text-sm 3xl:text-lg text-white leading-tight">Yirgacheffe</p>
                    <p class="font-mono text-[0.6875rem] xl:text-xs 3xl:text-xs uppercase tracking-wider text-white/60 mt-0.5 3xl:mt-1">Kochere · ETH</p>
                  </div>
                  <div class="border border-(--carls-chalk-border)/60 rounded-lg px-2.5 py-2 3xl:px-4 3xl:py-3 text-center">
                    <p class="font-serif text-[12px] md:text-[12.5px] xl:text-sm 3xl:text-lg text-white leading-tight">Huila</p>
                    <p class="font-mono text-[0.6875rem] xl:text-xs 3xl:text-xs uppercase tracking-wider text-white/60 mt-0.5 3xl:mt-1">Colombia</p>
                  </div>
                  <div class="border border-(--carls-chalk-border)/60 rounded-lg px-2.5 py-2 3xl:px-4 3xl:py-3 text-center">
                    <p class="font-serif text-[12px] md:text-[12.5px] xl:text-sm 3xl:text-lg text-white leading-tight">Gitesi</p>
                    <p class="font-mono text-[0.6875rem] xl:text-xs 3xl:text-xs uppercase tracking-wider text-white/60 mt-0.5 3xl:mt-1">Rwanda</p>
                  </div>
                  <div class="border border-(--carls-chalk-border)/60 rounded-lg px-2.5 py-2 3xl:px-4 3xl:py-3 text-center">
                    <p class="font-serif text-[12px] md:text-[12.5px] xl:text-sm 3xl:text-lg text-white leading-tight">Mandheling</p>
                    <p class="font-mono text-[0.6875rem] xl:text-xs 3xl:text-xs uppercase tracking-wider text-white/60 mt-0.5 3xl:mt-1">Sumatra</p>
                  </div>
                </div>
              </div>
              <div class="md:col-span-5 relative bg-(--carls-slate-note) border border-(--carls-chalk-border) rounded-xl p-6 md:p-7 2xl:p-10 3xl:p-12 space-y-4 3xl:space-y-6 md:translate-y-6">
                <div class="flex items-center gap-3 3xl:gap-5">
                  <div class="flex items-center justify-center w-9 h-9 2xl:w-11 2xl:h-11 3xl:w-14 3xl:h-14 rounded-full bg-(--carls-banner-cream)/25 text-(--carls-banner-cream) font-black font-serif text-base 3xl:text-2xl">2</div>
                  <div>
                    <p class="font-mono text-[0.75rem] md:text-[0.8125rem] xl:text-xs 3xl:text-sm uppercase tracking-[0.22em] text-white/60">${beanStoryCards[1].eyebrow}</p>
                    <h3 class="font-serif text-lg md:text-[1.35rem] xl:text-2xl 2xl:text-3xl 3xl:text-4xl leading-tight text-white mt-0.5 3xl:mt-1">${beanStoryCards[1].kicker}</h3>
                  </div>
                </div>
                <p class="text-[13.5px] md:text-[14px] xl:text-base 2xl:text-lg 3xl:text-xl leading-[1.75] text-white">Our 5kg drum roaster is tucked up the narrow stairs behind the bar · you can smell it working from the riverside path on a Wednesday morning. Roast profiles are hand-logged in a leather notebook.</p>
                <div class="space-y-2 3xl:space-y-3.5 text-[13px] xl:text-sm 3xl:text-base">
                  <div class="flex items-start gap-2 3xl:gap-3 text-white">
                    <span class="shrink-0 mt-0.5 text-(--carls-accent-terracotta) text-[11px] 3xl:text-base font-bold">✓</span>
                    <div>
                      <p class="font-semibold text-white text-sm xl:text-base 3xl:text-lg">Roast days</p>
                      <p class="text-white/70 text-[12px] xl:text-sm 3xl:text-base leading-tight">Wednesdays &amp; Fridays · two batches per day, max 10kg</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-2 3xl:gap-3 text-white">
                    <span class="shrink-0 mt-0.5 text-(--carls-accent-terracotta) text-[11px] 3xl:text-base font-bold">✓</span>
                    <div>
                      <p class="font-semibold text-white text-sm xl:text-base 3xl:text-lg">Sample cuppings</p>
                      <p class="text-white/70 text-[12px] xl:text-sm 3xl:text-base leading-tight">Thursday evenings · 7pm · 3 coffees, 3 spoons, a spittoon</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-2 3xl:gap-3 text-white">
                    <span class="shrink-0 mt-0.5 text-(--carls-accent-terracotta) text-[11px] 3xl:text-base font-bold">✓</span>
                    <div>
                      <p class="font-semibold text-white text-sm xl:text-base 3xl:text-lg">Bag drops</p>
                      <p class="text-white/70 text-[12px] xl:text-sm 3xl:text-base leading-tight">250g retail bags hit the shelf on Thursday mornings</p>
                    </div>
                  </div>
                </div>
                <div class="pt-2 3xl:pt-4 border-t border-dashed border-(--carls-chalk-border)/60 flex items-center justify-between">
                  <span class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-white/60">Development</span>
                  <span class="font-mono text-[11px] xl:text-sm 3xl:text-base text-(--carls-banner-cream)">Esp 20–22% · Filter 24%</span>
                </div>
              </div>
            </div>

            <div class="relative grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 3xl:gap-10 items-stretch">
                <div class="md:col-span-8 relative bg-(--carls-slate-note) border border-(--carls-accent-terracotta)/40 rounded-xl p-6 md:pt-7 md:px-7 md:pb-6 2xl:p-10 3xl:p-14 space-y-4 md:space-y-5 3xl:space-y-7 md:translate-y-6">
                <div class="absolute -top-3.5 left-6 md:left-10 3xl:-top-5">
                  <span class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-(--carls-dark-brown) bg-(--carls-accent-terracotta) px-3 py-1 3xl:px-5 3xl:py-1.5 rounded-full font-bold">on the bar every day</span>
                </div>
                <div class="flex items-start md:items-center justify-between gap-4 3xl:gap-6 pt-2 3xl:pt-4">
                  <div class="flex items-start md:items-center gap-3 md:gap-4 3xl:gap-6">
                    <div class="flex items-center justify-center w-10 h-10 2xl:w-12 2xl:h-12 3xl:w-14 3xl:h-14 rounded-full bg-(--carls-accent-terracotta)/15 border border-(--carls-accent-terracotta)/40 text-(--carls-accent-terracotta) font-black font-serif text-base 3xl:text-2xl shrink-0">3</div>
                    <div>
                      <p class="font-mono text-[0.75rem] md:text-[0.8125rem] xl:text-xs 3xl:text-sm uppercase tracking-[0.22em] text-white/60">${beanStoryCards[2].eyebrow}</p>
                      <h3 class="font-serif text-xl md:text-[1.65rem] xl:text-2xl 2xl:text-3xl 3xl:text-4xl leading-tight text-white mt-0.5 3xl:mt-1">${beanStoryCards[2].kicker}</h3>
                    </div>
                  </div>
                  <div class="hidden sm:flex items-center gap-2 3xl:gap-3">
                    <span class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-white/60">Roast curve</span>
                    <span class="font-serif text-(--carls-banner-cream) text-[13.5px] xl:text-sm 3xl:text-lg">21 min · medium-dark</span>
                  </div>
                </div>
                <div class="border-l-2 3xl:border-l-[3px] border-(--carls-accent-terracotta)/55 pl-4 pr-1 3xl:pl-8 space-y-3 3xl:space-y-5">
                  <p class="text-[14px] md:text-[14.5px] xl:text-base 2xl:text-lg 3xl:text-xl leading-[1.8] text-white">
                    ${beanStoryCards[2].body ?? ""}
                  </p>
                  <div class="flex flex-wrap items-center gap-x-4 3xl:gap-x-6 gap-y-1.5 3xl:gap-y-2.5 pt-1 3xl:pt-2 border-t border-(--carls-chalk-border)/60">
                    <span class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-white/60">Default espresso</span>
                    <span class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-white/60">·</span>
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 3xl:gap-7">
                  <div class="space-y-2.5 3xl:space-y-4 border border-(--carls-chalk-border)/60 rounded-lg p-3.5 3xl:p-6 bg-(--carls-base-brew)/70">
                    <p class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-(--carls-accent-terracotta) pb-1 3xl:pb-2 border-b border-(--carls-chalk-border)/60">Blend recipe</p>
                    <div class="space-y-2 3xl:space-y-3 text-[13.5px] md:text-[14px] xl:text-base 2xl:text-lg 3xl:text-xl text-white">
                      <div class="flex items-center justify-between gap-4 3xl:gap-6">
                        <span class="text-(--carls-accent-terracotta) text-[11px] xl:text-sm 3xl:text-base font-mono">60%</span>
                        <span class="text-right">Colombian Supremo</span>
                      </div>
                      <div class="flex items-center justify-between gap-4 3xl:gap-6">
                        <span class="text-(--carls-accent-terracotta) text-[11px] xl:text-sm 3xl:text-base font-mono">25%</span>
                        <span class="text-right">Guatemalan Antigua</span>
                      </div>
                      <div class="flex items-center justify-between gap-4 3xl:gap-6">
                        <span class="text-(--carls-accent-terracotta) text-[11px] xl:text-sm 3xl:text-base font-mono">15%</span>
                        <span class="text-right">Sumatran Mandheling</span>
                      </div>
                    </div>
                  </div>
                  <div class="space-y-2.5 3xl:space-y-4 border border-(--carls-chalk-border)/60 rounded-lg p-3.5 3xl:p-6 bg-(--carls-base-brew)/70">
                    <p class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-(--carls-banner-cream) pb-1 3xl:pb-2 border-b border-(--carls-chalk-border)/60">Pull recipe</p>
                    <div class="space-y-2 3xl:space-y-3 text-[13.5px] md:text-[14px] xl:text-base 2xl:text-lg 3xl:text-xl text-white">
                      <div class="flex items-center justify-between gap-4 3xl:gap-6">
                        <span class="text-white/60 text-[11px] xl:text-sm 3xl:text-base font-mono">Machine</span>
                        <span class="text-right">La Marzocco Linea</span>
                      </div>
                      <div class="flex items-center justify-between gap-4 3xl:gap-6">
                        <span class="text-white/60 text-[11px] xl:text-sm 3xl:text-base font-mono">Double</span>
                        <span class="text-right">18g → 36g</span>
                      </div>
                      <div class="flex items-center justify-between gap-4 3xl:gap-6">
                        <span class="text-white/60 text-[11px] xl:text-sm 3xl:text-base font-mono">9 bar · 28s</span>
                        <span class="text-right">Target 93°C</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap items-end gap-2 3xl:gap-3 pt-2 3xl:pt-4 border-t border-(--carls-chalk-border)/60">
                  <div class="space-y-2 3xl:space-y-3 flex-1 min-w-0">
                    <p class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-white/60">Tasting</p>
                    <div class="flex flex-wrap items-center gap-2 3xl:gap-3">
                      <span class="inline-flex items-center gap-1.5 3xl:gap-2 rounded-md border border-(--carls-chalk-border)/60 bg-(--carls-base-brew)/70 px-2.5 py-1 3xl:px-4 3xl:py-2 text-[11.5px] md:text-[12px] xl:text-sm 3xl:text-lg text-white">Cocoa nib</span>
                      <span class="inline-flex items-center gap-1.5 3xl:gap-2 rounded-md border border-(--carls-chalk-border)/60 bg-(--carls-base-brew)/70 px-2.5 py-1 3xl:px-4 3xl:py-2 text-[11.5px] md:text-[12px] xl:text-sm 3xl:text-lg text-white">Roasted hazelnut</span>
                      <span class="inline-flex items-center gap-1.5 3xl:gap-2 rounded-md border border-(--carls-chalk-border)/60 bg-(--carls-base-brew)/70 px-2.5 py-1 3xl:px-4 3xl:py-2 text-[11.5px] md:text-[12px] xl:text-sm 3xl:text-lg text-white">Malty finish</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0 max-w-[55%] text-right">
                    <p class="font-serif italic text-[12px] md:text-[12.5px] xl:text-sm 3xl:text-lg text-white/60 leading-snug wrap-break-word">"Drink within 3 weeks for the best cocoa and hazelnut sweetness."</p>
                  </div>
                </div>
              </div>
              <div class="md:col-span-4 relative bg-(--carls-slate-note) border border-(--carls-banner-cream)/40 rounded-xl p-6 md:p-7 2xl:p-10 3xl:p-12 space-y-4 3xl:space-y-6 md:translate-y-8">
                <div class="flex items-center justify-between gap-3 3xl:gap-5 pb-3 3xl:pb-5 border-b border-dashed border-(--carls-chalk-border)/60">
                  <div class="flex items-center gap-3 3xl:gap-5">
                    <div class="flex items-center justify-center w-9 h-9 2xl:w-11 2xl:h-11 3xl:w-14 3xl:h-14 rounded-full bg-(--carls-banner-cream)/25 border border-(--carls-banner-cream)/40 text-(--carls-banner-cream) font-black font-serif text-base 3xl:text-2xl">4</div>
                    <div>
                      <p class="font-mono text-[0.75rem] md:text-[0.8125rem] xl:text-xs 3xl:text-sm uppercase tracking-[0.22em] text-white/60">${beanStoryCards[3].eyebrow}</p>
                      <h3 class="font-serif text-lg md:text-[1.3rem] xl:text-2xl 2xl:text-3xl 3xl:text-4xl leading-tight text-white mt-0.5 3xl:mt-1">${beanStoryCards[3].kicker}</h3>
                    </div>
                  </div>
                  <span class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-(--carls-banner-cream)">Peru</span>
                </div>
                <p class="text-[13.5px] md:text-[14px] xl:text-base 2xl:text-lg 3xl:text-xl leading-[1.75] text-white">Chemical-free Swiss Water decaf of a high-grown Peruvian bean · retains 99.9% of the origin sweetness and acidity. No methylene chloride anywhere near the mill.</p>
                <ul class="space-y-2 3xl:space-y-3.5 border-t border-(--carls-chalk-border)/60 pt-3 3xl:pt-5 text-[12.5px] md:text-[13px] xl:text-sm 3xl:text-base text-white">
                  <li class="flex gap-2 3xl:gap-3 items-start">
                    <span class="shrink-0 text-(--carls-banner-cream) font-bold text-[0.75rem] xl:text-xs 3xl:text-sm pt-1 3xl:pt-1.5">❐</span>
                    <div><span class="font-bold text-white">Decaf process ·</span> Swiss Water, 99.9% caffeine-free, zero solvent</div>
                  </li>
                  <li class="flex gap-2 3xl:gap-3 items-start">
                    <span class="shrink-0 text-(--carls-banner-cream) font-bold text-[0.75rem] xl:text-xs 3xl:text-sm pt-1 3xl:pt-1.5">❐</span>
                    <div><span class="font-bold text-white">Shelf life ·</span> drink within 14 days of the roast date</div>
                  </li>
                  <li class="flex gap-2 3xl:gap-3 items-start">
                    <span class="shrink-0 text-(--carls-banner-cream) font-bold text-[0.75rem] xl:text-xs 3xl:text-sm pt-1 3xl:pt-1.5">❐</span>
                    <div><span class="font-bold text-white">Reusable jar ·</span> 50p off, ground fresh to your brew method</div>
                  </li>
                  <li class="flex gap-2 3xl:gap-3 items-start">
                    <span class="shrink-0 text-(--carls-banner-cream) font-bold text-[0.75rem] xl:text-xs 3xl:text-sm pt-1 3xl:pt-1.5">❐</span>
                    <div><span class="font-bold text-white">Date stamp ·</span> every bag hand-written, not ink-jet printed</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

          <!-- Atmosphere Section -->
      <section class="bg-(--carls-brew-espresso) border-b border-white/10 py-16 2xl:py-20 3xl:py-28 px-4 xl:px-10 3xl:px-20">
        <div class="max-w-6xl 2xl:max-w-7xl 3xl:max-w-[100rem] 4xl:max-w-[120rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 3xl:gap-14 items-start">

          <header class="lg:col-span-8 space-y-6 md:space-y-7 3xl:space-y-10">
            <div class="flex items-center gap-2 3xl:gap-3">
              <span class="w-8 h-px 3xl:w-12 3xl:h-0.5 bg-(--carls-accent-terracotta)/60"></span>
              <span class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm text-(--carls-accent-terracotta) font-bold tracking-widest uppercase inline-block">The Atmosphere</span>
            </div>
            <blockquote class="font-serif text-2xl sm:text-[2.2rem] md:text-[2.6rem] xl:text-5xl 2xl:text-6xl 3xl:text-7xl italic text-white leading-[1.18]" data-reveal>
              “A local coffee house in the heart of the community, where time slows down and the beans are roasted just yards from the riverbank we overlook.”
            </blockquote>
            <div class="pt-1 3xl:pt-2 space-y-4 3xl:space-y-6 max-w-none" data-reveal>
              <p class="text-base md:text-lg xl:text-xl 3xl:text-2xl text-white leading-[1.8]">
                We started in a medieval lane with a second-hand roaster and three wooden chairs. We added a La Marzocco, then a 5kg Probat drum tucked up the narrow back stairs, then the bench by the window that the regulars have now occupied for six years.
              </p>
              <p class="text-sm md:text-[15px] xl:text-base 2xl:text-lg 3xl:text-xl text-white leading-[1.85]">
                House rules: conversation flows, screen brightness gets turned down, and coffee should taste of its origin story · never sugar syrups. Sparkling water on arrival, complimentary oat or whole milk top-ups, and dog biscuits in a jar by the door.
              </p>
            </div>
          </header>

          <div class="lg:col-span-4 bg-(--carls-base-brew) p-4 sm:p-5 3xl:p-7 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.28)] border border-white/10 hover-lift transition-transform duration-500 rotate-1 hover:rotate-0" data-reveal data-reveal-delay="120">
            <div class="relative aspect-4/3 rounded-sm overflow-hidden bg-(--carls-dark-brown)/10">
              <div class="absolute inset-0">
                __CARLS_COFFEE_SHOP_IMAGE__
              </div>
              <div class="absolute top-3 left-3 3xl:top-5 3xl:left-5 inline-flex items-center gap-1.5 border border-(--carls-chalk-border) px-2 py-0.5 3xl:px-3 3xl:py-1 text-[0.6875rem] xl:text-xs 3xl:text-xs font-mono font-bold uppercase tracking-widest text-(--carls-chalk-text) bg-(--carls-slate-note)">
                Bailey Street
              </div>
              <div class="absolute bottom-3 right-3 3xl:bottom-5 3xl:right-5 inline-flex items-center gap-1.5 border border-(--carls-chalk-border) px-2 py-0.5 3xl:px-3 3xl:py-1 text-[0.6875rem] xl:text-xs 3xl:text-xs font-mono uppercase tracking-widest text-(--carls-chalk-text) bg-(--carls-slate-note)">
                ${getIcon("MapPin", "w-2.5 h-2.5 3xl:w-3.5 3xl:h-3.5 text-(--carls-accent-terracotta)")} DH1 3EE
              </div>
            </div>
            <div class="pt-4 sm:pt-5 3xl:pt-7 pb-3 sm:pb-4 3xl:pb-5 text-center space-y-1.5 3xl:space-y-2.5">
              <p class="font-serif italic text-[13px] sm:text-sm xl:text-base 3xl:text-lg text-white tracking-wide">
                Our Bailey Street shopfront
              </p>
              <p class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm text-white tracking-widest uppercase">
                Carl's Coffee · Est. 2018 · Spring 2026
              </p>
            </div>
          </div>

          <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-7 3xl:gap-10 pt-2 md:border-t md:border-white/10 md:pt-8 3xl:md:pt-12" data-reveal>
            <div class="md:col-span-7">
              <p class="font-serif text-[14px] md:text-[15px] xl:text-lg 3xl:text-xl text-(--carls-accent-terracotta) tracking-wide italic mb-4 3xl:mb-6">Things you'll only notice if you sit for a while</p>
              <ul class="space-y-2.5 3xl:space-y-3.5 text-white text-[14px] md:text-[15px] xl:text-base 2xl:text-lg 3xl:text-xl leading-[1.7]">
                <li class="flex gap-3 3xl:gap-5">
                  <span class="shrink-0 text-(--carls-accent-terracotta) font-bold leading-[1.8] text-sm 3xl:text-2xl">★</span>
                  <span>First espresso of the day for the baristas is at 7.45am · you're welcome to wait with us.</span>
                </li>
                <li class="flex gap-3 3xl:gap-5">
                  <span class="shrink-0 text-(--carls-accent-terracotta) font-bold leading-[1.8] text-sm 3xl:text-2xl">★</span>
                  <span>A jar of dog biscuits lives by the door. Regulars bring their own pooches in for a flat white saucer.</span>
                </li>
                <li class="flex gap-3 3xl:gap-5">
                  <span class="shrink-0 text-(--carls-accent-terracotta) font-bold leading-[1.8] text-sm 3xl:text-2xl">★</span>
                  <span>Sparkling water on arrival, a little glass for filter coffee, and free top-ups of oat or whole milk.</span>
                </li>
                <li class="flex gap-3 3xl:gap-5">
                  <span class="shrink-0 text-(--carls-accent-terracotta) font-bold leading-[1.8] text-sm 3xl:text-2xl">★</span>
                  <span>Bring any retail bag home · or bring it back · and we'll grind fresh on our Mahlkönig, free.</span>
                </li>
                <li class="flex gap-3 3xl:gap-5">
                  <span class="shrink-0 text-(--carls-accent-terracotta) font-bold leading-[1.8] text-sm 3xl:text-2xl">★</span>
                  <span>The window nook has no phone signal on purpose. Bring a book, bring a friend, or bring neither.</span>
                </li>
              </ul>
            </div>
            <div class="md:col-span-5 grid grid-rows-[auto_auto] gap-4 md:gap-5 3xl:gap-6">
              <div class="bg-(--carls-slate-note) border border-(--carls-chalk-border) rounded-xl p-3.5 md:p-4 2xl:p-5 3xl:p-6 space-y-2 3xl:space-y-3">
                <p class="font-serif text-[13.5px] md:text-sm xl:text-base 3xl:text-lg text-(--carls-accent-terracotta) tracking-wide italic">Opening hours</p>
                <ul class="space-y-1.5 text-white text-[13.5px] md:text-[14px] xl:text-sm 3xl:text-base leading-[1.55]">
                  <li><span class="text-(--carls-accent-terracotta) mr-2 text-[0.75rem] xl:text-xs 3xl:text-sm">✦</span>Mon to Fri · 8am to 4pm</li>
                  <li><span class="text-(--carls-accent-terracotta) mr-2 text-[0.75rem] xl:text-xs 3xl:text-sm">✦</span>Saturday · 9am to 4pm</li>
                  <li><span class="text-(--carls-accent-terracotta) mr-2 text-[0.75rem] xl:text-xs 3xl:text-sm">✦</span>Sunday · 9.30am to 3.30pm</li>
                  <li><span class="text-(--carls-accent-terracotta) mr-2 text-[0.75rem] xl:text-xs 3xl:text-sm">✦</span>40 yards to Framwellgate riverside</li>
                </ul>
              </div>
              <div class="bg-(--carls-slate-note) border border-(--carls-chalk-border) rounded-xl p-3.5 md:p-4 2xl:p-5 3xl:p-6 space-y-2 3xl:space-y-3">
                <p class="font-serif text-[13.5px] md:text-sm xl:text-base 3xl:text-lg text-(--carls-accent-terracotta) tracking-wide italic">Seating &amp; soundtrack</p>
                <ul class="space-y-1.5 text-white text-[13px] md:text-[13.5px] xl:text-sm 3xl:text-base leading-[1.55]">
                  <li><span class="text-(--carls-accent-terracotta) mr-2 text-[0.75rem] xl:text-xs 3xl:text-sm">·</span>22 covers · 8 window stools · 4 perches</li>
                  <li><span class="text-(--carls-accent-terracotta) mr-2 text-[0.75rem] xl:text-xs 3xl:text-sm">·</span>Low jazz weekdays · bluegrass Saturdays</li>
                  <li><span class="text-(--carls-accent-terracotta) mr-2 text-[0.75rem] xl:text-xs 3xl:text-sm">·</span>Wi-Fi password printed on your receipt</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 space-y-3.5 3xl:space-y-5 pt-2 md:border-t md:border-white/10 md:pt-8 3xl:md:pt-12">
            ${customerTestimonials
              .slice(0, 3)
              .map(
                (t) => `
              <div class="space-y-1.5 3xl:space-y-2.5" data-reveal>
                <p class="font-serif text-4xl 3xl:text-6xl leading-0 text-(--carls-accent-terracotta) pt-2.5 3xl:pt-4">“</p>
                <p class="font-serif text-[13px] xl:text-sm 3xl:text-lg leading-[1.75] text-white -mt-2 3xl:-mt-3">${t.quote}</p>
                <div class="pt-1.5 3xl:pt-2.5 border-t border-white/10">
                  <span class="font-serif font-bold text-[12.5px] xl:text-sm 3xl:text-lg text-white">${t.name}</span>
                  <span class="block text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-widest text-white mt-0.5 3xl:mt-1">${t.context}</span>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      <!-- Order Flow Section -->
      <section class="bg-(--carls-base-brew) text-white py-4 3xl:py-6 border-y border-white/10">
        <div class="max-w-6xl 3xl:max-w-[100rem] 4xl:max-w-[120rem] mx-auto px-4 xl:px-10 3xl:px-20 flex flex-col sm:flex-row justify-between items-center gap-4 3xl:gap-6 text-[0.8125rem] xl:text-sm 3xl:text-base font-mono">
          <div class="flex items-center gap-2 3xl:gap-3">
            <span class="w-2 h-2 3xl:w-3 3xl:h-3 bg-(--carls-accent-terracotta) rounded-full"></span>
            <span class="text-white">Walk-ins always welcome</span>
          </div>
          <div class="flex items-center gap-2 3xl:gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/15 w-full sm:w-auto justify-center">
            ${getIcon("Phone", "w-3.5 h-3.5 3xl:w-5 3xl:h-5 text-[var(--carls-accent-terracotta)]")}
            <span class="text-white">Call ahead orders: <strong class="text-white">0191 386 2000</strong></span>
          </div>
          <div class="flex items-center gap-2 3xl:gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/15 w-full sm:w-auto justify-center">
            ${getIcon("MapPin", "w-3.5 h-3.5 3xl:w-5 3xl:h-5 text-[var(--carls-accent-terracotta)]")}
            <span class="text-white">Find us: <strong class="text-white">12 Bailey Street, Durham</strong></span>
          </div>
        </div>
      </section>

      <!-- Location Section -->
      <section class="bg-(--carls-brew-espresso) py-16 2xl:py-20 3xl:py-28 px-4 xl:px-10 3xl:px-20">
        <div class="max-w-6xl 2xl:max-w-7xl 3xl:max-w-[100rem] 4xl:max-w-[120rem] mx-auto">
          <div class="max-w-3xl 3xl:max-w-4xl mb-8 3xl:mb-12" data-reveal>
            <h2 class="font-serif text-2xl md:text-[1.8rem] xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold text-white flex items-center gap-2.5 3xl:gap-4">
              ${getIcon("MapPin", "w-5 h-5 3xl:w-8 3xl:h-8 text-[var(--carls-accent-terracotta)]")} Visiting Durham &amp; Location Info
            </h2>
          </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 3xl:gap-10 items-stretch">

          <div class="lg:col-span-4 bg-(--carls-slate-note) border border-(--carls-chalk-border) p-6 3xl:p-10 rounded-xl hover-lift transition-transform duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.22)]" data-reveal data-reveal-delay="40">
            <div class="flex justify-between items-center mb-4 3xl:mb-6">
              <h3 class="font-serif text-sm xl:text-base 3xl:text-lg font-bold flex items-center gap-1.5 text-white">
                <span class="inline-flex items-center gap-2 3xl:gap-3">
                  <span class="w-6 h-px 3xl:w-10 3xl:h-0.5 bg-(--carls-chalk-border)"></span>
                  <span class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono font-bold uppercase tracking-[0.15em] text-white">From The Shop Door</span>
                </span>
              </h3>
            </div>
            <div class="space-y-1 3xl:space-y-2">
              ${durhamLandmarks
                .map(
                  (landmark) => `
                <div class="flex justify-between items-center border-b border-(--carls-chalk-border)/60 py-3 3xl:py-5 last:border-0 group">
                  <span class="flex items-center gap-3 3xl:gap-5 text-sm md:text-[15px] xl:text-base 2xl:text-lg 3xl:text-xl text-white group-hover:text-white transition-colors">
                    ${getIcon("MapPin", "w-3.5 h-3.5 3xl:w-5 3xl:h-5 text-[var(--carls-accent-terracotta)]")}
                    ${landmark.name}
                  </span>
                  <span class="font-mono text-[11px] md:text-[0.8125rem] xl:text-sm 3xl:text-base text-white font-bold group-hover:text-white transition-colors">${landmark.time}</span>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>

          <div class="lg:col-span-4 relative bg-(--carls-slate-note) border border-(--carls-chalk-border) p-3 sm:p-4 md:p-5 3xl:p-7 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.22)] overflow-hidden hover-lift transition-transform duration-500" data-reveal data-reveal-delay="90">
            <div class="flex justify-between items-center mb-3 3xl:mb-5 gap-3">
              <h3 class="font-serif text-sm xl:text-base 3xl:text-lg font-bold flex items-center gap-1.5 text-white min-w-0">
                <span class="inline-flex items-center gap-2 3xl:gap-3 whitespace-nowrap">
                  <span class="w-6 h-px 3xl:w-10 3xl:h-0.5 bg-(--carls-chalk-border)"></span>
                  <span class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono font-bold uppercase tracking-[0.15em] text-white whitespace-nowrap">Bailey Street Area</span>
                </span>
              </h3>
              <span class="text-[0.6875rem] sm:text-[0.75rem] xl:text-xs 3xl:text-sm font-mono text-white tracking-widest uppercase whitespace-nowrap">DH1 · Peninsula</span>
            </div>

            <div class="relative w-full h-55 sm:h-67.5 md:h-85 2xl:h-105 3xl:h-125 rounded-xl overflow-hidden border border-(--carls-chalk-border)/60 bg-(--carls-brew-espresso)">

              <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">

                <rect x="4"  y="6"  width="20" height="14" class="fill-white/14 stroke-white/22" stroke-width="0.4"></rect>
                <rect x="32" y="6"  width="16" height="16" class="fill-white/16 stroke-white/22" stroke-width="0.4"></rect>
                <rect x="60" y="6"  width="30" height="14" class="fill-white/18 stroke-white/22" stroke-width="0.4"></rect>

                <rect x="4"  y="28" width="26" height="16" class="fill-white/16 stroke-white/22" stroke-width="0.4"></rect>
                <rect x="52" y="28" width="18" height="14" class="fill-white/14 stroke-white/22" stroke-width="0.4"></rect>

                <rect x="4"  y="54" width="18" height="20" class="fill-white/14 stroke-white/22" stroke-width="0.4"></rect>
                <rect x="52" y="54" width="20" height="20" class="fill-white/18 stroke-white/22" stroke-width="0.4"></rect>

                <rect x="4"  y="82" width="22" height="12" class="fill-white/18 stroke-white/22" stroke-width="0.4"></rect>

                <path d="M 88 88 L 40 88 L 40 46 L 14 46" fill="none" stroke="var(--carls-accent-terracotta)" stroke-opacity="0.95" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="300" class="animate-carls-route-sweep"></path>
              </svg>

              <div class="absolute left-[88%] bottom-[12%] -translate-x-1/2 translate-y-1/2 z-20 pointer-events-none" aria-hidden="true">
                <div class="w-4 h-4 sm:w-5 sm:h-5 3xl:w-7 3xl:h-7 rounded-full bg-(--carls-accent-terracotta) border-2 3xl:border-[3px] border-white shadow-[0_3px_10px_rgba(226,149,120,0.5)]"></div>
              </div>

              <div class="absolute left-[14%] top-[46%] -translate-x-1/2 -translate-y-full z-20 pointer-events-none" aria-hidden="true">
                <div class="relative flex flex-col items-center">
                  <span class="absolute top-3 left-1/2 block w-8 h-8 origin-top-left sm:w-10 sm:h-10 3xl:w-14 3xl:h-14 rounded-full border border-(--carls-accent-terracotta)/60 animate-carls-ring-pulse"></span>
                  <div class="w-6 h-6 sm:w-7 sm:h-7 3xl:w-10 3xl:h-10 rounded-full bg-(--carls-accent-terracotta) border-2 3xl:border-[3px] border-white shadow-[0_4px_14px_rgba(226,149,120,0.55)] flex items-center justify-center shrink-0 relative z-10">
                    <span class="text-[0.6875rem] sm:text-xs 3xl:text-sm font-black text-white leading-none">C</span>
                  </div>
                  <div class="w-1 h-2.5 sm:h-3 3xl:w-1.5 3xl:h-4 bg-(--carls-accent-terracotta) -mt-px relative z-10"></div>
                </div>
              </div>

              <div class="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 md:bottom-2 md:left-2.5 3xl:bottom-4 3xl:left-4 flex flex-wrap items-center gap-x-3 sm:gap-x-4 3xl:gap-x-6 gap-y-1 px-2 py-1 sm:px-2 sm:py-1.5 3xl:px-3 3xl:py-2 max-w-[90%]">
                <div class="flex items-center gap-1.5 3xl:gap-2.5">
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 3xl:w-4 3xl:h-4 rounded-full bg-(--carls-accent-terracotta) border border-white"></div>
                  <span class="font-mono text-[0.6875rem] sm:text-[0.75rem] xl:text-xs 3xl:text-xs text-white uppercase tracking-wider whitespace-nowrap">You are here</span>
                </div>
                <div class="flex items-center gap-1.5 3xl:gap-2.5">
                  <div class="w-6 sm:w-8 3xl:w-12 h-1 3xl:h-1.25 rounded-full bg-(--carls-accent-terracotta)"></div>
                  <span class="font-mono text-[0.6875rem] sm:text-[0.75rem] xl:text-xs 3xl:text-xs text-white uppercase tracking-wider whitespace-nowrap">Walk route</span>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 lg:row-span-2 flex flex-col bg-(--carls-slate-note) border border-(--carls-chalk-border) p-6 3xl:p-10 rounded-xl hover-lift transition-transform duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.22)]" data-reveal data-reveal-delay="140">
            <div class="flex justify-between items-center mb-4 3xl:mb-6 shrink-0">
              <h3 class="font-serif text-sm xl:text-base 3xl:text-lg font-bold flex items-center gap-1.5 text-white">
                <span class="inline-flex items-center gap-2 3xl:gap-3">
                  <span class="w-6 h-px 3xl:w-10 3xl:h-0.5 bg-(--carls-chalk-border)"></span>
                  <span class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono font-bold uppercase tracking-[0.15em] text-white">Typical Weekly Flow</span>
                </span>
              </h3>
            </div>

            <div class="flex flex-col space-y-1.5 3xl:space-y-2.5">
              <div class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-wider text-white pb-1 3xl:pb-2">Tuesday – Thursday</div>
              <div class="flex flex-col gap-2.5 3xl:gap-4">
              ${weekdayFootfall
                .map(
                  (data) => `
                <div class="space-y-1.5 3xl:space-y-2.5">
                  <div class="flex justify-between text-[0.8125rem] xl:text-sm 3xl:text-base font-mono">
                    <span class="text-white">${data.hour}</span>
                    <span class="${data.label === "Peak Busy" ? "text-rose-400 font-bold" : "text-white"}">
                      ${data.busy} (${data.label})
                    </span>
                  </div>
                  <div class="h-3 3xl:h-4 bg-white/20 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500 ${
                        data.label === "Peak Busy"
                          ? "bg-rose-500"
                          : data.label === "Steady"
                            ? "bg-amber-500"
                            : "bg-(--carls-accent-teal)"
                      } ${getBusyWidthClass(data.busy)}"
                    ></div>
                  </div>
                </div>
              `,
                )
                .join("")}
              </div>
            </div>

            <div class="w-full h-px bg-(--carls-chalk-border)/60 my-4 3xl:my-6 shrink-0"></div>

            <div class="flex flex-col space-y-1.5 3xl:space-y-2.5">
              <div class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-wider text-white pb-1 3xl:pb-2">Saturday</div>
              <div class="flex flex-col gap-2.5 3xl:gap-4">
              ${saturdayFootfall
                .map(
                  (data) => `
                <div class="space-y-1.5 3xl:space-y-2.5">
                  <div class="flex justify-between text-[0.8125rem] xl:text-sm 3xl:text-base font-mono">
                    <span class="text-white">${data.hour}</span>
                    <span class="${data.label === "Peak Busy" ? "text-rose-400 font-bold" : "text-white"}">
                      ${data.busy} (${data.label})
                    </span>
                  </div>
                  <div class="h-3 3xl:h-4 bg-white/20 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500 ${
                        data.label === "Peak Busy"
                          ? "bg-rose-500"
                          : data.label === "Steady"
                            ? "bg-amber-500"
                            : "bg-(--carls-accent-teal)"
                      } ${getBusyWidthClass(data.busy)}"
                    ></div>
                  </div>
                </div>
              `,
                )
                .join("")}
              </div>
            </div>

            <div class="pt-4 3xl:pt-6 mt-4 3xl:mt-6 border-t border-(--carls-chalk-border)/60 shrink-0">
              <p class="text-[10.5px] xl:text-xs 3xl:text-base text-white leading-relaxed flex items-start gap-2.5 3xl:gap-4">
                <span class="inline-block mt-0.5 w-2 h-2 3xl:w-3 3xl:h-3 rounded-full bg-emerald-500 shrink-0"></span>
                <span class="italic">For quiet, cosy reading sessions, Tuesday &amp; Wednesday 2 pm – 4 pm are reliably calm — window nook is almost always free.</span>
              </p>
            </div>
          </div>

          <div class="lg:col-span-8 bg-(--carls-slate-note) border border-(--carls-chalk-border) p-4 sm:p-5 3xl:p-8 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.22)] hover-lift transition-transform duration-500" data-reveal data-reveal-delay="180">
            <div class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm uppercase tracking-widest text-white mb-3 3xl:mb-5">Getting Here</div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 3xl:gap-x-8 gap-y-3 sm:gap-y-3.5 3xl:gap-y-5 text-[12.5px] sm:text-[13.5px] xl:text-base 3xl:text-lg">
              <div class="flex items-start gap-2.5 3xl:gap-4">
                ${getIcon("MapPin", "w-3.5 h-3.5 3xl:w-5 3xl:h-5 text-[var(--carls-accent-terracotta)] shrink-0 mt-0.5")}
                <div class="text-white leading-snug">
                  <span class="font-bold text-white">Bus · </span>X15 &amp; X21 Cathedral services stop at Market Place, 2 min walk.
                </div>
              </div>
              <div class="flex items-start gap-2.5 3xl:gap-4">
                  ${getIcon("Compass", "w-3.5 h-3.5 3xl:w-5 3xl:h-5 text-[var(--carls-accent-terracotta)] shrink-0 mt-0.5")}
                <div class="text-white leading-snug">
                  <span class="font-bold text-white">Parking · </span>Prince Bishop pay-and-display car park, 6 min walk up Bailey Street.
                </div>
              </div>
              <div class="flex items-start gap-2.5 3xl:gap-4">
                ${getIcon("Clock", "w-3.5 h-3.5 3xl:w-5 3xl:h-5 text-[var(--carls-accent-terracotta)] shrink-0 mt-0.5")}
                <div class="text-white leading-snug">
                  <span class="font-bold text-white">Train · </span>Durham station (East Coast mainline), 14 min downhill walk.
                </div>
              </div>
              <div class="flex items-start gap-2.5 3xl:gap-4">
                ${getIcon("Zap", "w-3.5 h-3.5 3xl:w-5 3xl:h-5 text-[var(--carls-accent-terracotta)] shrink-0 mt-0.5")}
                <div class="text-white leading-snug">
                  <span class="font-bold text-white">Bike · </span>Racks line Bailey Street directly outside the shopfront.
                </div>
              </div>
            </div>
          </div>

        </div>
        </div>
      </section>

      <!-- Bookings Section -->
      <section id="contact" class="relative border-y border-white/10 py-16 2xl:py-20 3xl:py-28 px-4 xl:px-10 3xl:px-20 overflow-hidden bg-(--carls-brew-espresso)">
        <div class="absolute inset-0 z-0 opacity-45">
          __CARLS_COUPLE_DINING_IMAGE__
        </div>
        <div class="relative z-10 max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-360 mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 3xl:gap-12 items-stretch">
          <div class="md:col-span-5 space-y-5 3xl:space-y-7" data-reveal>
            <div class="bg-(--carls-slate-note) rounded-xl border border-(--carls-chalk-border) p-6 md:p-7 3xl:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.22)] space-y-5 3xl:space-y-7 h-full">
              <div class="flex items-center gap-2 3xl:gap-3">
                <span class="w-8 h-px 3xl:w-12 3xl:h-0.5 bg-(--carls-accent-terracotta)/60"></span>
                <span class="font-mono text-[0.75rem] xl:text-xs 3xl:text-sm text-(--carls-accent-terracotta) font-bold tracking-widest uppercase inline-block">Cupping & Private Hire</span>
              </div>
              <h2 class="font-serif text-2xl md:text-3xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold text-white leading-snug">Bookings & Private Hire</h2>
              <p class="text-sm md:text-base xl:text-lg 3xl:text-xl text-white leading-relaxed">
                We run regular cupping tastings, small-group roastery tours, and private hire for small celebrations, book clubs, or work away-days.
              </p>
              <ul class="space-y-3 3xl:space-y-5 text-sm xl:text-base 3xl:text-lg">
                <li class="relative pl-4 3xl:pl-6 border-l-2 3xl:border-l-[3px] border-(--carls-accent-terracotta)/60">
                  <span class="text-white">Public Cupping Sessions · every 2nd Thursday evening, 7 pm to 8.30 pm, £12/person, max 10 seats.</span>
                </li>
                <li class="relative pl-4 3xl:pl-6 border-l-2 3xl:border-l-[3px] border-(--carls-accent-terracotta)/60">
                  <span class="text-white">Private Group Hire · bookings over 8 guests for meetings, birthdays, or away-days.</span>
                </li>
                <li class="relative pl-4 3xl:pl-6 border-l-2 3xl:border-l-[3px] border-(--carls-accent-terracotta)/60">
                  <span class="text-white">Please enquire at least <strong class="text-white">48 hours in advance</strong> for group bookings so we can have the bar staffed & stocked.</span>
                </li>
              </ul>
            </div>
          </div>

          <form id="carls-booking-form" class="md:col-span-7 bg-(--carls-slate-note) p-6 md:p-8 3xl:p-12 rounded-xl border border-(--carls-chalk-border) space-y-4 3xl:space-y-6 shadow-[0_10px_40px_rgba(0,0,0,0.22)] hover-lift transition-transform duration-500 relative" data-reveal data-reveal-delay="120">
            <div class="pb-2 3xl:pb-4 mb-1 3xl:mb-2">
              <h3 class="font-serif text-lg xl:text-xl 3xl:text-3xl font-bold text-white">Send A Booking Enquiry</h3>
              <p class="text-[0.75rem] xl:text-xs 3xl:text-sm font-mono mt-1 3xl:mt-2 text-white uppercase tracking-widest">We aim to reply the same working day</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 3xl:gap-6">
              <div>
                <label for="carls-name" class="block text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-wider text-white pb-1.5 3xl:pb-2.5">Full Name</label>
                <input id="carls-name" name="name" type="text" placeholder="e.g. Olivia Carter" class="w-full rounded-xl border border-(--carls-chalk-border)/60 bg-(--carls-base-brew) px-3.5 py-3 xl:p-3.5 3xl:p-4 text-sm xl:text-base 3xl:text-lg text-white placeholder-white/55 focus:outline-none focus:border-(--carls-accent-terracotta) focus:ring-2 focus:ring-(--carls-accent-terracotta)/20" />
              </div>
              <div>
                <label for="carls-email" class="block text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-wider text-white pb-1.5 3xl:pb-2.5">Email Address</label>
                <input id="carls-email" name="email" type="email" placeholder="you@example.com" class="w-full rounded-xl border border-(--carls-chalk-border)/60 bg-(--carls-base-brew) px-3.5 py-3 xl:p-3.5 3xl:p-4 text-sm xl:text-base 3xl:text-lg text-white placeholder-white/55 focus:outline-none focus:border-(--carls-accent-terracotta) focus:ring-2 focus:ring-(--carls-accent-terracotta)/20" />
              </div>
              <div>
                <label for="carls-date" class="block text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-wider text-white pb-1.5 3xl:pb-2.5">Booking Date</label>
                <input id="carls-date" name="date" type="text" placeholder="e.g. Sat 14 Mar 2026" class="w-full rounded-xl border border-(--carls-chalk-border)/60 bg-(--carls-base-brew) px-3.5 py-3 xl:p-3.5 3xl:p-4 text-sm xl:text-base 3xl:text-lg text-white placeholder-white/55 focus:outline-none focus:border-(--carls-accent-terracotta) focus:ring-2 focus:ring-(--carls-accent-terracotta)/20" />
              </div>
              <div>
                <label for="carls-guests" class="block text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-wider text-white pb-1.5 3xl:pb-2.5">Number of Guests</label>
                <select id="carls-guests" name="guests" class="w-full rounded-xl border border-(--carls-chalk-border)/60 bg-(--carls-base-brew) px-3.5 py-3 xl:p-3.5 3xl:p-4 text-sm xl:text-base 3xl:text-lg text-white placeholder-white/55 focus:outline-none focus:border-(--carls-accent-terracotta) focus:ring-2 focus:ring-(--carls-accent-terracotta)/20 appearance-none cursor-default">
                  ${bookingGuestOptions.map((opt) => `<option value="${opt.value}">${opt.label}</option>`).join("")}
                </select>
              </div>
            </div>

            <div>
              <label for="carls-message" class="block text-[0.75rem] xl:text-xs 3xl:text-sm font-mono uppercase tracking-wider text-white pb-1.5 3xl:pb-2.5">Any Notes (optional)</label>
              <textarea id="carls-message" name="message" rows="3" 3xl:rows="4" placeholder="Tell us about the occasion · cupping session, birthday, away-day…" class="w-full rounded-xl border border-(--carls-chalk-border)/60 bg-(--carls-base-brew) px-3 py-2.5 xl:p-3.5 3xl:p-4 text-sm xl:text-base 3xl:text-lg text-white placeholder-white/55 focus:outline-none focus:border-(--carls-accent-terracotta) focus:ring-2 focus:ring-(--carls-accent-terracotta)/20 resize-none"></textarea>
            </div>

            <button
              type="submit"
              class="w-full md:w-auto bg-(--carls-accent-terracotta) hover:bg-(--carls-accent-terracotta)/90 text-(--carls-dark-brown) font-black text-[0.8125rem] xl:text-sm 3xl:text-base py-3.5 xl:py-4.5 3xl:py-5 px-8 xl:px-10 3xl:px-12 rounded-xl transition-all hover-button-polish cursor-default border-none shadow-[0_10px_40px_rgba(0,0,0,0.22)] uppercase tracking-wider"
            >
              Send Enquiry
            </button>
          </form>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-white/10 bg-(--carls-brew-espresso) py-7 text-center">
        <div class="max-w-5xl mx-auto px-4">
          <p class="font-mono text-xs text-white font-bold tracking-wide">© 2026 Septen</p>
        </div>
      </footer>
    </div>
  `;

  bindCarlsCoffee(container);
}

export function initCarlsCoffee(container: DemoContainer): void {
  bindCarlsCoffee(container);
}
