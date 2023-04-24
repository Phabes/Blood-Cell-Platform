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
import { CategoriesComponent } from "./components/categories/categories.component";
import { ActivitiesComponent } from "./components/activities/activities.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "profile", component: ProfilComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "leaderboard", component: LeaderboardComponent },
  { path: "activities", component: ActivitiesComponent },
  { path: "categories", component: CategoriesComponent },
  { path: "teacherpanel", component: TeacherPanelComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "cart", component: UserCartComponent },
  { path: "login", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
