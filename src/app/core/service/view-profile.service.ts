import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { apiRoutes } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ViewProfileService {

  constructor(private _apiService:ApiService) { }

  // GET SINGLE USER INFO
  getSingleUserInfo(id:any){
   return this._apiService.post(apiRoutes.getSingleUserInfo, id);
  }
}
