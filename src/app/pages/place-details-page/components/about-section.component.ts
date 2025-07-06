import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>

    </div>
  `,
})
export class AboutSectionComponent {
  @Input() place!: Place;
}
