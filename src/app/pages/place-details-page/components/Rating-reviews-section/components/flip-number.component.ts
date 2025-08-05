import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flip-number',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flip-wrapper">
      <div class="flip-digit" [class.flip]="shouldAnimate">
        <span class="front">{{ previousValue }}</span>
        <span class="back">{{ value }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .flip-wrapper {
        perspective: 1000px;
        height: 14px;
        width: 14px;
        overflow: hidden;
        align-items: flex-end; /* выравнивание по нижнему краю */
        justify-content: center;
        /* Дополнительно для подстройки */
        padding-bottom: 2px; /* можно варьировать */
      }

      .flip-digit {
        position: relative;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.4s ease-in-out;
      }

      .flip-digit.flip {
        transform: rotateX(-180deg);
      }

      .front,
      .back {
        position: absolute;
        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        backface-visibility: hidden;
      }

      .back {
        transform: rotateX(180deg);
      }
    `,
  ],
})
export class FlipNumberComponent implements OnChanges {
  @Input() value: number = 0;

  previousValue: number = 0;
  shouldAnimate = false;

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['value'] &&
      changes['value'].currentValue !== changes['value'].previousValue
    ) {
      this.previousValue = changes['value'].previousValue ?? 0;
      this.shouldAnimate = true;
      setTimeout(() => {
        this.shouldAnimate = false;
      }, 400);
    }
  }
}
