import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

/**
 * Directive to detect clicks outside of the host element.
 *
 * Emits an event when a click happens anywhere outside
 * the element this directive is applied to.
 *
 * Usage:
 * <div (appClickOutside)="onOutsideClick()"></div>
 */
@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  /** Event emitted when a click outside the host element is detected */
  @Output() appClickOutside = new EventEmitter<Event>();

  constructor(private elementRef: ElementRef) {}

  /**
   * Listens to global document clicks and emits event
   * if the click target is outside the host element.
   *
   * @param event Mouse event triggered on document click
   */
  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Check if the clicked target is outside the host element
    if (!this.elementRef.nativeElement.contains(target)) {
      this.appClickOutside.emit(event);
    }
  }
}
