import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';
import { CarouselSectionComponent } from './components/carousel-section.component';
import { InfoSectionComponent } from "./components/info-section.component";
import { MainInfoSectionComponent } from "./components/main-info-section.component";
import { AboutSectionComponent } from "./components/about-section.component";

@Component({
  selector: 'app-place-details-page',
  standalone: true,
  imports: [CommonModule, NgIf, InfoSectionComponent, CarouselSectionComponent, MainInfoSectionComponent, AboutSectionComponent],
  template: `
    <div *ngIf="place" class="mx-auto flex max-w-[1320px] flex-col gap-12">
      <app-carousel-section
        *ngIf="place.photoUrls.length"
        [photoUrls]="place.photoUrls"
      ></app-carousel-section>

      <app-main-info-section [place]="place"></app-main-info-section>

      <app-info-section [place]="place"></app-info-section>

      <app-about-section [place]="place"></app-about-section>
    </div>
  `,
})
export class PlaceDetailsPageComponent implements OnInit {
  place: Place | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.placesService.getPlaces().subscribe({
      next: (places: Place[]) => {
        const found = places.find((p) => p.id.toString() === id);
        if (found) {
          this.place = found;
        } else {
          this.router.navigate(['/not-found']);
        }
      },
      error: () => this.router.navigate(['/not-found']),
    });
  }
}
