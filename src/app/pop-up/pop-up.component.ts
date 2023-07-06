import { Component, OnInit } from '@angular/core';
import { ModalPopServiceService } from '../services/modal-pop-service.service';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css'],
})
export class PopUpComponent implements OnInit {
  constructor(private pop_service: ModalPopServiceService) {}

  ngOnInit(): void {}

  close_ER() {
    this.pop_service.close_error();
  }
}
