import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReferralCodeService } from 'src/app/core/service/referral-code.service';
import { AddReferralCodeComponent } from '../add-referral-code/add-referral-code.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-referral-code',
  templateUrl: './referral-code.component.html',
  styleUrls: ['./referral-code.component.scss']
})
export class ReferralCodeComponent {
  referralCodes: any[] = []; // Store referral codes
  isLoading = false; // To show a loader during API calls

  constructor(
  private referralCodeService: ReferralCodeService,
  private matdialog : MatDialog,
  private toastr : ToastrService) {}

  ngOnInit(): void {
    this.getReferralcodes();
  }

  getReferralcodes(): void {
    this.isLoading = true; // Start loading
    this.referralCodeService.getReferralCodes().subscribe(
      (response: any) => {
        if (response.status === 200) {
          console.log('response',response.data)
          this.referralCodes = response.data; // Adjust based on your API response structure
        } else {
          console.error('Error fetching referral codes:', response.message);
        }
        this.isLoading = false; // Stop loading
      },
      (error) => {
        console.error('Error fetching referral codes:', error);
        this.isLoading = false; // Stop loading
      }
    );
  }

  addRefferralCode(){
   const dialog = this.matdialog.open(AddReferralCodeComponent,{
    width : '500px'
   })
   dialog.afterClosed().subscribe((res:any)=>{
    if(res == 'success'){
      this.getReferralcodes();
    }
   })
  }
}
