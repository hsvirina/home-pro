import { LoaderService } from "../../core/services/loader.service";


export function WithLoader(): ClassDecorator {
  return function (target: any) {
    const originalNgOnInit = target.prototype.ngOnInit;

    target.prototype.ngOnInit = function (...args: any[]) {
      const loaderService: LoaderService = this.loaderService;

      if (!loaderService || typeof loaderService.show !== 'function') {
        console.warn('WithLoader: loaderService not found in component.');
        return originalNgOnInit?.apply(this, args);
      }

      loaderService.show();

      const result = originalNgOnInit?.apply(this, args);

      // Если ngOnInit возвращает Promise или Observable — ждём завершения
      if (result?.finally instanceof Function) {
        result.finally(() => loaderService.hide());
      } else if (result?.subscribe instanceof Function) {
        result.subscribe({
          complete: () => loaderService.hide(),
          error: () => loaderService.hide()
        });
      } else {
        // Просто синхронная функция
        loaderService.hide();
      }

      return result;
    };
  };
}
