import { Component, OnChanges } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  public addressList: any;
  public dist: number = 0;
  public duration: number = 0;
  
  public setAddress(data: any): void {
    this.addressList = data;
  }

  public updateRouteData(data: { totalDist: number, totalDuration: number }): void {
    this.dist = data.totalDist;
    this.duration = data.totalDuration;
  }
}
