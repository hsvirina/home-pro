import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { IconComponent } from './icon.component';
import { ICONS } from '../../core/constants/icons.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <nav aria-label="breadcrumb">
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

          <!-- Arrow between breadcrumb items -->
          <app-icon
            *ngIf="!last"
            [icon]="ICONS.ArrowBack"
            class="mx-3 inline-block rotate-180"
          />
        </li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbsComponent implements OnChanges {
  @Input() lastLabel: string | null = null;
  ICONS = ICONS;

  breadcrumbs: { label: string; url: string }[] = [];

  constructor(private router: Router, private translate: TranslateService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildBreadcrumbs();
      });

    this.translate.onLangChange.subscribe(() => {
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

    // Only generate breadcrumbs if we are inside the /catalog route
    if (segments.length === 0 || segments[0] !== 'catalog') {
      this.breadcrumbs = [];
      return;
    }

    const crumbs = [
      { label: this.translate.instant('breadcrumb.home'), url: '/' },
      { label: this.translate.instant('breadcrumb.catalog'), url: '/catalog' },
    ];

    // If there's a numeric ID segment, treat it as a detail page
    if (segments.length === 2 && /^\d+$/.test(segments[1])) {
      crumbs.push({
        label: this.lastLabel || this.translate.instant('breadcrumb.details'),
        url: `/catalog/${segments[1]}`,
      });
    }

    this.breadcrumbs = crumbs;
  }
}
