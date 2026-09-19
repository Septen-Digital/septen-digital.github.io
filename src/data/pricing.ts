export const buildOptions = [
  {
    name: "Basic Build",
    salePrice: "199",
    originalPrice: "499",
    firstMonthFreeCareTier: "Essential Care",
    ongoingCarePrice: "9.99",
    description:
      "A clean, professional single-build launch for local businesses and sole traders that just need to be found and contacted clearly.",
    ctaLabel: "Enquire About Basic Build",
    enquiryPlan: "Basic Build",
    featured: false,
    items: [
      "Custom one-page website design tailored to your brand",
      "Fast, responsive layout (mobile + desktop optimised)",
      "Core business information, contact details, and enquiry form",
      "Up to 5 content sections (about, services, contact, testimonials, gallery)",
      "Launch delivery with basic on-page SEO setup",
      "30 days of post-launch support for launch-day fixes",
    ],
  },
  {
    name: "Standard Build",
    salePrice: "349",
    originalPrice: "799",
    firstMonthFreeCareTier: "Growth Care",
    ongoingCarePrice: "19.99",
    description:
      "Designed for busy local services and shops that want stronger enquiry generation, content pages, and managed launch support.",
    ctaLabel: "Enquire About Standard Build",
    enquiryPlan: "Standard Build",
    featured: true,
    items: [
      "Everything included in Basic Build",
      "Multi-page site (up to 7 pages: services, team, gallery, FAQ)",
      "SEO optimisation to improve local search rankings and visibility",
      "Google Business Profile setup and linking",
      "Conversion-focused enquiry flow and call-to-action polish",
      "Launch training walkthrough so you know how to keep content fresh",
    ],
  },
  {
    name: "Premium Build",
    salePrice: "499",
    originalPrice: "1299",
    firstMonthFreeCareTier: "Pro Care",
    ongoingCarePrice: "29.99",
    description:
      "A premium end-to-end launch for ambitious local brands: bespoke layouts, booking-ready features, and performance-first setup.",
    ctaLabel: "Enquire About Premium Build",
    enquiryPlan: "Premium Build",
    featured: false,
    items: [
      "Everything included in Standard Build",
      "Bespoke multi-page layouts (up to 12 pages) with tailored section design",
      "Advanced conversion features: booking widgets, pricing tables, calendars",
      "Priority build queue with 3–5 day turnaround target",
      "Performance and accessibility polish with pre-launch audit",
      "30 days of advanced pro care SEO, monitoring, and priority support ramp-up at launch",
    ],
  },
];

export const retainerPlans = [
  {
    name: "Essential Care",
    price: "9.99",
    description:
      "Light-touch monthly upkeep so your site keeps running reliably, securely, and visibly online after launch.",
    ctaLabel: "Enquire About Essential Care",
    enquiryPlan: "Essential Care Retainer",
    featured: false,
    items: [
      "Secure UK hosting with 99.9% uptime and SSL encryption",
      "Core security updates, firewall, and backup retention",
      "Up to 2 small content updates each month (text, photos, hours)",
      "Monthly uptime monitoring and basic plugin/stack checks",
      "Standard email support (2–3 business day response time)",
      "Domain configuration and annual renewal management",
    ],
  },
  {
    name: "Growth Care",
    price: "19.99",
    description:
      "Our most popular retainer: proactive performance, SEO monitoring, and regular updates for busy growing businesses.",
    ctaLabel: "Enquire About Growth Care",
    enquiryPlan: "Growth Care Retainer",
    featured: true,
    items: [
      "Everything included in Essential Care",
      "Up to 6 content updates monthly (menus, pricing, offers, new pages)",
      "Monthly local SEO check-ins and ranking position reporting",
      "Performance tuning, Core Web Vitals monitoring, speed tweaks",
      "Priority email support (1–2 business day response time)",
      "Quarterly mini-reviews with improvement suggestions",
    ],
  },
  {
    name: "Pro Care",
    price: "29.99",
    description:
      "Hands-on total management for businesses that need constant updates, campaigns, and priority response.",
    ctaLabel: "Enquire About Pro Care",
    enquiryPlan: "Pro Care Retainer",
    featured: false,
    items: [
      "Everything included in Growth Care",
      "Unlimited content edits, pages, offers, and campaign updates",
      "Monthly strategy call and dedicated success check-ins",
      "VIP email support (Guaranteed under 24-hour response time)",
      "A/B testing of headings, contact forms, and call-to-action layouts",
      "Advanced analytics dashboard with custom weekly summary reports",
      "Dedicated developer block of 3 hours per month for new features",
    ],
  },
];
