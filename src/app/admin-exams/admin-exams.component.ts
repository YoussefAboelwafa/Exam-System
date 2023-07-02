import { Component, OnInit } from '@angular/core';
import { exams } from '../objects/exams';
import { Token } from '@angular/compiler';
declare const $: any;

@Component({
  selector: 'app-admin-exams',
  templateUrl: './admin-exams.component.html',
  styleUrls: ['./admin-exams.component.css']
})
export class AdminExamsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  remove_ex:any=new exams;
  index_remove:any;
  edit_ex:any=new exams;
  edit_index:any;
  learn_dataof_nontoken:any={
    title:"python programming",
      about:" python is a powerful and flexible language that is well-suited for a wide range of programming tasks. However, it can be more difficult to learn and use than some other languages due to its complexity and the need to manage memory manually in some cases.",
      info:["STL","OOP with python"],
      _id:"",
    }
    information:any[]=[];//numberof info used in ngfor
    title_add:any;
    about_add:any;
  non_token_exam:any[]=[
    {
    title:"python programming",
      about:" python is a powerful and flexible language that is well-suited for a wide range of programming tasks. However, it can be more difficult to learn and use than some other languages due to its complexity and the need to manage memory manually in some cases.",
      info:["STL","OOP with python"],
      _id:"",
    },
    {
      title:"java programming",
      about:" java is a powerful and flexible language that is well-suited for a wide range of programming tasks. However, it can be more difficult to learn and use than some other languages due to its complexity and the need to manage memory manually in some cases.",
      info:["basic","colections"],
      _id:"",
    },
    {
      title:"c programming",
      about:" C is a powerful and flexible language that is well-suited for a wide range of programming tasks. However, it can be more difficult to learn and use than some other languages due to its complexity and the need to manage memory manually in some cases.",
      info:["basic","advanced"],
      _id:"",
    },
    {
      title:"control",
      about:" C is a powerful and flexible language that is well-suited for a wide range of programming tasks. However, it can be more difficult to learn and use than some other languages due to its complexity and the need to manage memory manually in some cases.",
      info:["basic","advanced"],
      _id:"",
    },
    {
      title:"hci ",
      about:" C is a powerful and flexible language that is well-suited for a wide range of programming tasks. However, it can be more difficult to learn and use than some other languages due to its complexity and the need to manage memory manually in some cases.",
      info:["basic","advanced"],
      _id:"",
    }
  ];

  close_popup(){
    $('#confirmation').modal('hide');
    $('#edit').modal('hide');
    $('#not_token_exam').modal('hide');
    $('#add_exam').modal('hide');

  }
  learn_non_token(value_send_by_btn_learn:any){
    this.learn_dataof_nontoken=value_send_by_btn_learn;
  }
 

  remove_exam(value:any,index:any) {
    this.remove_ex=value;
    this.index_remove=index; 
  }

  totaly_remove(index:any){
   //service_remove exam pass object 
   this.non_token_exam.splice(index, 1);
   this.close_popup();
   this.remove_ex=new exams;
    this.index_remove="";
  }
  close() {
    this.close_popup();

    this.remove_ex=new exams;
    this.index_remove="";
    this.edit_ex=new exams
  }

  Edit_exam(value:any,index:any){
    this.edit_ex=value;
    if(index==-1){
      for(var i=0;i<this.non_token_exam.length;i++){
        if(this.non_token_exam[i]==value){
          this.edit_index=i;
        }
    }
  }
    else{
    this.edit_index=index;
    }
    this.close_popup();
  }
 confirm_edit(ed_title:any,ed_about:any){
    // console.log(ed_title);
    // console.log("about:"+ed_about);
    this.non_token_exam[this.edit_index].title=ed_title;
    this.non_token_exam[this.edit_index].about=ed_about;
    this.close_popup();

    //service to edit this exam
 }

 add_exam(){
  let x=new exams;
  x.title=this.title_add;
  x.about=this.about_add;
  x.info=this.information;
  this.non_token_exam.push(x);
  this.close_popup();

  //service add exam to system
 }

 set_number(value:any){
  this.information=[]
  for(var i=0;i<value;i++){
    this.information.push("");
  }
}

set_info(value:any,index:number){
  this.information[index]=value;
}

}
