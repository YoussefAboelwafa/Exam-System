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
    this.service.get_countries_prices().subscribe((x) => {
      console.log(x);
      if (x.success == true) {
        this.curr_prices = x.prices;
      } else {
        this.popup.open_error_book(x.error);
      }
    });

  }

  curr_prices: Prices[] = [];

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
    x.country_name = this.selected_country;
    x.currency = this.selected_currency;
    x.total_amount = add_total_amount;
    x.month_discount = add_month_dicount;
    x.year_discount = add_year_dicount;
    for (var i = 0; i <this.curr_prices.length;i++){
      if (this.curr_prices[i].country_name==this.selected_country){
          x._id=this.curr_prices[i]._id
          this.curr_prices[i].currency = this.selected_currency;
          this.curr_prices[i].total_amount = add_total_amount;
          this.curr_prices[i].month_discount = add_month_dicount;
          this.curr_prices[i].year_discount = add_year_dicount;
      }
    }
  
    this.close_popup();
    // serviec add new address and recieve id and set it

    console.log(x)
    this.service.edit_price(x).subscribe(y=>{
      if(y.success==true){

      }
      else{
          this.popup.open_error_book(y.message)
      }
    })
  }

  remove(rv_price: any, index: any) {
    this.remove_price = rv_price;
    this.index_remove_price = index;
  }
  totaly_remove() {
    //service remove
    this.curr_prices[this.index_remove_price].total_amount=0;
    this.curr_prices[this.index_remove_price].month_discount=0;
    this.curr_prices[this.index_remove_price].year_discount=0;
    this.service.edit_price(this.curr_prices[this.index_remove_price]).subscribe(
      x=>{

    })

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
