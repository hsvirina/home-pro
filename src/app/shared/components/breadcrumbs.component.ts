import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { IconComponent } from './icon.component';
import { ICONS } from '../../core/constants/icons.constant';

interface BreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <nav aria-label="breadcrumb" class="">
      <ol class="flex flex-wrap items-center text-[var(--color-gray-75)]">
        <li
          *ngFor="let crumb of breadcrumbs; let last = last"
          class="button-font flex items-center"
        >
          <a *ngIf="!last" [routerLink]="crumb.url">
            {{ crumb.label }}
          </a>

          <span *ngIf="last" class="cursor-pointer text-[var(--color-primary)]">
            {{ crumb.label }}
          </span>

          <!-- Стрелка между элементами -->
          <app-icon
            *ngIf="!last"
            [icon]="ICONS.ArrowBack"
            class="mx-3 inline-block"
          />
        </li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbsComponent implements OnChanges {
  @Input() lastLabel: string | null = null;
  ICONS = ICONS;

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
