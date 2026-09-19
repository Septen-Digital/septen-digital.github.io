export type LegalTab = "terms" | "privacy" | "cookies" | "data-rights" | "disclaimer";

export const legalTabs: Array<{ id: LegalTab; label: string }> = [
  { id: "terms", label: "Terms & Conditions" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "cookies", label: "Cookie Policy" },
  { id: "data-rights", label: "Data Rights" },
  { id: "disclaimer", label: "Disclaimer" },
];

export const legalTabContent: Record<LegalTab, string> = {
  terms: `
    <p class="font-extrabold text-brand-teal-dark uppercase text-[10px] tracking-widest">Septen - Website Terms of Use</p>
    <p><strong>Last updated:</strong> 16 September 2026</p>
    <p>These Website Terms of Use ("Terms") govern your use of septen.co.uk (the "Site"). By accessing or using the Site, you agree to these Terms. If you do not agree, do not use the Site.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">1. Description of Site</h3>
    <p>Septen showcases web design, hosting, and related digital studio packages on the Site. The information on this Site is for presentation purposes only, and any formal engagement for digital services is governed strictly by a separate written agreement or project invoice contract.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">2. Services and Pricing Model</h3>
    <p>Website builds are offered as one-off project packages. The currently listed build prices are Basic (£199), Standard (£349), and Premium (£499), subject to the final written scope. Every active website requires an ongoing care plan after launch. The listed care plans are Essential Care (£9.99 per month), Growth Care (£19.99 per month), and Pro Care (£29.99 per month). The first month of the matching care tier is included with each listed build package, subject to the package description. Bespoke work and requirements outside a listed package are scoped and quoted separately.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">3. Use of the Site</h3>
    <p>You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use of the Site.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">4. Intellectual Property</h3>
    <p>All content on the Site, including text, graphics, logos, and code, is the property of Septen or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written permission.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">5. Limitation of Liability</h3>
    <p>To the fullest extent permitted by law, Septen shall not be liable for indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, revenues, data, use, goodwill, or other intangible losses arising out of your use of the Site.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">6. Governing Law</h3>
    <p>These Terms are governed by the laws of England and Wales. Any dispute shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">7. Changes to Terms</h3>
    <p>We may update these Website Terms of Use from time to time. Any changes will be posted here with an updated effective date.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">8. Contact</h3>
    <p>If you have questions about these Terms, contact <strong class="font-bold text-brand-teal-dark select-all">septen.digital@gmail.com</strong>.</p>
  `,
  privacy: `
    <p class="font-extrabold text-brand-teal-dark uppercase text-[10px] tracking-widest">Septen - Privacy Policy</p>
    <p><strong>Last updated:</strong> 16 September 2026</p>
    <p>We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Site and services.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">1. Data Controller</h3>
    <p>Septen acts as the data controller for the purposes of the UK GDPR and related UK data protection law.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">2. Data We Collect</h3>
    <p>When you submit an enquiry, we may collect your name, email address, phone number, company name, company address, selected enquiry type or service plan, and the content of your message. The enquiry form may save an unfinished draft locally in your browser so you can continue later. We do not ask for special category personal data through this Site.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">3. How We Use Your Data</h3>
    <p>We use your data to respond to enquiries, discuss the services you request, provide support, and operate the Site. We may also use limited information for reasonable business administration and security purposes. We also process completely anonymised server telemetry via Cloudflare Web Analytics to monitor site security, traffic volume, and general performance metrics.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">4. Data Sharing</h3>
    <p>We share personal data only with trusted service providers essential to our workflow, including Cloudflare for site security, and Web3Forms (utilising Amazon Web Services infrastructure) for secure form transmission. These providers are bound by strict Data Processing Agreements.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">5. Data Retention</h3>
    <p>Form submissions are temporarily cached securely by our transmission processor (Web3Forms) for up to 30 days before being automatically deleted. We retain the final enquiry details directly within our secure business email system only for as long as necessary to manage your request, service any resulting contract, or comply with statutory UK tax record obligations.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">6. Your Rights</h3>
    <p>You have rights of access, correction, deletion, restriction, portability, and objection where applicable. See the Data Rights section for how to make a request.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">7. Security</h3>
    <p>We apply reasonable technical and organisational measures to protect personal data against unauthorised access, loss, misuse, or disclosure.</p>
  `,
  cookies: `
    <p class="font-extrabold text-brand-teal-dark uppercase text-[10px] tracking-widest">Septen - Cookie Policy</p>
    <p><strong>Last updated:</strong> 16 September 2026</p>
    <p>This Cookie Policy explains how we use cookies and similar technologies on our Site.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">1. What Are Cookies?</h3>
    <p>Cookies are small text files stored on your device when you visit a website. They help the website function and can remember preferences or settings.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">2. How We Use Cookies</h3>
    <p>We use necessary cookies to support secure, basic operation of the Site. We also utilise Cloudflare Web Analytics to monitor general website traffic trends and page performance. This analytics service is completely privacy-first, operates anonymously without collecting identifiable personal data, and does not drop, track, or store any cookies on your device.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">3. Your Choices</h3>
    <p>You can refuse or delete cookies in your browser settings. Blocking essential cookies may affect how some parts of the Site work.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">4. Changes to Policy</h3>
    <p>We may update this Cookie Policy from time to time. Any changes will be posted here with an updated effective date.</p>
  `,
  "data-rights": `
    <p class="font-extrabold text-brand-teal-dark uppercase text-[10px] tracking-widest">Septen - Data Rights</p>
    <p><strong>Last updated:</strong> 16 September 2026</p>
    <p>If you have submitted an enquiry to Septen, you can ask us how your personal data is being used and request action on it where the law allows.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">1. Rights You Can Exercise</h3>
    <p>You may request access to the personal data we hold about you, correction of inaccurate data, deletion of data, restriction of processing, a portable copy of data where applicable, or to object to processing.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">2. How to Make a Request</h3>
    <p>Email <strong class="font-bold text-brand-teal-dark select-all">septen.digital@gmail.com</strong> with the subject line <strong>Data Rights Request</strong>. Please include enough detail for us to identify your enquiry and the action you want us to take.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">3. Response Times</h3>
    <p>We aim to respond without undue delay and normally within one calendar month, subject to verification of identity and the complexity of the request.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">4. Complaints</h3>
    <p>If you are not satisfied with how we handle your data, you may complain to the Information Commissioner's Office in the UK.</p>
  `,
  disclaimer: `
    <p class="font-extrabold text-brand-teal-dark uppercase text-[10px] tracking-widest">Septen - Disclaimer</p>
    <p><strong>Last updated:</strong> 16 September 2026</p>
    <p>The information on this Site is provided for general information only. While we aim to keep it accurate and up to date, we make no guarantee that all content is complete, current, or suitable for every situation.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">1. No Professional Advice</h3>
    <p>Content on this Site does not constitute legal, financial, tax, or regulatory advice. You should obtain independent advice where your situation requires it.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">2. Service Descriptions</h3>
    <p>Package descriptions, prices, care-plan fees, included free-care periods, and delivery timelines are indicative and may change. Build packages are one-off project fees; active websites require an ongoing care plan after launch. Final scope, deliverables, payment terms, care coverage, and any bespoke work are governed by the written agreement for the specific project.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">3. Demo Content Notice</h3>
    <p>Some demo websites, names, branding, and example business scenarios shown on this Site are fictional concept materials created by Septen for presentation purposes. They are not intended to represent, copy, or infringe upon any real person, company, trademark, or trading activity, and any resemblance to real entities is unintended and coincidental.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">4. Third-Party Services</h3>
    <p>This Site uses third-party services including Cloudflare and Web3Forms. We are not responsible for outages, policy changes, or failures originating from those providers.</p>

    <h3 class="font-bold text-slate-900 text-sm mt-4">5. External Links</h3>
    <p>Where the Site links to external websites, those links are provided for convenience. We do not control and are not responsible for the content or policies of third-party sites.</p>
  `,
};
