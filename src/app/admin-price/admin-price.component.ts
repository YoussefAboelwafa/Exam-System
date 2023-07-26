import { Component, OnInit } from '@angular/core';
import { address } from '../objects/loction_address';

@Component({
  selector: 'app-admin-price',
  templateUrl: './admin-price.component.html',
  styleUrls: ['./admin-price.component.css']
})
export class AdminPriceComponent implements OnInit {

  constructor() { }
  address: address[] = [
    {
      country: 'United',
      city: 'San',
      location: 'San',
      snacks:"www",
      capacity:'asd',
      _id:'da'

  }
];
  remove_ad:any
  index_remved_address:any
  ngOnInit(): void {
  }
  remove_address(value: any, index: any) {
    this.remove_ad = value;
    this.index_remved_address = index;
  }
}
