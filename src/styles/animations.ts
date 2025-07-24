import { animate, style, transition, trigger } from '@angular/animations';

export const slideDownAnimation = trigger('slideDownAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scaleY(0)', transformOrigin: 'top' }),
    animate(
      '300ms ease-out',
      style({ opacity: 1, transform: 'scaleY(1)', transformOrigin: 'top' }),
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms ease-in',
      style({ opacity: 0, transform: 'scaleY(0)', transformOrigin: 'top' }),
    ),
  ]),
]);

export const fadeInBackdrop = trigger('fadeInBackdrop', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
]);

export const slideUpModal = trigger('slideUpModal', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate(
      '300ms ease-out',
      style({ transform: 'translateY(0)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms ease-in',
      style({ transform: 'translateY(100%)', opacity: 0 }),
    ),
  ]),
]);
