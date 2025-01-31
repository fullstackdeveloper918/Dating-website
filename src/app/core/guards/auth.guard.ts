import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../service/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.storageService.getItem('user'); // Retrieve the token from localStorage
    // Token exists and is valid (if you want more validation, like expiration, you can add that logic here)
    if (token) {
      // Allow access to the route
      return true;
    }

    // If no token, redirect to the login page
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }, // Store the original URL for redirection after login
    });

    return false; // Prevent navigation to the protected route
  }
}
