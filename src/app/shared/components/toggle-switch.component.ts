import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [NgClass, NgStyle],
  template: `
    <div
      class="relative flex h-[36px] w-[75px] cursor-pointer items-center rounded-full p-[3px] transition-colors duration-300"
      [ngClass]="{
        'border border-[var(--color-gray-55)]': !checked,
        'bg-[var(--color-primary)]': checked,
      }"
      (click)="toggle()"
    >
      <div
        class="h-[30px] w-[30px] rounded-full shadow transition-transform duration-300"
        [ngStyle]="{
          transform: checked ? 'translateX(38px)' : 'translateX(0)',
          backgroundColor: checked
            ? 'var(--color-white)'
            : 'var(--color-gray-55)',
        }"
      ></div>
    </div>
  `,
})
export class ToggleSwitchComponent {
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  toggle() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
