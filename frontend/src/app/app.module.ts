import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";

import { HomeComponent } from "./components/home/home.component";
import { HeaderComponent } from "./components/header/header.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LeaderboardComponent } from "./components/leaderboard/leaderboard.component";
import { LoginComponent } from "./components/login/login.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { TeacherPanelComponent } from "./components/teacher-panel/teacher-panel.component";
import { ActivitiesComponent } from "./components/activities/activities.component";
import { CategoriesComponent } from "./components/categories/categories.component";
import { SimpleSearchPipe } from "./simple-search.pipe";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MessagesComponent } from "./components/messages/messages.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    DashboardComponent,
    LeaderboardComponent,
    LoginComponent,
    RegistrationComponent,
    TeacherPanelComponent,
    ActivitiesComponent,
    CategoriesComponent,
    SimpleSearchPipe,
    MessagesComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTooltipModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
