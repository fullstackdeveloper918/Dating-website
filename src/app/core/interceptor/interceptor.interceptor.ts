import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '../service/loader/loader.service';
import { StorageService } from '../service/storage/storage.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService,
    private storageService: StorageService,
    private router: Router,  // Inject Router to check URL,
    private toastr : ToastrService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const currentUrl = this.router.url;

    // Show loader only if not on /chat route
    const shouldShowLoader = !currentUrl.includes('/chat');

    if (shouldShowLoader) {
      this.loaderService.show();
    }

    // Retrieve token from localStorage
    const user: any = this.storageService.getItem('user');
    const token = user?.token;

    let headers = request.headers;
    if (token) {
      // If token exists, set Authorization header
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No token found in localStorage');
    }

    // Clone the request with the updated headers
    const clonedRequest = request.clone({ headers });

    return next.handle(clonedRequest).pipe(
      finalize(() => {
        if (shouldShowLoader) {
          this.loaderService.hide();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if(!error.ok){
          this.storageService.removeItem('user')
          this.router.navigate(['login'])
          this.toastr.error('Token has expired');
        }
        if (shouldShowLoader) {
          this.loaderService.hide();
        }
        throw error;
      })
    );
  }
}
