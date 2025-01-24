import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { apiRoutes } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ReferralCodeService {

  constructor(private apiService :ApiService) { }

  // GET REFERRAL CODE 
  getReferralCodes(){
   return this.apiService.getAll(apiRoutes.getReferralCode)
  }

  // ADD REFERRAL CODE
  addReferralCode(code:any){
    return this.apiService.post(apiRoutes.addReferralCode,code)
  }
}
