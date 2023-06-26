export class users{

    private first_name:any;
    private last_name:any;
    private country:any;
    private city:any;
    private email:any;
    private phone_namber:any;
    private password:any;
    private id:any;
    private photo:any;

        set_first_name(value:any){
        this.first_name = value;
        }
        set_last_name(value:any){
            this.last_name = value;
        }
        set_country(value:any){
            this.country = value;
        }
        set_city(value:any){
            this.city = value;
        }
        set_email(value:any){
            this.email = value;
        }
        set_phone_namber(value:any){
            this.phone_namber = value;
        }
        set_password(value:any){
            this.password = value;
        }
        set_id(value:any){
            this.id = value;
        }
        set_photo(value:any){
            this.photo = value;
        }

        get_first_name(){
        return this.first_name
        }
        get_last_name(){
            return this.last_name 
        }
        get_country(){
            return this.country 
        }
        get_city(){
            return this.city 
        }
        get_email(){
            return  this.email
        }
        get_phone_namber(){
            return  this.phone_namber
        }
        get_password(){
            return  this.password 
        }
        get_id(){
            return this.id 
        }
        get_photo(){
            return this.photo 
        }
       


}