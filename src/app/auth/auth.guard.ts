import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { combineLatest } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([
    authService.isAuthInitialized$,
    authService.user$
  ]).pipe(
    filter(([initialized, _]) => initialized),
    take(1),
    map(([_, user]) => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
