import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token'); // Replace 'token' with the key used in your app
    
    if (token) {
      // Token exists, allow access to the route
      return true;
    }

    // Token doesn't exist, redirect to login page
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }, // Optional: Pass the original URL for redirect after login
    });
    return false;
  }
}
