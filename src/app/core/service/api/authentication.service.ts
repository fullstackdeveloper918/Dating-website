import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { apiRoutes } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _apiService : ApiService) { }

  register(signUpForm:any){
    console.log('sinupform',signUpForm)
   return this._apiService.post(apiRoutes.register,signUpForm)
  }

  login(loginForm:any){
    return this._apiService.post(apiRoutes.login, loginForm)
  }
}
  