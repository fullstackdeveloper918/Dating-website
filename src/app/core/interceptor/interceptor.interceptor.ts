import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const headers = request.headers.set('Authorization', 'Bearer your-token-here')
    .set('Custom-Header', 'CustomHeaderValue');
    console.log('request',request)
    console.log('hello')

// Clone the request and set the new headers
      const clonedRequest = request.clone({ headers });

      // Pass the cloned request to the next handler
      return next.handle(clonedRequest);
  }
}
