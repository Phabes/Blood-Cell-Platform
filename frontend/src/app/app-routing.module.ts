import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HomeComponent } from "./components/home/home.component";
import { LeaderboardComponent } from "./components/leaderboard/leaderboard.component";
import { LoginComponent } from "./components/login/login.component";
import { ProfilComponent } from "./components/profil/profil.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { TeacherPanelComponent } from "./components/teacher-panel/teacher-panel.component";
import { UserCartComponent } from "./components/user-cart/user-cart.component";
import { LoggedGuard, PermissionsGuard } from "./guards/permissions.guard";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "profil", component: ProfilComponent, canActivate: [LoggedGuard(true)]},
  { path: "dashboard", component: DashboardComponent, canActivate: [PermissionsGuard(["teacher"])] },
  { path: "leaderboard", component: LeaderboardComponent, canActivate: [PermissionsGuard(["student"])] },
  { path: "teacherpanel", component: TeacherPanelComponent, canActivate: [PermissionsGuard(["teacher"])] },
  { path: "registration", component: RegistrationComponent, canActivate: [LoggedGuard(false)] },
  { path: "cart", component: UserCartComponent, canActivate: [LoggedGuard(true)] },
  { path: "login", component: LoginComponent, canActivate: [LoggedGuard(false)] },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
