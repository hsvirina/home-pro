import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <!-- Navigates to homepage on logo click -->
    <a routerLink="/">
      <img
        src="./assets/logo.svg"
        alt="beanly logo"
        [ngClass]="
          sizeXxl
            ? 'h-[32px] w-[165px] object-contain'
            : 'h-[24px] w-[93px] object-contain lg:h-[28px] lg:w-[130px] xxl:h-[32px] xxl:w-[165px]'
        "
      />
    </a>
  `,
})
export class LogoComponent {
  @Input() sizeXxl = false;
}
