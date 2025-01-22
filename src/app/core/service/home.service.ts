import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { apiRoutes } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private _apiService : ApiService) { }

  getTodo(){
   return this._apiService.getAll(apiRoutes.todo)
  }
}
