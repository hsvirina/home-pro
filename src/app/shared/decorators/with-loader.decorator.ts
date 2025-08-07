import { LoaderService } from "../../core/services/loader.service";

/**
 * Class decorator that automatically shows a loading indicator
 * during the execution of the component's ngOnInit lifecycle hook.
 *
 * It expects the decorated component to have a `loaderService` property
 * of type LoaderService with `show()` and `hide()` methods.
 *
 * Works with synchronous ngOnInit, or if ngOnInit returns a Promise or Observable,
 * it waits for the completion before hiding the loader.
 */
export function WithLoader(): ClassDecorator {
  return function (target: any) {
    // Preserve the original ngOnInit method
    const originalNgOnInit = target.prototype.ngOnInit;

    // Override ngOnInit with loading logic
    target.prototype.ngOnInit = function (...args: any[]) {
      const loaderService: LoaderService = this.loaderService;

      // Warn if loaderService is missing or malformed
      if (!loaderService || typeof loaderService.show !== 'function' || typeof loaderService.hide !== 'function') {
        console.warn('WithLoader: loaderService not found or invalid in component.');
        return originalNgOnInit?.apply(this, args);
      }

      // Show loader before ngOnInit logic
      loaderService.show();

      // Execute original ngOnInit
      const result = originalNgOnInit?.apply(this, args);

      // Handle async cases where ngOnInit returns a Promise with finally()
      if (result?.finally instanceof Function) {
        result.finally(() => loaderService.hide());

      // Handle async cases where ngOnInit returns an Observable with subscribe()
      } else if (result?.subscribe instanceof Function) {
        result.subscribe({
          complete: () => loaderService.hide(),
          error: () => loaderService.hide(),
        });

      // Synchronous case: hide loader immediately after ngOnInit finishes
      } else {
        loaderService.hide();
      }

      return result;
    };
  };
}
