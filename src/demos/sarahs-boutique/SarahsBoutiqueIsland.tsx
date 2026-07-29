/** @jsxImportSource preact */
import { useEffect, useMemo, useState } from "preact/hooks";
import {
  getSarahsBoutiqueCategoryAnchorId,
  getSarahsBoutiqueProductDetailId,
  sarahsBoutiqueCategories,
  type SarahsBoutiqueCategory,
  type SarahsBoutiqueView,
} from "./sarahsBoutique.data";
import { initScrollReveal } from "@utils/ui";
import { initMediaSkeletons } from "@utils/media";

type Props = {
  rootId: string;
};

const navActiveClasses = ["text-[#E29578]", "font-bold"];
const filterActiveClasses = ["bg-[#1E1E1C]", "border-[#1E1E1C]", "text-white"];
const filterInactiveClasses = [
  "bg-white",
  "border-stone-200",
  "text-stone-500",
  "hover:border-stone-400",
  "hover:text-[#1E1E1C]",
];
const visitConfirmationSelector = "[data-boutique-visit-success]";
const collectionsLinksSelector = "[data-boutique-collections-links]";
const visitFormInputSelector =
  '[data-boutique-visit-form-input="primary"]';
const viewTargetSelectors: Record<Exclude<SarahsBoutiqueView, "product-detail">, string> = {
  home: "#boutique-home",
  catalogue: "#boutique-catalogue",
  about: "#boutique-about",
  visit: "#boutique-visit",
};
const panelScrollNudgeRemByViewport = {
  mobile: 0.4,
  desktop: 0.4,
};

// The island does not render the boutique UI itself. Instead it hydrates the
// static Astro markup by flipping data attributes, hidden states, and focus.
function isSarahsBoutiqueCategory(
  value: string,
): value is SarahsBoutiqueCategory {
  return sarahsBoutiqueCategories.some((category) => category === value);
}

function setClassState(
  element: Element,
  active: boolean,
  activeClasses: string[],
  inactiveClasses: string[],
): void {
  activeClasses.forEach((className) =>
    element.classList.toggle(className, active),
  );
  inactiveClasses.forEach((className) =>
    element.classList.toggle(className, !active),
  );
}

