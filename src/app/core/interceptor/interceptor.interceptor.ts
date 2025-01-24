import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '../service/loader/loader.service';
import { StorageService } from '../service/storage/storage.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
  constructor(
  private loaderService: LoaderService,
  private storageService : StorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Show loader when a request is made
    this.loaderService.show();

    // Retrieve token from localStorage
    const user:any = this.storageService.getItem('user');
    let token;
    if(user){
     token = user.token;
    }
    let headers = request.headers;

    if (token) {
      // If token exists, set Authorization header
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      // Optionally handle the case where there is no token (you can log or handle this error)
      console.warn('No token found in localStorage');
    }

    // Clone the request with the updated headers
    const clonedRequest = request.clone({ headers });

    // Return the HTTP request and handle loader visibility
    return next.handle(clonedRequest).pipe(
      finalize(() => {
        this.loaderService.hide(); // Hide loader when request completes
      }),
      catchError((error: HttpErrorResponse) => {
        this.loaderService.hide(); // Hide loader in case of error
        throw error; // Rethrow error to be handled elsewhere
      })
    );
  }
}
