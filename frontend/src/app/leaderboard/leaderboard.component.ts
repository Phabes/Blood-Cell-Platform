import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaderBoardService } from '../services/leaderboard.service';




@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {

  shippingCosts!: Observable<{ nick: string, points: number }[]>;

  ngOnInit(): void {
    this.shippingCosts =  this.cartService.getItems();
  }
  constructor(
    private cartService: LeaderBoardService
  ) { }
}
