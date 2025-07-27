import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-80"
    >
      <div class="loader"></div>
    </div>
  `,
  styles: [
    `
      .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #ccc;
        border-top-color: #007aff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderComponent {}
