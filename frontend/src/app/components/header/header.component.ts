import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent {
  loggedIn = false;
  constructor(private userService: UserService, private router:Router){

    this.userService.getUser().subscribe((user)=>{
      console.log(user);
      if(user.email && user.role)
        this.loggedIn = true;
      else
        this.loggedIn = false;
    });
  }

  logout(){
    this.userService.logout().subscribe((data) => {
      this.userService.setUser({ email: "", role: "" });
      this.router.navigate(["/"]);
    });
  }
}
