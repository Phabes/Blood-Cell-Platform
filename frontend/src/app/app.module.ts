import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HttpClientModule } from '@angular/common/http'
import { HomeComponent } from './home/home.component'

import { HeaderComponent } from './header/header.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { LeaderboardComponent } from './leaderboard/leaderboard.component'
import { LoginComponent } from './login/login.component'
import { RegistrationComponent } from './registration/registration.component'
import { ProfilComponent } from './profil/profil.component'
import { UserCartComponent } from './user-cart/user-cart.component'
import { ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    DashboardComponent,
    LeaderboardComponent,
    LoginComponent,
    RegistrationComponent,
    ProfilComponent,
    UserCartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
