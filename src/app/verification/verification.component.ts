import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalPopServiceService } from '../services/modal-pop-service.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
})
export class VerificationComponent implements OnInit {
  digits: any[] = [];
  user: any;
  flag_verify_btn = true;
  constructor(
    private service: ServicService,
    private router: Router,
    private route: ActivatedRoute,
    private pop_service: ModalPopServiceService
  ) {}

  ngOnInit(): void {}

  submit() {
    let code =
      this.digits[0] +
      '' +
      this.digits[1] +
      '' +
      this.digits[2] +
      '' +
      this.digits[3] +
      '' +
      this.digits[4] +
      '' +
      this.digits[5];

    //service with verify

    this.flag_verify_btn = false;
    this.service.verify_code(code).subscribe((x) => {
      if (x.success == false) {
        this.pop_service.open_error_verify_wrong();
        this.flag_verify_btn = true;
      }
      //code correct but email is token now
      else if (x.success == true && x.created == false) {
        this.router.navigate([`/signup`]);
      } else {
        this.router.navigate(['']);
      }

      error: (error: HttpErrorResponse) => alert(error.message);
    });
  }

  send() {
    //service to make backend to send code again
    this.service.send_again().subscribe((x) => {
      error: (error: HttpErrorResponse) => alert(error.message);
    });
  }

  moveToNext(currentInput: any, nextInputId: any) {
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
