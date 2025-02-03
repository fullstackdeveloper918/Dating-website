import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { apiRoutes } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
  private apiService: ApiService
  ) { }

  // GET USER INFORMATION
  getUserInfo(){
   return this.apiService.getAll(apiRoutes.getUser)
  }

  // UPDATE USER PROFILE
  updateUserInfo(formData:any){
   return this.apiService.post(apiRoutes.updateUserProfile, formData)
  }
}
