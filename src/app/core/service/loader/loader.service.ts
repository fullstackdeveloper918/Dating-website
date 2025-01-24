import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false); // Initial state is false
  public loading$ = this.loadingSubject.asObservable();

  constructor() {}

  show() {
    this.loadingSubject.next(true); // Show loader
  }

  hide() {
    this.loadingSubject.next(false); // Hide loader
  }
}
