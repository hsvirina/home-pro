import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

interface BreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<nav aria-label="breadcrumb" class="">
  <ol class="flex flex-wrap items-center text-[var(--color-gray-75)]">
    <li
      *ngFor="let crumb of breadcrumbs; let last = last"
      class="flex items-center button-font"
    >
      <a
        *ngIf="!last"
        [routerLink]="crumb.url"
      >
        {{ crumb.label }}
      </a>

      <span
        *ngIf="last"
        class="text-[var(--color-primary)] cursor-pointer"
      >
        {{ crumb.label }}
      </span>

      <!-- Стрелка между элементами -->
      <img
        *ngIf="!last"
        src="/icons/arrow-back.svg"
        alt="Arrow back"
        class="mx-3 inline-block h-6 w-6"
      />
    </li>
  </ol>
</nav>

  `,
})
export class BreadcrumbsComponent implements OnChanges {
  @Input() lastLabel: string | null = null;

  breadcrumbs: BreadCrumb[] = [];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildBreadcrumbs();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('lastLabel' in changes) {
      this.buildBreadcrumbs();
    }
  }

  private buildBreadcrumbs(): void {
    const url = this.router.url.split('?')[0];
    const segments = url.split('/').filter(Boolean);

    if (segments.length === 0 || segments[0] !== 'catalog') {
      this.breadcrumbs = [];
      return;
    }

    const crumbs: BreadCrumb[] = [
      { label: 'Home', url: '/' },
      { label: 'Catalog', url: '/catalog' },
    ];

    if (segments.length === 2 && /^\d+$/.test(segments[1])) {
      crumbs.push({
        label: this.lastLabel || 'Details',
        url: `/catalog/${segments[1]}`,
      });
    }

    this.breadcrumbs = crumbs;
  }
}
