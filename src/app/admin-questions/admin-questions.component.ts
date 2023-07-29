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
  styleUrls: ['./admin-questions.component.css'],
})
export class AdminQuestionsComponent implements OnInit {
  flag_topic = true;
  flag_question = false;
  flag_type = true;

  nontoken_exam: exams[];

  exam_topics: Topics[];

  rv_topic = new Topics();
  selected_exam: exams = new exams();
  flag_select = false;
  selected_topic: Topics = new Topics();
  index_remove_topic: any;
  index_selected_topic: any = 1;
  add_topic_title: string = '';
  edit_MCQ: number = 0;
  new_mcq: Q_MCQ = new Q_MCQ();
  new_coding: Q_Coding = new Q_Coding();
  number_of_choise_mcq: string[] = ['', ''];
  number_of_choice_size: any = 2;
  rv_quest: any;
  rv_index_quest: any;
  ed_mcq = new Q_MCQ();
  index_ed_mcq: any;
  ed_coding = new Q_Coding();
  index_ed_coding: any;

  constructor(
    private service: ServicService,
    private popup: ModalPopServiceService
  ) {
    this.nontoken_exam = this.service.non_token;
    this.exam_topics = [];
    this.service.exam_bar_init_admin().subscribe((x) => {
      this.flag_type = false;
      if (x.length == 0) {
        x = [];
      }
      this.service.non_token = x;
      this.nontoken_exam = this.service.non_token;
    });
  }

  ngOnInit(): void {}

  reset_add() {
    this.new_mcq = new Q_MCQ();
    this.new_coding = new Q_Coding();
  }
  remove_topic(value: any, index: number) {
    this.rv_topic = value;
    this.index_remove_topic = index;
  }

