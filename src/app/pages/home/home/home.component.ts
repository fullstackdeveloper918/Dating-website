import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/service/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private apiService: ApiService){}

  ngOnInit(){
    this.apiService.getAll('todos').subscribe(response => {
      console.log(response);
    });
  }
}
