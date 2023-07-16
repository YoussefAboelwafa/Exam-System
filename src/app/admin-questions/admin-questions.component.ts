import { Component, OnInit } from '@angular/core';
import { calendar } from '../objects/calender';
import { book_user } from '../objects/book_user';
import { ServicService } from '../services/servic.service';
import { address } from '../objects/loction_address';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalPopServiceService } from '../services/modal-pop-service.service';
import { exams } from '../objects/exams';
import { Topics } from '../objects/Topics';
import { error } from 'jquery';
import { Q_MCQ } from '../objects/mcq';
import { Q_Coding } from '../objects/coding';
declare const $: any;

@Component({
  selector: 'app-admin-questions',
  templateUrl: './admin-questions.component.html',
  styleUrls: ['./admin-questions.component.css']
})
export class AdminQuestionsComponent implements OnInit {

  flag_student = false;
  flag_topic = false;
  flag_question = true;

 
  nontoken_exam:any=[{
    title:"c++",
    about:"",
    info:"",
    _id:"",
  },
  {
    title:"python",
    about:"",
    info:"",
    _id:"",
  },
  {
    title:"java",
    about:"",
    info:"",
    _id:"",
  }];


  exam_topics:any[]=[
    {
    title:"printif",
    num_of_mcq:0,
    num_of_coding:0,
    mcq:[],
    coding:[],
    _id:"2"
   },{
    title:"scanif",
    num_of_mcq:0,
    num_of_coding:0,
    mcq:[],
    coding:[],
    _id:"1"
  },{
    title:"while loop",
    num_of_mcq:0,
    num_of_coding:0,
    mcq:[],
    coding:[],
    _id:"3"
  },
];

  rv_topic=new Topics();
  selected_exam:any={
    title:"python",
    about:"",
    info:"",
    _id:"",
  };
  selected_topic:any={
    title:"scanif",
    num_of_mcq:0,
    num_of_coding:0,
    mcq:[
      {

      }
    ],
    coding:[{

    }],
    _id:"1"
  };
  index_remove_topic:any;
  index_selected_topic:any=1;
  add_topic_title:string="";
  edit_MCQ:number=0
  new_mcq:Q_MCQ=new Q_MCQ();
  new_coding:Q_Coding=new Q_Coding();
  number_of_choise_mcq:string[]=[];
  number_of_choice_size:any=0

  constructor(private service: ServicService,private popup:ModalPopServiceService) {
    // this.nontoken_exam=this.service.non_token;
  } 
 
  ngOnInit(): void {}



  
  get_all_place() {
  }
  
  remove_topic(value:any,index:number) {
    this.rv_topic=value;
    this.index_remove_topic=index;
  }

  totaly_remove() {
    let x = this.exam_topics[this.index_remove_topic];
    this.exam_topics.splice(this.index_remove_topic, 1);
    this.close_popup();
    this.rv_topic = new Topics();
    this.index_remove_topic = '';
    console.log(x._id);
    // this.service.remove_topic(x._id).subscribe((x) => {
    //   if(x.success==false) {
    //     this.popup.open_error_delete_calender(); 
    //     return;      
    //   }   
    // });
  }
  close() {
    this.close_popup();
  }
  close_popup() {
    $('#confirmation').modal('hide');
    $('#add_topics').modal('hide');
    $('#add_MCQ').modal('hide');
    $('#add_coding').modal('hide');
    $('#edit_MCQ').modal('hide');
    $('#edit_coding').modal('hide');
    $('#edit_number_of_MCQ').modal('hide');
    $('#edit_number_of_coding').modal('hide');
  }

  add_topic(value: string) {
    this.add_topic_title=value;
    let x =new Topics;
    x.title=value;
    this.exam_topics.push(x)
    // this.service.add_topic(x).subscribe(
    //   y => {

    //   this.exam_topics[this.exam_topics.length - 1]._id = y;

    //   error: (error: HttpErrorResponse) => alert(error.message);
    //     })
    this.close_popup();
  }


  open_topics(value:any,index:any){
    this.selected_topic=value;
    this.index_selected_topic=index;
    this.flag_question = true;
    this.flag_topic=false;
  }

  goto_all_student() {

  }
  close_topics() {
    this.flag_topic = true;
    this.flag_question = false;
     // this.service.get_topics(this.selected_exam._id).subscribe(
    //   x=>{
    //       this.exam_topics=x;

    //     error: (error: HttpErrorResponse) => alert(error.message);
    //   }
    // )
  }

  onexams_select(event:any){
    const select_exam = (event.target as HTMLSelectElement).value;
    if(select_exam=='exams'){this.exam_topics=[]; return}
    console.log(select_exam);
    for(let i=0; i<this.nontoken_exam.length;i++){
      if(this.nontoken_exam[i].title==select_exam){
        this.selected_exam=this.nontoken_exam[i];
      }
    }

    // this.service.get_topics(this.selected_exam._id).subscribe(
    //   x=>{
    //       this.exam_topics=x;

    //     error: (error: HttpErrorResponse) => alert(error.message);
    //   }
    // )

  }

  edit_number_of_MCQ(value: any){

    this.selected_topic.num_of_mcq=value;
    this.close_popup();

    // this.service.edit_number_of_MCQ(this.selected_topic._id,value).subscribe(
    //   x=>{


    //            error: (error: HttpErrorResponse) => alert(error.message);

    // })
  }
  edit_number_of_coding(value: any){

    this.selected_topic.num_of_coding=value;
    this.close_popup(); 
    // this.service.edit_number_of_coding(this.selected_topic._id,value).subscribe(
    //   x=>{


    //   error: (error: HttpErrorResponse) => alert(error.message);

    // }
    // )
  }
  set_number_choices(value: string){
    this.number_of_choice_size=value;
    this.number_of_choise_mcq= new Array(parseInt(value)).fill("");
    console.log(this.number_of_choise_mcq)
    }
   set_chioce(value:any,index:number){
    this.number_of_choise_mcq[index]=value;
    console.log(index)
   }
   add_mcq(){
    this.new_mcq.choices=this.number_of_choise_mcq;
    this.exam_topics[this.index_selected_topic].mcq.push(this.new_mcq)
    this.number_of_choice_size=0
    this.number_of_choise_mcq=[];
    this.close_popup()
    // this.service.add_mcq_to_topic(this.selected_topic._id,this.selected_exam._id,this.new_mcq).subscribe(x=>{
    // this.exam_topics[this.index_selected_topic].mcq[this.exam_topics[this.index_selected_topic].mcq.length-1]=x;
    //   error: (error: HttpErrorResponse) => alert(error.message)
    // })
    this.new_mcq=new Q_MCQ;
   }

   add_coding(){
    this.exam_topics[this.index_selected_topic].coding.push(this.new_coding);
     this.close_popup()
    // this.service.add_coding_to_topic(this.selected_topic._id,this.selected_exam._id,this.new_coding).subscribe(x=>{
    //   this.exam_topics[this.index_selected_topic].coding[this.exam_topics[this.index_selected_topic].coding.length-1]=x;

    //   error: (error: HttpErrorResponse) => alert(error.message)
    // })
    this.new_coding=new Q_Coding;
    console.log(this.exam_topics[this.index_selected_topic].coding)
   }



 
}
