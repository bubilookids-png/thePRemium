import { animate, stagger } from 'animejs';
import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/** Shared timing and easing for purposeful interface motion. */
export const motion = {
  duration: {
    short: 160,
    medium: 320,
    long: 480
  },
  easing: {
    standard: 'outQuart',
    enter: 'outCubic'
  },
  stagger: 45,
  entrance: {
    distance: 10
  }
} as const;

/** Animate a scoped group once for a meaningful state change or mount. */
export function useMotionEntrance<T extends HTMLElement>(
  ref: RefObject<T>,
  trigger: string | number | boolean,
  selector?: string
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = selector ? Array.from(root.querySelectorAll<HTMLElement>(selector)) : [root];
    if (!targets.length) return;

    const animation = animate(targets, {
      opacity: [0.78, 1],
      translateY: [motion.entrance.distance, 0],
      duration: motion.duration.medium,
      delay: targets.length > 1 ? stagger(motion.stagger) : 0,
      ease: motion.easing.enter
    });

    return () => {
      animation.revert();
    };
  }, [ref, trigger, selector]);
}

/** Reveal a small set of meaningful sections as they enter the viewport once. */
export function useScrollReveal<T extends HTMLElement>(ref: RefObject<T>, selector: string) {
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!targets.length || !('IntersectionObserver' in window)) return;

    const activeAnimations = new Set<ReturnType<typeof animate>>();
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (!visible.length) return;

      visible.forEach((entry) => {
        observer.unobserve(entry.target);
      });

      const animation = animate(visible.map((entry) => entry.target as HTMLElement), {
        opacity: [0.78, 1],
        translateY: [motion.entrance.distance, 0],
        duration: motion.duration.medium,
        delay: visible.length > 1 ? stagger(motion.stagger) : 0,
        ease: motion.easing.enter
      });
      activeAnimations.add(animation);
      void animation.then(() => activeAnimations.delete(animation));
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      activeAnimations.forEach((animation) => animation.revert());
      activeAnimations.clear();
    };
  }, [ref, selector]);
}

/** Fade a modal out before asking React to remove it, and disable interaction while it closes. */
export function useAnimatedDismiss<TOverlay extends HTMLElement, TPanel extends HTMLElement>(
  overlayRef: RefObject<TOverlay>,
  panelRef: RefObject<TPanel>,
  onDismiss: () => void
) {
  const animationsRef = useRef<ReturnType<typeof animate>[]>([]);
  const closingRef = useRef(false);

  useEffect(() => () => {
    animationsRef.current.forEach((animation) => animation.revert());
    animationsRef.current = [];
  }, []);

  return useCallback((afterDismiss?: () => void) => {
    if (closingRef.current) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const finish = afterDismiss ?? onDismiss;

    if (!overlay || !panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    closingRef.current = true;
    overlay.style.pointerEvents = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    panel.setAttribute('inert', '');

    const overlayAnimation = animate(overlay, {
      opacity: [1, 0],
      duration: motion.duration.short,
      ease: motion.easing.standard
    });
    const panelAnimation = animate(panel, {
      opacity: [1, 0],
      translateY: [0, motion.entrance.distance / 2],
      scale: [1, 0.99],
      duration: motion.duration.short,
      ease: motion.easing.standard,
      onComplete: () => finish()
    });
    animationsRef.current = [overlayAnimation, panelAnimation];
  }, [overlayRef, panelRef, onDismiss]);
}
