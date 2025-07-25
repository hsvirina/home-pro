import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      (click)="onBackdropClick($event)"
    >
      <div
        class="modal-content rounded-[40px] bg-white p-6 shadow-xl"
        [ngStyle]="{ width: width }"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      backdrop-filter: blur(4px);
    }

    .modal-content {
      max-height: 90vh;
      overflow-y: auto;
    }
  `],
})
export class ModalComponent {
  /** Controls modal visibility */
  @Input() isOpen = false;

  /** Optional modal width (default: 600px) */
  @Input() width = '600px';

  /** Emits when modal should be closed */
  @Output() close = new EventEmitter<void>();

  /**
   * Closes modal if user clicks outside the modal content
   */
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
