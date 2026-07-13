import { getIcon } from '../utils/icons';
import { openDemoModalLazy } from '../utils/lazyDemoModal';
import { responsiveImageAttrs } from './responsiveImage';
import type { DemoContainer } from './types';

function bindNorthShoreFitness(container: DemoContainer): void {
  const handleJoinCta = async (e?: Event) => {
    if (e) e.preventDefault();
    await openDemoModalLazy("North Shore Fitness");
  };

  container.querySelector('#fitness-nav-cta')?.addEventListener('click', handleJoinCta);
  container.querySelector('#fitness-hero-cta')?.addEventListener('click', handleJoinCta);
  container.querySelector('#fitness-membership-1')?.addEventListener('click', handleJoinCta);
  container.querySelector('#fitness-membership-2')?.addEventListener('click', handleJoinCta);
  container.querySelector('#fitness-contact-form')?.addEventListener('submit', handleJoinCta);
}

export function renderNorthShoreFitness(container: DemoContainer): void {
  container.innerHTML = `
    <div class="bg-[#0B0F19] min-h-screen text-[#E2E8F0] font-sans antialiased text-left selection:bg-amber-500/20 flex flex-col">
      
      <!-- Brand Navigation Header -->
      <nav class="bg-[#0F1422] border-b border-slate-800">
        <div class="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center justify-center md:justify-start gap-2 w-full md:w-auto">
            <div class="w-8 h-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold font-mono shrink-0">
              NS
            </div>
            <span class="font-sans font-extrabold text-lg text-white tracking-wider text-center md:text-left">
              NORTH SHORE FITNESS
            </span>
          </div>

          <div class="flex flex-wrap justify-center items-center gap-x-4 gap-y-2.5 md:gap-x-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <a href="#services" class="hover:text-white transition-colors">Services</a>
            <a href="#coaches" class="hover:text-white transition-colors">Coaches</a>
            <a href="#memberships" class="hover:text-white transition-colors">Memberships</a>
            <a href="#timetables" class="hover:text-white transition-colors">Timetables</a>
            <button 
              id="fitness-nav-cta"
              class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-4 py-2 rounded text-[10px] uppercase tracking-widest transition-colors hover-button-polish font-mono border-none cursor-pointer shrink-0"
            >
              Join Gym
            </button>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative bg-[#0F1422] py-20 md:py-28 overflow-hidden border-b border-slate-800">
        <div class="absolute inset-0 z-0">
          <img 
            ${responsiveImageAttrs({
              src: '/demo-images/north-shore-fitness/hero.webp',
              baseWidth: 1400,
              variantWidths: [480, 960],
              sizes: '100vw',
            })}
            alt="North Shore Fitness clean black steel power racking and free weight benches" 
            loading="eager"
            fetchpriority="high"
            decoding="async"
            data-skeleton
            class="image-skeleton w-full h-full object-cover opacity-35"
          />
          <div class="absolute inset-0 bg-linear-to-t from-[#0B0F19] to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-4xl mx-auto px-6 space-y-6 text-left" data-reveal>
          <span class="text-[10px] uppercase tracking-[0.25em] text-amber-500 font-extrabold font-mono block">
            Independent Strength Athletics Studio
          </span>
          <h1 class="font-sans text-3xl sm:text-5xl font-black tracking-tight text-white max-w-2xl">
            A genuine local gym built for real performance and local community.
          </h1>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            No mirrors, no screen distractions, and no corporate gimmicks. North Shore Fitness is a physical training space dedicated to heavy kettlebells, Olympic plates, and supportive group strength training work for everyday people in our community.
          </p>

          <div class="flex flex-wrap gap-4 pt-3">
            <button 
              id="fitness-hero-cta"
              class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3.5 px-6 rounded transition-all hover-button-polish cursor-pointer border-none shadow-md uppercase tracking-wider"
            >
              Get Free Day Pass
            </button>
            <a 
              href="#timetables"
              class="bg-transparent hover:bg-white/5 text-white border border-solid border-slate-705 font-bold text-xs py-3.5 px-6 rounded transition-all text-center cursor-pointer flex items-center justify-center"
            >
              View Class Times
            </a>
          </div>

          <div class="flex flex-wrap gap-6 pt-4 text-xs font-mono text-slate-400">
            <span class="flex items-center gap-1.5">${getIcon('Clock', 'w-4 h-4 text-amber-400')} Open Daily: 06:00 - 22:00</span>
            <span class="flex items-center gap-1.5">${getIcon('ShieldCheck', 'w-4 h-4 text-amber-400')} Professional Olympic Equipment Only</span>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" class="max-w-5xl mx-auto px-6 py-20 text-left">
        <div class="border-b border-slate-800 pb-5 mb-12" data-reveal>
          <span class="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-black block">Core Training</span>
          <h2 class="font-sans text-2xl md:text-3xl font-extrabold text-white mt-1">Our Services</h2>
          <p class="text-xs text-slate-400 italic mt-1 font-serif font-light">Plainly explained, results-driven coaching loops.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="bg-[#121829] border border-slate-800 p-6 rounded-lg space-y-3 hover-lift transition-transform duration-300 hover:border-amber-500/40" data-reveal data-reveal-delay="60">
            <div class="w-10 h-10 bg-amber-500/10 text-amber-500 rounded flex items-center justify-center">
              ${getIcon('Dumbbell', 'w-5 h-5 animate-pulse')}
            </div>
            <h3 class="font-sans font-bold text-lg text-white">Group Strength Training</h3>
            <p class="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
              Traditional barbell programming focusing on safe biomechanics. Learn deadlifts, back squats, overhead presses, and lunges in small, focused team blocks of no more than 10 people.
            </p>
          </div>

          <div class="bg-[#121829] border border-slate-800 p-6 rounded-lg space-y-3 hover-lift transition-transform duration-300 hover:border-amber-500/40" data-reveal data-reveal-delay="110">
            <div class="w-10 h-10 bg-amber-500/10 text-amber-500 rounded flex items-center justify-center font-bold font-mono text-sm leading-none pt-0.5">
              PC
            </div>
            <h3 class="font-sans font-bold text-lg text-white">Individual Performance Coaching</h3>
            <p class="text-xs md:text-sm text-[#E2E8F0] leading-relaxed font-sans">
              One-on-one custom technique workshops, strength profiling, and kinetic movement correction designed to maximize joint safety and build consistent lifting habits.
            </p>
          </div>

          <div class="bg-[#121829] border border-slate-800 p-6 rounded-lg space-y-3 hover-lift transition-transform duration-300 hover:border-amber-500/40" data-reveal data-reveal-delay="160">
            <div class="w-10 h-10 bg-amber-500/10 text-amber-500 rounded flex items-center justify-center">
              ${getIcon('Zap', 'w-5 h-5')}
            </div>
            <h3 class="font-sans font-bold text-lg text-white">Athletic Conditioning</h3>
            <p class="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
              High-intensity metabolic thresholds utilizing weighted sled pulls, rowing splits, assault bikes, sandbag runs, and structural medicine ball tosses to build pure work capacity.
            </p>
          </div>

          <div class="bg-[#121829] border border-slate-800 p-6 rounded-lg space-y-3 hover-lift transition-transform duration-300 hover:border-amber-500/40" data-reveal data-reveal-delay="210">
            <div class="w-10 h-10 bg-amber-500/10 text-amber-500 rounded flex items-center justify-center">
              ${getIcon('Heart', 'w-5 h-5')}
            </div>
            <h3 class="font-sans font-bold text-lg text-white">Restoration</h3>
            <p class="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
              Restorative tissue mobility, deep foam roller triggers, targeted stretching bands, and breathing guidance to speed up muscle recovery and maintain full joint range.
            </p>
          </div>

        </div>
      </section>

      <!-- Coaches Section -->
      <section id="coaches" class="bg-[#0E1322] border-y border-slate-800 py-20">
        <div class="max-w-5xl mx-auto px-6 text-left">
          
          <div class="mb-12 border-b border-slate-800 pb-5" data-reveal>
            <span class="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold block">Our Instructors</span>
            <h2 class="font-sans text-2xl md:text-3xl font-black text-white mt-1">Coaching Staff & Qualifications</h2>
            <p class="text-xs text-slate-400 font-serif italic mt-1 pb-1 font-light">Accredited personal trainers focused on genuine technique support.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div class="bg-[#13192B] border border-slate-800 p-6 rounded-lg space-y-4 hover-lift transition-transform duration-300 hover:border-amber-500/40" data-reveal data-reveal-delay="60">
              <div class="w-12 h-12 bg-amber-500/15 text-amber-500 rounded-full flex items-center justify-center text-lg font-black font-mono">
                M
              </div>
              <div class="space-y-1">
                <h3 class="font-sans font-bold text-lg text-white">Coach Marcus</h3>
                <span class="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-900/40 px-2 py-0.5 rounded uppercase">
                  Head Performance Coach
                </span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed font-sans">
                Marcus holds a BSc in Sports Science and over 12 years of clinical strength coaching experience. Fully British Weightlifting certified, he specializes in safe barbell compound mechanics and power lifter preparation.
              </p>
              <div class="text-[10px] text-slate-500 font-mono italic mt-2">
                Focus: squats, heavy pulls, technique
              </div>
            </div>

            <div class="bg-[#13192B] border border-slate-800 p-6 rounded-lg space-y-4 hover-lift transition-transform duration-300 hover:border-amber-500/40" data-reveal data-reveal-delay="110">
              <div class="w-12 h-12 bg-amber-500/15 text-amber-500 rounded-full flex items-center justify-center text-lg font-black font-mono">
                S
              </div>
              <div class="space-y-1">
                <h3 class="font-sans font-bold text-lg text-white">Coach Sarah</h3>
                <span class="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-900/40 px-2 py-0.5 rounded uppercase">
                  Mobility & Restoration
                </span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed font-sans">
                Sarah is a 500-hour RYT Certified Yoga Instructor with advanced training in clinical athletic orthopedic rehabilitation. She focuses on joint health, injury rehabilitation, and functional muscular alignment.
              </p>
              <div class="text-[10px] text-slate-500 font-mono italic mt-2">
                Focus: restorative care, core recovery, bands
              </div>
            </div>

            <div class="bg-[#13192B] border border-slate-800 p-6 rounded-lg space-y-4 hover-lift transition-transform duration-300 hover:border-amber-500/40" data-reveal data-reveal-delay="160">
              <div class="w-12 h-12 bg-amber-500/15 text-amber-500 rounded-full flex items-center justify-center text-lg font-black font-mono">
                K
              </div>
              <div class="space-y-1">
                <h3 class="font-sans font-bold text-lg text-white">Trainer Kelly</h3>
                <span class="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-900/40 px-2 py-0.5 rounded uppercase">
                  Conditioning Specialist
                </span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed font-sans">
                A competitive British Athletics road-running coach and active ultra-triathlete, Kelly specializes in aerobic engine modeling. She builds high-output interval loops designed for pure heart conditioning and joint safety.
              </p>
              <div class="text-[10px] text-slate-500 font-mono italic mt-2">
                Focus: cardiac output, endurance, speed repeaters
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Memberships Section -->
      <section id="memberships" class="max-w-5xl mx-auto px-6 py-20 text-left">
        <div class="border-b border-slate-800 pb-5 mb-12" data-reveal>
          <span class="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-black block">Join Us</span>
          <h2 class="font-sans text-2xl md:text-3xl font-extrabold text-white mt-1">Membership Access Tiers</h2>
          <p class="text-xs text-slate-400 italic mt-1 font-serif font-light">Honest flat-rate fees. No annoying tie-in contracts or startup card penalties.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          
          <div class="bg-[#121829] border border-slate-800 p-8 rounded-xl relative overflow-hidden space-y-6 flex flex-col justify-between hover-lift transition-transform duration-300 hover:border-amber-500/40" data-reveal data-reveal-delay="60">
            <div class="space-y-4">
              <div>
                <span class="text-[9px] font-mono bg-slate-800 text-slate-300 font-extrabold px-2 py-0.5 rounded uppercase tracking-widest">
                  Floor Only Access
                </span>
                <p class="text-2xl font-black text-white mt-2">£35.00 / <span class="text-xs text-slate-400 font-normal">month</span></p>
                <p class="text-xs text-slate-400 mt-1">Excellent for experienced, self-directed lifters.</p>
              </div>

              <ul class="space-y-2.5 text-xs text-slate-300">
                <li class="flex items-center gap-2">✔ Unlimited gym floor access 06:00 - 22:05 daily</li>
                <li class="flex items-center gap-2">✔ Access to complete range of heavy barbells & kettlebells</li>
                <li class="flex items-center gap-2">✔ Dedicated changing cabins & solid lockers</li>
              </ul>
            </div>

            <button 
              id="fitness-membership-1"
              class="w-full bg-transparent hover:bg-slate-800/80 text-white border border-slate-700 font-bold p-3 text-xs rounded transition-all hover-button-polish cursor-pointer uppercase tracking-wider"
            >
              Sign Up For Floor Pass
            </button>
          </div>

          <div class="bg-[#121829] border-2 border-amber-500 p-8 rounded-xl relative overflow-hidden space-y-6 shadow-lg shadow-amber-500/5 flex flex-col justify-between hover-lift transition-transform duration-300" data-reveal data-reveal-delay="120">
            <div class="absolute top-0 right-0 bg-amber-500 text-slate-950 px-3 py-1 font-mono font-black text-[9px] uppercase tracking-wider rounded-bl">
              Most Popular
            </div>

            <div class="space-y-4">
              <div>
                <span class="text-[9px] font-mono bg-amber-500/10 text-amber-400 font-extrabold px-2.5 py-0.5 rounded uppercase tracking-widest">
                  Coached Strength Pass
                </span>
                <p class="text-2xl font-black text-amber-500 mt-2">£55.00 / <span class="text-xs text-slate-400 font-normal">month</span></p>
                <p class="text-xs text-slate-300 mt-1">Our fully guided class & team technique access pass.</p>
              </div>

              <ul class="space-y-2.5 text-xs text-slate-200">
                <li class="flex items-center gap-2">✔ Access to all scheduled group strength & conditioning classes</li>
                <li class="flex items-center gap-2">✔ High-level technique coaching by Coach Marcus</li>
                <li class="flex items-center gap-2">✔ Initial 1-on-1 performance diagnostic correction program</li>
                <li class="flex items-center gap-2">✔ Unlimited independent floor hours</li>
              </ul>
            </div>

            <button 
              id="fitness-membership-2"
              class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black p-3 text-xs rounded transition-all hover-button-polish cursor-pointer border-none uppercase tracking-wider"
            >
              Secure Class Access Pass
            </button>
          </div>

        </div>
      </section>

      <!-- Timetables Section -->
      <section id="timetables" class="bg-[#0E1322] border-t border-slate-800 py-20 text-left">
        <div class="max-w-5xl mx-auto px-6">
          
          <div class="mb-12 border-b border-slate-800 pb-5" data-reveal>
            <span class="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-black block">Weekly Times</span>
            <h2 class="font-sans text-2xl md:text-3xl font-black text-white mt-1">Weekly Gym Timetable</h2>
            <p class="text-xs text-slate-400 font-serif italic mt-1 font-light">
              Static reference list of focused workouts. No schedules dashboards to click or online booking systems to worry about — members simply show up 5 minutes before class begins.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <!-- Monday card -->
            <div class="bg-[#121829] border border-slate-800 rounded-lg p-5 space-y-4 hover-lift transition-transform duration-300 hover:border-amber-500/40" data-reveal data-reveal-delay="60">
              <h3 class="font-bold text-md text-amber-500 font-mono tracking-wider border-b border-slate-800 pb-2 uppercase text-left">
                Monday Class Schedule
              </h3>
              
              <div class="space-y-4 text-xs">
                <div class="space-y-1 text-left">
                  <div class="flex justify-between items-center gap-2">
                    <span class="font-mono text-white font-extrabold text-[11px]">06:00 AM - Power HIIT</span>
                    <span class="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded shrink-0">ADVANCED</span>
                  </div>
                  <p class="text-slate-400 leading-relaxed font-sans">Kettlebells, sandbags, and assault bikes. Led by Kelly.</p>
                </div>

                <div class="space-y-1 text-left">
                  <div class="flex justify-between items-center gap-2">
                    <span class="font-mono text-white font-extrabold text-[11px]">12:00 PM - Iron Strength 101</span>
                    <span class="text-[8px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded shrink-0">CORE</span>
                  </div>
                  <p class="text-slate-400 leading-relaxed font-sans">Deadlifts, heavy compound barbell presses. Led by Marcus.</p>
                </div>

                <div class="space-y-1 text-left">
                  <div class="flex justify-between items-center gap-2">
                    <span class="font-mono text-white font-extrabold text-[11px]">05:30 PM - Cardio Cycle</span>
                    <span class="text-[8px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded shrink-0">CORE</span>
                  </div>
                  <p class="text-slate-400 leading-relaxed font-sans">Rhythmic sprint repeats and heavy hill loops. Led by Kelly.</p>
                </div>
              </div>
            </div>

            <!-- Wednesday card -->
            <div class="bg-[#121829] border border-slate-800 rounded-lg p-5 space-y-4 hover-lift transition-transform duration-300 hover:border-amber-500/40" data-reveal data-reveal-delay="110">
              <h3 class="font-bold text-md text-amber-500 font-mono tracking-wider border-b border-slate-800 pb-2 uppercase text-left">
                Wednesday Schedule
              </h3>
              
              <div class="space-y-4 text-xs">
                <div class="space-y-1 text-left">
                  <div class="flex justify-between items-center gap-2">
                    <span class="font-mono text-white font-extrabold text-[11px]">06:30 AM - Barbell Complex</span>
                    <span class="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded shrink-0">ADVANCED</span>
                  </div>
                  <p class="text-slate-400 leading-relaxed font-sans">Olympic classic clean & high pull technique. Led by Marcus.</p>
                </div>

                <div class="space-y-1 text-left">
                  <div class="flex justify-between items-center gap-2">
                    <span class="font-mono text-white font-extrabold text-[11px]">12:30 PM - Core Stability</span>
                    <span class="text-[8px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded shrink-0">CORE</span>
                  </div>
                  <p class="text-slate-400 leading-relaxed font-sans">Rotational carries, heavy holds, and alignment blocks. Led by Sarah.</p>
                </div>

                <div class="space-y-1 text-left">
                  <div class="flex justify-between items-center gap-2">
                    <span class="font-mono text-white font-extrabold text-[11px]">06:00 PM - Athletic Conditioning</span>
                    <span class="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded shrink-0">ADVANCED</span>
                  </div>
                  <p class="text-slate-400 leading-relaxed font-sans">Heavy sled pushes and high row intervals. Led by Kelly.</p>
                </div>
              </div>
            </div>

            <!-- Friday card -->
            <div class="bg-[#121829] border border-slate-800 rounded-lg p-5 space-y-4 hover-lift transition-transform duration-300 hover:border-amber-500/40" data-reveal data-reveal-delay="160">
              <h3 class="font-bold text-md text-amber-500 font-mono tracking-wider border-b border-slate-800 pb-2 uppercase text-left">
                Friday Schedule
              </h3>
              
              <div class="space-y-4 text-xs">
                <div class="space-y-1 text-left">
                  <div class="flex justify-between items-center gap-2">
                    <span class="font-mono text-white font-extrabold text-[11px]">07:00 AM - Row Intervals</span>
                    <span class="text-[8px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded shrink-0">CORE</span>
                  </div>
                  <p class="text-slate-400 leading-relaxed font-sans">Row splits with bodyweight compound blocks. Led by Kelly.</p>
                </div>

                <div class="space-y-1 text-left">
                  <div class="flex justify-between items-center gap-2">
                    <span class="font-mono text-white font-extrabold text-[11px]">01:00 PM - Kettlebell Flow</span>
                    <span class="text-[8px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded shrink-0">CORE</span>
                  </div>
                  <p class="text-slate-400 leading-relaxed font-sans">Continuous ballistic kettlebell movements. Guided by Marcus.</p>
                </div>

                <div class="space-y-1 text-left">
                  <div class="flex justify-between items-center gap-2">
                    <span class="font-mono text-white font-extrabold text-[11px]">05:30 PM - Joint Recovery</span>
                    <span class="text-[8px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded shrink-0">RECOVERY</span>
                  </div>
                  <p class="text-slate-400 leading-relaxed font-sans">Slow-stretching foam-rolling muscle restoration. Led by Sarah.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Structured invitation callback Enquiry block -->
      <section class="bg-[#0B0F19] py-16 text-center border-t border-slate-800">
        <div class="max-w-xl mx-auto px-6 space-y-6" data-reveal>
          <h2 class="font-sans text-2xl font-extrabold text-white">Join the Community Club</h2>
          <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed font-sans">
            Interested in booking a strength test day pass or looking to speak to one of our head coaches? Fill in your details below and we will contact you directly.
          </p>

          <form id="fitness-contact-form" class="space-y-3.5 p-6 bg-[#0F1422] border border-slate-800 rounded-lg text-left shadow-md max-w-sm mx-auto hover-lift transition-transform duration-300 hover:border-amber-500/40">
            <div>
              <label class="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">Your Full Name</label>
              <input type="text" required placeholder="Marcus Vance" class="w-full bg-[#121829] border border-slate-800 text-white rounded p-2.5 text-xs focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label class="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">Email Address</label>
              <input type="email" required placeholder="marcus@vance.com" class="w-full bg-[#121829] border border-slate-800 text-white rounded p-2.5 text-xs focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label class="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">Core Training Goal</label>
              <select class="w-full bg-[#121829] border border-slate-800 text-slate-300 rounded p-2.5 text-xs focus:outline-none focus:border-amber-500">
                <option>Traditional Barbell Squats/Pulls</option>
                <option>Athletic Metabolic Conditioning</option>
                <option>Joint Mobility & Restoration</option>
                <option>Self-directed gym floor only</option>
              </select>
            </div>
            <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black p-3 rounded text-xs uppercase tracking-widest hover-button-polish border-none cursor-pointer font-sans">
              Submit My Request
            </button>
          </form>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-slate-900 bg-[#070A11] py-8 text-center text-xs text-slate-500 font-mono mt-auto">
        © 2026 Septen
      </footer>

    </div>
  `;

  bindNorthShoreFitness(container);
}

export function initNorthShoreFitness(container: DemoContainer): void {
  bindNorthShoreFitness(container);
}
