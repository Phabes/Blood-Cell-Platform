import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HomeComponent } from "./components/home/home.component";
import { LeaderboardComponent } from "./components/leaderboard/leaderboard.component";
import { LoginComponent } from "./components/login/login.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { TeacherPanelComponent } from "./components/teacher-panel/teacher-panel.component";
import { UserCartComponent } from "./components/user-cart/user-cart.component";
import { LoggedGuard, PermissionsGuard } from "./guards/permissions.guard";
import { CategoriesComponent } from "./components/categories/categories.component";
import { ActivitiesComponent } from "./components/activities/activities.component";
import { MessagesComponent } from "./components/messages/messages.component";
import { ProfileComponent } from "./components/profile/profile.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [PermissionsGuard(["student", "teacher"])],
  },
  {
    path: "categories",
    component: CategoriesComponent,
    canActivate: [PermissionsGuard(["teacher"])],
  },
  {
    path: "activities",
    component: ActivitiesComponent,
    canActivate: [PermissionsGuard(["teacher"])],
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [PermissionsGuard(["student"])],
  },
  {
    path: "leaderboard",
    component: LeaderboardComponent,
    canActivate: [PermissionsGuard(["teacher"])],
  },
  {
    path: "teacherpanel",
    component: TeacherPanelComponent,
    canActivate: [PermissionsGuard(["teacher"])],
  },
  {
    path: "registration",
    component: RegistrationComponent,
    canActivate: [LoggedGuard(false)],
  },
  {
    path: "cart",
    component: UserCartComponent,
    canActivate: [LoggedGuard(true)],
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoggedGuard(false)],
  },
  {
    path: "messages",
    component: MessagesComponent,
    canActivate: [PermissionsGuard(["student"])],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
