import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { Router } from '@angular/router';
declare const $: any;

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.css']
})
export class SeatsComponent implements OnInit {

  constructor(private service:ServicService,private router:Router) {
    if(this.service.location_seat_id==undefined){
      this.router.navigate(['admin_home/admin_location'])
    }
   }

  ngOnInit(): void {

  //   var stage = new Konva.Stage({
  //     container: 'container',
  //     width: 900,
  //     height: 500
  //   });

  //   var layer = new Konva.Layer();
  //   stage.add(layer);

  //   // Size of the grid
  //   var rows = 10;
  //   var cols = 10;
  //   var cellWidth = stage.width() / cols;
  //   var cellHeight = stage.height() / rows;

  //   // Create the grid with rectangles in each cell
  //   for (var row = 0; row < rows; row++) {
  //     for (var col = 0; col < cols; col++) {
  //       var rect = new Konva.Rect({
  //         x: col * cellWidth,
  //         y: row * cellHeight,
  //         width: cellWidth,
  //         height: cellHeight,
  //         fill: '#E9FFFD',
  //         stroke: '#FFD7BF',
  //         strokeWidth: 1.5,          
  //       });
  //       layer.add(rect);
  //     }
  //   }

  //   layer.draw();
  }


flag_on_off:any;
grid:any[]=[["seat","seat","seat"],["seat","seat","seat"],["seat","seat","seat"],["seat","seat","seat"]]

seat="seat";
none="none";
// booked="booked";

set(i:any, j:any){

  if(this.grid[i][j]=="seat none")
  {
    this.grid[i][j]="seat"

  }
  else if(this.grid[i][j]=="seat"){
    this.grid[i][j]="seat none"

  }

}
close(){
  $('#new_grid').modal('hide');
}


add_new_grid(rows:any,columns:any){

  this.grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push("seat");
    }
    this.grid.push(row);
  }

  this.close();

  



}
}
