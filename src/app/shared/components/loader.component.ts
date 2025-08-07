import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <!--
      Fullscreen overlay with semi-transparent white background
      Centered spinner loader inside
    -->
    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-80"
      aria-label="Loading"
      role="status"
    >
      <div class="loader"></div>
    </div>
  `,
  styles: [
    `
      /* Spinner loader styles */
      .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #ccc; /* Light gray border */
        border-top-color: #007aff; /* Blue highlight for spinner animation */
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      /* Spin animation rotates the loader infinitely */
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderComponent {}
