import { Component, OnInit } from '@angular/core';
import { LeaderBoardService } from '../services/leaderboard.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.css'],
})
export class UserCartComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private leaderboardService: LeaderBoardService
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
