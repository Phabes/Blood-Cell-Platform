import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  loggedIn = false;
  isTeacher = true;
  constructor(private userService: UserService, private router: Router) {
    this.userService.getUser().subscribe((user) => {
      if (user.email && user.role) {
        this.loggedIn = true;
        if (user.role == 'teacher') this.isTeacher = true;
        else this.isTeacher = false;
      } else {
        this.loggedIn = false;
        this.isTeacher = false;
      }
    });
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.userService.setUser({ _id: '', email: '', role: '' });
      this.router.navigate(['/']);
    });
  }
}
