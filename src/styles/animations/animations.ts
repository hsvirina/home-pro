import { animate, style, transition, trigger } from '@angular/animations';

/**
 * Animation for sliding down an element with fade-in/out effect.
 * Used for dropdowns, accordions, etc.
 */
export const slideDownAnimation = trigger('slideDownAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scaleY(0)', transformOrigin: 'top' }),
    animate(
      '300ms ease-out',
      style({ opacity: 1, transform: 'scaleY(1)', transformOrigin: 'top' })
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms ease-in',
      style({ opacity: 0, transform: 'scaleY(0)', transformOrigin: 'top' })
    ),
  ]),
]);

/**
 * Fade in/out animation for backdrop overlays.
 * Smoothly fades the backdrop in and out on enter/leave.
 */
export const fadeInBackdrop = trigger('fadeInBackdrop', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0 })),
  ]),
]);

/**
 * Slide up animation for modals/dialogs with fade effect.
 * Slides modal up from bottom and fades in/out on enter/leave.
 */
export const slideUpModal = trigger('slideUpModal', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate(
      '300ms ease-out',
      style({ transform: 'translateY(0)', opacity: 1 })
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms ease-in',
      style({ transform: 'translateY(100%)', opacity: 0 })
    ),
  ]),
]);

/**
 * Fade in/out animation for images with subtle scale effect.
 * Creates a smooth fade and slight zoom on enter and leave.
 */
export const fadeInOutImage = trigger('fadeInOutImage', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(1.02)' }),
    animate('600ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition(':leave', [
    animate('600ms ease-out', style({ opacity: 0, transform: 'scale(0.98)' })),
  ]),
]);
