import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ServicService } from './servic.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GuardServiceService implements CanActivate {
  constructor(
    private service: ServicService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      const observable = this.service.is_signin();
      const response: any = await observable.toPromise();

      if (response.signed_in ==false) {
        this.router.navigate(['']);
        return false;
      } else {
        return true;
      }
    } catch (error) {
      alert(error);
      return false;
    }
  }
}
