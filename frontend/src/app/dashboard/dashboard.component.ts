import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {

  messages!: Observable<{  date: Date,
    task : string,
    points: number }[]>;

  ngOnInit(): void {
    this.messages =  this.messagesService.getItems();
  }
  constructor(
    private messagesService: MessagesService
  ) { }
}
