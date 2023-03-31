import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivitiesService } from 'src/app/services/activities.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  messages!: Observable<{ date: Date; task: string; points: number }[]>;

  ngOnInit(): void {
    this.messages = this.activitiesService.getItems();
  }
  constructor(private activitiesService: ActivitiesService) {}
}
