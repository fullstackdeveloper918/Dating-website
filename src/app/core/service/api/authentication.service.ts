import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { apiRoutes } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _apiService : ApiService) { }

  register(signUpForm:any){
   return this._apiService.post(apiRoutes.register,signUpForm)
  }

  login(loginForm:any){
    return this._apiService.post(apiRoutes.login, loginForm)
  }

  resetPassword(resetForm:any){
    return this._apiService.post(apiRoutes.forgotPassword, resetForm)
  }

  // VERIFY EMAIL
  verifyEmail(code:any){
    return this._apiService.post(apiRoutes.verifyEmail,code)
  }

  // CONFIRMPASSWORD
  confirmPassword(data:any){
    return this._apiService.post(apiRoutes.confirmPassword, data)
  }

  // RESEND CODE 
  resendCode(email:any){
    return this._apiService.post(apiRoutes.resendCode, email)
  }

  // CHECK REFERRAL CODE
  checkReferralCode(referralCode:any){
  return this._apiService.post(apiRoutes.checkReferral,referralCode)
  } 
} 
  