import lukeImage from "@assets/founders/luke.avif";
import danielImage from "@assets/founders/daniel.avif";
import type { DemoSlug } from "@demos/scripts/demoMarkup";

type DemoCard = {
  slug: DemoSlug;
  name: string;
  description: string;
  siteLabel: string;
};

// These cards mirror the fixed demo catalogue, so typing the slug helps prevent drift
// between homepage content, demo routing, and the preview components.
export const demoCards: DemoCard[] = [
  {
    slug: "carls-coffee",
    name: "Carl's Coffee",
    description:
      "Artisan coffee roaster chalkboard digital menu. Styled inside deep chocolate sepia tones with maps and busy charts.",
    siteLabel: "www.carlscoffee.co.uk",
  },
  {
    slug: "alder-and-pipe-plumbing",
    name: "Alder & Pipe Plumbing",
    description:
      "Quiet, premium domestic home plumbing and system care. Features professional narrative case studies and workmanship credentials.",
    siteLabel: "www.alderandpipe.co.uk",
  },
  {
    slug: "sarahs-boutique",
    name: "Sarah's Boutique",
    description:
      "Soft luxury fashion storefront lookbook. Features full-screen hero overlays, extensive multi-category inventory grids, and custom fitting reserves.",
    siteLabel: "www.sarahsboutique.co.uk",
  },
  {
    slug: "greenfield-landscaping",
    name: "Greenfield Landscaping",
    description:
      "Established garden transformations. Features thick sandstone paving, timber deck screening, and robust drainage case studies in plain trades language.",
    siteLabel: "www.greenfieldlandscaping.co.uk",
  },
  {
    slug: "north-shore-fitness",
    name: "North Shore Fitness",
    description:
      "High-energy gym layout with membership offers, coaching details, and lead capture designed for direct sign-ups.",
    siteLabel: "www.northshorefitness.co.uk",
  },
];

export const faqItems = [
  {
    question: "Do I need technical knowledge?",
    answer:
      "Not at all. We handle the design, register the domain, set up secure hosting, and publish pages. Once live, we manage all updates so you do not have to touch any software.",
  },
  {
    question: "Who updates the website?",
    answer:
      "We do. All content edits and corrections are done by our team. You simply email us your new details, and we make the change.",
  },
  {
    question: "Can I request changes?",
    answer:
      "Yes. Both our plans include content updates. Whenever you need to change your telephone number, swap an image, or update pricing, we handle the edit.",
  },
  {
    question: "How quickly is it live?",
    answer:
      "We typically have your website completely designed, approved, and live online within 3 to 7 working days, depending on your chosen plan.",
  },
  {
    question: "How does the pricing work?",
    answer:
      "Each build is paid as a single transparent upfront fee, and includes the first month of your ongoing care plan for free. All active sites require a monthly care plan to stay hosted, secured, and up to date — after your free month you'll be charged the tiered care fee shown, and can cancel anytime.",
  },
  {
    question: "What is included in the required care plan?",
    answer:
      "Coverage depends on your selected tier. Every plan includes secure UK hosting, SSL encryption, security updates, monitored backups, managed domain configuration, and tiered email support with a guaranteed response speed — 2–3 business days for Essential Care, 1–2 business days for Growth Care, and under 24 hours for Pro Care.",
  },
  {
    question: "Is there any hidden cost?",
    answer:
      "No. Build packages are charged as a single transparent upfront fee as displayed, with the first month of your required care tier included free. After that, only the fixed monthly care plan cost applies. No surprise add-ons, no hidden setup fees, and you can cancel any care plan anytime after the initial 90-day post-launch stability window.",
  },
  {
    question: "Is there a long-term contract lock-in?",
    answer:
      "No. We just require a 3-month Post-Launch Stability Period to safely deploy your site, get it indexed on Google, and handle initial updates. After 90 days, you move to a flexible rolling monthly basis.",
  },
];

export const aboutParagraphs = [
  "Septen started in Gateshead, built by a couple of Computer Science students who spend most of their time writing code, breaking things, and trying to rebuild them properly. Beyond our studies, we hold hands-on experience in real industry development teams, building and maintaining production websites and web applications. Web development came out of that naturally more than anything else, less as a business idea at first, more as a habit of building small things that actually solve problems for people around us.",
  "Being from the North East, we've always seen how many small businesses rely on word of mouth or outdated websites that don't really reflect the work they do. Most of them don't need anything complicated, just something clear, reliable, and easy to keep up to date. That's the space we try to work in. Not overengineering things, just building websites that make sense for real people running real businesses.",
  "We handle everything from design through to hosting and maintenance, but the main idea behind that isn't convenience as a pitch, it's so that the technical side doesn't get in the way of anything else. We prefer keeping systems simple, readable, and stable so they don't need constant attention. The goal is that once something is built, it just quietly does its job in the background.",
  "Most of what we've learned has come from trial and error rather than formal experience in an agency environment. That's shaped how we approach things: straightforward builds, minimal unnecessary layers, and a focus on whether something actually improves how a business is seen online rather than how impressive the setup looks under the hood.",
];

export const founders = [
  {
    name: "Luke",
    role: "Co-Founder & Principal Developer",
    image: lukeImage,
    alt: "Luke, Co-Founder & Principal Developer of Septen",
  },
  {
    name: "Daniel",
    role: "Co-Founder & Principal Developer",
    image: danielImage,
    alt: "Daniel, Co-Founder & Principal Developer of Septen",
  },
];
