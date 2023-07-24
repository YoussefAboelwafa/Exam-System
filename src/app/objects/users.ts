export class users {
  first_name: any;
  last_name: any;
  country: any;
  city: any;
  email: any;
  phone_namber: any;
  password: any;
  _id: any;
   photo: any;
  exams: any; //exam that contain the array of exam that user take it and the degree of each exam

  set_first_name(value: any) {
    this.first_name = value;
  }
  set_last_name(value: any) {
    this.last_name = value;
  }
  set_country(value: any) {
    this.country = value;
  }
  set_city(value: any) {
    this.city = value;
  }
  set_email(value: any) {
    this.email = value;
  }
  set_phone_namber(value: any) {
    this.phone_namber = value;
  }
  set_password(value: any) {
    this.password = value;
  }
  set_id(value: any) {
    this._id = value;
  }
  set_photo(value: any) {
    this.photo = value;
  }

  get_first_name() {
    return this.first_name;
  }
  get_last_name() {
    return this.last_name;
  }
  get_country() {
    return this.country;
  }
  get_city() {
    return this.city;
  }
  get_email() {
    return this.email;
  }
  get_phone_namber() {
    return this.phone_namber;
  }
  get_password() {
    return this.password;
  }
  get_id() {
    return this._id;
  }
  get_photo() {
    return this.photo;
  }
}
