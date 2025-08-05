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
    <div
      *ngIf="isOpen"
      class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-5 backdrop-blur"
      (click)="onBackdropClick($event)"
      [ngClass]="{
        'bg-[#FFFFFF]/60': (currentTheme$ | async) === 'light',
        'bg-[#8C8C8E]/50': (currentTheme$ | async) === 'dark',
      }"
    >
      <div
        class="modal-content rounded-[40px] p-6"
        [ngStyle]="{ width: width }"
        [ngClass]="{
          'bg-[var(--color-bg-2)]': (currentTheme$ | async) === 'light',
          'bg-[var(--color-bg-card)]': (currentTheme$ | async) === 'dark',
        }"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-content {
        max-height: 90vh;
        overflow-y: auto;
      }
    `,
  ],
})
export class ModalComponent {
  /** Controls modal visibility */
  @Input() isOpen = false;

  /** Optional modal width (default: 600px) */
  @Input() width = '600px';

  /** Emits when modal should be closed */
  @Output() close = new EventEmitter<void>();

  currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Closes modal if user clicks outside the modal content
   */
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
