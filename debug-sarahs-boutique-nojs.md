# Debug Session: sarahs-boutique-nojs

- **Status**: [OPEN]
- **Issue**: With JavaScript disabled on mobile, navigating Sarah’s Boutique demo links can land on blank sections (likely hidden panels). Footer branding also needs to remain Septen-branded.

## Reproduction Steps

1. Open Sarah’s Boutique demo on mobile.
2. Disable JavaScript.
3. Tap `Catalogue` / `About` / `Visit Store` / product links.
4. Observe whether the target section becomes visible or appears as a blank/white area.

## Hypotheses & Verification

| ID  | Hypothesis                                                                                                                     | Likelihood | Effort | Evidence |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------ | -------- |
| A   | The `hidden` attribute is not being reliably overridden by the current `<noscript><style>` rules on the target mobile browser. | High       | Low    | Pending  |
| B   | The `<noscript><style>` block is not being applied (JS not truly disabled, or browser quirk), leaving non-home panels hidden.  | Medium     | Low    | Pending  |
| C   | Product-detail targeting conflicts with broader hidden overrides, causing unexpected visibility/blank areas.                   | Medium     | Medium | Pending  |
| D   | Hardcoded “active” nav styling remains on `Home`, making multiple tabs appear active without JS.                               | Medium     | Low    | Pending  |

## Next Step

- Simplify no-JS CSS to a single robust hidden override (`#root [hidden] { display:block !important; }`) and then re-hide product detail panels unless targeted.