  totaly_remove() {
    let x = this.exam_topics[this.index_remove_topic];
    this.exam_topics.splice(this.index_remove_topic, 1);
    this.close_popup();
    this.rv_topic = new Topics();
    this.index_remove_topic = '';
    this.service.remove_topic(x._id, this.selected_exam._id).subscribe((x) => {
      if (x.success == false) {
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
    this.add_topic_title = value;
    let x = new Topics();
    x.title = value;
    this.service.add_topic(x.title, this.selected_exam._id).subscribe((y) => {
      if (y.success == false) {
        let x = 'error occurred when add topic try again.';
        this.popup.open_error_book(x);
      } else {
        x._id = y._id;
        this.exam_topics.push(x);
      }
      error: (error: HttpErrorResponse) => alert(error.message);
    });
    this.close_popup();
  }

  open_topics(value: any, index: any) {
    this.selected_topic = value;
    this.index_selected_topic = index;
    this.flag_question = true;
    this.flag_topic = false;
    this.service.get_topics(this.selected_exam._id).subscribe((x) => {
      this.exam_topics = x.topics;
    });
  }

  close_topics() {
    this.flag_topic = true;
    this.flag_question = false;
    this.service.get_topics(this.selected_exam._id).subscribe((x) => {
      this.exam_topics = x.topics;

      error: (error: HttpErrorResponse) => alert(error.message);
    });
  }

  onexams_select(event: any) {
    const select_exam = (event.target as HTMLSelectElement).value;
    if (select_exam == 'exams') {
      this.exam_topics = [];
      this.flag_select = false;
      return;
    }
    for (let i = 0; i < this.nontoken_exam.length; i++) {
      if (this.nontoken_exam[i].title == select_exam) {
        this.selected_exam = this.nontoken_exam[i];
        this.flag_select = true;
      }
    }

    this.service.get_topics(this.selected_exam._id).subscribe((x) => {
      this.exam_topics = x.topics;

      error: (error: HttpErrorResponse) => alert(error.message);
    });
  }

  edit_number_of_MCQ(value: any) {
    this.selected_topic.num_of_mcq = value;
    this.close_popup();

    this.service
      .edit_number_of_MCQ(this.selected_topic._id, value)
      .subscribe((x) => {
        error: (error: HttpErrorResponse) => alert(error.message);
      });
  }
  edit_number_of_coding(value: any) {
    this.selected_topic.num_of_coding = value;
    this.close_popup();
    this.service
      .edit_number_of_coding(this.selected_topic._id, value)
      .subscribe((x) => {
        error: (error: HttpErrorResponse) => alert(error.message);
      });
  }
  set_number_choices(value: string) {
    this.number_of_choice_size = value;
    this.number_of_choise_mcq = new Array(parseInt(value)).fill('');
  }
  set_chioce(value: any, index: number) {
    this.number_of_choise_mcq[index] = value;
  }
  add_mcq() {
    this.new_mcq.choices = this.number_of_choise_mcq;
    this.number_of_choice_size = 2;
    this.number_of_choise_mcq = [];
    this.close_popup();
    this.service
      .add_mcq_to_topic(
        this.selected_topic._id,
        this.selected_exam._id,
        this.new_mcq
      )
      .subscribe((x) => {
        if (x.success == false) {
        } else {
          this.new_mcq._id = x._id;
          let xz = Object.assign({}, this.new_mcq);
          this.selected_topic.mcq.push(xz);
        }
        error: (error: HttpErrorResponse) => alert(error.message);
      });
  }

  add_coding() {
    this.close_popup();
    this.service
      .add_coding_to_topic(
        this.selected_topic._id,
        this.selected_exam._id,
        this.new_coding
      )
      .subscribe((x) => {
        if (x.success == false) {
        } else {
          this.new_coding._id = x._id;
          let a = Object.assign({}, this.new_coding);
          this.selected_topic.coding.push(a);
        }

        error: (error: HttpErrorResponse) => alert(error.message);
      });
  }

  delete_MCQ(value: any, index: any) {
    this.rv_quest = value;
    this.rv_index_quest = index;
  }
  totaly_remove_MCQ() {
    let x = this.selected_topic.mcq[this.rv_index_quest];
    this.selected_topic.mcq.splice(this.rv_index_quest, 1);
    this.close_popup();
    this.service
      .delete_mcq_in_topic(x._id, this.selected_topic._id)
      .subscribe((x) => {
        if (x.success == false) {
          return;
        }
      });
  }

  delete_coding(value: any, index: any) {
    this.rv_quest = value;
    this.rv_index_quest = index;
  }
  totaly_remove_coding() {
    let x = this.selected_topic.coding[this.rv_index_quest];
    this.selected_topic.coding.splice(this.rv_index_quest, 1);
    this.close_popup();
    this.service
      .delete_coding_in_topic(x._id, this.selected_topic._id)
      .subscribe((x) => {
        if (x.success == false) {
          return;
        }
      });
  }

  edit_mcq_request(value: any, index: any) {
    this.ed_mcq = value;
    this.index_ed_mcq = index;
  }
  edit_coding_request(value: any, index: any) {
    this.ed_coding = value;
    this.index_ed_coding = index;
  }

  final_edit_mcq(
    ed_mcq_description: any,
    ed_mcq_answer: any,
    ed_mcq_weight: any
  ) {
    this.ed_mcq.description = ed_mcq_description;
    this.ed_mcq.answer = ed_mcq_answer;
    this.ed_mcq.weight = ed_mcq_weight;
    this.selected_topic.mcq[this.index_ed_mcq] = this.ed_mcq;
    this.close_popup();
    this.service
      .edit_mcq_in_topic(this.ed_mcq._id, this.ed_mcq)
      .subscribe((x) => {
        if (x.success == false) {
          this.popup.open_error_book(x.message);
        }
      });
  }

  final_edit_coding(
    ed_cod_title: any,
    ed_cod_description: any,
    ed_cod_input_format: any,
    ed_cod_output_format: any,
    ed_cod_constraints: any,
    ed_cod_weight: any,
    ed_cod_output: any,
    ed_cod_input: any
  ) {
    this.selected_topic.coding[this.index_ed_coding].title = ed_cod_title;
    this.selected_topic.coding[this.index_ed_coding].description =
      ed_cod_description;
    this.selected_topic.coding[this.index_ed_coding].input_format =
      ed_cod_input_format;
    this.selected_topic.coding[this.index_ed_coding].output_format =
      ed_cod_output_format;
    this.selected_topic.coding[this.index_ed_coding].constraints =
      ed_cod_constraints;
    this.selected_topic.coding[this.index_ed_coding].weight = ed_cod_weight;
    this.selected_topic.coding[this.index_ed_coding].output = ed_cod_output;
    this.selected_topic.coding[this.index_ed_coding].input = ed_cod_input;

    this.ed_coding = this.selected_topic.coding[this.index_ed_coding];
    this.close_popup();
    this.service
      .edit_coding_in_topic(this.ed_coding._id, this.ed_coding)
      .subscribe((x) => {
        if (x.success == false) {
          this.popup.open_error_book(x.message);
        }
      });
  }
}
