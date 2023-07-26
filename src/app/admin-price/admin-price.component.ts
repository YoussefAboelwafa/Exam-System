import { Component, OnInit } from '@angular/core';
import { address } from '../objects/loction_address';
import { ModalPopServiceService } from '../services/modal-pop-service.service';
import { ServicService } from '../services/servic.service';
import { Prices } from '../objects/prices';
declare const $: any;


@Component({
  selector: 'app-admin-price',
  templateUrl: './admin-price.component.html',
  styleUrls: ['./admin-price.component.css'],
})
export class AdminPriceComponent implements OnInit {
  constructor(
    private popup: ModalPopServiceService,
    private service: ServicService
  ) {
    // this.service.get_prices().subscribe((x) => {
    //   if (x.success == true) {
    //     this.curr_prices = x.prices;
    //   } else {
    //     this.popup.open_error_book(x.error);
    //   }
    // });

    // this.service.get_countries().subscribe((x) => {
    //   if (x.success == true) {
    //     this.countries = x.countries;
    //   }
    // });

  }

  curr_prices: Prices[] = [
    {
      country: 'any',
      month_discount: 'any',
      year_dicount: 'any',
      total_amount: 'any',
      currency: 'any',
      _id: 'any',
    },
    {
      country: 'any',
      month_discount: 'any',
      year_dicount: 'any',
      total_amount: 'any',
      currency: 'any',
      _id: 'any',
    },
  ];

  currencies: any[] = [
    'USD', // United States Dollar
    'EUR', // Euro
    'AED', // United Arab Emirates Dirham
    'SAR', // Saudi Riyal
    'EGP', // Egyptian Pound
  ];

  countries: string[] = [
    'United States', // United States;
    'EUR', // Euro
    ' United Arab Emirates Dirham', // United Arab Emirates Dirham
    'Saudi Riyal', // Saudi Riyal
    'Egyptian Pound', // Egyptian Pound
  ];

  selected_country: string = 'Country';
  selected_currency: string = 'Currency';
  remove_price = new Prices();
  index_remove_price: any;
  ngOnInit(): void {}

  add_price(
    add_total_amount: any,
    add_month_dicount: any,
    add_year_dicount: any
  ) {
    if (
      this.selected_country == 'Country' ||
      this.selected_currency == 'Currency' ||
      add_total_amount < 0 ||
      add_total_amount == '' ||
      add_month_dicount < 0 ||
      add_month_dicount > 100 ||
      add_month_dicount == '' ||
      add_year_dicount < 0 ||
      add_year_dicount > 100 ||
      add_year_dicount == ''
    ) {
      this.popup.open_error_book(
        'the date you entered is not valid or incomplete'
      );
      return;
    }

    let x = new Prices();
    x.country = this.selected_country;
    x.currency = this.selected_currency;
    x.total_amount = add_total_amount;
    x.month_discount = add_month_dicount;
    x.year_dicount = add_year_dicount;
    this.curr_prices.push(x);
    this.close_popup();
    console.log(x);
    //serviec add new address and recieve id and set it

    // this.service.add_price(x).subscribe(y=>{
    //   if(y.success==true){
    //     this.curr_prices[this.curr_prices.length-1]._id=y._id;
    //   }
    //   else{

    //   }
    // })
  }

  remove(rv_price: any, index: any) {
    this.remove_price = rv_price;
    this.index_remove_price = index;
  }
  totaly_remove() {
    let rv = this.curr_prices[this.index_remove_price];
    this.curr_prices.splice(this.index_remove_price, 1);
    //service remove
    // this.service.remove_price(rv._id).subscribe(
    //   x=>{

    // })

    this.close_popup();
  }
  close_popup() {
    $('#add_price').modal('hide');
    $('#confirm_rv').modal('hide');
  }
  close() {
    this.close_popup();
  }

  oncurrencyselect(event: any) {
    this.selected_currency = (event.target as HTMLSelectElement).value;
    console.log(this.selected_currency);
  }

  oncountryselect(event: any) {
    this.selected_country = (event.target as HTMLSelectElement).value;
    console.log(this.selected_country);
  }
}