export default function SarahsBoutiqueIsland({ rootId }: Props) {
  const [currentView, setCurrentView] = useState<SarahsBoutiqueView>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [activeCategory, setActiveCategory] =
    useState<SarahsBoutiqueCategory>("All");
  const [visitRequestSubmitted, setVisitRequestSubmitted] = useState(false);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) {
      return;
    }

    // Mirror the current island state back into the pre-rendered DOM so the
    // JS and no-JS versions stay structurally identical.
    root.setAttribute("data-boutique-enhanced", "true");

    const panels = root.querySelectorAll<HTMLElement>("[data-boutique-panel]");
    panels.forEach((panel) => {
      const panelView = panel.dataset.boutiquePanel as
        SarahsBoutiqueView | undefined;
      const isProductDetail = panelView === "product-detail";
      const isSelectedProduct =
        !isProductDetail ||
        panel.dataset.boutiqueProductId === selectedProductId;
      if (panelView === currentView && isSelectedProduct) {
        panel.setAttribute("data-boutique-active", "true");
      } else {
        panel.removeAttribute("data-boutique-active");
      }
    });

    const visitSuccessMessage = root.querySelector<HTMLElement>(
      visitConfirmationSelector,
    );
    if (visitSuccessMessage) {
      if (currentView === "visit" && visitRequestSubmitted) {
        visitSuccessMessage.setAttribute("data-boutique-active", "true");
      } else {
        visitSuccessMessage.removeAttribute("data-boutique-active");
      }
    }

    const collectionLinks = root.querySelector<HTMLElement>(
      collectionsLinksSelector,
    );
    if (collectionLinks) {
      if (currentView === "catalogue" && activeCategory === "Collections") {
        collectionLinks.setAttribute("data-boutique-active", "true");
      } else {
        collectionLinks.removeAttribute("data-boutique-active");
      }
    }

    const navButtons = root.querySelectorAll<HTMLElement>(
      "[data-boutique-nav]",
    );
    navButtons.forEach((button) => {
      const isActive =
        button.dataset.boutiqueNav === currentView ||
        (button.dataset.boutiqueNav === "catalogue" &&
          currentView === "product-detail");
      setClassState(button, isActive, navActiveClasses, []);
      if (button instanceof HTMLAnchorElement) {
        if (isActive) {
          button.setAttribute("aria-current", "page");
        } else {
          button.removeAttribute("aria-current");
        }
      } else {
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      }
    });

    const filterButtons = root.querySelectorAll<HTMLElement>(
      "[data-boutique-filter]",
    );
    filterButtons.forEach((button) => {
      const isActive =
        currentView === "catalogue" &&
        button.dataset.boutiqueFilter === activeCategory;
      setClassState(
        button,
        isActive,
        filterActiveClasses,
        filterInactiveClasses,
      );
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    const catalogueCards = root.querySelectorAll<HTMLElement>(
      "[data-boutique-catalogue-card]",
    );
    catalogueCards.forEach((card) => {
      const category = card.dataset.boutiqueCategory;
      card.hidden = activeCategory !== "All" && category !== activeCategory;
    });
  }, [activeCategory, currentView, rootId, selectedProductId, visitRequestSubmitted]);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) {
      return;
    }

    const activePanels = root.querySelectorAll<HTMLElement>(
      '[data-boutique-panel][data-boutique-active="true"]',
    );
    if (!activePanels.length) {
      return;
    }

    window.requestAnimationFrame(() => {
      activePanels.forEach((panel) => {
        initScrollReveal(panel);
        initMediaSkeletons(panel);
      });
    });
  }, [activeCategory, currentView, rootId, selectedProductId]);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) {
      return;
    }

    const scheduleScroll = (selector: string, offsetRem = 0) => {
      // Wait until the new panel state has painted before measuring offsets.
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const target = root.querySelector<HTMLElement>(selector);
          if (!target) {
            return;
          }

          if (offsetRem !== 0) {
            const rootFontSize =
              Number.parseFloat(
                window.getComputedStyle(document.documentElement).fontSize,
              ) || 16;
            const scrollMarginTop =
              Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) ||
              0;
            const targetTop =
              window.scrollY +
              target.getBoundingClientRect().top -
              scrollMarginTop +
              offsetRem * rootFontSize;
            window.scrollTo({
              top: Math.max(0, targetTop),
              behavior: "smooth",
            });
            return;
          }

          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    };

    const handleClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(
              "[data-boutique-nav], [data-boutique-go-view], [data-boutique-filter], [data-boutique-select-product], [data-boutique-open-modal]",
            )
          : null;
      if (!target) {
        return;
      }

      if (target.hasAttribute("data-boutique-open-modal")) {
        event.preventDefault();
        setVisitRequestSubmitted(false);
        setSelectedProductId(null);
        setCurrentView("visit");
        scheduleScroll(viewTargetSelectors.visit);
        window.requestAnimationFrame(() => {
          root
            .querySelector<HTMLElement>(visitFormInputSelector)
            ?.focus({ preventScroll: true });
        });
        return;
      }

      const nextView =
        target.dataset.boutiqueGoView ?? target.dataset.boutiqueNav;
      if (nextView) {
        event.preventDefault();
        setCurrentView(nextView as SarahsBoutiqueView);
        setVisitRequestSubmitted(false);
        if (nextView !== "product-detail") {
          setSelectedProductId(null);
        }
        if (nextView !== "product-detail") {
          const panelScrollNudgeRem =
            window.matchMedia("(min-width: 48rem)").matches
              ? panelScrollNudgeRemByViewport.desktop
              : panelScrollNudgeRemByViewport.mobile;
          scheduleScroll(
            viewTargetSelectors[nextView as Exclude<SarahsBoutiqueView, "product-detail">],
            panelScrollNudgeRem,
          );
        }
        return;
      }

      const nextCategory = target.dataset.boutiqueFilter;
      if (nextCategory && isSarahsBoutiqueCategory(nextCategory)) {
        event.preventDefault();
        setCurrentView("catalogue");
        setActiveCategory(nextCategory);
        scheduleScroll(`#${getSarahsBoutiqueCategoryAnchorId(nextCategory)}`);
        return;
      }

      const productId = target.dataset.boutiqueSelectProduct;
      if (productId) {
        event.preventDefault();
        setVisitRequestSubmitted(false);
        setSelectedProductId(productId);
        setCurrentView("product-detail");
        scheduleScroll(`#${getSarahsBoutiqueProductDetailId(productId)}`);
      }
    };

    const handleSubmit = (event: SubmitEvent) => {
      const form =
        event.target instanceof HTMLFormElement ? event.target : null;
      if (!form || !form.hasAttribute("data-boutique-open-modal-form")) {
        return;
      }

      event.preventDefault();
      setCurrentView("visit");
      setVisitRequestSubmitted(true);
      form.reset();
      window.requestAnimationFrame(() => {
        root
          .querySelector<HTMLElement>(visitConfirmationSelector)
          ?.focus({ preventScroll: true });
      });
    };

    root.addEventListener("click", handleClick);
    root.addEventListener("submit", handleSubmit);

    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("submit", handleSubmit);
    };
  }, [rootId]);

  const announcement = useMemo(() => {
    if (currentView === "product-detail" && selectedProductId) {
      return `Showing product detail ${selectedProductId}.`;
    }

    if (currentView === "visit" && visitRequestSubmitted) {
      return "Showing visit view. Appointment request saved for review.";
    }

    if (currentView === "catalogue") {
      return `Showing catalogue. Filter ${activeCategory}.`;
    }

    return `Showing ${currentView} view.`;
  }, [activeCategory, currentView, selectedProductId, visitRequestSubmitted]);

  return (
    <div class="sr-only" aria-live="polite">
      {announcement}
    </div>
  );
}
