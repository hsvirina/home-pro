import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [NgClass, NgStyle],
  template: `
    <div
      class="relative flex h-[20px] w-[38px] cursor-pointer items-center rounded-full p-[2px] transition-colors duration-300 lg:h-[36px] lg:w-[75px] lg:p-[3px]"
      [ngClass]="{
        'border border-[var(--color-gray-55)]': !checked,
        'bg-[var(--color-primary)]': checked
      }"
      (click)="toggle()"
      role="switch"
      [attr.aria-checked]="checked"
      tabindex="0"
      (keydown.enter)="toggle()"
      (keydown.space)="toggle()"
    >
      <div
        class="h-[15px] w-[15px] rounded-full shadow transition-transform duration-300 lg:h-[30px] lg:w-[30px]"
        [ngStyle]="{
          transform: checked
            ? screenWidth >= 1024
              ? 'translateX(38px)'
              : 'translateX(19px)'
            : 'translateX(0)',
          backgroundColor: checked
            ? 'var(--color-white)'
            : 'var(--color-gray-55)'
        }"
      ></div>
    </div>
  `,
})
export class ToggleSwitchComponent implements OnInit, OnDestroy {
  /** Current toggle state */
  @Input() checked = false;

  /** Emits new toggle state on change */
  @Output() checkedChange = new EventEmitter<boolean>();

  /** Current viewport width to adjust toggle knob position */
  screenWidth = window.innerWidth;

  /**
   * Lifecycle hook - on component initialization,
   * subscribes to window resize events to update screenWidth dynamically.
   */
  ngOnInit(): void {
    window.addEventListener('resize', this.onResize);
  }

  /**
   * Lifecycle hook - on component destruction,
   * removes previously added window resize event listener to prevent memory leaks.
   */
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  /**
   * Handler for window resize events,
   * updates `screenWidth` property to recalculate toggle knob position.
   */
  onResize = (): void => {
    this.screenWidth = window.innerWidth;
  };

  /**
   * Toggles the checked state and emits the new value.
   */
  toggle(): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
