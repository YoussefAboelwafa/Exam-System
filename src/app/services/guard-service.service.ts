import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ServicService } from './servic.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GuardServiceService implements CanActivate {

signed_in=false;
  constructor(private service:ServicService,private router: Router,private route: ActivatedRoute){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    const user = route.paramMap.get('user'); // Get the user parameter from the route
    this.service.is_signin().subscribe(
             (x)=> {
              if(x.signed_in==false){
                alert("email or phone is found in system");
                this.router.navigate(['/login']);
                this.signed_in= false;
              }
              
              else{ this.signed_in= true;}
             error:(error: HttpErrorResponse) =>alert(error.message);
              }
           )
  return this.signed_in;
  }
}
