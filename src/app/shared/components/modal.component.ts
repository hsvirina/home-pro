import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme } from '../../core/models/theme.type';
import { Observable } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Modal backdrop with dynamic background and visibility controlled by isOpen -->
    <div
      *ngIf="isOpen"
      class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-5 backdrop-blur"
      (click)="onBackdropClick($event)"
      [ngClass]="{
        'bg-[#FFFFFF]/60': (currentTheme$ | async) === 'light',
        'bg-[#8C8C8E]/50': (currentTheme$ | async) === 'dark'
      }"
    >
      <!-- Modal content container with dynamic width and theme-based background -->
      <div
        class="modal-content rounded-[40px] p-6"
        [ngStyle]="{ width: width }"
        [ngClass]="{
          'bg-[var(--color-bg-2)]': (currentTheme$ | async) === 'light',
          'bg-[var(--color-bg-card)]': (currentTheme$ | async) === 'dark'
        }"
      >
        <!-- Projected modal inner content -->
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      /* Modal content styling to limit height and enable scrolling */
      .modal-content {
        max-height: 90vh;
        overflow-y: auto;
      }
    `,
  ],
})
export class ModalComponent {
  /** Controls whether the modal is visible */
  @Input() isOpen = false;

  /** Width of the modal content container; default to 600px */
  @Input() width = '600px';

  /** Emits when modal backdrop is clicked (outside content), signaling to close */
  @Output() close = new EventEmitter<void>();

  /** Observable for current theme to apply theme-based styles dynamically */
  currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Handles click on backdrop; emits close event only if click is outside modal content
   * @param event Mouse click event
   */
  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
