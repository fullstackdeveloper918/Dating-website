import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from '../../../core/service/api.service';
import { HomeService } from 'src/app/core/service/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private homeService : HomeService){}

  ngOnInit(){
    this.homeService.getTodo().subscribe(response => {
      console.log(response);
    });
  }
}
