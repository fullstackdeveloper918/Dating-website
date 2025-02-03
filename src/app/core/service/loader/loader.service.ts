import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  show() {
    Promise.resolve().then(() => this.loading.next(true)); // Ensures the update happens in the next microtask
  }

  hide() {
    Promise.resolve().then(() => this.loading.next(false)); // Ensures the update happens in the next microtask
  }
}
