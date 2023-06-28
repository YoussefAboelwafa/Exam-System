import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  
  openModal() {
    const modal = document.getElementById('ERROR');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  
  closeModal() {
    const modal = document.getElementById('ERROR');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
    
  }

}
