import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserCartComponent } from './user-cart/user-cart.component';

const routes: Routes = [
  {path: '' ,             component: LoginComponent},
  {path: 'profil' ,       component: ProfilComponent},
  {path: 'dashboard' ,    component: DashboardComponent},
  {path: 'leaderboard' ,  component: LeaderboardComponent},
  {path: 'registration' , component: RegistrationComponent},
  { path: 'cart', component: UserCartComponent},
  {path: 'login', component: LoginComponent}
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
