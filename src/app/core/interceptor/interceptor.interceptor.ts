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
    const token = localStorage.getItem('token'); // Replace with your token retrieval logic

    let headers = request.headers
      .set('Authorization', `Bearer ${token || 'your-token-here'}`)
      .set('Custom-Header', 'CustomHeaderValue');

    const clonedRequest = request.clone({ headers });
    return next.handle(clonedRequest);
  }
}
