import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  digits:any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  submit(){}
   moveToNext(currentInput:any, nextInputId:any) {
    const maxLength = parseInt(currentInput.getAttribute('maxlength'));
    const currentLength = currentInput.value.length;
  
    if (currentLength === maxLength) {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      } else {
        currentInput.blur();
      }
    }
  }
}
