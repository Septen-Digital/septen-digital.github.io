import { useEffect, useMemo, useState } from 'preact/hooks';
import { openDemoModalLazy } from '../../../utils/lazyDemoModal';
import type { SarahsBoutiqueView } from '../../../data/sarahsBoutique';
import { initScrollReveal } from '../../../utils/scrollReveal';
import { initMediaSkeletons } from '../../../utils/media';

type Props = {
  rootId: string;
  businessName: string;
};

const navActiveClasses = ['text-[#E29578]', 'font-bold'];
const filterActiveClasses = ['bg-[#1E1E1C]', 'border-[#1E1E1C]', 'text-white'];
const filterInactiveClasses = ['bg-white', 'border-stone-200', 'text-stone-500', 'hover:border-stone-400', 'hover:text-[#1E1E1C]'];

function setClassState(element: Element, active: boolean, activeClasses: string[], inactiveClasses: string[]): void {
  activeClasses.forEach((className) => element.classList.toggle(className, active));
  inactiveClasses.forEach((className) => element.classList.toggle(className, !active));
}

export default function SarahsBoutiqueIsland({ rootId, businessName }: Props) {
  const [currentView, setCurrentView] = useState<SarahsBoutiqueView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) {
      return;
    }

    const panels = root.querySelectorAll<HTMLElement>('[data-boutique-panel]');
    panels.forEach((panel) => {
      const panelView = panel.dataset.boutiquePanel as SarahsBoutiqueView | undefined;
      const isProductDetail = panelView === 'product-detail';
      const isSelectedProduct = !isProductDetail || panel.dataset.boutiqueProductId === selectedProductId;
      panel.hidden = !(panelView === currentView && isSelectedProduct);
    });

    const navButtons = root.querySelectorAll<HTMLElement>('[data-boutique-nav]');
    navButtons.forEach((button) => {
      const isActive = button.dataset.boutiqueNav === currentView || (button.dataset.boutiqueNav === 'catalogue' && currentView === 'product-detail');
      setClassState(button, isActive, navActiveClasses, []);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const filterButtons = root.querySelectorAll<HTMLElement>('[data-boutique-filter]');
    filterButtons.forEach((button) => {
      const isActive = button.dataset.boutiqueFilter === activeCategory;
      setClassState(button, isActive, filterActiveClasses, filterInactiveClasses);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const catalogueCards = root.querySelectorAll<HTMLElement>('[data-boutique-catalogue-card]');
    catalogueCards.forEach((card) => {
      const category = card.dataset.boutiqueCategory;
      card.hidden = activeCategory !== 'All' && category !== activeCategory;
    });
  }, [activeCategory, currentView, rootId, selectedProductId]);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) {
      return;
    }

    const activePanels = root.querySelectorAll<HTMLElement>('[data-boutique-panel]:not([hidden])');
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

    const handleClick = async (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-boutique-nav], [data-boutique-go-view], [data-boutique-filter], [data-boutique-select-product], [data-boutique-open-modal]') : null;
      if (!target) {
        return;
      }

      if (target.hasAttribute('data-boutique-open-modal')) {
        event.preventDefault();
        await openDemoModalLazy(businessName);
        return;
      }

      const nextView = target.dataset.boutiqueGoView ?? target.dataset.boutiqueNav;
      if (nextView) {
        event.preventDefault();
        setCurrentView(nextView as SarahsBoutiqueView);
        if (nextView !== 'product-detail') {
          setSelectedProductId(null);
        }
        return;
      }

      const nextCategory = target.dataset.boutiqueFilter;
      if (nextCategory) {
        event.preventDefault();
        setActiveCategory(nextCategory);
        return;
      }

      const productId = target.dataset.boutiqueSelectProduct;
      if (productId) {
        event.preventDefault();
        setSelectedProductId(productId);
        setCurrentView('product-detail');
      }
    };

    const handleSubmit = async (event: SubmitEvent) => {
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (!form || !form.hasAttribute('data-boutique-open-modal-form')) {
        return;
      }

      event.preventDefault();
      await openDemoModalLazy(businessName);
    };

    root.addEventListener('click', handleClick);
    root.addEventListener('submit', handleSubmit);

    return () => {
      root.removeEventListener('click', handleClick);
      root.removeEventListener('submit', handleSubmit);
    };
  }, [businessName, rootId]);

  const announcement = useMemo(() => {
    if (currentView === 'product-detail' && selectedProductId) {
      return `Showing product detail ${selectedProductId}.`;
    }

    if (currentView === 'catalogue') {
      return `Showing catalogue. Filter ${activeCategory}.`;
    }

    return `Showing ${currentView} view.`;
  }, [activeCategory, currentView, selectedProductId]);

  return <div class="sr-only" aria-live="polite">{announcement}</div>;
}
