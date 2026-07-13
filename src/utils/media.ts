const SKELETON_SELECTOR = 'img[data-skeleton]';
const MEDIA_PENDING_CLASS = 'is-media-pending';
const MEDIA_PRIORITY_CLASS = 'is-media-priority';

function isPriorityImage(image: HTMLImageElement): boolean {
  return image.loading === 'eager' || image.getAttribute('fetchpriority') === 'high';
}

function imageHasRenderableSource(image: HTMLImageElement): boolean {
  return image.complete && image.naturalWidth > 0;
}

function markImageLoaded(image: HTMLImageElement): void {
  if (image.classList.contains('is-loaded')) {
    return;
  }

  image.classList.remove(MEDIA_PENDING_CLASS, MEDIA_PRIORITY_CLASS);
  image.classList.add('is-loaded');
  image.removeAttribute('data-skeleton');
}

export function initMediaSkeletons(root: ParentNode = document): void {
  const images = root.querySelectorAll<HTMLImageElement>(SKELETON_SELECTOR);
  if (!images.length) return;

  images.forEach((image) => {
    image.style.setProperty('--image-target-opacity', window.getComputedStyle(image).opacity || '1');

    if (isPriorityImage(image)) {
      image.classList.add(MEDIA_PRIORITY_CLASS);
    } else {
      image.classList.add(MEDIA_PENDING_CLASS);
    }

    if (imageHasRenderableSource(image)) {
      window.requestAnimationFrame(() => {
        markImageLoaded(image);
      });
      return;
    }

    const handleReady = (): void => {
      if (!imageHasRenderableSource(image)) {
        return;
      }

      markImageLoaded(image);
      image.removeEventListener('load', handleReady);
      image.removeEventListener('error', handleReady);
    };

    void image.decode?.().then(handleReady).catch(() => {
      // The load/error listeners below cover browsers that reject decode on in-flight images.
    });

    image.addEventListener('load', handleReady, { once: true });
    image.addEventListener('error', handleReady, { once: true });
  });
}
