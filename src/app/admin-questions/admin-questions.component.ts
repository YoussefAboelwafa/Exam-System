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

  flag_topic = true;
  flag_question = false;

 
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


  exam_topics:Topics[]=[
    {
    title:"printif",
    num_of_mcq:0,
    num_of_coding:0,
    mcq:[{
      title:"q1",
      description:"asdedasd",
      choices:"asdas",
      answer:"sdsad",
      _id:"1"
    },
    {
      title:"q2",
      description:"asdedasd",
      choices:"asdas",
      answer:"sdsad",
      _id:"1"
    }],
    coding:[{

    }],
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
  flag_select=false;
  selected_topic:any={
    title:"scanif",
    num_of_mcq:0,
    num_of_coding:0,
    mcq:[
      {
        description:"wwwwwwwwwwwwww www ww ww",
        choices:["asdas","aadw"],
        answer:"aadw",
        _id:"1"
      },
      {
        description:"asdedasd",
        choices:["asdas","DSadsa","DSAdsada"],
        answer:"DSadsa",
        _id:"1"
      }
    ],
    coding:[{
      title:"kimo",
      description:"wda sdsa sdsa fwfa vxcsacsa xcssa",
      input_format:"The first line of the input contains two integers n and h(1≤ n ≤ 1000, 1 ≤ h ≤ 1000) — the number of friends and the height of the fence, respectively.",
      output_format:"Print a single integer — the minimum possible valid width of the road.",
      constraints:"2 <= nums.length <= 104 -109 <= nums[i] <= 109 -109 <= target <= 109",
    },{
      title:"ahmed",
      description:"wda sdsa sdsa fwfa vxcsacsa xcssa",
      input_format:"The first line of the input contains two integers n and h(1≤ n ≤ 1000, 1 ≤ h ≤ 1000) — the number of friends and the height of the fence, respectively.",
      output_format:"Print a single integer — the minimum possible valid width of the road.",
      constraints:"2 <= nums.length <= 104 -109 <= nums[i] <= 109 -109 <= target <= 109",
    }
  ],
    _id:"1"
  };
  index_remove_topic:any;
  index_selected_topic:any=1;
  add_topic_title:string="";
  edit_MCQ:number=0
  new_mcq:Q_MCQ=new Q_MCQ();
  new_coding:Q_Coding=new Q_Coding();
  number_of_choise_mcq:string[]=["",""];
  number_of_choice_size:any=2
  rv_quest:any;
  rv_index_quest:any;
  ed_mcq=new Q_MCQ;
  index_ed_mcq:any;
  ed_coding=new Q_Coding;
  index_ed_coding:any;

  constructor(private service: ServicService,private popup:ModalPopServiceService) {
    this.nontoken_exam=this.service.non_token;
    this.exam_topics=[];
    this.service.exam_bar_init_admin().subscribe((x) => {
        
      if(x.length==0){
        x=[];
      }
      this.service.non_token = x;
      this.nontoken_exam = this.service.non_token;
    });
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
    this.service.remove_topic(x._id,this.selected_exam._id).subscribe((x) => {
      if(x.success==false) {
        this.popup.open_error_delete_calender(); 
        return;      
      }   
    });
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
    $('#confirmation_mcq').modal('hide');
    $('#confirmation_coding').modal('hide');

    
  }

  add_topic(value: string) {
    this.add_topic_title=value;
    let x =new Topics();
    x.title=value;
    this.exam_topics.push(x)
    this.service.add_topic(x.title,this.selected_exam._id).subscribe(
      y => {

        console.log(y);
        if(y.success==false){
          let x="error occurred when add topic try again."
          this.popup.open_error_book(x);
        }
      this.exam_topics[this.exam_topics.length - 1]._id = y._id;
        console.log(this.exam_topics);
      error: (error: HttpErrorResponse) => alert(error.message);
        })
    this.close_popup();
  }


  open_topics(value:any,index:any){
    this.selected_topic=value;
    this.index_selected_topic=index;
    this.flag_question = true;
    this.flag_topic=false;
    this.service.get_topics(this.selected_exam._id).subscribe(
      x=>{
        this.exam_topics=x.topics;
    })
  }

  close_topics() {
    this.flag_topic = true;
    this.flag_question = false;
    this.service.get_topics(this.selected_exam._id).subscribe(
      x=>{
          this.exam_topics=x.topics;

        error: (error: HttpErrorResponse) => alert(error.message);
      }
    )
  }

  onexams_select(event:any){
    const select_exam = (event.target as HTMLSelectElement).value;
    if(select_exam=='exams'){this.exam_topics=[]; this.flag_select=false; return}
    for(let i=0; i<this.nontoken_exam.length;i++){
      if(this.nontoken_exam[i].title==select_exam){
        this.selected_exam=this.nontoken_exam[i];
        this.flag_select=true;
        console.log(this.selected_exam);
      }
    }

    this.service.get_topics(this.selected_exam._id).subscribe(
      x=>{
         console.log(x);
          this.exam_topics=x.topics;

        error: (error: HttpErrorResponse) => alert(error.message);
      }
    )

  }

  edit_number_of_MCQ(value: any){

    this.selected_topic.num_of_mcq=value;
    this.close_popup();

    this.service.edit_number_of_MCQ(this.selected_topic._id,value).subscribe(
      x=>{


      error: (error: HttpErrorResponse) => alert(error.message);

    })
  }
  edit_number_of_coding(value: any){

    this.selected_topic.num_of_coding=value;
    this.close_popup(); 
    this.service.edit_number_of_coding(this.selected_topic._id,value).subscribe(
      x=>{


      error: (error: HttpErrorResponse) => alert(error.message);

    }
    )
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
    this.selected_topic.mcq.push(this.new_mcq)
    this.number_of_choice_size=0
    this.number_of_choise_mcq=[];
    console.log(this.selected_topic);
    this.close_popup()
    this.service.add_mcq_to_topic(this.selected_topic._id,this.selected_exam._id,this.new_mcq).subscribe(x=>{
      console.log(x);
      if(x.success==false){
        console.log("failed")
      }
      else{ 
        this.selected_topic.mcq[this.selected_topic.mcq.length-1]=x._id;
        console.log(this.selected_topic)
      }
      error: (error: HttpErrorResponse) => alert(error.message)
    })
    this.new_mcq=new Q_MCQ;
   }

   add_coding(){
    
    this.selected_topic.coding.push(this.new_coding);
     this.close_popup()
    this.service.add_coding_to_topic(this.selected_topic._id,this.selected_exam._id,this.new_coding).subscribe(x=>{
      console.log(x);
      this.selected_topic.coding[this.selected_topic.coding.length-1]=x._id;

      error: (error: HttpErrorResponse) => alert(error.message)
    })
    this.new_coding=new Q_Coding;
    console.log(this.selected_topic.coding)
   }



   delete_MCQ(value:any,index:any) {
    this.rv_quest=value;
    this.rv_index_quest=index;
   }
   totaly_remove_MCQ() {
    let x = this.selected_topic.mcq[this.rv_index_quest];
    this.selected_topic.mcq.splice(this.rv_index_quest, 1);
    this.close_popup();
    this.service.delete_mcq_in_topic(x._id,this.selected_topic._id).subscribe((x) => {
      if(x.success==false) {
        return;      
      }   
    });
  }

  delete_coding(value:any,index:any) {
    this.rv_quest=value;
    this.rv_index_quest=index;
   }
   totaly_remove_coding() {
    let x = this.selected_topic.coding[this.rv_index_quest];
    this.selected_topic.coding.splice(this.rv_index_quest, 1);
    this.close_popup();
    this.service.delete_coding_in_topic(x._id,this.selected_topic._id).subscribe((x) => {
      if(x.success==false) {
        return;      
      }   
    });
  }



  edit_mcq_request(value:any,index:any){
    this.ed_mcq=value;
    this.index_ed_mcq=index;
  }
  edit_coding_request(value:any,index:any){
    this.ed_coding=value;
    this.index_ed_coding=index;
  }


  final_edit_mcq(ed_mcq_description:any,ed_mcq_answer:any){
  this.ed_mcq.description=ed_mcq_description;
  this.ed_mcq.answer=ed_mcq_answer;
  this.selected_topic.mcq[this.index_ed_mcq]=this.ed_mcq;
  this.close_popup();
  this.service.edit_mcq_in_topic(this.ed_mcq._id,this.ed_mcq).subscribe(
    x=>{
      if(x.success==false){
        this.popup.open_error_book(x.message);
      }

  })
  }


  final_edit_coding(ed_cod_title:any,ed_cod_description:any,ed_cod_input_format:any,ed_cod_output_format:any,ed_cod_constraints:any){
  
    this.selected_topic.coding[this.index_ed_coding].title=ed_cod_title;
    this.selected_topic.coding[this.index_ed_coding].description=ed_cod_description;
    this.selected_topic.coding[this.index_ed_coding].input_format=ed_cod_input_format;
    this.selected_topic.coding[this.index_ed_coding].output_format=ed_cod_output_format;
    this.selected_topic.coding[this.index_ed_coding].constraints=ed_cod_constraints;
    this.ed_coding=this.selected_topic.coding[this.index_ed_coding];
    this.close_popup();
    this.service.edit_coding_in_topic(this.ed_coding._id,this.ed_coding).subscribe(
      x=>{
        if(x.success==false){
          this.popup.open_error_book(x.message);
        }
  
    })
    }
 
}
