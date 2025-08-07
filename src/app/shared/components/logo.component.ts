import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <!--
      Logo image wrapped in a routerLink to navigate to the homepage.
      Responsive sizing based on the 'sizeXxl' input property.
    -->
    <a routerLink="/" aria-label="Navigate to homepage">
      <img
        src="./assets/logo.svg"
        alt="Beanly logo"
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
  /**
   * Determines whether to use extra-large size for the logo.
   * Defaults to false (standard size).
   */
  @Input() sizeXxl = false;
}
