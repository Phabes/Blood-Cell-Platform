import {  inject } from "@angular/core";
import {  CanActivateFn, Router, UrlTree } from "@angular/router";
import { UserService } from "../services/user.service";
import { Observable } from "rxjs";


export function PermissionsGuard(allowedRoles:string[]):CanActivateFn {
  return (): Observable<boolean> =>{
    const userService: UserService = inject(UserService);
    const router: Router = inject(Router);
    return new Observable<boolean>((observer)=>{
      userService.checkAuth().subscribe((data)=>{
        if (data.action == "VERIFIED"){
          if (allowedRoles.includes(data.role))
            observer.next(true);
          else
            router.navigate(["/"]);
        }else
          router.navigate(["/login"]);
      });
    });
  };
}

export function LoggedGuard(loggedIn: boolean): CanActivateFn {
  return (): Observable<boolean> => {
    const userService: UserService = inject(UserService);
    const router: Router = inject(Router);
    return new Observable<boolean>((observer) => {
      userService.checkAuth().subscribe((data) => {
        if (["NOT_VERIFIED", "NO_TOKEN"].includes(data.action) && !loggedIn){
          observer.next(true);
        }else{
          router.navigate(["/"]);
        }
      });
    });
  };
}
