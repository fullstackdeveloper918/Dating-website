import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { apiUrl } from '../../../environment';  // Adjust the path for your environment config

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl : string = apiUrl;

  constructor(private http: HttpClient) {}

  // GET method - Include params only if provided
  getAll<T>(endpoint: string, params?: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    const options: any = { observe: 'response', params }; // Correctly pass params
  
    return this.http.get<T>(url, options).pipe(
      map((response:any) => response.body),  // Extract data
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error); // Handle errors properly
      })
    );
  }
  

  // POST method - Include body only if provided
  post<T>(endpoint: string, body?: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options: any = {
      headers: { 'Content-Type': 'application/json' }, // Add headers here
      observe: 'response',
    };
    if (body) {
      return this.http.post<T>(url, body);
    }

    return this.http.post<T>(url, {});  // Empty body for POST
  }

  // PUT method - Include body only if provided
  put<T>(endpoint: string, body?: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options: any = { observe: 'response' };  // Ensure full HttpResponse is returned

    if (body) {
      return this.http.put<T>(url, body, options);
    }

    return this.http.put<T>(url, {}, options);  // Empty body for PUT
  }

  // DELETE method - Delete usually doesn't require a body but can take params if needed
  delete<T>(endpoint: string, params?: HttpParams): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options: any = { observe: 'response' };  // Ensure full HttpResponse is returned

    if (params) {
      options.params = params;
    }

    return this.http.delete<T>(url, options);
  }

  // PATCH method - Include body only if provided
  patch<T>(endpoint: string, body?: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options: any = { observe: 'response' };  // Ensure full HttpResponse is returned

    if (body) {
      return this.http.patch<T>(url, body, options);
    }

    return this.http.patch<T>(url, {}, options);  // Empty body for PATCH
  }
}
