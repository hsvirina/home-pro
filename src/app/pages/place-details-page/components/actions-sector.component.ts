import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actions-sector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center gap-4 mb-11">
      <h5>Like Larks & Owls?</h5>
      <span class="body-font-1"
        >Help other coffee lovers discover this place by sharing your
        experience!</span
      >
      <div class="flex gap-4">
        <button
          (click)="onToggleFavorite.emit()"
          [ngClass]="{
            'button-bg-blue': isFavorite,
            'button-bg-transparent shadow-hover': !isFavorite,
          }"
          class="button-font flex items-center gap-2 rounded-[40px] px-6 py-3"
        >
          <img src="./icons/heart.svg" alt="Favorite" class="h-5 w-5" />
          {{ isFavorite ? 'Remove from Favorites' : 'Save to Favorites' }}
        </button>

        <button
          (click)="onShare.emit()"
          class="button-font flex gap-2 button-bg-transparent px-6 py-3 shadow-hover"
        >
          <img src="./icons/share.svg" alt="Share" class="h-5 w-5" />
          Share this Place
        </button>
      </div>
    </div>
  `,
})
export class ActionsSectorComponent {
  @Input() isFavorite = false;

  @Output() onToggleFavorite = new EventEmitter<void>();
  @Output() onShare = new EventEmitter<void>();
}
