import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalPopServiceService {
  constructor() {}
  error_message: any = '';
  title: any = '';

  name_course: any = '';
  discription: any = '';

  public open_error_login() {
    this.error_message =
      "Sorry, we couldn't log you in. The email or password you entered was not found in our system. Please make sure you have entered the correct email and password and try again.";
    this.title = 'Login Error Message !';
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
      errorMessageElement.textContent = this.error_message;
    }
    const title_message = document.getElementById('error-title');
    if (title_message) {
      title_message.textContent = this.title;
    }
    const modal = document.getElementById('ERROR_login');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  public open_error_signup() {
    this.error_message =
      'This phone number or email address is already registered in our system. Please use a different phone number or email address to sign up, or try logging in if you already have an account.';
    this.title = 'Sign up Error Message !';
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
      errorMessageElement.textContent = this.error_message;
    }
    const title_message = document.getElementById('error-title');
    if (title_message) {
      title_message.textContent = this.title;
    }
    const modal = document.getElementById('ERROR_login');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  public open_error_verify_wrong() {
    this.error_message =
      'The verification code you entered is incorrect.Please double-check the code and try again with a valid code.';
    this.title = 'Verify Error Message !';
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
      errorMessageElement.textContent = this.error_message;
    }
    const title_message = document.getElementById('error-title');
    if (title_message) {
      title_message.textContent = this.title;
    }
    const modal = document.getElementById('ERROR_login');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  public open_error_book(error:any) {
    this.error_message =error;
    this.title = 'Message !';
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
      errorMessageElement.textContent = this.error_message;
    }
    const title_message = document.getElementById('error-title');
    if (title_message) {
      title_message.textContent = this.title;
    }
    const modal = document.getElementById('ERROR_login');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }


  public open_error_payment() {
    this.error_message =
      'Payment failed, but no money has been taken from you. Please try again.';
    this.title = 'Book Error Message !';
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
      errorMessageElement.textContent = this.error_message;
    }
    const title_message = document.getElementById('error-title');
    if (title_message) {
      title_message.textContent = this.title;
    }
    const modal = document.getElementById('ERROR_login');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  public open_error_delete_calender() {
    this.error_message =
      'you cant delete this day';
    this.title = 'Book Error Message !';
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
      errorMessageElement.textContent = this.error_message;
    }
    const title_message = document.getElementById('error-title');
    if (title_message) {
      title_message.textContent = this.title;
    }
    const modal = document.getElementById('ERROR_login');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  
  // public open_error_delete_exam() {
  //   this.error_message =
  //     'You can\'t delete an exam if a student has already booked it.';
  //   this.title = 'Book Error Message !';
  //   const errorMessageElement = document.getElementById('error-message');
  //   if (errorMessageElement) {
  //     errorMessageElement.textContent = this.error_message;
  //   }
  //   const title_message = document.getElementById('error-title');
  //   if (title_message) {
  //     title_message.textContent = this.title;
  //   }
  //   const modal = document.getElementById('ERROR_login');
  //   if (modal) {
  //     modal.classList.add('show');
  //     modal.style.display = 'block';
  //   }
  // }


  public close_error() {
    const modal = document.getElementById('ERROR_login');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
}
