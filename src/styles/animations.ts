import { trigger, transition, style, animate } from '@angular/animations';

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
