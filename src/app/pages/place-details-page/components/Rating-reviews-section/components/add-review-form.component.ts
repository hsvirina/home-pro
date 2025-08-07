import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { Theme } from '../../../../../core/models/theme.type';
import { ICONS } from '../../../../../core/constants/icons.constant';
import { IconComponent } from '../../../../../shared/components/icon.component';

@Component({
  selector: 'app-add-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div
      *ngIf="currentUser && (alwaysShowFormOnDesktop || showAddReviewForm)"
      class="flex flex-col gap-4 rounded-[40px] border p-4"
      [ngClass]="{
        'border-[var(--color-gray-20)]': (currentTheme$ | async) === 'light',
        'border-[var(--color-gray-75)]': (currentTheme$ | async) === 'dark'
      }"
    >
      <h5>Submit your review</h5>

      <!-- Rating Stars -->
      <div class="flex flex-col gap-2">
        <span class="body-font-2">Add your rating</span>
        <div class="flex">
          <ng-container *ngFor="let star of [1, 2, 3, 4, 5]">
            <app-icon
              [icon]="star <= (hoveredRating || newReviewRating) ? ICONS.Star : ICONS.StarEmpty"
              (mouseenter)="hoveredRating = star"
              (mouseleave)="hoveredRating = 0"
              (click)="onStarClick(star)"
              class="cursor-pointer transition duration-200"
            />
          </ng-container>
        </div>
      </div>

      <!-- User Info & Review Text -->
      <div class="body-font-2 flex flex-col gap-2">
        <div class="flex gap-5">
          <!-- Name input -->
          <div class="flex flex-1 flex-col gap-1">
            <span class="text-[var(--color-gray-55)]">Name*</span>
            <input
              class="body-font-1 flex-1 rounded-[40px] border px-6 py-3 focus:border-[var(--color-gray-20)] focus:outline-none"
              [(ngModel)]="userName"
              [ngClass]="{
                'border-[var(--color-gray-20)] bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
                'border-[var(--color-gray-100)] bg-transparent': (currentTheme$ | async) === 'dark'
              }"
            />
          </div>

          <!-- Email input (disabled) -->
          <div class="flex flex-1 flex-col gap-1">
            <span class="text-[var(--color-gray-55)]">Email*</span>
            <input
              class="body-font-1 flex-1 cursor-not-allowed rounded-[40px] border px-6 py-3 text-[var(--color-gray-55)]"
              [(ngModel)]="userEmail"
              [disabled]="true"
              [ngClass]="{
                'border-[var(--color-gray-20)] bg-[var(--color-gray-10)]': (currentTheme$ | async) === 'light',
                'border-[var(--color-gray-100)] bg-[var(--color-bg-card)] text-[var(--color-gray-75)]': (currentTheme$ | async) === 'dark'
              }"
            />
          </div>
        </div>

        <!-- Review textarea -->
        <div class="flex flex-1 flex-col gap-1">
          <span class="text-[var(--color-gray-55)]">Write your review*</span>
          <textarea
            [(ngModel)]="newReviewText"
            placeholder="Write what you think about this cafe..."
            rows="1"
            class="body-font-1 w-full flex-grow resize-none overflow-hidden rounded-[40px] border px-8 py-3 focus:outline-none"
            (input)="onTextInput($event)"
            [ngClass]="{
              'border-[var(--color-gray-20)] bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
              'border-[var(--color-gray-100)] bg-transparent': (currentTheme$ | async) === 'dark'
            }"
          ></textarea>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        (click)="onAddReview()"
        [disabled]="!canSubmitReview"
        class="button-font h-[48px] w-[215px] flex-shrink-0 rounded-[40px] px-8 py-3"
        [ngClass]="[
          canSubmitReview ? 'button-bg-blue cursor-pointer' : 'text-[var(--color-gray-55)]',
          (currentTheme$ | async) === 'light' && !canSubmitReview ? 'bg-[var(--color-gray-20)]' : '',
          (currentTheme$ | async) === 'dark' && !canSubmitReview ? 'bg-[var(--color-gray-100)]' : ''
        ]"
      >
        Leave a Review
      </button>
    </div>
  `,
})
export class AppAddReviewFormComponent {
  // Inputs
  @Input() currentTheme$!: Observable<Theme>;
  @Input() userName = '';
  @Input() userEmail = '';
  @Input() newReviewText = '';
  @Input() newReviewRating = 0;
  @Input() canSubmitReview = false;
  @Input() currentUser?: any;
  @Input() alwaysShowFormOnDesktop = false;
  @Input() showAddReviewForm = false;

  // Outputs
  @Output() reviewTextChange = new EventEmitter<string>();
  @Output() reviewRatingChange = new EventEmitter<number>();
  @Output() addReview = new EventEmitter<void>();

  // Local state
  hoveredRating = 0;
  readonly ICONS = ICONS;

  /**
   * Emits review submit event to parent
   */
  onAddReview(): void {
    this.addReview.emit();
  }

  /**
   * Handles star click to set rating
   * @param rating number - selected rating value
   */
  onStarClick(rating: number): void {
    this.newReviewRating = rating;
    this.reviewRatingChange.emit(rating);
  }

  /**
   * Emits text change and auto-resizes textarea
   */
  onTextInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.newReviewText = value;
    this.reviewTextChange.emit(value);
    this.autoGrow(event);
  }

  /**
   * Dynamically grows the height of the textarea
   */
  private autoGrow(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
